<template>
    <div class="match-wrapper">
        <ThemeExplain v-if="showInfo" @close="showInfo = false"/>
        <div class="match-header">ПОЕДИНОК АРТИКЛЕЙ</div>
        <div class="match-layout">
            <div class="panel left-panel">
                <div class="panel-title">Данные игрока</div>
                <div class="player-slot">Кол-во побед</div>
                <div class="player-slot">Кол-во поражений</div>
                <div class="player-slot">Всего сыграно</div>
                <div class="player-slot">Кол-во очков</div>
                <div class="chat-info">Добро пожаловать в артикль-чат!</div>
            </div>
            <div class="panel center-panel">
                <div class="center-panel-header">
                    <div class="panel-title">Темы</div>
                  <button v-if="showDeck" class="find-button" style="padding:8px 12px; font-size:14px"
                          @click="showDeck = false">
                    ← К колодам
                  </button>
                    <img @click="showInfo = true" class="theme__info" src="../../assets/images/sticker-question.svg"
                         alt="info">
                </div>
                <div class="themen" data-simplebar>
                    <div class="themen-inner">
                        <template v-if="!showDeck">
                            <div
                                    class="theme-card"
                                    :class="{ selected: userBattle.selectedTheme === key }"
                                    v-for="(theme , key) in useTheme.themes"
                                    :key="key"
                                    @click="selectTheme(key)"
                            >
                                <div class="theme-card-title">{{ nameMap[key] || key }}</div>
                                <div class="theme__card-icon">
                                    <img class="theme__card-icon-item" src="../../assets/images/notebooks.svg" alt="">
                                </div>
                                <div class="theme-articles">
                                    <div class="article-circle der">{{ theme.stats.der }}</div>
                                    <div class="article-circle die">{{ theme.stats.die }}</div>
                                    <div class="article-circle das">{{ theme.stats.das }}</div>
                                </div>
                            </div>
                        </template>
                        <template v-else>
                            <Deck/>
                        </template>
                    </div>
                </div>
            </div>
            <div class="panel right-panel">
                <div class="panel-title">Поиск соперника</div>
                <div class="center-content">
                    <div class="session__wrapper">
                        <button v-if="!sessionId && !loading" class="find-button" @click="findOpponent">Найти
                            противника
                        </button>
                        <div v-else-if="loading || (sessionData && sessionData.status === 'waiting')"
                             class="status-message">
                            <div class="search-spinner"></div>
                            <span>Идёт поиск соперника...</span>
                        </div>
                        <div v-else-if="bothPlayersConnected" class="status-message">
                            <div>Противник найден!</div>
                            <button class="find-button" :class="{ ready: isReady }" :disabled="isReady"
                                    @click="markReady">
                                {{ isReady ? (opponentReady ? 'Ждём начала боя...' : 'Ожидание второго игрока...') :
                                'Начать бой' }}
                            </button>

                        </div>
                        <div v-if="message" class="status-message">{{ message }}</div>
                    </div>
                </div>
                <button v-if="sessionId" @click="leaveSession" class="leave-button">Покинуть</button>
            </div>
        </div>
    </div>
</template>

