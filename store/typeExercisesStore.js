import { defineStore } from "pinia";
import { computed, ref } from "vue";

export const useTypeExercisesStore = defineStore("typeExercises", () => {
	const exercisesData = ref([]);
	const isLoading = ref(false);
	const loadingError = ref("");

	const selectedCategoryId = ref(null);
	const selectedLevelNumber = ref(null);

	const currentTaskIndex = ref(0);
	const correctAnswersCount = ref(0);
	const isSessionFinished = ref(false);
	const isInputLocked = ref(false);

	const feedbackStatus = ref("");
	const lastSelectedAnswer = ref(null);

	async function loadExercises() {
		if (exercisesData.value.length > 0) return;
		isLoading.value = true;
		try {
			const response = await fetch("/type-exercises/exercises.json");
			exercisesData.value = await response.json();
		} catch (fetchError) {
			loadingError.value = "Ошибка при загрузке данных";
		} finally {
			isLoading.value = false;
		}
	}

	const selectedCategory = computed(() => {
		return exercisesData.value.find((category) => category.id === selectedCategoryId.value) ?? null;
	});

	const selectedLevel = computed(() => {
		return selectedCategory.value?.levels.find((levelItem) => levelItem.level === selectedLevelNumber.value) ?? null;
	});

	const currentLevelTasks = computed(() => {
		return selectedLevel.value?.tasks ?? [];
	});

	const totalTasksCount = computed(() => {
		return currentLevelTasks.value.length;
	});

	const currentTask = computed(() => {
		return currentLevelTasks.value[currentTaskIndex.value];
	});

	const progressPercent = computed(() => {
		if (totalTasksCount.value === 0) return 0;
		if (isSessionFinished.value) return 100;
		return (currentTaskIndex.value / totalTasksCount.value) * 100;
	});

	function resetSession() {
		currentTaskIndex.value = 0;
		correctAnswersCount.value = 0;
		isSessionFinished.value = false;
		isInputLocked.value = false;
		feedbackStatus.value = "";
		lastSelectedAnswer.value = null;
	}

	function setCategory(categoryId) {
		selectedCategoryId.value = categoryId;
		selectedLevelNumber.value = null;
		resetSession();
	}

	function setLevel(levelNumber) {
		selectedLevelNumber.value = levelNumber;
		resetSession();
	}

	async function submitAnswer(userAnswer) {
		if (isInputLocked.value || isSessionFinished.value) return;

		isInputLocked.value = true;
		lastSelectedAnswer.value = userAnswer;

		if (userAnswer === currentTask.value.answer) {
			feedbackStatus.value = "success";
			correctAnswersCount.value++;
		} else {
			feedbackStatus.value = "error";
		}

		await new Promise((resolve) => setTimeout(resolve, 800));

		feedbackStatus.value = "";
		lastSelectedAnswer.value = null;

		if (currentTaskIndex.value < currentLevelTasks.value.length - 1) {
			currentTaskIndex.value++;
			isInputLocked.value = false;
		} else {
			isSessionFinished.value = true;
			isInputLocked.value = false;
		}
	}

	return {
		exercisesData, isLoading, loadingError,
		selectedCategoryId, selectedLevelNumber,
		currentTaskIndex, correctAnswersCount, isSessionFinished, isInputLocked,
		feedbackStatus, lastSelectedAnswer,
		selectedCategory, selectedLevel, currentLevelTasks, totalTasksCount, currentTask, progressPercent,
		loadExercises, setCategory, setLevel, resetSession, submitAnswer
	};
});