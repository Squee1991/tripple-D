import {defineStore} from 'pinia';
import {ref} from 'vue';
import {
    getFirestore,
    collection,
    query,
    where,
    addDoc,
    onSnapshot,
    getDocs,
    getDoc,
    doc,
    serverTimestamp,
    updateDoc,
    orderBy,
    limit,
    runTransaction,
    deleteDoc,
    increment
} from 'firebase/firestore';
import {userAuthStore} from './authStore.js';
import {useSentencesStore} from './sentencesStore.js';

export const useDuelStore = defineStore('gameDuelStore', () => {
    const db = getFirestore();
    const authStore = userAuthStore();
    const sentencesStore = useSentencesStore();
    const localTasks = ref([])
    const isSearching = ref(false);
    const gameId = ref(null);
    const error = ref(null);
    const sessionData = ref(null);
    let unsubscribeFromSession = null;
    const isCheckingWinner = ref(false);
    const achievements = ref({});

    async function loadUserAchievements() {
        const userId = authStore.uid;
        if (!userId) return;
        try {
            const userDocRef = doc(db, 'users', userId);
            const userDoc = await getDoc(userDocRef);
            const newAchievements = userDoc.exists() ? userDoc.data().achievements || {} : {};
            // --- ИЗМЕНЕНИЯ ЗДЕСЬ ---
            // 1. Очищаем текущий объект от старых ключей
            Object.keys(achievements.value).forEach(key => {
                delete achievements.value[key];
            });

            // 2. Копируем свойства из нового объекта в старый (мутируем его)
            Object.assign(achievements.value, newAchievements);
            // Вместо: achievements.value = newAchievements;
            // --- КОНЕЦ ИЗМЕНЕНИЙ ---


        } catch (error) {
            console.error("Ошибка загрузки достижений:", error);
            // В случае ошибки тоже очищаем, чтобы не показывать старые данные
            Object.keys(achievements.value).forEach(key => delete achievements.value[key]);
        }
    }

    async function loadLocalTasks(level) {
        const all = sentencesStore.db?.levels[level]?.sentences || []
        localTasks.value = all.sort(() => Math.random() - 0.5).slice(0, 8)
    }

    async function updateUserStats(userId, level, isWin, isCleanSweep, isFlawless) {
        if (!userId || !level) {

            return;
        }
        const userDocRef = doc(db, 'users', userId);
        const updates = {};
        const prefix = `achievements.${level.toUpperCase()}`;
        if (isWin) {
            updates[`${prefix}.wins`] = increment(1);
            updates[`${prefix}.streaks`] = increment(1);
            if (isCleanSweep) {
                updates[`${prefix}.cleanSweeps`] = increment(1);
            }
            if (isFlawless) {
                updates[`${prefix}.flawlessWins`] = increment(1);
            }
        } else {
            updates[`${prefix}.streaks`] = 0;
        }

        try {
            await updateDoc(userDocRef, updates);
            // 👇 ВОТ ЭТА СТРОКА УЛУЧШИТ ОПЫТ ХОСТА
            // Это не решает проблему гостя, но делает обновление у хоста мгновенным.
            // Основное решение - в listenToSession.
            if (userId === authStore.uid) { // Обновляем локальные данные только для себя
                await loadUserAchievements();
            }
        } catch (error) {
            console.error("Ошибка обновления статистики для", userId, error);
        }
    }

    async function createGameSession(level, hostId) {
        if (!sentencesStore.db) {
            return null;
        }
        const allSentencesForLevel = sentencesStore.db?.levels[level]?.sentences || [];
        if (allSentencesForLevel.length < 11) {

            return null;
        }

        const shuffled = allSentencesForLevel.sort(() => 0.5 - Math.random());
        const selectedSentences = shuffled.slice(0, 11);
        const sessionsRef = collection(db, 'gameSessions');
        const newSession = {
            hostId: hostId,
            guestId: null,
            level: level,
            status: 'waiting',
            createdAt: serverTimestamp(),
            players: {[hostId]: {score: 0, name: authStore.name, hasMadeError: false}},
            rounds: selectedSentences.map(s => ({sentenceId: s.id, winner: null})),
            currentRoundIndex: 0,
            totalRounds: 11,
            currentRoundData: null
        };

        const newSessionRef = await addDoc(sessionsRef, newSession);
        return newSessionRef.id;
    }

    async function findGame(level) {
        if (isSearching.value) return;
        const myUserId = authStore.uid;
        if (!myUserId) {
            error.value = "Ошибка: пользователь не авторизован.";
            return;
        }
        isSearching.value = true;
        error.value = null;

        const q = query(collection(db, 'gameSessions'),
            where('guestId', '==', null),
            where('status', '==', 'waiting'),
            where('level', '==', level),
            orderBy('createdAt'), limit(1));
        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
            const sessionToJoin = snapshot.docs[0];
            const sessionRef = doc(db, 'gameSessions', sessionToJoin.id);
            try {
                await runTransaction(db, async (t) => {
                    const docSnap = await t.get(sessionRef);
                    if (!docSnap.exists() || docSnap.data().guestId) {
                        throw 'Эту сессию уже заняли!';
                    }
                    t.update(sessionRef, {
                        guestId: myUserId,
                        status: 'starting',
                        [`players.${myUserId}`]: {score: 0, name: authStore.name, hasMadeError: false} // ИЗМЕНЕНО
                    });
                });
                listenToSession(sessionToJoin.id);
            } catch (e) {
                error.value = 'Не удалось присоединиться...';
                setTimeout(() => findGame(level), 100);
            }

        } else {
            const newGameId = await createGameSession(level, myUserId);
            if (newGameId) {
                listenToSession(newGameId);
            }
        }
        isSearching.value = false;
    }

    function getSentenceById(id) {
        if (!sentencesStore.db) {
            console.error("Хранилище предложений пустое!");
            return null;
        }
        for (const levelKey in sentencesStore.db.levels) {
            const sentence = sentencesStore.db.levels[levelKey].sentences.find(s => s.id === id);
            if (sentence) {
                return sentence.original.toLowerCase().replace(/[.,!?;]/g, '');
            }
        }
        return null;
    }

    function listenToSession(sessionId) {
        gameId.value = sessionId;
        const sessionRef = doc(db, 'gameSessions', sessionId);
        if (unsubscribeFromSession) unsubscribeFromSession();

        unsubscribeFromSession = onSnapshot(sessionRef, (docSnap) => {
            // Запоминаем старый статус игры перед обновлением
            const oldStatus = sessionData.value?.status;

            if (docSnap.exists()) {
                sessionData.value = {id: docSnap.id, ...docSnap.data()};
                const newStatus = sessionData.value.status;

                // 👇 ВОТ ОНО, ГЛАВНОЕ ИСПРАВЛЕНИЕ!
                // Если игра ТОЛЬКО ЧТО перешла в статус 'finished'
                if (newStatus === 'finished' && oldStatus !== 'finished') {

                    // Каждый клиент (и хост, и гость) перезагрузит СВОИ данные.
                    // К этому моменту хост уже должен был обновить данные в БД для обоих.
                    loadUserAchievements();
                }

            } else {
                sessionData.value = null;
                gameId.value = null;
                if (unsubscribeFromSession) {
                    unsubscribeFromSession();
                    unsubscribeFromSession = null;
                }
            }
        });
    }

    const cancelSearch = async () => {
        if (gameId.value && sessionData.value?.status === 'waiting') {
            const sessionRef = doc(db, 'gameSessions', gameId.value);
            try {
                await deleteDoc(sessionRef);
            } catch (e) {
                console.error("Ошибка при удалении сессии:", e);
            }
        }
        leaveSession();
    }

    async function leaveSession() {
        if (unsubscribeFromSession) unsubscribeFromSession();
        unsubscribeFromSession = null;
        if (gameId.value) {
            const sessionRef = doc(db, 'gameSessions', gameId.value);
            try {
                await deleteDoc(sessionRef);
            } catch (e) {
                console.error("Ошибка при удалении сессии:", e);
            }
        }
        gameId.value = null;
        sessionData.value = null;
        isSearching.value = false;
        error.value = null;
    }

    async function prepareCurrentRound() {
        if (!gameId.value) {
            console.error("prepareCurrentRound вызван без gameId!");
            return;
        }

        const roundIndex = sessionData.value.currentRoundIndex;
        const sentenceId = sessionData.value.rounds[roundIndex]?.sentenceId;
        if (!sentenceId) {
            console.error(`Не найден ID предложения для раунда ${roundIndex}`);
            return;
        }

        const originalSentence = getSentenceById(sentenceId);
        if (!originalSentence) {
            console.error(`Не найдено предложение по ID: ${sentenceId}`);
            return;
        }

        const scrambledWords = originalSentence.split(' ').sort(() => Math.random() - 0.5);
        const sessionRef = doc(db, 'gameSessions', gameId.value);
        await updateDoc(sessionRef, {
            currentRoundData: {
                scrambledWords: scrambledWords,
                answers: {}
            },
            status: 'in_progress'
        });
    }

    async function checkRoundWinner() {
        if (isCheckingWinner.value || sessionData.value?.status !== 'in_progress') return;
        isCheckingWinner.value = true;
        try {
            const sessionRef = doc(db, 'gameSessions', gameId.value);
            let isGameOver = false;
            let finalSessionDataForStats = null;

            await runTransaction(db, async (transaction) => {
                const sessionDoc = await transaction.get(sessionRef);
                if (!sessionDoc.exists() || sessionDoc.data().status !== 'in_progress') return;

                const data = sessionDoc.data();
                const roundIndex = data.currentRoundIndex;
                if (roundIndex >= data.totalRounds) return;

                const correctAnswer = getSentenceById(data.rounds[roundIndex]?.sentenceId);
                const currentAnswers = data.currentRoundData.answers;
                let winnerId = null;
                for (const playerId in currentAnswers) {
                    if (currentAnswers[playerId]?.toLowerCase().replace(/[.,!?;]/g, '').trim() === correctAnswer) {
                        winnerId = playerId;
                        break;
                    }
                }

                if (winnerId) {
                    const newRounds = [...data.rounds];
                    newRounds[roundIndex].winner = winnerId;
                    const nextRoundIndex = roundIndex + 1;
                    isGameOver = nextRoundIndex >= data.totalRounds;

                    const currentScore = data.players[winnerId]?.score || 0;
                    const newScore = currentScore + 1;

                    const updates = {
                        [`players.${winnerId}.score`]: newScore,
                        status: isGameOver ? 'finished' : 'starting',
                        currentRoundIndex: nextRoundIndex,
                        currentRoundData: null,
                        rounds: newRounds
                    };
                    transaction.update(sessionRef, updates);

                    if (isGameOver) {
                        const finalPlayers = JSON.parse(JSON.stringify(data.players));
                        finalPlayers[winnerId].score = newScore;
                        finalSessionDataForStats = {...data, ...updates, players: finalPlayers};
                    }
                }
            });

            if (isGameOver && finalSessionDataForStats) {

                const finalData = finalSessionDataForStats;
                const hostId = finalData.hostId;
                const guestId = finalData.guestId;

                // Проверяем, что оба игрока существуют
                if (!guestId || !hostId) return;

                const hostScore = finalData.players[hostId]?.score || 0;
                const guestScore = finalData.players[guestId]?.score || 0;

                const winnerId = hostScore > guestScore ? hostId : guestId;
                const loserId = hostScore > guestScore ? guestId : hostId;

                console.log(`[HOST DEBUG] Игра окончена. Хост: ${hostScore}, Гость: ${guestScore}`);
                console.log(`[HOST DEBUG] ID Победителя: ${winnerId}, ID Проигравшего: ${loserId}`);
                console.log(`[HOST DEBUG] Сейчас буду обновлять статистику для победителя...`);

                // 1. Обновляем статистику победителя
                const winnerData = finalData.players[winnerId];
                const isCleanSweep = winnerData.score === finalData.totalRounds;
                const isFlawless = !winnerData.hasMadeError;
                await updateUserStats(winnerId, finalData.level, true, isCleanSweep, isFlawless);

                console.log(`[HOST DEBUG] Статистика победителя обновлена. Теперь обновляю проигравшего...`);


                // 2. Обновляем статистику проигравшего
                await updateUserStats(loserId, finalData.level, false, false, false);

                console.log(`[HOST DEBUG] Обновление статистики завершено.`);

            }
        } catch (e) {
            console.error("ошибка в checkRoundWinner: ", e);
        } finally {
            isCheckingWinner.value = false;
        }
    }

    async function submitAnswer(answerText) {
        const myUserId = authStore.uid;
        if (!sessionData.value || !gameId.value || !myUserId || sessionData.value.status !== 'in_progress') return;

        const roundIndex = sessionData.value.currentRoundIndex;
        const correctSentence = getSentenceById(sessionData.value.rounds[roundIndex]?.sentenceId);

        const sessionRef = doc(db, 'gameSessions', gameId.value);
        const updates = {
            [`currentRoundData.answers.${myUserId}`]: answerText
        };

        if (answerText.toLowerCase().replace(/[.,!?;]/g, '').trim() !== correctSentence) {
            updates[`players.${myUserId}.hasMadeError`] = true;
        }

        await updateDoc(sessionRef, updates);
    }

    return {
        isSearching, gameId, error, sessionData,
        localTasks, achievements,
        loadLocalTasks,
        findGame, listenToSession, leaveSession, submitAnswer,
        prepareCurrentRound, checkRoundWinner, cancelSearch, loadUserAchievements
    };
});