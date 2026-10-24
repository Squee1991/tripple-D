import { ref, computed } from 'vue'
import { RANK_AVATAR_FILES, AVATAR_EFFECT_MAP } from '~/constants/cabinet.constants.js'

export const useCabinetAvatars = (authStore) => {
    const isAvatarModalOpen = ref(false)
    const isPurchaseModalOpen = ref(false)
    const selectedAvatarName = ref(null)
    const purchaseAvatarName = ref(null)
    const purchaseState = ref('default')
    const activeAvatarTab = ref('regular')

    const isRankAvatarLocked = computed(() => purchaseState.value.startsWith('locked_'))

    const currentAvatarEffectClass = computed(() => {
        return AVATAR_EFFECT_MAP[authStore.avatar] || ''
    })

    const regularAvatars = computed(() =>
        authStore.availableAvatars.filter(avatar => !RANK_AVATAR_FILES.includes(avatar))
    )

    const rankAvatars = computed(() =>
        authStore.availableAvatars.filter(avatar => RANK_AVATAR_FILES.includes(avatar))
    )

    const currentViewAvatars = computed(() =>
        activeAvatarTab.value === 'regular' ? regularAvatars.value : rankAvatars.value
    )

    const openPurchaseModal = (name) => {
        purchaseAvatarName.value = name
        purchaseState.value = 'default'
        isPurchaseModalOpen.value = true
    }

    const selectAvatar = (name) => {
        selectedAvatarName.value = name
    }

    const confirmPurchase = async () => {
        const status = await authStore.purchaseAvatar(purchaseAvatarName.value)
        if (status === 'success' || status === 'owned') {
            selectedAvatarName.value = purchaseAvatarName.value
            purchaseState.value = 'success'
        } else {
            purchaseState.value = status || 'insufficient'
            isPurchaseModalOpen.value = true
        }
    }

    const confirmAvatarChange = async () => {
        if (!selectedAvatarName.value) return
        try {
            await authStore.updateUserAvatar(selectedAvatarName.value)
            isAvatarModalOpen.value = false
        } catch {}
    }

    const closePurchaseOk = () => {
        isPurchaseModalOpen.value = false
        isAvatarModalOpen.value = false
        purchaseState.value = 'default'
        authStore.clearNotEnoughArticle?.()
    }

    return {
        isAvatarModalOpen,
        isPurchaseModalOpen,
        selectedAvatarName,
        purchaseState,
        activeAvatarTab,
        isRankAvatarLocked,
        currentAvatarEffectClass,
        currentViewAvatars,
        openPurchaseModal,
        selectAvatar,
        confirmPurchase,
        confirmAvatarChange,
        closePurchaseOk
    }
}