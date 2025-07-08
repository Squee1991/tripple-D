// stores/game.js
import { defineStore } from 'pinia';
import { ref } from 'vue';
import {
    getFirestore, collection, query, where, addDoc, onSnapshot, getDocs, doc,
    serverTimestamp, deleteDoc, updateDoc, orderBy, limit, runTransaction
} from 'firebase/firestore';
import { userAuthStore } from './authStore.js';

export const useGameStore = defineStore('game', () => {
    const db = getFirestore();
    const authStore = userAuthStore();

    // Состояние
    const isSearching = ref(false);
    const gameId = ref(null);
    const error = ref(null);
    const sessionData = ref(null);
    let unsubscribeFromSession = null;

    // --- Поиск и создание игры ---
    async function findGame(level) {
        if (gameId.value && sessionData.value?.status === 'waiting') {
            return;
        }
        if (isSearching.value) return;

        const myUserId = authStore.uid;
        if (!myUserId) {
            error.value = "Ошибка: пользователь не авторизован.";
            return;
        }

        isSearching.value = true;
        error.value = null;

        const q = query(
            collection(db, 'gameSessions'),
            where('guestId', '==', null),
            where('status', '==', 'waiting'),
            where('level', '==', level),
            orderBy('createdAt'),
            limit(1)
        );

        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
            const sessionToJoin = snapshot.docs[0];
            const sessionRef = doc(db, 'gameSessions', sessionToJoin.id);
            try {
                await runTransaction(db, async (transaction) => {
                    const docSnap = await transaction.get(sessionRef);
                    if (!docSnap.exists() || docSnap.data().guestId) {
                        throw 'Эту сессию уже заняли!';
                    }
                    transaction.update(sessionRef, {
                        guestId: myUserId,
                        status: 'starting',
                        [`players.${myUserId}`]: { score: 0 }
                    });
                });
                gameId.value = sessionToJoin.id;
                listenToSession(sessionToJoin.id);
            } catch (e) {
                console.error("Не удалось присоединиться:", e);
                error.value = 'Не удалось присоединиться, ищем заново...';
                setTimeout(() => findGame(level), 2000);
            }
        } else {
            const newSession = {
                hostId: myUserId, guestId: null, level: level, status: 'waiting',
                createdAt: serverTimestamp(), players: { [myUserId]: { score: 0 } },
                rounds: [], currentRoundIndex: 0, totalRounds: 5
            };
            const newSessionRef = await addDoc(collection(db, 'gameSessions'), newSession);
            gameId.value = newSessionRef.id;
            listenToSession(newSessionRef.id);
        }
        isSearching.value = false;
    }

    // --- Управление активной сессией ---
    function listenToSession(sessionId) {
        const sessionRef = doc(db, 'gameSessions', sessionId);
        unsubscribeFromSession = onSnapshot(sessionRef, (docSnap) => {
            if (docSnap.exists()) {
                sessionData.value = docSnap.data();
            } else {
                leaveSession();
            }
        });
    }

    function leaveSession() {
        if (unsubscribeFromSession) unsubscribeFromSession();
        gameId.value = null;
        sessionData.value = null;
        isSearching.value = false;
        error.value = null;
    }

    // --- Логика "Судьи" на стороне клиента ---
    async function checkRoundWinner() {
        if (!sessionData.value || sessionData.value.status !== 'in_progress') {
            return;
        }

        const roundIndex = sessionData.value.currentRoundIndex;
        const answers = sessionData.value.currentRoundData.answers;
        const sentencesForGame = ['A1-FAM-001', 'A1-FAM-002', 'A2-REI-001', 'A1-EAT-001', 'A1-EAT-002'];
        const sentenceId = sentencesForGame[roundIndex];
        const correctAnswer = getSentenceById(sentenceId);

        if (!correctAnswer) return;

        let winnerId = null;
        for (const playerId in answers) {
            const playerAnswer = answers[playerId]?.toLowerCase().replace(/[.,!?;]/g, '').trim();
            if (playerAnswer === correctAnswer) {
                winnerId = playerId;
                break;
            }
        }

        if (winnerId) {
            const sessionRef = doc(db, 'gameSessions', gameId.value);
            await updateDoc(sessionRef, {
                [`players.${winnerId}.score`]: (sessionData.value.players[winnerId]?.score || 0) + 1,
                status: 'round_over',
                [`rounds.${roundIndex}`]: { winner: winnerId }
            });
            setTimeout(() => {
                prepareNextRound();
            }, 3000);
        }
    }

    async function prepareNextRound() {
        if (!sessionData.value) return;
        const nextRoundIndex = sessionData.value.currentRoundIndex + 1;
        const sessionRef = doc(db, 'gameSessions', gameId.value);

        if (nextRoundIndex >= sessionData.value.totalRounds) {
            await updateDoc(sessionRef, { status: 'finished' });
        } else {
            await updateDoc(sessionRef, { currentRoundIndex: nextRoundIndex });
            // prepareCurrentRound будет вызван наблюдателем в компоненте, когда статус изменится на starting
        }
    }

    async function prepareCurrentRound() {
        if (!sessionData.value || !gameId.value) return;
        const roundIndex = sessionData.value.currentRoundIndex;
        const sentencesForGame = ['A1-FAM-001', 'A1-FAM-002', 'A2-REI-001', 'A1-EAT-001', 'A1-EAT-002'];
        const sentenceId = sentencesForGame[roundIndex];
        const originalSentence = getSentenceById(sentenceId);
        if (!originalSentence) { return; }
        const scrambledWords = originalSentence.split(' ').sort(() => Math.random() - 0.5);
        const sessionRef = doc(db, 'gameSessions', gameId.value);
        await updateDoc(sessionRef, {
            'currentRoundData.scrambledWords': scrambledWords,
            'currentRoundData.answers': {},
            status: 'in_progress'
        });
    }

    function getSentenceById(id) {
        const allSentences = {
            'A1-FAM-001': 'das ist mein vater', 'A1-FAM-002': 'meine mutter ist ärztin',
            'A2-REI-001': 'wann fährt der nächste zug nach berlin', 'A1-EAT-001': 'ich trinke gerne kaffee',
            'A1-EAT-002': 'der apfel ist rot'
        };
        return allSentences[id] || null;
    }

    async function submitAnswer(answerText) {
        const myUserId = authStore.uid;
        if (!sessionData.value || !gameId.value || !myUserId) return;
        const sessionRef = doc(db, 'gameSessions', gameId.value);
        const updatePath = `currentRoundData.answers.${myUserId}`;
        await updateDoc(sessionRef, { [updatePath]: answerText });
    }

    return {
        isSearching, gameId, error, sessionData,
        findGame, listenToSession, leaveSession,
        prepareCurrentRound, submitAnswer, checkRoundWinner
    };
});