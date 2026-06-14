
import { Capacitor } from '@capacitor/core';
import { Purchases } from '@revenuecat/purchases-capacitor';
export const usePayment = () => {
	const isMobile = Capacitor.isNativePlatform();

	const startPayment = async (planId) => {
		if (isMobile) {
			console.log('Запуск оплаты через RevenueCat для:', planId);
			const offerings = await Purchases.getOfferings();
		} else {
			console.log('Перенаправление на Stripe для:', planId);
		}
	};

	return { startPayment, isMobile };
};