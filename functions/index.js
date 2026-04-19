const { onSchedule } = require("firebase-functions/v2/scheduler");
const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { defineSecret } = require("firebase-functions/params");
const { getFirestore } = require("firebase-admin/firestore");
const admin = require("firebase-admin");

if (admin.apps.length === 0) admin.initializeApp();
const db = getFirestore();

const CYCLE_MS = 24 * 60 * 60 * 1000;
const IMMUNITY_RANK_HATS = 500;
const GROQ_API_KEY = defineSecret("GROQ_API_KEY");
exports.takeFromArticlePenalty = onSchedule({
	schedule: "every 20 minutes",
	timeZone: "UTC",
	memory: "256Mi",
	timeoutSeconds: 540
}, async (event) => {
	const now = Date.now();

	const snapshot = await db.collectionGroup('daily')
		.where('expiresAtMs', '<=', now)
		.where('penaltyProcessed', '==', false)
		.get();

	if (snapshot.empty) return null;

	let batch = db.batch();
	let count = 0;
	const promises = [];

	for (const doc of snapshot.docs) {
		if (doc.id !== 'currentDailyQuests') continue;

		const data = doc.data();
		const userId = data.owner;

		if ((data.completedCount || 0) === 0) {
			const userRef = db.collection('users').doc(userId);
			const userSnap = await userRef.get();

			if (userSnap.exists) {
				const userData = userSnap.data();
				const currentHats = userData.totalHats || 0;
				const freezeEndMs = userData.freezeEndsAt || 0;
				const prevCycleStartsAt = (data.expiresAtMs || 0) - CYCLE_MS;
				const hadShield = freezeEndMs && freezeEndMs > prevCycleStartsAt;
				const hasImmunity = currentHats >= IMMUNITY_RANK_HATS;
				if (!hadShield && !hasImmunity) {
					batch.update(userRef, { totalHats: Math.max(0, currentHats - 3) });
				}
			}
		}

		batch.update(doc.ref, { penaltyProcessed: true });
		count++;

		if (count >= 400) {
			promises.push(batch.commit());
			batch = db.batch();
			count = 0;
		}
	}

	if (count > 0) promises.push(batch.commit());
	await Promise.all(promises);

	return null;
});


exports.whisperTranscribe = onCall({
	secrets: [GROQ_API_KEY],
	memory: "256Mi"
}, async (request) => {
	const { audioContent, lang } = request.data;
	if (!audioContent) throw new HttpsError("invalid-argument", "Нет аудио");

	try {
		const base64Data = audioContent.includes(",") ? audioContent.split(",")[1] : audioContent;
		const buffer = Buffer.from(base64Data, "base64");

		const formData = new FormData();
		const blob = new Blob([buffer], { type: "audio/m4a" });
		formData.append("file", blob, "recording.m4a");
		formData.append("model", "whisper-large-v3-turbo");
		if (lang) formData.append("language", lang.substring(0, 2));

		const response = await fetch("https://api.groq.com/openai/v1/audio/transcriptions", {
			method: "POST",
			headers: { "Authorization": `Bearer ${GROQ_API_KEY.value()}` },
			body: formData
		});

		const data = await response.json();
		if (!response.ok) throw new Error(JSON.stringify(data));
		return { text: data.text || "" };
	} catch (error) {
		console.error("Whisper Error:", error);
		throw new HttpsError("internal", error.message);
	}
});

exports.visionAnalyze = onCall({
	secrets: [GROQ_API_KEY],
	memory: "512Mi",
	timeoutSeconds: 60
}, async (request) => {
	const { userLevel, userMessage, userLocale, imageUrl, referenceDescription } = request.data;

	try {
		let finalImageUrl = imageUrl;
		if (imageUrl.startsWith('http') && !imageUrl.includes('localhost')) {
			const imgResponse = await fetch(imageUrl);
			if (imgResponse.ok) {
				const buffer = await imgResponse.arrayBuffer();
				const base64 = Buffer.from(buffer).toString('base64');
				finalImageUrl = `data:${imgResponse.headers.get('content-type') || 'image/png'};base64,${base64}`;
			}
		}

		const modelId = 'meta-llama/llama-4-scout-17b-16e-instruct';
		const feedbackLang = String(userLocale || 'ru').split('-')[0].trim();

		const systemPrompt = `You are a strict but supportive German language tutor evaluating an image description. Feedback language: ${feedbackLang}.
Evaluate for level ${userLevel}. Focus on Dativ for "Wo?" and Akkusativ for movement. 
JSON Output: {score, feedback, suggestedAnswer, keyCorrections[]}`;

		const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
			method: 'POST',
			headers: {
				'Authorization': `Bearer ${GROQ_API_KEY.value()}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				model: modelId,
				messages: [
					{ role: 'system', content: systemPrompt },
					{
						role: 'user',
						content: [
							{ type: "text", text: `Level ${userLevel}. Answer: ${userMessage}. Reference: ${referenceDescription}` },
							{ type: "image_url", image_url: { url: finalImageUrl } }
						]
					}
				],
				response_format: { type: "json_object" },
				temperature: 0.2
			})
		});

		const resJson = await response.json();
		if (!response.ok) throw new Error(JSON.stringify(resJson));

		const content = resJson.choices[0].message.content;
		return { data: JSON.parse(content) };
	} catch (err) {
		console.error("Vision Error:", err);
		throw new HttpsError("internal", err.message);
	}
});