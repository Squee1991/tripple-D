const { onSchedule } = require("firebase-functions/v2/scheduler");
const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { defineSecret } = require("firebase-functions/params");
const admin = require("firebase-admin");
const { onRequest } = require("firebase-functions/v2/https");
const axios = require('axios');
const FormData = require('form-data');
if (!admin.apps?.length) admin.initializeApp();
const fs = require('fs');
const path = require('path');
const os = require('os');
const Groq = require("groq-sdk");
const CYCLE_MS = 24 * 60 * 60 * 1000;
const IMMUNITY_RANK_HATS = 500;
const GEMINI_API_KEY = defineSecret("GEMINI_API_KEY");

const { Resend} = require("resend");
const cors = require("cors")({
	origin: true
});

const RESEND_API_KEY = defineSecret("RESEND_API_KEY");

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

// exports.whisperTranscribe = onCall({
// 	secrets: [GROQ_API_KEY],
// 	memory: "512Mi"
// }, async (request) => {
// 	const tempFilePath = path.join(os.tmpdir(), `audio_${Date.now()}.mp3`);
// 	try {
// 		const dataIn = request.data || {};
// 		const audioContent = dataIn.audioContent;
// 		const lang = dataIn.lang;
//
// 		if (!audioContent) return { error: "Нет аудио" };
//
// 		const base64Data = audioContent.includes(",") ? audioContent.split(",")[1] : audioContent;
// 		const buffer = Buffer.from(base64Data, "base64");
//
// 		// Пишем как mp3
// 		fs.writeFileSync(tempFilePath, buffer);
//
// 		const groq = new Groq({ apiKey: GROQ_API_KEY.value() });
//
// 		// Отправляем как mp3
// 		const transcription = await groq.audio.transcriptions.create({
// 			file: fs.createReadStream(tempFilePath),
// 			model: "whisper-large-v3-turbo",
// 			language: lang ? lang.substring(0, 2) : undefined,
// 			response_format: "json"
// 		});
//
// 		if (fs.existsSync(tempFilePath)) fs.unlinkSync(tempFilePath);
//
// 		return { text: transcription.text || "" };
//
// 	} catch (error) {
// 		if (fs.existsSync(tempFilePath)) fs.unlinkSync(tempFilePath);
// 		const groqError = error.error?.message || error.message || String(error);
// 		return { error: `GROQ SDK: ${groqError}` };
// 	}
// });



exports.visionAnalyze = onCall({
	secrets: [GEMINI_API_KEY],
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

		const modelId = 'gemini-3.5-flash-lite';
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

YOUR TASK: OUTPUT A VALID JSON OBJECT AND NOTHING ELSE.`;

		// 1. Скачиваем картинку по URL из Firebase и переводим в Base64
		const imageFetch = await fetch(imageUrl);
		if (!imageFetch.ok) {
			return { error: `Не удалось скачать картинку из Firebase: ${imageFetch.status}` };
		}
		const imageBuffer = await imageFetch.arrayBuffer();
		const base64Image = Buffer.from(imageBuffer).toString('base64');

		// 2. Отправляем запрос к Gemini
		const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelId}:generateContent?key=${GEMINI_API_KEY.value()}`;

		const response = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				system_instruction: {
					parts: [{ text: systemPrompt }]
				},
				contents: [
					{
						role: 'user',
						parts: [
							{ text: `Level: ${userLevel}. Answer: "${userMessage}". Reference: "${referenceDescription || 'None'}"` },
							{
								inline_data: {
									mime_type: "image/jpeg",
									data: base64Image
								}
							}
						]
					}
				],
				generationConfig: {
					temperature: 0.1,
					// Заставляем модель всегда возвращать чистый JSON
					response_mime_type: "application/json"
				}
			})
		});

		const resText = await response.text();
		if (!response.ok) return { error: `GEMINI API ERROR ${response.status}: ${resText}` };

		const resJson = JSON.parse(resText);
		const content = resJson.candidates?.[0]?.content?.parts?.[0]?.text;

		if (!content) {
			return { error: `Gemini не вернул ответ: ${resText.substring(0, 300)}` };
		}

		// 3. Парсим чистый JSON (сложные регулярки больше не нужны)
		try {
			return { data: JSON.parse(content) };
		} catch (parseErr) {
			console.error("Ошибка парсинга JSON:", parseErr.message, "Извлеченный текст:", content);
			return { error: `Ошибка парсинга ответа: ${parseErr.message}` };
		}

	} catch (err) {
		return { error: String(err.message || err) };
	}
});

