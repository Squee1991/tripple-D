import { ref, computed } from 'vue';
import { defineStore } from 'pinia';

export const useSpeakStore = defineStore('speakStore', () => {
	const dialogueData = ref(null);
	const currentStepKey = ref('');
	const chatHistory = ref([]);
	const chatStarted = ref(false);
	const isOptionsDisabled = ref(false);

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
		loadDialogue,
		resetSession,
		addMessage,
		setStep
	};
});