const { onSchedule } = require("firebase-functions/v2/scheduler");
const { onCall, onRequest } = require("firebase-functions/v2/https");
const { defineSecret } = require("firebase-functions/params");
const admin = require("firebase-admin");

if (admin.apps.length === 0) admin.initializeApp();

const { Resend} = require("resend");
const cors = require("cors")({origin: true});
const db = admin.firestore();

const CYCLE_MS = 24 * 60 * 60 * 1000;
const IMMUNITY_RANK_HATS = 500;
const GEMINI_API_KEY = defineSecret("GEMINI_API_KEY");
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

exports.hedgehogAssistant = onCall({
	secrets: [GEMINI_API_KEY],
	memory: "256Mi",
	timeoutSeconds: 30,
	cors: true
}, async (request) => {
	if (!request.auth || !request.auth.uid) {
		return { error: "UNAUTHORIZED" };
	}
	const dataIn = request.data || {};
	const action = dataIn.action || "hint";
	const uid = request.auth.uid;
	const today = new Date().toISOString().split('T')[0];
	try {
		const userDoc = await db.collection("users").doc(uid).get();
		const userData = userDoc.exists ? userDoc.data() : {};
		const isPremium = userData.isPremium === true;
		const usageRef = db.collection("users").doc(uid).collection("usage").doc(today);

		if (!isPremium) {
			const usageSnap = await usageRef.get();
			const currentUsage = usageSnap.exists ? (usageSnap.data().hintCount || 0) : 0;
			if (currentUsage >= 6) {
				return { error: "LIMIT_REACHED" };
			}
		}

		const userLocale = String(dataIn.userLocale || 'ru').split('-')[0].trim();
		const modelId = 'gemini-3.5-flash-lite';
		let systemPrompt = "";

		if (action === "grammar") {
			const sentence = dataIn.sentence || "";
			const answer = dataIn.answer || "";
			const selectedAnswer = dataIn.selectedAnswer || "";

			systemPrompt = `You are a friendly German language tutor.
The user is practicing German grammar and needs to know why a specific article is correct.
Sentence: "${sentence}"
Correct article: "${answer}"
User selected (if any): "${selectedAnswer}"

Explain in 1-2 short sentences (max 150 chars) why the article "${answer}" is needed in the blank for this sentence.
If the user chose "${selectedAnswer}", briefly explain why it's wrong (mention gender, case, or preposition government).
STRICT RULES:
- When explaining grammar endings, always use the phrase "берет у артикля".
- When the question is "Where?" (Wo?), use Dativ and put the noun's article in Dativ. For Akkusativ, apply the same rule.
- Respond in THIS exact language: ${userLocale}.

CRITICAL: Respond ONLY with valid JSON matching this schema:
{ "explanation": "string" }`;

		} else if (action === "imageHint") {
			const referenceDescription = dataIn.referenceDescription || "";
			const userLevel = dataIn.userLevel || "A1";

			const taskInstruction = `The user needs ideas BEFORE writing a sentence about an image described as: "${referenceDescription}".

STRICT RULES FOR HINT:
1. "hintText":
   - Exactly 1 ULTRA-SHORT sentence strictly in language: ${userLocale}.
   - STRICT BAN ON FLUFF: NO greetings, NO filler words.
   - Instruct the user in ${userLocale} to start their sentence with the main German subject from the description and use the clues below.
   - The German subject itself must remain in German inside quotes «...», but the instruction text around it MUST be entirely in ${userLocale}.
2. "vocabulary":
   - Exactly 4 items.
   - "de": ONLY the German words/phrase (e.g. "fährt Ski", "im Schnee"). NEVER put translations or dashes inside "de"!
   - "tr": ONLY the short translation in ${userLocale} without dashes.
3. "grammarTip":
   - 1 short practical sentence on word order or endings strictly in ${userLocale}.
   - If userLocale is "ru" and you explain adjective/noun endings taking cues from an article, use the phrasing "берет у артикля". For other languages, express this concept naturally in ${userLocale}.`;

			systemPrompt = `You are "Hedgehog", an upbeat, friendly German language tutor.
Target German level: ${userLevel}. User interface language: ${userLocale}.

${taskInstruction}

CRITICAL: Respond ONLY with valid JSON matching this schema:
{
  "hintText": "string",
  "vocabulary": [ { "de": "word", "tr": "translation" } ],
  "grammarTip": "string"
}`;
		} else {
			const question = dataIn.question || "";
			const correctAnswer = dataIn.correctAnswer || dataIn.answer || "";
			const options = Array.isArray(dataIn.options) ? dataIn.options.join(", ") : "";

			systemPrompt = `You are a friendly German language tutor named Hedgehog.
The user is solving a task and needs a clear, helpful hint.
Task: "${question}"
Options: "${options}"
Correct answer: "${correctAnswer}"

Give a brief explanation in 1-2 short sentences why "${correctAnswer}" is the right choice.
STRICT RULES:
- When explaining grammar endings taking cues from an article, use the phrasing "берет у артикля".
- Respond in THIS exact language: ${userLocale}.

CRITICAL: Respond ONLY with a valid JSON object matching this schema:
{
  "correctOption": "${correctAnswer}",
  "explanation": "short explanation in ${userLocale}"
}`;
		}

		const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelId}:generateContent?key=${GEMINI_API_KEY.value()}`;
		const response = await fetch(url, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				contents: [{ role: 'user', parts: [{ text: systemPrompt }] }],
				generationConfig: {
					temperature: 0.1,
					response_mime_type: "application/json"
				}
			})
		});

		const resText = await response.text();
		if (!response.ok) return { error: `Gemini error: ${response.status}` };

		const resJson = JSON.parse(resText);
		const content = resJson.candidates?.[0]?.content?.parts?.[0]?.text;
		if (!content) return { error: "Пустой ответ от Gemini" };

		let parsedContent = JSON.parse(content);
		if (Array.isArray(parsedContent)) {
			parsedContent = parsedContent[0] || {};
		}

		if (!isPremium) {
			await usageRef.set({
				hintCount: admin.firestore.FieldValue.increment(1),
				updatedAt: admin.firestore.FieldValue.serverTimestamp()
			}, { merge: true });
		}

		return { data: parsedContent };

	} catch (err) {
		console.error("FUNCTION ERROR:", err);
		return { error: String(err.message || err) };
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