const { onSchedule } = require("firebase-functions/v2/scheduler");
const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { defineSecret } = require("firebase-functions/params");
const admin = require("firebase-admin");
const { onRequest } = require("firebase-functions/v2/https");
const axios = require('axios');
const FormData = require('form-data');
if (admin.apps.length === 0) admin.initializeApp();
const fs = require('fs');
const path = require('path');
const os = require('os');
const Groq = require("groq-sdk");
const CYCLE_MS = 24 * 60 * 60 * 1000;
const IMMUNITY_RANK_HATS = 500;
const GROQ_API_KEY = defineSecret("GROQ_API_KEY");

exports.takeFromArticlePenalty = onSchedule({
	schedule: "every 20 minutes",
	timeZone: "UTC",
	memory: "256Mi",
	timeoutSeconds: 540
}, async (event) => {
	const db = admin.firestore();
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
	memory: "512Mi"
}, async (request) => {
	const tempFilePath = path.join(os.tmpdir(), `audio_${Date.now()}.mp3`);
	try {
		const dataIn = request.data || {};
		const audioContent = dataIn.audioContent;
		const lang = dataIn.lang;

		if (!audioContent) return { error: "Нет аудио" };

		const base64Data = audioContent.includes(",") ? audioContent.split(",")[1] : audioContent;
		const buffer = Buffer.from(base64Data, "base64");

		// Пишем как mp3
		fs.writeFileSync(tempFilePath, buffer);

		const groq = new Groq({ apiKey: GROQ_API_KEY.value() });

		// Отправляем как mp3
		const transcription = await groq.audio.transcriptions.create({
			file: fs.createReadStream(tempFilePath),
			model: "whisper-large-v3-turbo",
			language: lang ? lang.substring(0, 2) : undefined,
			response_format: "json"
		});

		if (fs.existsSync(tempFilePath)) fs.unlinkSync(tempFilePath);

		return { text: transcription.text || "" };

	} catch (error) {
		if (fs.existsSync(tempFilePath)) fs.unlinkSync(tempFilePath);
		const groqError = error.error?.message || error.message || String(error);
		return { error: `GROQ SDK: ${groqError}` };
	}
});

exports.visionAnalyze = onCall({
	secrets: [GROQ_API_KEY],
	memory: "256Mi",
	timeoutSeconds: 60
}, async (request) => {
	try {
		const dataIn = request.data || {};
		const userLevel = dataIn.userLevel;
		const userMessage = dataIn.userMessage;
		const userLocale = dataIn.userLocale;
		const imageUrl = dataIn.imageUrl;
		const referenceDescription = dataIn.referenceDescription;

		const modelId = 'meta-llama/llama-4-scout-17b-16e-instruct';
		const feedbackLang = String(userLocale || 'ru').split('-')[0].trim();

		const systemPrompt = `You are a strict but supportive German language tutor evaluating an image description exercise.
**STRICT LANGUAGE RULE: YOU MUST WRITE ALL FEEDBACK AND CORRECTIONS IN THE LANGUAGE: "${feedbackLang}". NEVER USE GERMAN IN THE FEEDBACK FIELD.**

INPUTS:
1. **The Image:** Look at the visual image carefully.
2. **Target Level:** ${userLevel} (A1, A2, or B1).
3. **User Answer:** "${userMessage}"
4. **Reference Template:** "${referenceDescription || 'None'}" 

GRAMMAR BOUNDARIES BY LEVEL & RULES:
- **A1 Grammar:** Präsens, Perfekt. Nominativ/Akkusativ/Dativ. When the question is "Where?" (Wo?), use Dativ and put the noun's article in Dativ. Apply the same rule for Akkusativ. When explaining grammar endings, always use the phrase "берет у артикля" to clarify how the word gets its ending. NO subordinate clauses.
- **A2 Grammar:** Präteritum, Wechselpräpositionen, Nebensätze, Adjektivdeklination.
- **B1 Grammar:** Plusquamperfekt, Passiv, complexe Nebensätze, Relativsätze.

CRITICAL EVALUATION RULES:
0. FATAL ERROR: If the user writes in any language other than German, SCORE IS 1/10. Feedback MUST say in ${feedbackLang}: "Пожалуйста, опишите картинку на немецком языке."
1. OVER-PERFORMING: If lower-level user writes complex answer, SCORE 10/10. NO nitpicking.
2. DYNAMIC SUGGESTED ANSWER: 
   - Score 9-10: Set 'suggestedAnswer' to the User's exact answer. 
   - Score <=8: Set 'suggestedAnswer' to the Reference Template.

YOUR TASK: OUTPUT A RAW JSON OBJECT EXCLUSIVELY. Do NOT wrap in markdown.
{
  "score": 0,
  "feedback": "...",
  "suggestedAnswer": "...",
  "keyCorrections": []
}`;

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
							{ type: "image_url", image_url: { url: imageUrl } }
						]
					}
				],
				temperature: 0.2
			})
		});

		const resText = await response.text();
		if (!response.ok) return { error: `GROQ API ERROR ${response.status}: ${resText}` };

		const resJson = JSON.parse(resText);
		if (!resJson.choices || !resJson.choices[0]) return { error: `GROQ EMPTY CHOICES: ${resText}` };

		let content = resJson.choices[0].message.content;
		content = content.replace(/```json/g, '').replace(/```/g, '').trim();

		return { data: JSON.parse(content) };
	} catch (err) {
		return { error: String(err.message || err) };
	}
});


exports.handleRevenueCatWebhook = onRequest(async (req, res) => {
	const eventData = req.body.event;
	if (!eventData || !eventData.app_user_id) {
		return res.status(200).send("No data");
	}

	const userId = eventData.app_user_id;
	const eventType = eventData.type;
	const db = admin.firestore();

	try {
		switch (eventType) {
			case "INITIAL_PURCHASE":
			case "RENEWAL":
				await db.collection("users").doc(userId).update({
					isPremium: true,
					subscriptionCancelled: false
				});
				break;
			case "EXPIRATION":
				await db.collection("users").doc(userId).update({
					isPremium: false,
					subscriptionCancelled: true
				});
				break;

			case "CANCELLATION":
				await db.collection("users").doc(userId).update({
					subscriptionCancelled: true
				});
				break;
			case "TRANSFER":
				if (eventData.transferred_from) {
					for (const oldUid of eventData.transferred_from) {
						await db.collection("users").doc(oldUid).update({ isPremium: false });
					}
				}
				if (eventData.transferred_to) {
					for (const newUid of eventData.transferred_to) {
						await db.collection("users").doc(newUid).update({ isPremium: true });
					}
				}
				break;
		}
		res.status(200).send("OK");
	} catch (error) {
		res.status(500).send("Error");
	}
});