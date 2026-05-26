import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';

export const useSpeakStore = defineStore('speakStore', () => {
	const db = getFirestore();
	const dialogueData = ref(null);
	const currentStepKey = ref('');
	const chatHistory = ref([]);
	const chatStarted = ref(false);
	const isOptionsDisabled = ref(false);
	const userProgress = ref({});

	const currentOptions = computed(() => {
		if (!dialogueData.value || !currentStepKey.value) return [];
		return dialogueData.value[currentStepKey.value]?.options || [];
	});

	const currentStepData = computed(() => {
		if (!dialogueData.value || !currentStepKey.value) return null;
		return dialogueData.value[currentStepKey.value];
	});

	const loadDialogue = async (level, theme) => {
		try {
			const url = `/speak-tasks/${level}/${theme}.json`;
			const response = await fetch(url);
			if (!response.ok) {
				throw new Error(`Файл не найден! Статус: ${response.status}`);
			}
			dialogueData.value = await response.json();
		} catch (error) {
			console.error(error);
		}
	};

	const loadUserProgress = async () => {
		const auth = getAuth();
		if (!auth.currentUser) return;
		try {
			const docRef = doc(db, 'users', auth.currentUser.uid, 'speak_tasks', 'progress');
			const snap = await getDoc(docRef);
			if (snap.exists()) {
				userProgress.value = snap.data();
			}
		} catch (error) {
			console.error('Ошибка при загрузке прогресса:', error);
		}
	};

	const saveDialogueCompletion = async (themeId) => {
		if (userProgress.value[themeId] === true) return;
		userProgress.value[themeId] = true;
		const auth = getAuth();
		if (!auth.currentUser) return;

		try {
			const docRef = doc(db, 'users', auth.currentUser.uid, 'speak_tasks', 'progress');
			await setDoc(docRef, { [themeId]: true }, { merge: true });
		} catch (error) {
			console.error('Ошибка при сохранении прогресса:', error);
		}
	};

	const resetSession = () => {
		dialogueData.value = null;
		chatHistory.value = [];
		currentStepKey.value = '';
		chatStarted.value = false;
		isOptionsDisabled.value = false;
	};

	const addMessage = (sender, text, translation = null) => {
		chatHistory.value.push({ sender, text, translation });
	};

	const setStep = (stepKey) => {
		currentStepKey.value = stepKey;
	};

	return {
		dialogueData,
		currentStepKey,
		chatHistory,
		chatStarted,
		isOptionsDisabled,
		currentOptions,
		currentStepData,
		userProgress,
		loadDialogue,
		loadUserProgress,
		saveDialogueCompletion,
		resetSession,
		addMessage,
		setStep
	};
});