const { onSchedule } = require("firebase-functions/v2/scheduler");
const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { defineSecret } = require("firebase-functions/params");
const admin = require("firebase-admin");

if (admin.apps.length === 0) admin.initializeApp();

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

		const systemPrompt = `You are a strict but supportive German language tutor evaluating an image description exercise.
**STRICT LANGUAGE RULE: YOU MUST WRITE ALL FEEDBACK AND CORRECTIONS IN THE LANGUAGE: "${feedbackLang}". NEVER USE GERMAN IN THE FEEDBACK FIELD.**

INPUTS:
1. **The Image:** Look at the visual image carefully.
2. **Target Level:** ${userLevel} (A1, A2, or B1).
3. **User Answer:** "${userMessage}"
4. **Reference Template:** "${referenceDescription || 'None'}" 

GRAMMAR BOUNDARIES BY LEVEL:
- **A1 Grammar:** Präsens, Perfekt (basics), modal verbs. Basic Nominativ/Akkusativ/Dativ. Note: When the question is "Where?" (Wo?), use Dativ and put the noun's article in Dativ; apply the same rule for Akkusativ. NO subordinate clauses.
- **A2 Grammar:** Präteritum, Wechselpräpositionen, Nebensätze, Adjektivdeklination.
- **B1 Grammar:** Plusquamperfekt, Passiv, complexe Nebensätze, Relativsätze.

CRITICAL EVALUATION RULES - ASYMMETRIC SCORING & NO NITPICKING:

0. **FATAL ERROR - WRONG LANGUAGE (CRITICAL RULE):**
   - The "User Answer" MUST be written in German.
   - If the user writes the description in Russian, English, Spanish, or ANY language other than German, YOU MUST GIVE A SCORE OF 1/10.
   - In this case, the feedback MUST explicitly say in ${feedbackLang}: "Пожалуйста, опишите картинку на немецком языке." (or the equivalent in the selected feedback language). Do not evaluate the grammar or visual details if the language is wrong.

1. **OVER-PERFORMING (REWARD & NO NITPICKING):**
   - If the user is at a lower level (e.g., A1) but writes a complex, accurate answer (e.g., A2 or B1), YOU MUST GIVE THEM 10/10.
   - **CRITICAL FEEDBACK RULE:** Explicitly state: "Отличная работа! Вы использовали грамматику и словарный запас, которые значительно превышают уровень ${userLevel}."
   - **NO NITPICKING BAN:** If they wrote an advanced/complex sentence, DO NOT deduct points for "missing visual details" (like ski poles, trees, or lifts). NEVER tell them to "add more details for level ${userLevel}" because they already exceeded it!

2. **UNDER-PERFORMING (PENALIZE):**
   - If the user is at a higher level (e.g., B1) but writes a very basic, short answer (like A1), you MUST deduct points (Score 5-7). Tell them to add more complex structures.

3. **THE GOLDEN STANDARD (Matching the Level):**
   - If the answer matches the length and detail of the "Reference Template", give 10/10. 
   - NEVER ask to describe background objects (poles, trees) if they are not explicitly mentioned in the Reference Template for that level.

4. **DYNAMIC SUGGESTED ANSWER RULE:**
   - **IF SCORE IS 9 OR 10 (Perfect/Excellent):** DO NOT use the basic Reference Template. Set the 'suggestedAnswer' to the User's exact answer (you may fix minor typos). Validate their success by showing their own text!
   - **IF SCORE IS 8 OR BELOW (Mistakes or too short):** Set the 'suggestedAnswer' to the official Reference Template for the ${userLevel} level.

YOUR TASK: GENERATE JSON RESPONSE.
1. **Score (1-10):** Rate strictly based on the Asymmetric Scoring rules above. (Score 1 if wrong language).
2. **Feedback (Language: ${feedbackLang}):** Write EXCLUSIVELY in ${feedbackLang}. 
3. **Suggested Answer:** Follow the Dynamic Suggested Answer Rule.
4. **Key Corrections:** List specific fixes in ${feedbackLang} or say "No corrections needed".

OUTPUT JSON FORMAT:
{
  "score": 0,
  "feedback": "WRITE EXCLUSIVELY IN ${feedbackLang}...",
  "suggestedAnswer": "...",
  "keyCorrections": []
}`

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