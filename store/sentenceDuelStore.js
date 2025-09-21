import {defineStore} from 'pinia';
import {ref} from 'vue';
import {getFirestore, collection, query, where, addDoc, onSnapshot, getDocs, setDoc, getDoc, doc, serverTimestamp, updateDoc, orderBy, limit, runTransaction, deleteDoc, increment} from 'firebase/firestore';
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
        } catch (error) {
            console.error("Ошибка при загрузке достижений пользователя:", error);
            achievements.value = {};
        }
    }

    async function ensureLevelBranch(userDocRef, level) {
        await setDoc(userDocRef, {
            achievements: {
                [level]: { wins: 0, streaks: 0, cleanSweeps: 0, flawlessWins: 0 }
            }
        }, { merge: true });
    }

    async function loadLocalTasks(level) {
        const all = sentencesStore.db?.levels[level]?.sentences || []
        localTasks.value = all.sort(() => Math.random() - 0.5).slice(0, 8)
    }
    async function updateUserStats(userId, level, isWin, isCleanSweep, isFlawless) {
        if (!userId || !level) return;
        const userDocRef = doc(db, 'users', userId);

        try {
            // 1) гарантируем, что ветка существует (без точек, без increment)
            await ensureLevelBranch(userDocRef, level);

            // 2) применяем изменения через updateDoc с точками и increment
            const inc = (n) => increment(n);
            const updates = {};

            if (isWin) {
                updates[`achievements.${level}.wins`] = inc(1);
                updates[`achievements.${level}.streaks`] = inc(1);
                if (isCleanSweep)  updates[`achievements.${level}.cleanSweeps`]  = inc(1);
                if (isFlawless)    updates[`achievements.${level}.flawlessWins`] = inc(1);
            } else {
                // при поражении серия = 0
                updates[`achievements.${level}.streaks`] = 0;
            }

            await updateDoc(userDocRef, updates);
        } catch (e) {
            console.error('!!! КРИТИЧЕСКАЯ ОШИБКА ПРИ ЗАПИСИ В БД !!!', e);
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
            currentRoundData: null,
            statsApplied: false,
            result: null
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
                const s = await getDoc(sessionRef);
                const canDelete =
                    !s.exists() ||
                    s.data()?.status === 'waiting' ||
                    s.data()?.statsApplied === true;

                if (canDelete) await deleteDoc(sessionRef);
            } catch (e) {
                console.error('Ошибка при удалении сессии:', e);
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
            if (!gameId.value) return;
            const sessionRef = doc(db, 'gameSessions', gameId.value);

            // сюда положим итог, посчитанный ВНУТРИ транзакции
            let resultToApply = null;

            await runTransaction(db, async (t) => {
                const snap = await t.get(sessionRef);
                if (!snap.exists()) return;
                const data = snap.data();
                if (data.status !== 'in_progress') return;

                const roundIndex = data.currentRoundIndex;
                if (roundIndex >= data.totalRounds) return;

                const correctAnswer = getSentenceById(data.rounds[roundIndex]?.sentenceId);
                const currentAnswers = (data.currentRoundData && data.currentRoundData.answers) || {};

                // ищем победителя раунда
                let winnerId = null;
                for (const pid in currentAnswers) {
                    const ans = String(currentAnswers[pid] || '')
                        .toLowerCase().replace(/[.,!?;]/g, '').trim();
                    if (ans === correctAnswer) { winnerId = pid; break; }
                }
                if (!winnerId) return;

                // фиксируем раунд
                const newRounds = [...data.rounds];
                newRounds[roundIndex] = { ...newRounds[roundIndex], winner: winnerId };

                const nextRoundIndex = roundIndex + 1;
                const newScore = (data.players[winnerId]?.score || 0) + 1;

                const updates = {
                    [`players.${winnerId}.score`]: newScore,
                    currentRoundIndex: nextRoundIndex,
                    currentRoundData: null,
                    rounds: newRounds,
                    status: nextRoundIndex >= data.totalRounds ? 'finished' : 'starting',
                };

                // если это финал и статистика ещё не применялась
                if (nextRoundIndex >= data.totalRounds && !data.statsApplied) {
                    const hostId = data.hostId;
                    const guestId = data.guestId;

                    // финальные очки
                    const fs = {};
                    fs[hostId]  = hostId  === winnerId ? (data.players[hostId]?.score  || 0) + 1 : (data.players[hostId]?.score  || 0);
                    fs[guestId] = guestId === winnerId ? (data.players[guestId]?.score || 0) + 1 : (data.players[guestId]?.score || 0);

                    // строго нормализуем флаг ошибок победителя
                    const winnerHasError = data.players?.[winnerId]?.hasMadeError === true;
                    const isWinnerFlawless = !winnerHasError;
                    const isWinnerClean    = fs[winnerId] === data.totalRounds;

                    updates.statsApplied = true;
                    updates.result = {
                        winnerId,
                        level: data.level,
                        hostId,
                        guestId,
                        totalRounds: data.totalRounds,
                        finalScores: fs,
                        isWinnerFlawless,
                        isWinnerClean,
                    };

                    // обновляем сессию внутри транзакции
                    t.update(sessionRef, updates);

                    // прокидываем наружу для начисления очков пользователям
                    resultToApply = updates.result;
                    return;
                }

                // не финал — просто апдейт
                t.update(sessionRef, updates);
            });

            // ВАЖНО: начисляем статы ОДИН раз, используя то, что посчитали в транзакции
            if (resultToApply) {
                const { winnerId, hostId, guestId, level, isWinnerFlawless, isWinnerClean } = resultToApply;
                const loserId = winnerId === hostId ? guestId : hostId;

                console.log('APPLY_STATS', { level, winnerId, isWinnerClean, isWinnerFlawless });

                await Promise.all([
                    updateUserStats(winnerId, level, true,  isWinnerClean,  isWinnerFlawless),
                    updateUserStats(loserId,  level, false, false,         false),
                ]);
            }
        } catch (e) {
            console.error('ошибка в checkRoundWinner: ', e);
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