import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { Capacitor } from '@capacitor/core'
import { Purchases } from '@revenuecat/purchases-capacitor'
import { doc, updateDoc, getFirestore } from 'firebase/firestore'
import { userAuthStore } from '../store/authStore.js'
import { App } from '@capacitor/app'

export const useBillingStore = defineStore('billing', () => {
	const authStore = userAuthStore()
	const db = getFirestore()

	const offerings = ref([])
	const activeDiscountId = ref(null)
	const isMobile = computed(() => Capacitor.isNativePlatform())
	const isPurchasing = ref(false)

	const initialize = async () => {
		if (!isMobile.value) return
		try {
			if (!authStore.uid) {
				return
			}

			await Purchases.configure({
				apiKey: 'goog_zJiiRlMjdJmJNBtZXxiePlRaHmv',
			})
			await Purchases.logIn({ appUserID: authStore.uid })

			App.addListener('appStateChange', ({ isActive }) => {
				if (isActive) {
					syncSubscription()
				}
			})

			await loadOfferings()
			await syncSubscription()

		} catch (e) {
			console.error('RC Init Error:', e)
		}
	}

	const syncSubscription = async () => {
		if (!authStore.uid) return
		if (isPurchasing.value) return

		try {
			// 🔥 ИСПОЛЬЗУЕМ МЯГКИЙ ЗАПРОС, чтобы не сбросить кэш Гугла
			const info = await Purchases.getCustomerInfo()
			const premiumEntitlement = info?.entitlements?.active?.['premium']

			if (premiumEntitlement) {
				const expDate = premiumEntitlement.expirationDate
				const isCancelled = !premiumEntitlement.willRenew

				if (!authStore.isPremium ||
					authStore.subscriptionEndsAt !== expDate ||
					authStore.subscriptionCancelled !== isCancelled) {

					authStore.isPremium = true
					authStore.subscriptionEndsAt = expDate
					authStore.subscriptionCancelled = isCancelled

					await updateDoc(doc(db, 'users', authStore.uid), {
						isPremium: true,
						paymentSource: 'google',
						subscriptionEndsAt: expDate,
						subscriptionCancelled: isCancelled,
						debug_last_action: "SYNC_UPDATED_PREMIUM_" + Date.now()
					})
				}
			} else {
				if (authStore.isPremium) {
					const expTime = new Date(authStore.subscriptionEndsAt).getTime()
					const now = Date.now()
					if (expTime && now < expTime) {
						console.log('🛑 RC вернул пустоту, но время не вышло! Блокируем сброс в false.')
						await updateDoc(doc(db, 'users', authStore.uid), {
							debug_last_action: "SAVED_BY_TIME_LOCK_" + Date.now()
						})
						return
					}
					authStore.isPremium = false
					authStore.subscriptionCancelled = false
					await updateDoc(doc(db, 'users', authStore.uid), {
						isPremium: false,
						subscriptionCancelled: false,
						debug_last_action: "EXPIRED_SET_FALSE_" + Date.now()
					})
				}
			}
		} catch (e) {
			await updateDoc(doc(db, 'users', authStore.uid), {
				debug_error: "CRASH: " + e.message
			})
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
			console.error('Ошибка:', e)
		}
	}

	const buy = async (pkg) => {
		if (!isMobile.value) return false
		isPurchasing.value = true

		try {
			const usedDiscount = activeDiscountId.value
			const { customerInfo } = await Purchases.purchasePackage({ aPackage: pkg })
			const premiumEntitlement = customerInfo.entitlements.active['premium']

			if (premiumEntitlement) {
				const expDate = premiumEntitlement.expirationDate
				authStore.isPremium = true
				authStore.subscriptionEndsAt = expDate
				authStore.subscriptionCancelled = false

				const updateData = {
					isPremium: true,
					paymentSource: 'google',
					subscriptionEndsAt: expDate,
					subscriptionCancelled: false,
					debug_last_action: "NEW_PURCHASE_SUCCESS_" + Date.now()
				}

				if (usedDiscount) {
					updateData[usedDiscount] = false
					authStore.premiumDiscount[usedDiscount] = false
				}

				if (authStore.uid) {
					await updateDoc(doc(db, 'users', authStore.uid), updateData)
				}
				return true
			}
			return false
		} catch (e) {
			if (!e.userCancelled) {
				console.error('Ошибка покупки RC:', e.message)
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
		syncSubscription,
		loadOfferings,
		buy
	}
})