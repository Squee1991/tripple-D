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
	const shuffle = (array) => array.sort(() => Math.random() - 0.5)

	const loadWords = async () => {
		const wordResponse = await fetch('/words.json')
		return await wordResponse.json()
	}

	const loadSpells = async () => {
		const spellsResponse = await fetch('/spells.json')
		return await spellsResponse.json()
	}

	const assignSpells = (words, spells, type) => {
		const shuffledSpells = shuffle(spells[type])
		const spellPool = []
		for (let i = 0; i < 4; i++) {
			spellPool.push(shuffledSpells[i])
			spellPool.push({...shuffledSpells[i]})
		}

		for (let i = 0; i < 9; i++) {
			spellPool.push(shuffledSpells[i])
		}

		const finalSpells = shuffle(spellPool).slice(0, 12)

		return words.map((word, i) => {
			const spell = finalSpells[i]
			return {
				...word,
				spellId: spell.id,
				spell,
				attack: spell.defaultAttack,
				health: spell.defaultHealth

			}
		})
	}

	const generateuserDeck = async () => {
		const wordsData = await loadWords()
		const spellsData = await loadSpells()
		const allWords = wordsData[selectedTheme.value] || []

		const derWords = shuffle(allWords.filter(w => w.article === 'der')).slice(0, 12)
		const dieWords = shuffle(allWords.filter(w => w.article === 'die')).slice(0, 12)
		const dasWords = shuffle(allWords.filter(w => w.article === 'das')).slice(0, 12)

		const fullUserDeck = [
			...assignSpells(derWords, spellsData, 'der'),
			...assignSpells(dieWords, spellsData, 'die'),
			...assignSpells(dasWords, spellsData, 'das')
		]

		userDeck.value = shuffle(fullUserDeck)
	}


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