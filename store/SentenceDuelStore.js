import { defineStore } from 'pinia';
import { ref } from 'vue';
import {
    getFirestore, collection, query, where, addDoc, onSnapshot, getDocs, doc,
    serverTimestamp, updateDoc, orderBy, limit, runTransaction
} from 'firebase/firestore';
import { userAuthStore } from './authStore.js';
import { useSentencesStore } from './sentencesStore.js';

export const useGameStore = defineStore('game', () => {
    const db = getFirestore();
    const authStore = userAuthStore();
    const sentencesStore = useSentencesStore();
    const isSearching = ref(false);
    const gameId = ref(null);
    const error = ref(null);
    const sessionData = ref(null);
    let unsubscribeFromSession = null;
    const isCheckingWinner = ref(false);

    async function createGameSession(level, hostId) {
        // Убедимся, что данные на месте
        if (!sentencesStore.db) {
            console.error("Критическая ошибка: createGameSession вызвана до загрузки предложений.");
            return null;
        }

        const allSentencesForLevel = sentencesStore.db?.levels[level]?.sentences || [];
        if (allSentencesForLevel.length < 10) {
            console.error("Недостаточно предложений для уровня:", level);
            return null;
        }

        const shuffled = allSentencesForLevel.sort(() => 0.5 - Math.random());
        const selectedSentences = shuffled.slice(0, 10);

        // --- ГЛАВНЫЙ ДИАГНОСТИЧЕСКИЙ ЛОГ ---
        console.log("===================================");
        console.log("ИГРА СОЗДАНА. ВЫБРАНЫ СЛЕДУЮЩИЕ ID ПРЕДЛОЖЕНИЙ:");
        selectedSentences.forEach((s, index) => {
            console.log(`Раунд ${index + 1}: ${s.id}`);
        });
        console.log("===================================");
        // --- КОНЕЦ ЛОГА ---

        const sessionsRef = collection(db, 'gameSessions');
        const newSession = {
            hostId: hostId,
            guestId: null,
            level: level,
            status: 'waiting',
            createdAt: serverTimestamp(),
            players: { [hostId]: { score: 0, name: authStore.name } },
            rounds: selectedSentences.map(s => ({ sentenceId: s.id, winner: null })),
            currentRoundIndex: 0,
            totalRounds: 10,
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
                    if (!docSnap.exists() || docSnap.data().guestId) { throw 'Эту сессию уже заняли!'; }
                    t.update(sessionRef, {
                        guestId: myUserId,
                        status: 'starting',
                        [`players.${myUserId}`]: { score: 0, name: authStore.name }
                    });
                });
                listenToSession(sessionToJoin.id);
            } catch (e) { error.value = 'Не удалось присоединиться...'; setTimeout(() => findGame(level), 100); }

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
        };
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
                sessionData.value = { id: docSnap.id, ...docSnap.data() };
            } else {
                leaveSession();
            }
        });
    }

    function leaveSession() {
        if (unsubscribeFromSession) unsubscribeFromSession();
        unsubscribeFromSession = null;
        gameId.value = null;
        sessionData.value = null;
        isSearching.value = false;
        error.value = null;
    }

    async function prepareCurrentRound() {
        if (sessionData.value?.status !== 'starting') return;
        const roundIndex = sessionData.value.currentRoundIndex;
        const sentenceId = sessionData.value.rounds[roundIndex]?.sentenceId;
        if (!sentenceId) {
            return;
        }
        const originalSentence = getSentenceById(sentenceId);
        if (!originalSentence) {
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

        const roundIndex = sessionData.value.currentRoundIndex;
        const answers = sessionData.value.currentRoundData.answers;
        const sentenceId = sessionData.value.rounds[roundIndex]?.sentenceId;
        const correctAnswer = getSentenceById(sentenceId);
        if (!correctAnswer || !answers) return;

        let winnerId = null;
        for (const playerId in answers) {
            if (answers[playerId]?.toLowerCase().replace(/[.,!?;]/g, '').trim() === correctAnswer) {
                winnerId = playerId;
                break;
            }
        }
        if (winnerId) {
            isCheckingWinner.value = true;
            const sessionRef = doc(db, 'gameSessions', gameId.value);
            await updateDoc(sessionRef, {
                [`players.${winnerId}.score`]: (sessionData.value.players[winnerId]?.score || 0) + 1,
                status: 'round_over',
                [`rounds.${roundIndex}.winner`]: winnerId
            });
            setTimeout(prepareNextRound, 100);
        }
    }

    async function prepareNextRound() {
        isCheckingWinner.value = false;
        if (!sessionData.value) return;
        const nextRoundIndex = sessionData.value.currentRoundIndex + 1;
        const sessionRef = doc(db, 'gameSessions', gameId.value);
        if (nextRoundIndex >= sessionData.value.totalRounds) {
            await updateDoc(sessionRef, { status: 'finished' });
        } else {
            await updateDoc(sessionRef, {
                currentRoundIndex: nextRoundIndex,
                status: 'starting',
                currentRoundData: null
            });
        }
    }

    async function submitAnswer(answerText) {
        const myUserId = authStore.uid;
        if (!sessionData.value || !gameId.value || !myUserId || sessionData.value.status !== 'in_progress') return;
        const sessionRef = doc(db, 'gameSessions', gameId.value);
        const updatePath = `currentRoundData.answers.${myUserId}`;
        await updateDoc(sessionRef, { [updatePath]: answerText });
    }

    return {
        isSearching, gameId, error, sessionData,
        findGame, listenToSession, leaveSession, submitAnswer,
        prepareCurrentRound, checkRoundWinner
    };
});