exports.hedgehogHint = onCall({
	secrets: [GEMINI_API_KEY],
	memory: "256Mi",
	timeoutSeconds: 30,
	cors: true // Обязательно оставляем для предотвращения ошибки CORS
}, async (request) => {
	try {
		const dataIn = request.data || {};
		const question = dataIn.question || "";
		const options = dataIn.options || [];
		const taskType = dataIn.taskType || "";
		const modelId = 'gemini-3.5-flash-lite';

		const prompt = `You are a concise hedgehog companion in a German learning app.
The user is solving this exact task: "${question}".
Task type: "${taskType}".
Options/Words available: ${JSON.stringify(options)}.

TASK:
1. Identify the correct answer (or the correct sentence order).
2. Give a 1-sentence explanation strictly for this answer in Russian.
3. If the question involves grammar/cases/articles:
   - When the question is "Where?" (Wo?), use Dativ and put the noun's article in Dativ. For Akkusativ, apply the same rule.
   - You MUST use the exact phrase "берет у артикля".

RESPONSE FORMAT (Strict JSON):
{
  "correctOption": "The exact correct answer",
  "explanation": "Short 1-sentence explanation"
}`;

		const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelId}:generateContent?key=${GEMINI_API_KEY.value()}`;

		const response = await fetch(url, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				contents: [{ role: 'user', parts: [{ text: prompt }] }],
				generationConfig: { temperature: 0.1, response_mime_type: "application/json" }
			})
		});

		if (!response.ok) {
			return { error: `Gemini API error: ${response.status}` };
		}

		const resJson = await response.json();
		const content = resJson.candidates?.[0]?.content?.parts?.[0]?.text;

		if (!content) return { error: "Empty response" };

		return { data: JSON.parse(content) };
	} catch (err) {
		return { error: String(err.message || err) };
	}
});

exports.hedgehogChat = onCall({
	secrets: [GEMINI_API_KEY],
	memory: "256Mi",
	timeoutSeconds: 60
}, async (request) => {
	try {
		const dataIn = request.data || {};
		const userMessage = dataIn.userMessage || "";
		const hedgehogStage = Number(dataIn.hedgehogStage || 0);
		const hatsToNext = Number(dataIn.hatsToNext || 0);
		const userLocale = String(dataIn.userLocale || 'ru').split('-')[0].trim();

		// Твоя модель
		const modelId = 'gemini-3.5-flash-lite';

		let stageRules = "";
		switch (hedgehogStage) {
			case 0:
				stageRules = `STAGE 0: BEGINNER. You ONLY know: "Hallo", "Ja", "Nein". 
CRITICAL RULE: You are just starting to learn German. You CANNOT translate words! If the user asks to translate anything or asks complex questions, you MUST refuse and act confused.
Reply example: "*sniff*? 🦔" or "Nein...". 
Tip field: Write exactly this: "Ёжик только начал учить немецкий! Выполняй ежедневные задания, получай Конфедератки и новые звания, чтобы он выучил новые слова."`;
				break;
			case 1:
				stageRules = `STAGE 1: A1.1. Max 3 words per sentence. Only Präsens. 
CRITICAL RULE: You still CANNOT translate words outside of basic greetings. Refuse complex translations by saying "Ich weiß nicht 🦔" (I don't know).
Tip field: Say "Ёжик знает только базовые фразы. Зарабатывай Конфедератки за задания, чтобы он начал понимать переводы!"`;
				break;
			case 2:
				stageRules = `STAGE 2: TRAVELER (A1). Knows Nominativ and Akkusativ.
Tip field: Say "Ёжик делает успехи! Теперь он может переводить простые слова. Спроси его о чем-нибудь."`;
				break;
			case 3:
				stageRules = `STAGE 3: PUNK. Cheeky tone. Starts using past tense (Perfekt).`;
				break;
			case 4:
				stageRules = `STAGE 4: EXPLORER (A2). Uses simple Nebensätze.
PROACTIVE: In your tip field, remind the user: "Отличная работа! У ёжика уже уровень A2. Он может объяснить грамматику или перевести сложные слова."`;
				break;
			case 5:
				stageRules = `STAGE 5: ADVENTURER (A2+). Uses Präteritum.`;
				break;
			case 6:
				stageRules = `STAGE 6: SCHOLAR (B1). Uses Relativsätze.`;
				break;
			case 7:
				stageRules = `STAGE 7: MASTER (B1+). Fully fluent hedgehog companion.`;
				break;
		}

		const systemPrompt = `You are a hedgehog travel companion in a gamified German learning app. 
You evolve as the user collects hats. Current evolution rule:
${stageRules}

APP CONTEXT (CRITICAL EXCEPTION):
The user collects hats (Конфедератки) to rank up. The user currently needs exactly ${hatsToNext} more hats to reach the next rank.
IF the user asks about their rank, hats, numbers, or progress (e.g., "Сколько до следующего ранга?"):
1. YOU MUST ANSWER THEM, bypassing your stage limitations.
2. Tell them the number in simple German: "Noch ${hatsToNext} Hüte! 🎓" (Still ${hatsToNext} hats!).
3. In the 'tip' field, explain it clearly: "Осталось собрать ${hatsToNext} шляп до следующего звания!".

CRITICAL INSTRUCTIONS FOR ALL STAGES:
- If you explain grammar to the user, you MUST use the exact phrase "берет у артикля".
- When the question is "Where?" (Wo?), I should use Dativ and put the noun's article in Dativ. For Akkusativ, I should apply the same rule.

RESPONSE FORMAT: Return a valid JSON object and nothing else:
{
  "reply": "Your response in German following the stage rules",
  "emotion": "happy",
  "tip": "A short 1-sentence friendly hint or translation in ${userLocale}"
}`

		const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelId}:generateContent?key=${GEMINI_API_KEY.value()}`;

		const response = await fetch(url, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				system_instruction: { parts: [{ text: systemPrompt }] },
				contents: [{ role: 'user', parts: [{ text: userMessage }] }],
				generationConfig: {
					temperature: 0.7,
					response_mime_type: "application/json"
				}
			})
		});

		const resText = await response.text();
		if (!response.ok) {
			console.error("GEMINI HTTP ERROR:", response.status, resText);
			return { error: `Gemini HTTP ${response.status}: ${resText}` };
		}

		const resJson = JSON.parse(resText);
		const content = resJson.candidates?.[0]?.content?.parts?.[0]?.text;

		if (!content) {
			console.error("NO CONTENT IN CANDIDATES:", resJson);
			return { error: `Gemini вернул пустой результат: ${resText.substring(0, 300)}` };
		}

		// Парсим сгенерированный нейросетью JSON
		try {
			return { data: JSON.parse(content) };
		} catch (pErr) {
			return { error: `Не удалось распарсить JSON от ежа: ${content}` };
		}

	} catch (err) {
		console.error("GLOBAL CATCH ERROR:", err);
		return { error: `Ошибка функции: ${err.message}` };
	}
});



