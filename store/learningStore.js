import {defineStore} from 'pinia'
import {ref, computed} from 'vue'
import {doc, setDoc, getDoc, getFirestore, updateDoc} from 'firebase/firestore'
import {getAuth, onAuthStateChanged} from 'firebase/auth'
import {dailyStore} from './dailyStore.js'

export const userlangStore = defineStore('learning', () => {
    const db = getFirestore()
    const daily = dailyStore()
    const words = ref([])
    const learnedWords = ref([])
    const wrongAnswers = ref([])
    const selectedTopics = ref([])
    const selectedWords = ref([])
    const points = ref(0)
    const gotPremiumBonus = ref(false)
    const totalEarnedPoints = ref(0)
    const articlesSpentForAchievement = ref(0)
    const currentIndex = ref(0)
    const currentModeIndex = ref(0)
    const exp = ref(0)
    const isLeveling = ref(0)
    const isLoaded = ref(false)
    const bestStreakAnyMode = ref(0)
    const bestStreakEasyArticle = ref(0)

    const topicStats = computed(() => {
        const stats = {}
        const topics = [...new Set(words.value.map(w => w.topic).filter(Boolean))]
        for (const topic of topics) {
            const total = words.value.filter(w => w.topic === topic).length
            const learned = learnedWords.value.filter(w => w.topic === topic).length
            stats[topic] = {totalWords: total, learnedWords: learned}
        }
        return stats
    })

    const markProgress = async (word, modeKey, value = true) => {
        const selected = selectedWords.value.find(w => w.de === word.de)
        if (selected) {
            if (!selected.progress) selected.progress = {}
            selected.progress[modeKey] = value
        }
        const found = words.value.find(w => w.de === word.de)
        if (found) {
            if (!found.progress) found.progress = {}
            found.progress[modeKey] = value
        }

        // ★ Начисляем за КАЖДЫЙ правильный ответ (без проверки wasAlreadyTrue)
        if (value === true) {
            points.value++
            totalEarnedPoints.value++
            exp.value++
            handleLeveling()
            try {
                daily.addPoints(1)
                daily.addExp(1)
                if (modeKey === 'wordArticle') daily.addWordArticle(1)
                if (modeKey === 'plural')      daily.addPlural(1)
                if (modeKey === 'audio')       daily.addAudioArticle(1)
            } catch {}
        }

        const requiredModes = ['article', 'letters', 'wordArticle', 'audio', 'plural']
        const p = (found?.progress) || {}
        const allPassed = requiredModes.every(m => p[m] === true)
        if (allPassed) {
            const already = learnedWords.value.some(w => w.de === word.de)
            if (!already) {
                learnedWords.value.push({ ...found, progress: { ...p } })
                try { daily.addLearned(1) } catch {}
            }
        }

        await saveToFirebase()
    }



    const recordAnswerResult = (isCorrect, {modeKey = null, difficulty = null} = {}) => {
        let currentAny = Number(sessionStorage.getItem('streakAnyMode') || '0')
        currentAny = isCorrect ? currentAny + 1 : 0
        sessionStorage.setItem('streakAnyMode', String(currentAny))
        if (currentAny > bestStreakAnyMode.value) {
            bestStreakAnyMode.value = currentAny
            saveToFirebase()
        }

        if (isCorrect && modeKey === 'wordArticle' && difficulty === 'easy') {
            let currentEasy = Number(sessionStorage.getItem('streakEasyArticle') || '0')
            currentEasy = currentEasy + 1
            sessionStorage.setItem('streakEasyArticle', String(currentEasy))
            if (currentEasy > bestStreakEasyArticle.value) {
                bestStreakEasyArticle.value = currentEasy
                saveToFirebase()
            }
        }
        if (!isCorrect && modeKey === 'wordArticle' && difficulty === 'easy') {
            sessionStorage.setItem('streakEasyArticle', '0')
        }
    }


    const addWordsToGlobal = async (wordsList) => {
        let added = false
        wordsList.forEach(newWord => {
            if (!words.value.find(w => w.de === newWord.de)) {
                words.value.push({
                    ...newWord,
                    progress: {
                        article: null,
                        letters: null,
                        wordArticle: null,
                        audio: null,
                        plural: null
                    }
                })
                added = true
            }
        })
        if (added) await saveToFirebase()
    }

    const setSelectedWords = async (wordsList) => {
        selectedWords.value = wordsList.map(word => ({
            ...word,
            progress: {
                article: null,
                letters: null,
                wordArticle: null,
                audio: null,
                plural: null
            }
        }))
        currentIndex.value = 0
        currentModeIndex.value = 0
        await saveToFirebase()
    }

    const handleLeveling = () => {
        const LEVEL_UP_XP = 100
        while (exp.value >= LEVEL_UP_XP) {
            isLeveling.value++
            exp.value -= LEVEL_UP_XP
        }
    }

    const setSelectedTopics = async (topics) => {
        const uniqueTopics = Array.from(new Set([...selectedTopics.value, ...topics]))
        selectedTopics.value = uniqueTopics
        currentIndex.value = 0
        currentModeIndex.value = 0
        await saveToFirebase()
    }

    const markAsLearned = async (word, selectedModes = []) => {
        const requiredModes = ['article', 'letters', 'wordArticle', 'audio', 'plural'];
        const progress = word.progress || {};
        const allPassed = requiredModes.every(mode => progress[mode] === true);
        if (!allPassed) return;
        const alreadyLearned = learnedWords.value.some(w => w.de === word.de);
        if (!alreadyLearned) {
            learnedWords.value.push({...word});
            try {
                daily.addLearned(1)
            } catch {
            }
            await saveToFirebase();
        }
    }

    const addWrongAnswers = async (word) => {
        if (!word || !word.de) return;
        const isAlreadyInWrong = wrongAnswers.value.find(w => w.de === word.de);
        if (!isAlreadyInWrong) {
            wrongAnswers.value.push({...word});
            await saveToFirebase();
        }
    };

    const clearProgress = async () => {
        words.value.forEach(word => {
            word.progress = {
                article: false, letters: null, wordArticle: null, audio: null, plural: null
            }
        })
        selectedWords.value.forEach(word => {
            word.progress = {
                article: null, letters: null, wordArticle: null, audio: null, plural: null
            }
        })
        learnedWords.value = []
        points.value = 0
        currentIndex.value = 0
        currentModeIndex.value = 0
        await saveToFirebase()
    }

    const loadFromFirebase = async () => {
        const auth = getAuth()
        const db = getFirestore()
        return new Promise((resolve) => {
            onAuthStateChanged(auth, async (user) => {
                if (!user) return resolve()
                const userDoc = doc(db, 'users', user.uid)
                const docSnap = await getDoc(userDoc)
                if (docSnap.exists()) {
                    const data = docSnap.data()
                    words.value = data.words || []
                    learnedWords.value = data.learnedWords || []
                    wrongAnswers.value = data.wrongAnswers || []
                    selectedTopics.value = data.selectedTopics || []
                    selectedWords.value = data.selectedWords || []
                    totalEarnedPoints.value = data.totalEarnedPoints || 0
                    articlesSpentForAchievement.value = data.articlesSpentForAchievement || 0
                    points.value = data.points || 0
                    exp.value = data.exp || 0
                    isLeveling.value = data.isLeveling ?? 0
                    currentIndex.value = data.currentIndex || 0
                    currentModeIndex.value = data.currentModeIndex || 0
                    gotPremiumBonus.value = data.gotPremiumBonus || false

                    bestStreakAnyMode.value = data.bestStreakAnyMode || 0
                    bestStreakEasyArticle.value = data.bestStreakEasyArticle || 0

                }
                isLoaded.value = true
                const prevExp = exp.value
                const prevLvl = isLeveling.value
                handleLeveling()
                if (exp.value !== prevExp || isLeveling.value !== prevLvl) {
                    await saveToFirebase()
                }

                resolve()
            })
        })
    }


    const getUserDocRef = () => {
        const user = getAuth().currentUser
        if (!user) return null
        return doc(db, 'users', user.uid)
    }

    const saveToFirebase = async () => {
        const userDoc = getUserDocRef()
        if (!userDoc) return
        await setDoc(userDoc, {
            words: words.value,
            learnedWords: learnedWords.value,
            wrongAnswers: wrongAnswers.value,
            selectedTopics: selectedTopics.value,
            selectedWords: selectedWords.value,
            points: points.value,
            totalEarnedPoints: totalEarnedPoints.value,
            articlesSpentForAchievement: articlesSpentForAchievement.value,
            exp: exp.value,
            isLeveling: isLeveling.value,
            currentIndex: currentIndex.value,
            currentModeIndex: currentModeIndex.value,
            gotPremiumBonus: gotPremiumBonus.value,

            bestStreakAnyMode: bestStreakAnyMode.value,
            bestStreakEasyArticle: bestStreakEasyArticle.value,


        }, {merge: true})
    }

    const syncSelectedWordsProgress = () => {
        selectedWords.value = selectedWords.value.map(selected => {
            const fullWord = words.value.find(w => w.de === selected.de)
            if (fullWord && fullWord.progress) {
                selected.progress = fullWord.progress
            }
            return selected
        })
    }
    const clearAll = async () => {
        words.value = []
        learnedWords.value = []
        wrongAnswers.value = []
        selectedTopics.value = []
        selectedWords.value = []
        points.value = 0
        exp.value = 0
        totalEarnedPoints.value = 0
        articlesSpentForAchievement.value = 0
        isLeveling.value = 0
        currentIndex.value = 0
        currentModeIndex.value = 0
        bestStreakAnyMode.value = 0
        bestStreakEasyArticle.value = 0
        await saveToFirebase()
    }


    return {
        words,
        learnedWords,
        wrongAnswers,
        selectedTopics,
        selectedWords,
        points,
        exp,
        totalEarnedPoints,
        isLeveling,
        currentIndex,
        currentModeIndex,
        topicStats,
        articlesSpentForAchievement,
        isLoaded,
        handleLeveling,
        markProgress,
        markAsLearned,
        setSelectedTopics,
        setSelectedWords,
        addWrongAnswers,
        clearProgress,
        syncSelectedWordsProgress,
        loadFromFirebase,
        saveToFirebase,
        clearAll,
        addWordsToGlobal,

        bestStreakAnyMode,
        bestStreakEasyArticle,
        recordAnswerResult,

    }
})