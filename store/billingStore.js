import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { Capacitor } from '@capacitor/core'
import { Purchases } from '@revenuecat/purchases-capacitor'
import { doc, updateDoc, getFirestore } from 'firebase/firestore'
import { userAuthStore } from '../store/authStore.js'

export const useBillingStore = defineStore('billing', () => {
	const authStore = userAuthStore()
	const db = getFirestore()

	const offerings = ref([])
	const isMobile = computed(() => Capacitor.isNativePlatform())

	const syncSubscription = async () => {
		if (!isMobile.value) return
		try {
			const info = await Purchases.getCustomerInfo()
			authStore.isPremium = !!info.entitlements.active['premium']
		} catch (e) {
			console.error('Sync error:', e)
		}
	}

	const loadOfferings = async () => {
		if (!isMobile.value) return
		try {
			const result = await Purchases.getOfferings()
			if (result.current) {
				offerings.value = result.current.availablePackages
			}
		} catch (e) {
			console.error('Load offerings error:', e)
		}
	}

	const buy = async (pkg) => {
		if (!isMobile.value) return
		try {
			const { customerInfo } = await Purchases.purchasePackage({ aPackage: pkg })
			if (customerInfo.entitlements.active['premium']) {
				authStore.isPremium = true

				if (authStore.uid) {
					await updateDoc(doc(db, 'users', authStore.uid), { isPremium: true })
				}
			}
		} catch (e) {
			if (!e.userCancelled) console.error('Purchase error:', e)
		}
	}

	return {
		offerings,
		isMobile,
		syncSubscription,
		loadOfferings,
		buy
	}
})