import {defineStore} from "pinia";
import {ref, computed} from 'vue'

export const userBattleStore = defineStore('battle', () => {

	const userHp = ref(40)
	const enemyHp = ref(40)
	const selectedTheme = ref(null)
	const userhand = ref([])
	const userDeck = ref([])
	const userField = ref([])
	const enemyhand = ref([])
	const enemyDeck = ref([])
	const enemyField = ref([])
	const stepNumber = ref(1)

	const loadWords = async () => {
		const wordResponse = await fetch('/words.json')
		return await wordResponse.json()
	}


	const loadSpells = async () => {
		const spellsResponse = await fetch('/spells.json')
		return await spellsResponse.json()
	}

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