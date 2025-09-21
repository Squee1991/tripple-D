import {defineStore} from 'pinia';
import {ref} from 'vue';
import {getFirestore, collection, query, where, addDoc, onSnapshot, getDocs, getDoc, doc, serverTimestamp, updateDoc, orderBy, limit, runTransaction, deleteDoc, increment} from 'firebase/firestore';
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
            if (userDoc.exists()) {
                achievements.value = userDoc.data().achievements || {};
            } else {
                achievements.value = {};
            }
            const plainObject = JSON.parse(JSON.stringify(achievements.value));
            console.log('[DUEL STORE] Загружены данные из Firestore (в виде простого объекта):', plainObject);
        } catch (error) {
            console.error("Ошибка при загрузке достижений пользователя:", error);
            achievements.value = {};
        }
    }

    async function loadLocalTasks(level) {
        const all = sentencesStore.db?.levels[level]?.sentences || []
        localTasks.value = all.sort(() => Math.random() - 0.5).slice(0, 8)
    }

    async function updateUserStats(userId, level, isWin, isCleanSweep, isFlawless) {
        if (!userId || !level) return;
        const userDocRef = doc(db, 'users', userId);
        const updates = {};
        const prefix = `achievements.${level}`;
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
            // 👇 ВОТ ЭТА СТРОКА ВСЁ ИСПРАВИТ
            await loadUserAchievements();
        } catch (error) {
            console.error("!!! КРИТИЧЕСКАЯ ОШИБКА ПРИ ЗАПИСИ В БД !!!", error);
        }
    }

    async function createGameSession(level, hostId) {
        if (!sentencesStore.db) {
            return null;
        }
        const allSentencesForLevel = sentencesStore.db?.levels[level]?.sentences || [];
        if (allSentencesForLevel.length < 11) {
            console.error("Недостаточно предложений для уровня:", level);
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
            if (docSnap.exists()) {
                sessionData.value = {id: docSnap.id, ...docSnap.data()};
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
                console.log("Конец игры обновим статистику!!!!!!!!!!!!");
                const myUserId = authStore.uid;
                const finalData = finalSessionDataForStats;

                if (!finalData.guestId || !myUserId) return;

                const winnerId = finalData.players[finalData.hostId].score > finalData.players[finalData.guestId].score
                    ? finalData.hostId
                    : finalData.guestId;

                if (myUserId === winnerId) {
                    const winnerData = finalData.players[winnerId];
                    const isCleanSweep = winnerData.score === finalData.totalRounds;
                    const isFlawless = !winnerData.hasMadeError;
                    await updateUserStats(myUserId, finalData.level, true, isCleanSweep, isFlawless);
                    console.log("Статистика победы обновлена.");
                } else {
                    await updateUserStats(myUserId, finalData.level, false, false, false);
                    console.log("Статистика поражения обновлена.");
                }
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