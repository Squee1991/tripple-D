const { onSchedule } = require("firebase-functions/v2/scheduler");
const { getFirestore, FieldValue } = require("firebase-admin/firestore");
const admin = require("firebase-admin");

if (admin.apps.length === 0) admin.initializeApp();
const db = getFirestore();

const CYCLE_MS = 24 * 60 * 60 * 1000;

exports.takeFromArticlePenalty = onSchedule({
	schedule: "every 15 minutes",
	timeZone: "UTC",
	memory: "256Mi",
	timeoutSeconds: 540
}, async (event) => {
	const now = Date.now();

	const snapshot = await db.collectionGroup('daily')
		.where('expiresAtMs', '<=', now)
		.where('penaltyProcessed', '==', false)
		.get();

	console.log(`Артикль проснулся. Найдено записей в базе: ${snapshot.size}`);

	if (snapshot.empty) {
		console.log("Нет должников на сегодня. Артикль уходит.");
		return null;
	}

	let batch = db.batch();
	let count = 0;
	const promises = [];

	for (const doc of snapshot.docs) {
		if (doc.id !== 'currentDailyQuests') continue;

		const data = doc.data();
		const userId = data.owner;
		const completedCount = data.completedCount || 0;

		if (completedCount === 0) {

			const userRef = db.collection('users').doc(userId);
			const userSnap = await userRef.get();

			if (userSnap.exists) {
				const userData = userSnap.data();
				const freezeEndMs = userData.freezeEndsAt || 0;

				const previousCycleExpiresAt = data.expiresAtMs || 0;
				const previousCycleStartsAt = previousCycleExpiresAt - CYCLE_MS;
				let hadShield = false;
				if (freezeEndMs && freezeEndMs > previousCycleStartsAt) {
					hadShield = true;
				}

				if (hadShield) {
					console.log(`Юзер ${userId} спасен заморозкой! Штраф отменен.`);
				} else {
					batch.update(userRef, { totalHats: FieldValue.increment(-3) });
					console.log(`Юзер ${userId} не выполнил ни одного квеста. Артикль берет у артикля 3 шляпы.`);
				}
			}
		} else {
			console.log(`Юзер ${userId} выполнил хотя бы 1 квест (${completedCount}). Штрафа нет.`);
		}
		batch.update(doc.ref, { penaltyProcessed: true });
		count++;

		if (count >= 400) {
			promises.push(batch.commit());
			batch = db.batch();
			count = 0;
		}
	}

	if (count > 0) {
		promises.push(batch.commit());
	}

	await Promise.all(promises);
	console.log(`Артикль закончил работу. Обработано квестов: ${count}`);
	return null;
});