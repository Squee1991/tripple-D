import { defineStore } from 'pinia';
import { ref } from 'vue';
import {
    getFirestore, collection, query, where, addDoc, onSnapshot, getDocs, doc,
    serverTimestamp, updateDoc, orderBy, limit, runTransaction, deleteDoc
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
        if (!sentencesStore.db) {
            console.error("Критическая ошибка");
            return null;
        }

        const allSentencesForLevel = sentencesStore.db?.levels[level]?.sentences || [];
        if (allSentencesForLevel.length < 10) {
            console.error("Недостаточно предложений для уровня:", level);
            return null;
        }

        const shuffled = allSentencesForLevel.sort(() => 0.5 - Math.random());
        const selectedSentences = shuffled.slice(0, 10);
        console.log("ИГРА СОЗДАНА. ВЫБРАНЫ СЛЕДУЮЩИЕ ID ПРЕДЛОЖЕНИЙ:");
        selectedSentences.forEach((s, index) => {
            console.log(`Раунд ${index + 1}: ${s.id}`);
        });
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
        const raw = sentencesStore.db;
        if (!raw) {
            console.error("Хранилище предложений пустое!");
            return null;
        }

        // если у вас есть обёртка raw.levels, то используем её,
        // иначе предполагаем, что raw[level] — это сразу объект с { sentences: [...] }
        const levels = raw.levels ?? raw;

        for (const levelKey in levels) {
            const maybeContainer = levels[levelKey];
            // либо уровень — это { sentences: [...] }
            let arr = maybeContainer.sentences;
            // либо он сразу равен массиву
            if (!arr && Array.isArray(maybeContainer)) {
                arr = maybeContainer;
            }
            if (!Array.isArray(arr)) continue;

            const found = arr.find(s => s.id === id);
            if (found && found.original) {
                return found.original
                    .toLowerCase()
                    .replace(/[.,!?;]/g, '')
                    .trim();
            }
        }

        console.warn(`Предложение с id=${id} не найдено в словаре.`);
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

    function leaveSession() {
        if (unsubscribeFromSession) unsubscribeFromSession();
        unsubscribeFromSession = null;
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
        console.log('раунд ');
        console.log('Полное состояние sessionData:', JSON.parse(JSON.stringify(sessionData.value)));
        const roundIndex = sessionData.value.currentRoundIndex;
        const sentenceId = sessionData.value.rounds[roundIndex]?.sentenceId;
        if (!sentenceId) {
            console.error(`Не найден ID предложения для раунда ${roundIndex}`);
            console.error('ДЕБАГ: Индекс раунда:', roundIndex);
            console.error('ДЕБАГ: Массив раундов в момент ошибки:', JSON.parse(JSON.stringify(sessionData.value.rounds)));
            console.log('--- ДЕБАГ: Конец ---');
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
                if (!sessionDoc.exists()) throw "Документ с игрой не найден!";
                const data = sessionDoc.data();
                if (data.status !== 'in_progress') return;
                const roundIndex = data.currentRoundIndex;
                const correctAnswer = getSentenceById(data.rounds[roundIndex]?.sentenceId);
                const currentAnswers = sessionData.value.currentRoundData.answers;

                let winnerId = null;
                for (const playerId in currentAnswers) {
                    if (currentAnswers[playerId]?.toLowerCase().replace(/[.,!?;]/g, '').trim() === correctAnswer) {
                        winnerId = playerId;
                        break;
                    }
                }

                if (winnerId) {
                    const newRounds = [...data.rounds];
                    if(newRounds[roundIndex]) {
                        newRounds[roundIndex].winner = winnerId;
                    }
                    const nextRoundIndex = roundIndex + 1;
                    const isGameOver = nextRoundIndex >= data.totalRounds;
                    const updates = {
                        [`players.${winnerId}.score`]: (data.players[winnerId]?.score || 0) + 1,
                        status: isGameOver ? 'finished' : 'starting',
                        currentRoundIndex: isGameOver ? roundIndex : nextRoundIndex,
                        currentRoundData: null,
                        rounds: newRounds
                    };
                    transaction.update(sessionRef, updates);
                }
            });

        } catch (e) {
            if (e.code === 'failed-precondition') {
                console.log("Гонка состояний предотвращена. Это нормально.");
            } else {
                console.error("Неожиданная ошибка транзакции: ", e);
            }
        } finally {
            isCheckingWinner.value = false;
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
        prepareCurrentRound, checkRoundWinner , cancelSearch
    };
});