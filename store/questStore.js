// import { defineStore } from 'pinia'
// import { ref } from 'vue'
// import { getFirestore, doc, getDoc, setDoc, getDocs, collection } from 'firebase/firestore'
// import { getAuth } from 'firebase/auth'
//
// export const useQuestStore = defineStore('quest', () => {
//     const db = getFirestore()
//     const auth = getAuth()
//     const themes = ref([])
//     const currentRecipe = ref(null)
//     const dailyQuestCount = ref(0)
//     const themenMap = [
//         {
//             title: 'questThemeList.firstTitle',
//             description: 'questThemeList.firstDescription'
//         },
//         {
//             title: 'questThemeList.SecondTitle',
//             description: 'questThemeList.SecondDescription'
//         },
//         {
//             title: 'questThemeList.ThirdTitle',
//             description: 'questThemeList.ThirdDescription'
//         }
//     ]
//
//     async function loadThemesAndRecipes() {
//         try {
//             const response = await fetch('/quest-themen/themen.json')
//             const data = await response.json()
//             const allRecipes = []
//
//             for (const item of data) {
//                 const themeId = item.id
//                 try {
//                     const res = await fetch(`/quest-themen/recipes-${themeId}.json`)
//                     const json = await res.json()
//                     allRecipes.push(...json)
//                 } catch (e) {
//                     console.warn(`Не удалось загрузить рецепты для темы "${themeId}"`)
//                 }
//             }
//             themes.value = data.map((item, index) => {
//                 const availableIds = allRecipes
//                     .filter(r => r.theme === item.id && r.title)
//                     .map(r => r.id)
//
//                 return {
//                     ...item,
//                     title: themenMap[index]?.title || '',
//                     description: themenMap[index]?.description || '',
//                     availableIds
//                 }
//             })
//         } catch (error) {
//             console.error('Ошибка загрузки тем:', error)
//         }
//     }
//
//     async function loadDailyProgress() {
//         const user = auth.currentUser
//         if (!user) return
//         const todayKey = new Date().toISOString().split('T')[0]
//         let totalCount = 0
//         const querySnapshot = await getDocs(
//             collection(db, 'users', user.uid, 'questProgress')
//         )
//         querySnapshot.forEach(docSnap => {
//             const data = docSnap.data();
//             if (data.dateKey === todayKey && typeof data.count === 'number' && !isNaN(data.count)) {
//                 totalCount += data.count;
//             }
//         });
//         dailyQuestCount.value = totalCount;
//     }
//
//     async function loadRecipeById(recipeId) {
//         try {
//             if (!themes.value.length) {
//                 await loadThemesAndRecipes()
//             }
//             const theme = themes.value.find(t => t.availableIds.includes(recipeId))
//             if (!theme) throw new Error
//             const response = await fetch(`/quest-themen/recipes-${theme.id}.json`)
//             const recipes = await response.json()
//             const found = recipes.find(r => r.id === recipeId)
//
//             if (!found) throw new Error
//             currentRecipe.value = found
//         } catch (e) {
//             currentRecipe.value = null
//         }
//     }
//
//     async function markRecipeAsCompleted(recipeId) {
//         const user = auth.currentUser
//         if (!user) return console.warn('Пользователь не авторизован')
//         const todayKey = new Date().toISOString().split('T')[0]
//         const recipeRef = doc(db, 'users', user.uid, 'questProgress', recipeId)
//         const recipeSnap = await getDoc(recipeRef)
//         let newCount = 1
//         if (recipeSnap.exists()) {
//             const data = recipeSnap.data()
//             if (data.dateKey === todayKey) {
//                 newCount = (data.count || 0) + 1
//             }
//         }
//         await setDoc(recipeRef, {
//             completedAt: Date.now(),
//             dateKey: todayKey,
//             count: newCount
//         })
//         dailyQuestCount.value++;
//     }
//
//
//
//     function getNextRecipeId(currentId) {
//         const theme = themes.value.find(t => t.availableIds.includes(currentId))
//         if (!theme) return null
//         const index = theme.availableIds.indexOf(currentId)
//         if (index === -1 || index === theme.availableIds.length - 1) return null
//         return theme.availableIds[index + 1]
//     }
//
//     async function isNextRecipeAvailable(currentId) {
//         const nextId = getNextRecipeId(currentId)
//         if (!nextId) return false
//
//         const user = auth.currentUser
//         if (!user) return false
//
//         const docRef = doc(db, 'users', user.uid, 'questProgress', currentId)
//         const snap = await getDoc(docRef)
//         if (!snap.exists()) return false
//
//         const last = snap.data().completedAt
//         const now = Date.now()
//         const diff = now - last
//
//         return diff >= 60 * 1000
//     }
//
//     async function isRecipeCooldown(recipeId) {
//         const user = auth.currentUser
//         if (!user) return false
//         const docRef = doc(db, 'users', user.uid, 'questProgress', recipeId)
//         const snap = await getDoc(docRef)
//         if (!snap.exists()) return false
//         const last = snap.data().completedAt
//         const now = new Date()
//         const lastDate = new Date(last)
//         const lastDayKey = lastDate.toISOString().split('T')[0]
//         const todayKey = now.toISOString().split('T')[0]
//         return lastDayKey === todayKey
//     }
//
//     async function getTodaysQuestCooldown() {
//         const user = auth.currentUser;
//         if (!user) return 0;
//
//         const todayKey = new Date().toISOString().split('T')[0];
//         const querySnapshot = await getDocs(collection(db, 'users', user.uid, 'questProgress'));
//         let completedAt = 0;
//         for (const docSnap of querySnapshot.docs) {
//             if (docSnap.data().dateKey === todayKey) {
//                 completedAt = docSnap.data().completedAt;
//                 break;
//             }
//         }
//
//         if (!completedAt) return 0;
//         const now = new Date();
//         const nextAvailable = new Date(completedAt);
//         nextAvailable.setDate(nextAvailable.getDate() + 1);
//         nextAvailable.setHours(8, 0, 0, 0);
//
//         const remaining = nextAvailable - now;
//         return remaining > 0 ? Math.ceil(remaining / 1000) : 0;
//     }
//
//     async function getRemainingCooldown(recipeId) {
//         const user = auth.currentUser
//         if (!user) return 0
//         const docRef = doc(db, 'users', user.uid, 'questProgress', recipeId)
//         const snap = await getDoc(docRef)
//         if (!snap.exists()) return 0
//         const last = snap.data().completedAt
//         const now = new Date()
//         const nextAvailable = new Date(last)
//         nextAvailable.setDate(nextAvailable.getDate() + 1)
//         nextAvailable.setHours(8, 0, 0, 0)
//
//         const remaining = nextAvailable - now
//         return remaining > 0 ? Math.ceil(remaining / 1000) : 0
//     }
//
//
//     async function getFirstAvailableRecipeId(themeId) {
//         const theme = themes.value.find(t => t.id === themeId)
//         if (!theme) return null
//         const user = auth.currentUser
//         if (!user) return null
//         for (const id of theme.availableIds) {
//             const docRef = doc(db, 'users', user.uid, 'questProgress', id)
//             const snap = await getDoc(docRef)
//             if (!snap.exists()) {
//                 return id
//             } else {
//                 const last = snap.data().completedAt
//                 const lastDate = new Date(last)
//                 const now = new Date()
//                 const lastKey = lastDate.toISOString().split('T')[0]
//                 const todayKey = now.toISOString().split('T')[0]
//                 if (lastKey !== todayKey) {
//                     return id
//                 }
//             }
//         }
//         return null
//     }
//
//     return {
//         themes,
//         currentRecipe,
//         dailyQuestCount,
//         loadThemesAndRecipes,
//         loadRecipeById,
//         markRecipeAsCompleted,
//         isRecipeCooldown,
//         getRemainingCooldown,
//         getNextRecipeId,
//         isNextRecipeAvailable,
//         getFirstAvailableRecipeId,
//         loadDailyProgress,
//         getTodaysQuestCooldown
//     }
// })
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getFirestore, doc, getDoc, setDoc, getDocs, collection } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