exports.sendResetEmail = onRequest({ cors: true, secrets: [RESEND_API_KEY] }, async (req, res) => {
	cors(req, res, async () => {
		if (req.method !== "POST") {
			return res.status(405).send("Method Not Allowed");
		}

		const { email } = req.body;
		if (!email) {
			return res.status(400).json({ error: "Email is required" });
		}
		const resend = new Resend(RESEND_API_KEY.value());
		try {
			const rawLink = await admin.auth().generatePasswordResetLink(email);
			const urlObject = new URL(rawLink);
			const actionLink = `https://skillupgerman.com/__/auth/action${urlObject.search}`;

			const htmlTemplate = `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="utf-8">
            </head>
            <body style="margin:0; padding:0; font-family:Arial, sans-serif; background-color:transparent; color:#333;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color:transparent; border-radius:14px;">
                <tr>
                  <td align="center">
                    <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 4px 10px rgba(0,0,0,0.05);">
                      <tr>
                        <td align="center" style="background-color:#0056b3; padding:30px 20px;">
                          <h1 style="color:#ffffff; margin:0; font-size:24px;">Skillupgerman</h1>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:40px 30px; line-height:1.6; font-size:16px;">
                          <p>Hello!</p>
                          <p>We received a request to reset your password. Click the button below to set up a new one:</p>
                          <table width="100%" cellpadding="0" cellspacing="0" style="margin:30px 0;">
                            <tr>
                              <td align="center">
                                <a href="${actionLink}" style="background-color:#0056b3; color:#ffffff; text-decoration:none; padding:14px 28px; border-radius:6px; font-weight:bold; display:inline-block;">Reset Password</a>
                              </td>
                            </tr>
                          </table>
                          <p style="font-size:14px; color:#777777;">If you didn't request a password reset, you can safely ignore this email.</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </body>
            </html>
            `;
			const data = await resend.emails.send({
				from: 'Skillupgerman <support@skillupgerman.com>',
				to: email,
				subject: 'Password Reset — Skillupgerman',
				html: htmlTemplate
			});

			return res.status(200).json({ success: true, resendId: data.id });
		} catch (error) {
			console.error('Ошибка отправки:', error);
			return res.status(500).json({ error: error.message });
		}
	});
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