<script setup>
    import {ref, onUnmounted, computed, onMounted, watch} from 'vue'
    import {useRouter} from 'vue-router'
    import {getAuth} from 'firebase/auth'
    import ThemeExplain from '../../src/components/themeExplain.vue'
    import {useThemeCardStore} from '../../store/themeStore.js'
    import {userBattleStore} from '../../store/BattleStore.js'
    import {
        getFirestore, collection, query, where, orderBy, limit, getDocs,
        doc, updateDoc, addDoc, onSnapshot, serverTimestamp, deleteDoc, runTransaction
    } from 'firebase/firestore'
    import Deck from "~/src/components/deck.vue";

    const userBattle = userBattleStore()
    const useTheme = useThemeCardStore()
    const db = getFirestore()
    const auth = getAuth()
    const router = useRouter()

    const loading = ref(false)
    const showDeck = ref(false)
    let showInfo = ref(false)
    const message = ref('')
    const sessionId = ref(null)
    const sessionData = ref(null)
    const unsubscribe = ref(null)

    const uid = computed(() => auth.currentUser?.uid)
    const isThemeSelected = computed(() => !!userBattle.selectedTheme)

    const nameMap = {
        Furniture: 'Мебель',
        Animals: 'Животные',
        Clothes: 'Одежда',
        Food: 'Еда',
        Body: 'Части тела',
        Professions: 'Профессии',
        Transport: 'Транспорт',
        Colors: 'Цвета',
        Nature: 'Природа',
        Home: 'Дом',
        Zeit: 'Время',
        City: 'Город',
        School: 'Школа',
        DaysAndMonths: 'Дни и месяцы',
        Toys: 'Игрушки',
        CommonItems: 'Общие',
        BathroomItems: 'Ванная',
        Kosmetik: 'Косметика',
        Familie: 'Семья',
        Emotions: 'Эмоции',
        Werkzeuge: 'Инструменты',
        Kitchen: 'Кухня',
        Health: 'Здоровье',
        Sport: 'Спорт',
        Drinks: 'Напитки',
        Holidays: 'Праздники',
        SportEquipment: 'Фитнес',
        Travel: 'Путешествия',
        Musik: 'Музыка',
        Amount: 'Колличество',
        Informatik: 'Информатика'
    }

    // Эта функция просто сохраняет выбор в userBattle store
    const selectTheme = async (key) => {
        userBattle.selectedTheme = key
        await userBattle.generateuserDeck()
        showDeck.value = true
    }

    const findOpponent = async () => {
        loading.value = true
        message.value = ''
        if (!uid.value) {
            message.value = 'Вы не авторизованы';
            loading.value = false;
            return
        }
        if (!isThemeSelected.value) {
            message.value = 'Пожалуйста, сначала выберите тему';
            loading.value = false;
            return
        }

        // ВАШ РАБОЧИЙ ЗАПРОС, я его не менял
        const q = query(
            collection(db, 'sessions'),
            where('guestId', '==', null),
            where('status', '==', 'waiting'),
            orderBy('createdAt'),
            limit(1)
        )
        const snapshot = await getDocs(q)

        if (!snapshot.empty) {
            const sessionToJoin = snapshot.docs[0]
            const sessionRef = doc(db, 'sessions', sessionToJoin.id)
            try {
                await runTransaction(db, async (transaction) => {
                    const docSnap = await transaction.get(sessionRef)
                    if (!docSnap.exists() || docSnap.data().guestId) {
                        throw 'Сессию уже заняли'
                    }
                    transaction.update(sessionRef, {
                        guestId: uid.value,
                        status: 'pending',
                        guestTheme: userBattle.selectedTheme,
                        guestDeck: JSON.parse(JSON.stringify(userBattle.userDeck))
                    })
                })
                sessionId.value = sessionToJoin.id
                listenToSession(sessionToJoin.id)
            } catch (error) {
                console.error(error);
                message.value = 'Не удалось присоединиться, ищем заново...';
                setTimeout(() => findOpponent(), 2000)
            }
        } else {

            const newSessionRef = await addDoc(collection(db, 'sessions'), {
                hostId: uid.value,
                guestId: null,
                status: 'waiting',
                readyHost: false,
                readyGuest: false,
                createdAt: serverTimestamp(),
                hostTheme: userBattle.selectedTheme,
                hostDeck: JSON.parse(JSON.stringify(userBattle.userDeck)),
                guestTheme: null,
                guestDeck: null
            })
            sessionId.value = newSessionRef.id
            listenToSession(newSessionRef.id)
        }
        loading.value = false
    }

    const leaveSession = async () => {
        if (sessionId.value) {
            if (unsubscribe.value) unsubscribe.value();
            await deleteDoc(doc(db, 'sessions', sessionId.value));
            sessionId.value = null;
            sessionData.value = null;
            message.value = 'Вы покинули сессию';
            setTimeout(() => {
                message.value = ''
            }, 2000)
        }
    }
    const markReady = async () => {
        if (!uid.value || !sessionId.value) return;
        const sessionRef = doc(db, 'sessions', sessionId.value);
        const updateData = isHost.value ? {readyHost: true} : {readyGuest: true};
        await updateDoc(sessionRef, updateData)
    }
    const listenToSession = (id) => {
        const sessionRef = doc(db, 'sessions', id);
        if (unsubscribe.value) unsubscribe.value();
        unsubscribe.value = onSnapshot(sessionRef, (docSnap) => {
            if (!docSnap.exists()) {
                sessionId.value = null;
                sessionData.value = null;
                message.value = '';
                return
            }
            ;sessionData.value = docSnap.data();
            if (sessionData.value?.status === 'active') {
                router.push(`/battle?id=${id}`)
            }
        })
    }
    onUnmounted(() => {
        if (unsubscribe.value) unsubscribe.value()
    })
    const bothPlayersConnected = computed(() => sessionData.value?.status === 'pending' && sessionData.value?.hostId && sessionData.value?.guestId)
    const isHost = computed(() => sessionData.value?.hostId === uid.value)
    const isReady = computed(() => !sessionData.value ? false : (isHost.value ? sessionData.value.readyHost : sessionData.value.readyGuest))
    const opponentReady = computed(() => !sessionData.value ? false : (isHost.value ? sessionData.value.readyGuest : sessionData.value.readyHost))
    onMounted(() => {
        useTheme.loadthemes()
    })
    watch(sessionData, (newData) => {
        if (newData?.readyHost && newData?.readyGuest && newData?.status === 'pending') {
            const sessionRef = doc(db, 'sessions', sessionId.value);
            updateDoc(sessionRef, {status: 'active'})
        }
    }, {deep: true})