export const useQuestStore = defineStore('quest', () => {
    const db = getFirestore()
    const auth = getAuth()
    const themes = ref([])
    const currentRecipe = ref(null)
    const dailyQuestCount = ref(0)
    const themenMap = [
        {
            title: 'questThemeList.firstTitle',
            description: 'questThemeList.firstDescription'
        },
        {
            title: 'questThemeList.SecondTitle',
            description: 'questThemeList.SecondDescription'
        },
        {
            title: 'questThemeList.ThirdTitle',
            description: 'questThemeList.ThirdDescription'
        }
    ]

    async function loadThemesAndRecipes() {
        try {
            const response = await fetch('/quest-themen/themen.json')
            const data = await response.json()
            const allRecipes = []

            for (const item of data) {
                const themeId = item.id
                try {
                    const res = await fetch(`/quest-themen/recipes-${themeId}.json`)
                    const json = await res.json()
                    allRecipes.push(...json)
                } catch (e) {
                    console.warn(`Не удалось загрузить рецепты для темы "${themeId}"`)
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
        } catch (error) {
            console.error('Ошибка загрузки тем:', error)
        }
    }

    async function loadDailyProgress() {
        const user = auth.currentUser
        if (!user) return
        const todayKey = new Date().toISOString().split('T')[0]
        let totalCount = 0
        const querySnapshot = await getDocs(
            collection(db, 'users', user.uid, 'questProgress')
        )
        querySnapshot.forEach(docSnap => {
            const data = docSnap.data();
            if (data.dateKey === todayKey && typeof data.count === 'number' && !isNaN(data.count)) {
                totalCount += data.count;
            }
        });
        dailyQuestCount.value = totalCount;
    }

    async function loadRecipeById(recipeId) {
        try {
            if (!themes.value.length) {
                await loadThemesAndRecipes()
            }
            const theme = themes.value.find(t => t.availableIds.includes(recipeId))
            if (!theme) throw new Error
            const response = await fetch(`/quest-themen/recipes-${theme.id}.json`)
            const recipes = await response.json()
            const found = recipes.find(r => r.id === recipeId)

            if (!found) throw new Error
            currentRecipe.value = found
        } catch (e) {
            currentRecipe.value = null
        }
    }

    async function markRecipeAsCompleted(recipeId) {
        const user = auth.currentUser
        if (!user) return console.warn('Пользователь не авторизован')
        const todayKey = new Date().toISOString().split('T')[0]
        const recipeRef = doc(db, 'users', user.uid, 'questProgress', recipeId)
        const recipeSnap = await getDoc(recipeRef)
        let newCount = 1
        if (recipeSnap.exists()) {
            const data = recipeSnap.data()
            if (data.dateKey === todayKey) {
                newCount = (data.count || 0) + 1
            }
        }
        await setDoc(recipeRef, {
            completedAt: Date.now(),
            dateKey: todayKey,
            count: newCount
        })
        dailyQuestCount.value++;
    }

    function getNextRecipeId(currentId) {
        const theme = themes.value.find(t => t.availableIds.includes(currentId))
        if (!theme) return null
        const index = theme.availableIds.indexOf(currentId)
        if (index === -1 || index === theme.availableIds.length - 1) return null
        return theme.availableIds[index + 1]
    }

    async function isNextRecipeAvailable(currentId) {
        const nextId = getNextRecipeId(currentId)
        if (!nextId) return false

        const user = auth.currentUser
        if (!user) return false

        const docRef = doc(db, 'users', user.uid, 'questProgress', currentId)
        const snap = await getDoc(docRef)
        if (!snap.exists()) return false

        const last = snap.data().completedAt
        const now = Date.now()
        const diff = now - last
        return diff >= 10 * 1000
    }

    async function isRecipeCooldown(recipeId) {
        const user = auth.currentUser
        if (!user) return false
        const docRef = doc(db, 'users', user.uid, 'questProgress', recipeId)
        const snap = await getDoc(docRef)
        if (!snap.exists()) return false
        const last = snap.data().completedAt
        const now = Date.now()
        return now - last < 10 * 1000
    }

    async function getTodaysQuestCooldown() {
        const user = auth.currentUser
        if (!user) return 0
        const querySnapshot = await getDocs(collection(db, 'users', user.uid, 'questProgress'))
        let completedAt = 0
        for (const docSnap of querySnapshot.docs) {
            if (docSnap.data().dateKey === new Date().toISOString().split('T')[0]) {
                completedAt = docSnap.data().completedAt
                break
            }
        }
        if (!completedAt) return 0
        const now = Date.now()
        const diff = now - completedAt
        const cooldown = 10 * 1000
        return diff < cooldown ? Math.ceil((cooldown - diff) / 1000) : 0
    }

    async function getRemainingCooldown(recipeId) {
        const user = auth.currentUser
        if (!user) return 0
        const docRef = doc(db, 'users', user.uid, 'questProgress', recipeId)
        const snap = await getDoc(docRef)
        if (!snap.exists()) return 0
        const last = snap.data().completedAt
        const now = Date.now()
        const diff = now - last
        const cooldown = 10 * 1000
        return diff < cooldown ? Math.ceil((cooldown - diff) / 1000) : 0
    }


    async function getFirstAvailableRecipeId(themeId) {
        const theme = themes.value.find(t => t.id === themeId)
        if (!theme) return null
        const user = auth.currentUser
        if (!user) return null
        for (const id of theme.availableIds) {
            const docRef = doc(db, 'users', user.uid, 'questProgress', id)
            const snap = await getDoc(docRef)
            if (!snap.exists()) {
                return id
            } else {
                const last = snap.data().completedAt
                const lastDate = new Date(last)
                const now = new Date()
                const lastKey = lastDate.toISOString().split('T')[0]
                const todayKey = now.toISOString().split('T')[0]
                if (lastKey !== todayKey) {
                    return id
                }
            }
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
