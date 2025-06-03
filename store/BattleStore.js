import {defineStore} from "pinia";
import {ref, computed} from 'vue'

export const userBattleStore = defineStore('battle', () => {
	// --- Основные состояния игры ---
	const userHp = ref(40) // Очки здоровья игрока
	const enemyHp = ref(40) // Очки здоровья противника
	const selectedTheme = ref(null) // Выбранная тема для боя (название темы)
	// --- Руки, колоды и поля игроков ---
	const userhand = ref([]) // Рука игрока (карты в руке)
	const userDeck = ref([]) // Колода игрока (карты ещё не в руке)
	const userField = ref([]) // Игровое поле игрока (разыгранные карты)
	const enemyhand = ref([]) // Рука противника
	const enemyDeck = ref([]) // Колода противника
	const enemyField = ref([]) // Игровое поле противника
	const stepNumber = ref(1) // Номер текущего хода


//  JSON-файл с немецкими словами (словарь по темам)
	const loadWords = async () => {
		const wordResponse = await fetch('/words.json')
		return await wordResponse.json()
	}


// JSON-файл с описанием спеллов
	const loadSpells = async () => {
		const spellsResponse = await fetch('/spells.json')
		return await spellsResponse.json()
	}
	// Тут мы Назначаем спеллы каждому слову по артиклю
	const assignSpells = (words, spells, article) => {
		const availableSpells = spells[article];
		const spellCount = availableSpells.length;
		return words.map((word, i) => {
			const spell = availableSpells[i % spellCount];
			return {
				...word,
				spellId: spell.id,
				spell,
				attack: spell.defaultAttack,
				health: spell.defaultHealth
			};
		});
	};
// Тут генерируем колоду игрока по выбранной теме
	const generateuserDeck = async () => {
		const wordsData = await loadWords();
		const spellsData = await loadSpells();
		const allWords = wordsData[selectedTheme.value] || [];

		const derWords = allWords.filter(w => w.article === 'der').slice(0, 12);
		const dieWords = allWords.filter(w => w.article === 'die').slice(0, 12);
		const dasWords = allWords.filter(w => w.article === 'das').slice(0, 12);

		const fullUserDeck = [
			...assignSpells(derWords, spellsData, 'der'),
			...assignSpells(dieWords, spellsData, 'die'),
			...assignSpells(dasWords, spellsData, 'das')
		];

		userDeck.value = fullUserDeck;
	};


	return {
		userHp,
		enemyHp,
		selectedTheme,
		userhand,
		userDeck,
		userField,
		enemyhand,
		enemyDeck,
		enemyField,
		stepNumber,
		loadWords,
		loadSpells,
		assignSpells,
		generateuserDeck

	}

})