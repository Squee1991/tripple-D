// plugins/achievements-toasts.client.js
import {toast} from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import {useAchievementStore} from '~/store/achievementStore';
import {useUiSettingsStore} from '~/store/uiSettingsStore';


// Firebase импорты — подстрой под свой проект
import {getAuth, onAuthStateChanged} from 'firebase/auth'
import {getFirestore, doc, getDoc, setDoc, updateDoc, serverTimestamp} from 'firebase/firestore'


let inited = false
let lastShownKey = null

export default defineNuxtPlugin((nuxtApp) => {
    if (process.server) return
    if (inited) return
    inited = true

    const ach = useAchievementStore()
    const ui = useUiSettingsStore()

    // Firebase
    const auth = getAuth()
    const db = getFirestore()

    // локальный кеш показанных ключей (для скорости и оффлайна)
    let shownSet = new Set()
    const lsKey = (uid) => `shown_toasts_v1_${uid || 'anon'}`
    const loadLocal = (uid) => {
        try {
            return new Set(JSON.parse(localStorage.getItem(lsKey(uid)) || '[]'))
        } catch {
            return new Set()
        }
    }
    const saveLocal = (uid, set) => {
        try {
            localStorage.setItem(lsKey(uid), JSON.stringify([...set]))
        } catch {
        }
    }

    async function loadShownFromCloud(uid) {
        shownSet = loadLocal(uid)
        if (!uid) return
        try {
            const ref = doc(db, 'users', uid, 'ui', 'toastFlags')
            const snap = await getDoc(ref)
            const cloudMap = snap.exists() ? (snap.data().shown || {}) : {}
            const keys = Object.keys(cloudMap)
            shownSet = new Set([...shownSet, ...keys])
            saveLocal(uid, shownSet)
        } catch (e) {
            // игнорируем сеть: остаёмся на локальном кеше
        }
    }

    const currentUid = () => auth.currentUser?.uid || null

    function isShown(key) {
        return shownSet.has(key)
    }

    async function markShown(key) {
        if (!key) return
        if (shownSet.has(key)) return
        shownSet.add(key)
        saveLocal(currentUid(), shownSet)

        const uid = currentUid()
        if (!uid) return
        try {
            const ref = doc(db, 'users', uid, 'ui', 'toastFlags')
            await setDoc(ref, {}, {merge: true})
            await updateDoc(ref, {[`shown.${key}`]: serverTimestamp()})
        } catch (e) {
            // оффлайн — останется в локальном кеше
        }
    }

    onAuthStateChanged(auth, (user) => {
        loadShownFromCloud(user?.uid || null)
    })

    let appMounted = false

    // очередь тостов
    const MIN_GAP = 1000
    const BOOT_DELAY = 700
    const CONTAINER_ID = 'achievements'

    const toastQueue = []
    let processing = false
    let lastAt = 0

    const enqueueToast = (fn, extraDelay = 0) => {
        toastQueue.push({fn, extraDelay})
        if (appMounted) drainQueue()
    }

    const drainQueue = () => {
        if (processing) return
        processing = true
        const step = () => {
            if (!toastQueue.length) {
                processing = false;
                return
            }
            const {fn, extraDelay} = toastQueue.shift()
            const since = Date.now() - lastAt
            const wait = Math.max(MIN_GAP - since, 0) + (extraDelay || 0)
            setTimeout(() => {
                try {
                    fn()
                } finally {
                    lastAt = Date.now()
                    step()
                }
            }, wait)
        }
        step()
    }

    // i18n helper
    const t =
        nuxtApp?.$i18n?.t ||
        nuxtApp?.vueApp?.config?.globalProperties?.$t ||
        ((s) => s)

    const makeAwardKey = (award) => {
        const baseKey = award?.key ?? award?.achId ?? award?.title
        return baseKey ? `award:${baseKey}` : null
    }
    const makeAchKey = (a) => a?.id ? `ach:${a.id}` : null

    const showAward = async (award) => {
        const key = makeAwardKey(award)
        if (!key || key === lastShownKey) return
        if (isShown(key)) return

        lastShownKey = key
        setTimeout(() => {
            toast.success(`🎉 ${t('Вы получили награду')} «${t(award?.title || 'Награда')}»!`, {
                position: toast.POSITION.TOP_RIGHT,
                theme: 'colored',
                style: {
                    background: '#222', // фон
                    color: '#fff',      // цвет текста
                    fontSize: '16px',   // размер текста
                    borderRadius: '12px', // скругление
                },
                toastId: key,
                containerId: CONTAINER_ID,
            })

        }, 1000)
        await markShown(key)
        setTimeout(() => {
            if (lastShownKey === key) lastShownKey = null
        }, 1200)
    }

    const showAchievement = async (a) => {
        const key = makeAchKey(a)
        if (!key || key === lastShownKey) return
        if (isShown(key)) return

        lastShownKey = key

        const rawTitle =
            a?.title ||
            (ach.findById ? ach.findById(a?.id)?.title : null) ||
            a?.i18nKey || a?.id || 'Достижение'

        const title = t(rawTitle)

        toast.success(`🏆 ${t('Достижение')} «${title}» ${t('выполнено')}!`, {
            toastId: key,
            containerId: CONTAINER_ID,
        })
        await markShown(key)
        setTimeout(() => {
            if (lastShownKey === key) lastShownKey = null
        }, 1200)
    }

    // единая подписка: кладём события в очередь (сначала награда, затем ачивка)
    ach.$subscribe((_m, state) => {
        if (!ui.achievementsNotifyEnabled) return
        const achievement = state.lastUnlockedAchievement
        const award = state.lastUnlockedAward

        // 🔹 Спец-правило: при регистрации «Первый шаг» показываем раньше награды
        if (achievement?.id === 'registerAchievement') {
            enqueueToast(() => showAchievement(achievement), 250)
            if (award) enqueueToast(() => showAward(award), 350)
            return
        }

        // остальной случай — как было (сначала награда, потом ачивка)
        if (award) enqueueToast(() => showAward(award), 0)
        if (achievement) enqueueToast(() => showAchievement(achievement), 250)
    })

    nuxtApp.hook('app:mounted', () => {
        setTimeout(() => {
            appMounted = true
            drainQueue()
        }, BOOT_DELAY)
    })
})