</script>

<style scoped>
    .theme-card.selected {
        transform: scale(1.05);
        z-index: 2;
    }

    .match-wrapper {
        min-height: 100vh;
        height: 100vh;
        width: 100vw;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        font-family: Georgia, serif;
    }

    .match-header {
        background: #3e2e1f;
        color: #ffd765;
        text-align: center;
        font-size: 28px;
        font-weight: bold;
        padding: 12px;
        border-bottom: 4px solid #c9a24e;
    }

    .match-layout {
        flex: 1 1 0%;
        display: flex;
        flex-direction: row;
        min-height: 0;
        height: 100%;
        gap: 12px;
        padding: 16px;
        box-sizing: border-box;
    }

    .panel {
        background: #e0caa2;
        border: 4px solid #7a5b32;
        border-radius: 10px;
        padding: 16px;
        box-shadow: inset 0 0 8px #00000033;
        display: flex;
        flex-direction: column;
        min-height: 0;
        height: 100%;
    }

    .center-panel {
        flex: 1;
        display: flex;
        flex-direction: column;
        min-width: 0;
        min-height: 0;
        height: 100%;
    }

    .center-panel-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 4px solid #b89040;
        padding: 10px;
        margin-bottom: 10px;
    }

    .panel-title {
        font-size: 24px;
        font-weight: bold;
        color: #3a260e;
        font-family: 'Georgia', serif;
    }

    .player-slot {
        background: #c9b07d;
        padding: 10px;
        margin-bottom: 8px;
        border: 2px solid #8c6c3a;
        border-radius: 6px;
        text-align: center;
        font-weight: 600;
        color: #2e1e07;
    }

    .leave-button {
        padding: 10px 0;
        background: #c9b07d;
        border: 2px solid #a88d61;
        border-radius: 10px;
        font-weight: bold;
        color: #3e2e1f;
        cursor: pointer;
        transition: background 0.2s;
    }

    .leave-button:hover {
        background: #ffe4a6;
    }

    .chat-info {
        margin-top: auto;
        font-size: 12px;
        color: #4a3720;
        padding-top: 12px;
    }

    .center-panel-header {
        display: flex;
        justify-content: space-between;
    }

    .center-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        flex: 1;
    }

    .theme__info {
        cursor: pointer;
    }

    .find-button {
        background: linear-gradient(120deg, #ffe08a, #a87709);
        color: #3e2503;
        border: 3px solid #f8e1b7;
        border-radius: 18px;
        padding: 15px;
        font-size: 20px;
        font-weight: bold;
        cursor: pointer;
        transition: background 0.3s ease, transform 0.2s ease;
        box-shadow: 0 4px 12px #00000045, inset 0 2px 4px #ffffff60;
        text-shadow: 0 1px 1px #fff2c1;
        margin-bottom: 10px;
        width: 250px;
    }

    .find-button:hover:enabled {
        background: linear-gradient(120deg, #fff0b4, #c99a2b);
    }

    .find-button:disabled {
        background: #e4d6a179;
        color: #a1926a;
        cursor: not-allowed;
        box-shadow: none;
        opacity: 0.8;
    }

    .status-message {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        font-size: 18px;
        color: #5b3b08;
        font-weight: 500;
        background: #fdf3dc;
        padding: 12px 20px;
        border-radius: 14px;
        border: 2px solid #e3c285;
        box-shadow: inset 0 2px 4px #ffffff80;
        max-width: 360px;
        width: 250px;
        text-align: center;
    }

    .player-list {
        display: flex;
        flex-direction: column;
        gap: 6px;
        margin-top: 8px;
    }

    .player {
        padding: 6px 10px;
        background: #e9dab1;
        border: 1px solid #b0905e;
        border-radius: 6px;
        font-size: 14px;
        color: #2d1e06;
    }

    .search-spinner {
        display: inline-block;
        width: 36px;
        height: 36px;
        border: 5px solid #e6c15c;
        border-radius: 50%;
        border-top-color: #a68836;
        animation: spin 1s linear infinite;
        margin-bottom: 8px;
    }

    @keyframes spin {
        to {
            transform: rotate(360deg);
        }
    }

    .themen {
        flex: 1 1 0%;
        min-height: 0;
        padding: 25px;
    }

    .themen-inner {
        display: flex;
        flex-wrap: wrap;
        gap: 2%;
        justify-content: center;
    }

    .theme-card {
        width: 10%;
        min-width: 175px;
        background: linear-gradient(135deg, #e5be73 65%, #a07632 100%);
        border: 5px solid #7a5921;
        border-radius: 20px;
        box-shadow: 0 8px 40px #2e1b0a88,
        0 0 0 5px #ecd18a inset;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 16px;
        margin-bottom: 20px;
        transition: transform 0.3s ease, box-shadow 0.3s ease;
        cursor: pointer;
    }

    .theme-card-title {
        width: 150px;
        background: #553a13;
        color: #ffd462;
        font-family: 'Georgia', serif;
        font-size: 17px;
        height: 60px;
        display: flex;
        justify-content: center;
        font-weight: bold;
        align-items: center;
        padding: 7px 5px 8px 5px;
        border-radius: 12px 12px 14px 14px;
        margin-bottom: 18px;
        border: 3px solid #cfab63;
        box-shadow: 0 2px 14px #29190388 inset;
        text-shadow: 0 3px 8px #b3872e, 0 1px 0 #fffbe8;
    }

    .theme__card-icon {
        width: 100px;
        height: 120px;
        border-radius: 50%;
        margin-bottom: 25px;
        border: 4px solid #7a5921;
        display: flex;
        justify-content: center;
        align-items: center;
        overflow: hidden;
        box-shadow: inset 0 6px 18px #a2832e99,
        inset 0 -8px 16px #00000038,
        0 2px 8px #7a5921cc;
        background: radial-gradient(ellipse at 60% 40%, #e2c072 70%, #ba9652 100%);
        position: relative;
    }


    .theme__card-icon-item {

    }

    .theme-card-word-count {
        font-size: 15px;
        font-weight: 500;
        color: #6e4f25;
        background: #fff9d5;
        padding: 6px 12px;
        border-radius: 12px;
        box-shadow: inset 0 1px 2px #ffffffaa;
        margin-bottom: 16px;
    }

    .theme-articles {
        display: flex;
        justify-content: center;
        gap: 7px;
        margin-top: auto;

    }

    .article-circle {
        width: 42px;
        height: 42px;
        border-radius: 50%;
        font-size: 16px;
        font-weight: bold;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        box-shadow: 0 0 8px #00000055, inset 0 2px 3px #ffffff50;
        text-shadow: 0 1px 1px #00000099;
    }

    .session__wrapper {
        height: 150px;
    }

    .article-circle.der {
        background: radial-gradient(circle at 60% 40%, #48b85e 70%, #1a431c 100%);
    }

    .article-circle.die {
        background: radial-gradient(circle at 60% 40%, #c53d2f 70%, #6b1616 100%);
    }

    .article-circle.das {
        background: radial-gradient(circle at 60% 40%, #4662b7 70%, #222a50 100%);
    }

    @media (max-width: 900px) {
        .match-layout {
            flex-direction: column-reverse;
            gap: 10px;
            padding: 4px;
        }

        .left-panel, .right-panel {
            min-width: 0;
            max-width: none;
            height: auto;
        }

        .center-panel {
            min-height: 0;
            min-width: 0;
            height: 240px;
            flex: 1 1 0%;
        }

        .left-panel {
            display: none;
            position: relative;
            z-index: 10000;
        }
    }

</style>
