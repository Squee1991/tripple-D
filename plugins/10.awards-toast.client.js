import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'
import { useAchievementStore } from '~/store/achievementStore'
import { useUiSettingsStore } from '~/store/uiSettingsStore'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { getFirestore, doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore'

let inited = false
let lastShownKey = null

export default defineNuxtPlugin((nuxtApp) => {
    if (process.server || inited) return
    inited = true

    const ach  = useAchievementStore()
    const ui   = useUiSettingsStore()
    const auth = getAuth()
    const db   = getFirestore()

    const MIN_GAP = 1000
    const BOOT_DELAY = 700
    const CONTAINER_ID = 'achievements'

    const i18n = nuxtApp?.$i18n || nuxtApp?.vueApp?.config?.globalProperties?.$i18n
    const t = i18n?.t || ((s) => s)
    const looksLikeKey = (s) => typeof s === 'string' && /^[A-Za-z0-9_.:-]+$/.test(s) && !/\s/.test(s)
    const tr = (s) => { if (!s) return null; const res = t(s); return (res === s && looksLikeKey(s)) ? null : res }
    let shownSet = new Set()
    const lsKey = (uid) => `shown_toasts_v1_${uid || 'anon'}`
    const loadLocal = (uid) => { try { return new Set(JSON.parse(localStorage.getItem(lsKey(uid)) || '[]')) } catch { return new Set() } }
    const saveLocal = (uid, set) => { try { localStorage.setItem(lsKey(uid), JSON.stringify([...set])) } catch {} }
    const currentUid = () => auth.currentUser?.uid || null
    const isShown = (key) => shownSet.has(key)
    async function initShown(uid) {
        shownSet = loadLocal(uid)
        if (!uid) return
        try {
            const ref = doc(db, 'users', uid, 'ui', 'toastFlags')
            const snap = await getDoc(ref)
            const cloud = snap.exists() ? (snap.data().shown || {}) : {}
            shownSet = new Set([...shownSet, ...Object.keys(cloud)])
            saveLocal(uid, shownSet)
        } catch {}
    }

    async function markShown(key) {
        if (!key || shownSet.has(key)) return
        shownSet.add(key)
        saveLocal(currentUid(), shownSet)
        const uid = currentUid()
        if (!uid) return
        try {
            const ref = doc(db, 'users', uid, 'ui', 'toastFlags')
            await setDoc(ref, {}, { merge: true })
            await updateDoc(ref, { [`shown.${key}`]: serverTimestamp() })
        } catch {}
    }
    onAuthStateChanged(auth, (user) => initShown(user?.uid || null))
    let appMounted = false, processing = false, lastAt = 0
    const queue = []
    const enqueue = (fn, extraDelay = 0) => {
        console.log('[TOAST PLUGIN] Добавляю в очередь:', fn); // <-- ЛОГ
        queue.push({ fn, extraDelay });
        if (appMounted) drain()
    }
    const drain = () => {
        if (processing) return
        processing = true
        const step = () => {
            if (!queue.length) { processing = false; return }
            const { fn, extraDelay } = queue.shift()
            const wait = Math.max(MIN_GAP - (Date.now() - lastAt), 0) + (extraDelay || 0)
            setTimeout(() => { try { fn() } finally { lastAt = Date.now(); step() } }, wait)
        }
        step()
    }
    nuxtApp.hook('app:mounted', () => setTimeout(() => { appMounted = true; drain() }, BOOT_DELAY))

    const makeKey = (kind, obj) => {
        const base = obj?.key ?? obj?.achId ?? obj?.title ?? obj?.name ?? obj?.id
        return base ? `${kind}:${base}` : null
    }

    const resolveName = (a) => {
        const fromStore = ach.findById ? ach.findById(a?.id) : null
        const candidates = [ a?.name, fromStore?.name, a?.i18nKey, a?.id && `achievements.${a.id}.name`, a?.id && `achievements.${a.id}.title`, a?.id, ]
        for (const c of candidates) {
            const v = tr(c)
            if (v) return v
        }
        return null
    }

    const showAward = async (award) => {
        const key = makeKey('award', award)
        console.log(`[TOAST PLUGIN] Пытаюсь показать НАГРАДУ. Ключ: ${key}, Уже показан?: ${isShown(key)}`); // <-- ЛОГ
        if (!key || key === lastShownKey || isShown(key)) return
        lastShownKey = key
        const name = tr(award?.name) || tr(award?.title) || tr('Награда') || 'Награда'
        toast.success(`🎉 ${t('Вы получили награду')} «${name}»!`, {
            toastId: key, containerId: CONTAINER_ID, position: toast.POSITION.TOP_RIGHT, theme: 'colored',
            style: { background: '#222', color: '#fff', fontSize: '16px', borderRadius: '12px' },
        })
        await markShown(key)
        setTimeout(() => { if (lastShownKey === key) lastShownKey = null }, 1200)
    }

    const showAchievement = async (a) => {
        const key = makeKey('ach', a)
        console.log(`[TOAST PLUGIN] Пытаюсь показать ДОСТИЖЕНИЕ. Ключ: ${key}, Уже показан?: ${isShown(key)}`); // <-- ЛОГ
        if (!key || key === lastShownKey || isShown(key)) return
        lastShownKey = key
        const name = resolveName(a)
        const msg = name ? `🏆 ${t('Достижение получено')}: «${name}»!` : `🏆 ${t('Новое достижение разблокировано')}!`
        if (!msg.includes('null') && !msg.includes('undefined')) {
            toast.success(msg, { toastId: key, containerId: CONTAINER_ID })
        }
        await markShown(key)
        setTimeout(() => { if (lastShownKey === key) lastShownKey = null }, 1200)
    }

    ach.$subscribe((_m, state) => {
        // --- ЭТО САМАЯ ВАЖНАЯ ПРОВЕРКА ---
        console.log('[TOAST PLUGIN] Сработала подписка! Проверяю переключатель уведомлений:', { isEnabled: ui.achievementsNotifyEnabled }); // <-- ЛОГ

        if (!ui.achievementsNotifyEnabled) return

        const achievement = state.lastUnlockedAchievement
        const award = state.lastUnlockedAward

        console.log('[TOAST PLUGIN] Получены данные из стора:', { achievement, award }); // <-- ЛОГ

        if (achievement?.id === 'registerAchievement') {
            enqueue(() => showAchievement(achievement), 250)
            if (award) enqueue(() => showAward(award), 350)
            return
        }
        if (award) enqueue(() => showAward(award))
        if (achievement) enqueue(() => showAchievement(achievement), 250)
    })
})