const { onSchedule } = require("firebase-functions/v2/scheduler");
const { getFirestore } = require("firebase-admin/firestore");
const admin = require("firebase-admin");

if (admin.apps.length === 0) admin.initializeApp();
const db = getFirestore();

const CYCLE_MS = 24 * 60 * 60 * 1000;
const IMMUNITY_RANK_HATS = 500;

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