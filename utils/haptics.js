import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';
import { Capacitor } from '@capacitor/core';

// Вибрация телефона в играх. В браузере ничего не делает
function runOnPhone(action) {
	if (!Capacitor.isNativePlatform()) return;
	action().catch(() => {});
}

// Короткий лёгкий толчок — правильный ответ
export function vibrateSuccess() {
	runOnPhone(() => Haptics.impact({ style: ImpactStyle.Light }));
}

// Средний толчок — сработала способность (например, щит принял удар)
export function vibrateImpact() {
	runOnPhone(() => Haptics.impact({ style: ImpactStyle.Medium }));
}

// Сильная вибрация — ошибка
export function vibrateError() {
	runOnPhone(() => Haptics.notification({ type: NotificationType.Error }));
}
