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
    increment,
    Timestamp
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
    const didFinalizeMyStats = ref(false);
    async function loadUserAchievements() {
        const userId = authStore.uid;
        if (!userId) return;
        try {
            const userDocRef = doc(db, 'users', userId);
            const userDoc = await getDoc(userDocRef);
            const newAchievements = userDoc.exists() ? userDoc.data().achievements || {} : {};
            Object.keys(achievements.value).forEach(key => {
                delete achievements.value[key];
            });
            Object.assign(achievements.value, newAchievements);
        } catch (error) {
            console.error("Ошибка загрузки достижений:", error);
            Object.keys(achievements.value).forEach(key => delete achievements.value[key]);
        }
    }

    async function loadLocalTasks(level) {
        const all = sentencesStore.db?.levels[level]?.sentences || []
        localTasks.value = all.sort(() => Math.random() - 0.5).slice(0, 8)
    }

    async function updateUserStats(userId, level, isWin, isCleanSweep, isFlawless) {
        console.log('--- [STATS UPDATE] Вызов функции с данными:', { userId, level, isWin });
        if (!userId || !level || userId !== authStore.uid) return;
        const userDocRef = doc(db, 'users', userId);
        const updates = {};
        const prefix = `achievements.${level.toUpperCase()}`;
        if (isWin) {
            updates[`${prefix}.wins`]        = increment(1);
            updates[`${prefix}.streaks`]     = increment(1);
            if (isCleanSweep) updates[`${prefix}.cleanSweeps`]  = increment(1);
            if (isFlawless)   updates[`${prefix}.flawlessWins`] = increment(1);
        } else {
            updates[`${prefix}.streaks`] = 0;
        }
        try {
            await updateDoc(userDocRef, updates);
            await loadUserAchievements();
            console.log(`[STATS] ${isWin ? 'Победа' : 'Поражение'} для ${userId} на уровне ${level}`);
        } catch (error) {
            console.error(`[STATS ERROR] Не удалось обновить статистику для ${userId}`, error);
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
        const expireAt = Timestamp.fromMillis(Date.now() + 60 * 1000);
        const sessionsRef = collection(db, 'gameSessions');
        const newSession = {
            hostId: hostId,
            guestId: null,
            level: level,
            status: 'waiting',
            createdAt: serverTimestamp(),
            expireAt: expireAt,
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
                        [`players.${myUserId}`]: {score: 0, name: authStore.name, hasMadeError: false}
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
        didFinalizeMyStats.value = false;
        if (unsubscribeFromSession) unsubscribeFromSession();

        unsubscribeFromSession = onSnapshot(sessionRef, (docSnap) => {
            const prevStatus = sessionData.value?.status;

            if (!docSnap.exists()) {
                sessionData.value = null;
                gameId.value = null;
                if (unsubscribeFromSession) {
                    unsubscribeFromSession();
                    unsubscribeFromSession = null;
                }
                return;
            }

            const data = { id: docSnap.id, ...docSnap.data() };
            sessionData.value = data; // Сначала обновляем данные
            const newStatus = data.status;
            // --- ИЗМЕНЕНИЕ 2 ---
            // Когда игра впервые перешла в статус 'finished'
            if (newStatus === 'finished' && prevStatus !== 'finished') {
                // 1. Каждый игрок обновляет СВОЮ статистику
                if (!didFinalizeMyStats.value) {
                    const hostId  = data.hostId;
                    const guestId = data.guestId;
                    if (!hostId || !guestId) return;

                    const hostScore  = data.players[hostId]?.score  || 0;
                    const guestScore = data.players[guestId]?.score || 0;
                    const winnerId   = hostScore > guestScore ? hostId : (guestScore > hostScore ? guestId : null);

                    const myUid   = authStore.uid;
                    const myState = data.players[myUid] || {};
                    const iWon        = myUid === winnerId;
                    const isCleanSweep = (myState.score || 0) === data.totalRounds;
                    const isFlawless   = !myState.hasMadeError;

                    updateUserStats(myUid, data.level, iWon, isCleanSweep, isFlawless)
                        .finally(() => { didFinalizeMyStats.value = true; });
                }
                // 2. Только ХОСТ планирует удаление сессии
                if (data.hostId === authStore.uid) {
                    console.log(`Я хост, удаляю сессию ${data.id} через 10 секунд...`);
                    // Задержка нужна, чтобы гость успел получить финальное состояние и обновить свою статистику
                    setTimeout(async () => {
                        try {
                            await deleteDoc(doc(db, 'gameSessions', data.id));
                            console.log(`Сессия ${data.id} успешно удалена.`);
                        } catch (e) {
                            console.log("Не удалось удалить сессию (возможно, она уже удалена).");
                        }
                    }, 10000); // 10 секунд
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
            // При выходе из сессии также пытаемся её удалить, если мы хост
            // Это поможет, если второй игрок уже отключился
            if (sessionData.value && sessionData.value.hostId === authStore.uid) {
                try {
                    const sessionRef = doc(db, 'gameSessions', gameId.value);
                    await deleteDoc(sessionRef);
                } catch (e) {
                    console.error("Ошибка при удалении сессии при выходе:", e);
                }
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
            await runTransaction(db, async (transaction) => {
                const sessionDoc = await transaction.get(sessionRef);
                if (!sessionDoc.exists()) return;
                const data = sessionDoc.data();
                if (data.status !== 'in_progress') return;
                const roundIndex = data.currentRoundIndex;
                if (roundIndex >= data.totalRounds) return;
                const correctAnswer = getSentenceById(data.rounds[roundIndex]?.sentenceId);
                const currentAnswers = data.currentRoundData?.answers || {};
                let winnerId = null;
                for (const playerId in currentAnswers) {
                    const ans = (currentAnswers[playerId] || '').toLowerCase().replace(/[.,!?;]/g, '').trim();
                    if (ans === correctAnswer) {
                        winnerId = playerId;
                        break;
                    }
                }
                if (!winnerId) return;
                const nextRounds = [...data.rounds];
                nextRounds[roundIndex] = { ...nextRounds[roundIndex], winner: winnerId };
                const newScore = (data.players[winnerId]?.score || 0) + 1;
                const nextIndex = roundIndex + 1;
                const isGameOver = nextIndex >= data.totalRounds;
                transaction.update(sessionRef, {
                    [`players.${winnerId}.score`]: newScore,
                    rounds: nextRounds,
                    currentRoundIndex: nextIndex,
                    currentRoundData: null,
                    status: isGameOver ? 'finished' : 'starting'
                });
            });
        } catch (e) {
            console.error("ошибка в checkRoundWinner:", e);
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