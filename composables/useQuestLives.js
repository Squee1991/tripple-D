import { ref } from 'vue'
import { showRewarded } from '~/utils/admob.js'

export function useQuestLives(questStore, langStore, PRICE = 5, MAX_ADS = 5) {
    const isAdLoading = ref(false)
    const remainingAds = ref(MAX_ADS)
    const forceRevive = ref(false)

    function updateRemainingAds() {
        const today = new Date()
        const todayKey = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`
        const statsStr = localStorage.getItem('adRewardStats')
        if (!statsStr) {
            remainingAds.value = MAX_ADS
            return
        }
        try {
            const stats = JSON.parse(statsStr)
            remainingAds.value = stats.date !== todayKey ? MAX_ADS : Math.max(0, MAX_ADS - stats.count)
        } catch (e) {
            remainingAds.value = MAX_ADS
        }
    }

    async function trySpendLocal(amount) {
        if (amount <= 0) return true
        if ((langStore.points ?? 0) < amount) return false
        langStore.points -= amount
        langStore.articlesSpentForAchievement = Number(langStore.articlesSpentForAchievement || 0) + amount
        if (typeof langStore.saveToFirebase === 'function') {
            try { await langStore.saveToFirebase() } catch {}
        }
        return true
    }

    function watchAdForLife() {
        isAdLoading.value = true
        showRewarded(
            async () => {
                await questStore.addLife(1)
                if (questStore.finished && !questStore.success) questStore.finished = false
                if (!questStore.sessionStarted) questStore.sessionStarted = true
                forceRevive.value = false
                updateRemainingAds()
            },
            () => { isAdLoading.value = false }
        )
    }

    async function purchaseLife() {
        const wallet = Number(langStore.points || 0)
        if (wallet < PRICE) return
        const ok = await trySpendLocal(PRICE)
        if (!ok) return
        await questStore.addLife(1)
        if (questStore.finished && !questStore.success) questStore.finished = false
        if (!questStore.sessionStarted) questStore.sessionStarted = true
        forceRevive.value = false
    }

    return { isAdLoading, remainingAds, forceRevive, updateRemainingAds, watchAdForLife, purchaseLife }
}