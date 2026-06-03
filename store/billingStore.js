import { defineStore } from 'pinia'
import { ref, computed, toRaw } from 'vue'
import { Capacitor } from '@capacitor/core'
import { Purchases } from '@revenuecat/purchases-capacitor'
import { doc, updateDoc, getFirestore } from 'firebase/firestore'
import { userAuthStore } from '../store/authStore.js'

export const useBillingStore = defineStore('billing', () => {
	const authStore = userAuthStore()
	const db = getFirestore()
	const offerings = ref([])
	const activeDiscountId = ref(null)

	const isMobile = computed(() => Capacitor.isNativePlatform())
	const isPurchasing = ref(false)
	const currentPlatform = Capacitor.getPlatform()
	const paymentSource = currentPlatform === 'ios' ? 'apple' : 'google'

	const initialize = async () => {
		if (!isMobile.value) return
		try {
			if (!authStore.uid || authStore.uid === '') return
			let apiKey = ''
			if (currentPlatform === 'ios') {
				apiKey = 'appl_AJSNvgOPCFscmWguFDVeIucVoRS'
			} else if (currentPlatform === 'android') {
				apiKey = 'goog_zJiiRlMjdJmJNBtZXxiePlRaHmv'
			}
			if (!apiKey) return
			await Purchases.configure({ apiKey })
			await Purchases.logIn({ appUserID: authStore.uid })
			Purchases.addCustomerInfoUpdateListener((info) => {
				handleSubscriptionStatus(info)
			})
			await loadOfferings()
			const initialInfo = await Purchases.getCustomerInfo()
			await handleSubscriptionStatus(initialInfo)

		} catch (e) {
			console.error('RC Init Error:', e)
		}
	}

	// const handleSubscriptionStatus = async (info) => {
	// 	if (!authStore.uid) return
	//
	// 	const premiumEntitlement = info?.entitlements?.active?.['premium']
	//
	// 	if (premiumEntitlement) {
	// 		const expDate = premiumEntitlement.expirationDate
	// 		const isCancelled = !premiumEntitlement.willRenew
	//
	// 		if (!authStore.isPremium ||
	// 			authStore.subscriptionEndsAt !== expDate ||
	// 			authStore.subscriptionCancelled !== isCancelled) {
	// 			authStore.isPremium = true
	// 			authStore.subscriptionEndsAt = expDate
	// 			authStore.subscriptionCancelled = isCancelled
	//
	// 			await updateDoc(doc(db, 'users', authStore.uid), {
	// 				isPremium: true,
	// 				paymentSource: paymentSource,
	// 				subscriptionEndsAt: expDate,
	// 				subscriptionCancelled: isCancelled,
	// 				debug_last_action: "SYNC_UPDATED_PREMIUM_" + Date.now()
	// 			})
	// 		}
	// 	} else {
	// 		const pastPremium = info?.entitlements?.all?.['premium']
	// 		if (pastPremium && pastPremium.isActive === false) {
	// 			if (authStore.isPremium) {
	// 				authStore.isPremium = false
	// 				authStore.subscriptionCancelled = false
	//
	// 				await updateDoc(doc(db, 'users', authStore.uid), {
	// 					isPremium: false,
	// 					subscriptionCancelled: false,
	// 					debug_last_action: "EXPLICITLY_EXPIRED_" + Date.now()
	// 				})
	// 			}
	// 		}
	// 	}
	// }

	const handleSubscriptionStatus = async (info) => {
		if (!authStore.uid) return

		const premiumEntitlement = info?.entitlements?.active?.['premium']

		if (premiumEntitlement) {
			const expDate = premiumEntitlement.expirationDate
			const isCancelled = !premiumEntitlement.willRenew

			// Просто меняем локальные переменные Pinia, базу НЕ трогаем!
			authStore.isPremium = true
			authStore.subscriptionEndsAt = expDate
			authStore.subscriptionCancelled = isCancelled
		} else {
			authStore.isPremium = false
			authStore.subscriptionCancelled = false
		}
	}

	const restore = async () => {
		if (!isMobile.value) return false
		isPurchasing.value = true
		try {
			if (currentPlatform === 'android') {
				try {
					await Purchases.syncPurchases()
				} catch (syncErr) {
					console.log('Sync err:', syncErr)
				}
			}
			const customerInfo = await Purchases.restorePurchases()
			await handleSubscriptionStatus(customerInfo)

			return !!customerInfo?.entitlements?.active?.['premium']
		} catch (e) {
			console.error('Ошибка восстановления RC:', e.message)
			return false
		} finally {
			isPurchasing.value = false
		}
	}

	const loadOfferings = async (forcedDiscountId = null) => {
		if (!isMobile.value) return
		try {
			const result = await Purchases.getOfferings()
			let targetOffering = result.current
			let currentDiscount = null

			if (forcedDiscountId && result.all[forcedDiscountId]) {
				targetOffering = result.all[forcedDiscountId]
				currentDiscount = forcedDiscountId
			}

			if (targetOffering && targetOffering.availablePackages.length > 0) {
				offerings.value = targetOffering.availablePackages
				activeDiscountId.value = currentDiscount
			}
		} catch (e) {
			console.error('Ошибка при загрузке продуктов:', e)
		}
	}

	const buy = async (pkg) => {
		if (!isMobile.value) return false
		isPurchasing.value = true

		try {
			const rawPkg = toRaw(pkg)
			const usedDiscount = activeDiscountId.value

			const purchaseResult = await Purchases.purchasePackage({ aPackage: rawPkg })
			const customerInfo = purchaseResult.customerInfo || purchaseResult
			await handleSubscriptionStatus(customerInfo)

			if (usedDiscount) {
				authStore.premiumDiscount[usedDiscount] = false
				if (authStore.uid) {
					await updateDoc(doc(db, 'users', authStore.uid), {
						[usedDiscount]: false
					})
				}
			}

			return !!customerInfo?.entitlements?.active?.['premium']
		} catch (e) {
			if (!e.userCancelled) {
				console.error(`Ошибка RC: ${e.message}`)
			}
			return false
		} finally {
			isPurchasing.value = false
		}
	}

	return {
		offerings,
		isMobile,
		initialize,
		handleSubscriptionStatus,
		loadOfferings,
		buy,
		restore
	}
})