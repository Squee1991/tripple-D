import { defineStore } from "pinia";
import { ref } from "vue";
import { getFirestore, doc, setDoc, getDocs, collection } from "firebase/firestore";
import { userAuthStore } from "./authStore.js";

export const useEasterEggsStore = defineStore("eggs", () => {
	const answeredMap = ref({});
	const isLoaded = ref(false);
	const isVisible = ref(false);
	const tapsCount = ref(0);
	const auth = userAuthStore();
	const db = getFirestore();
	let resetTimer = null;
	const triggerTaps = () => {
		console.log("Стук! Текущий счетчик:", tapsCount.value + 1);
		if (tapsCount.value === 0) {
			console.log("Таймер запущен на 8 сек...");
			resetTimer = setTimeout(() => {
				console.log("Время вышло! Сброс счетчика.");
				tapsCount.value = 0;
				resetTimer = null;
			}, 8000);
		}

		tapsCount.value++;
		if (tapsCount.value >= 5) {
			console.log("Победа! Открываем пасхалку.");
			isVisible.value = true;
			tapsCount.value = 0;
			if (resetTimer) {
				clearTimeout(resetTimer);
				resetTimer = null;
			}
		}
	};

	const loadEggs = async () => {
		if (!auth.uid) return;
		try {
			const colRef = collection(db, "users", auth.uid, "eggs");
			const snap = await getDocs(colRef);
			const data = {};
			snap.forEach((d) => {
				data[d.id] = d.data().unlocked === true;
			});
			answeredMap.value = data;
			isLoaded.value = true;
		} catch (e) {
			console.error(e);
		}
	};

	const isAnswered = (id) => {
		return !!answeredMap.value[id];
	};

	const markAnswered = async (id) => {
		if (!id) return;
		answeredMap.value[id] = true;
		if (!auth.uid) return;
		try {
			const docRef = doc(db, "users", auth.uid, "eggs", id);
			await setDoc(docRef, {
				unlocked: true,
			}, { merge: true });
		} catch (e) {
			console.error("Ошибка сохранения пасхалки:", e);
		}
	};

	return {
		answeredMap,
		isLoaded,
		loadEggs,
		markAnswered,
		isAnswered,
		tapsCount,
		isVisible,
		triggerTaps,
	};
});