import { defineStore } from 'pinia'
import { ref } from 'vue'

const isClient = import.meta.client
const LOCAL_COOLDOWN_MS = 10 * 1000

function getLocalDateKey(d = new Date()) {
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${y}-${m}-${day}`
}

let db = null, auth = null, fb = null, fba = null
async function initFirebase() {
    if (!isClient) return false
    if (db && auth) return true
    fb  = await import('firebase/firestore')
    fba = await import('firebase/auth')
    db  = fb.getFirestore()
    auth = fba.getAuth()
    return true
}

export const useQuestStore = defineStore('quest', () => {
    const themes = ref([])
    const currentRecipe = ref(null)
    const dailyQuestCount = ref(0)

    const themenMap = [
        { title: 'questThemeList.firstTitle',  description: 'questThemeList.firstDescription'  },
        { title: 'questThemeList.SecondTitle', description: 'questThemeList.SecondDescription' },
        { title: 'questThemeList.ThirdTitle',  description: 'questThemeList.ThirdDescription'  }
    ]

    async function loadThemesAndRecipes() {
        if (!isClient) return
        try {
            const response = await fetch('/quest-themen/themen.json')
            const data = await response.json()
            const allRecipes = []

            for (const item of data) {
                try {
                    const res = await fetch(`/quest-themen/recipes-${item.id}.json`)
                    const json = await res.json()
                    allRecipes.push(...json)
                } catch {
                    console.warn(`Не удалось загрузить рецепты для темы "${item.id}"`)
                }
            }
            themes.value = data.map((item, index) => {
                const availableIds = allRecipes
                    .filter(r => r.theme === item.id && r.title)
                    .map(r => r.id)
                return {
                    ...item,
                    title: themenMap[index]?.title || '',
                    description: themenMap[index]?.description || '',
                    availableIds
                }
            })
        } catch (err) {
            console.error('Ошибка загрузки тем:', err)
        }
    }

    async function loadDailyProgress() {
        if (!await initFirebase()) return
        const user = auth.currentUser
        if (!user) return
        const todayKey = getLocalDateKey()
        const { getDocs, collection, where, query } = fb
        const q = query(collection(db, 'users', user.uid, 'questProgress'), where('dateKey', '==', todayKey))
        const snap = await getDocs(q)

        let total = 0
        snap.forEach(docSnap => {
            const d = docSnap.data()
            if (typeof d.count === 'number' && !isNaN(d.count)) total += d.count
        })
        dailyQuestCount.value = total
    }

    async function loadRecipeById(recipeId) {
        if (!isClient) return
        try {
            if (!themes.value.length) await loadThemesAndRecipes()
            const theme = themes.value.find(t => t.availableIds.includes(recipeId))
            if (!theme) throw new Error('no-theme-for-recipe')
            const response = await fetch(`/quest-themen/recipes-${theme.id}.json`)
            const recipes = await response.json()
            const found = recipes.find(r => r.id === recipeId)
            if (!found) throw new Error('recipe-not-found')
            currentRecipe.value = found
        } catch {
            currentRecipe.value = null
        }
    }

    async function markRecipeAsCompleted(recipeId) {
        if (!await initFirebase()) return console.warn('Firebase не инициализирован')
        const user = auth.currentUser
        if (!user) return console.warn('Пользователь не авторизован')
        const { doc, getDoc, setDoc } = fb
        const todayKey = getLocalDateKey()
        const recipeRef = doc(db, 'users', user.uid, 'questProgress', recipeId)
        const recipeSnap = await getDoc(recipeRef)
        let newCount = 1
        if (recipeSnap.exists()) {
            const data = recipeSnap.data()
            if (data.dateKey === todayKey) newCount = (data.count || 0) + 1
        }
        await setDoc(recipeRef, { completedAt: Date.now(), dateKey: todayKey, count: newCount })
        dailyQuestCount.value++
    }

    function getNextRecipeId(currentId) {
        const theme = themes.value.find(t => t.availableIds.includes(currentId))
        if (!theme) return null
        const index = theme.availableIds.indexOf(currentId)
        if (index === -1 || index === theme.availableIds.length - 1) return null
        return theme.availableIds[index + 1]
    }

    async function isNextRecipeAvailable(currentId) {
        if (!await initFirebase()) return false
        const nextId = getNextRecipeId(currentId)
        if (!nextId) return false
        const user = auth.currentUser
        if (!user) return false

        const { doc, getDoc } = fb
        const docRef = doc(db, 'users', user.uid, 'questProgress', currentId)
        const snap = await getDoc(docRef)
        if (!snap.exists()) return false

        const last = snap.data().completedAt
        return Date.now() - last >= LOCAL_COOLDOWN_MS
    }

    async function isRecipeCooldown(recipeId) {
        if (!await initFirebase()) return false
        const user = auth.currentUser
        if (!user) return false

        const { doc, getDoc } = fb
        const docRef = doc(db, 'users', user.uid, 'questProgress', recipeId)
        const snap = await getDoc(docRef)
        if (!snap.exists()) return false
        return Date.now() - snap.data().completedAt < LOCAL_COOLDOWN_MS
    }

    async function getTodaysQuestCooldown() {
        if (!await initFirebase()) return 0
        const user = auth.currentUser
        if (!user) return 0

        const { getDocs, collection, where, query } = fb
        const todayKey = getLocalDateKey()
        const q = query(collection(db, 'users', user.uid, 'questProgress'), where('dateKey', '==', todayKey))
        const snap = await getDocs(q)

        let latest = 0
        snap.forEach(docSnap => {
            const t = docSnap.data()?.completedAt || 0
            if (t > latest) latest = t
        })
        if (!latest) return 0
        const diff = Date.now() - latest
        return diff < LOCAL_COOLDOWN_MS ? Math.ceil((LOCAL_COOLDOWN_MS - diff) / 1000) : 0
    }

    async function getRemainingCooldown(recipeId) {
        if (!await initFirebase()) return 0
        const user = auth.currentUser
        if (!user) return 0

        const { doc, getDoc } = fb
        const docRef = doc(db, 'users', user.uid, 'questProgress', recipeId)
        const snap = await getDoc(docRef)
        if (!snap.exists()) return 0
        const diff = Date.now() - snap.data().completedAt
        return diff < LOCAL_COOLDOWN_MS ? Math.ceil((LOCAL_COOLDOWN_MS - diff) / 1000) : 0
    }

    async function getFirstAvailableRecipeId(themeId) {
        if (!await initFirebase()) return null
        const theme = themes.value.find(t => t.id === themeId)
        if (!theme) return null

        const user = auth.currentUser
        if (!user) return null

        const { doc, getDoc } = fb
        const todayKey = getLocalDateKey()

        for (const id of theme.availableIds) {
            const ref = doc(db, 'users', user.uid, 'questProgress', id)
            const snap = await getDoc(ref)
            if (!snap.exists()) return id
            const lastKey = getLocalDateKey(new Date(snap.data().completedAt))
            if (lastKey !== todayKey) return id
        }
        return null
    }

    return {
        themes,
        currentRecipe,
        dailyQuestCount,
        loadThemesAndRecipes,
        loadRecipeById,
        markRecipeAsCompleted,
        isRecipeCooldown,
        getRemainingCooldown,
        getNextRecipeId,
        isNextRecipeAvailable,
        getFirstAvailableRecipeId,
        loadDailyProgress,
        getTodaysQuestCooldown
    }
})
