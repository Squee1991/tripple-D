import { LocalNotifications } from '@capacitor/local-notifications';
import { Capacitor } from '@capacitor/core';

// Ежедневные напоминания об уроке — локальные уведомления, планируются на телефоне без сервера
const STORAGE_KEY = 'studyReminder';
const BASE_ID = 9000;
const DAYS_AHEAD = 7;
const PROMPT_AGAIN_AFTER = 3 * 24 * 60 * 60 * 1000;

export const REMINDER_TIMES = ['09:00', '13:00', '19:00', '21:00'];

function getTodayKey() {
	const today = new Date();
	return `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
}

function readSettings() {
	try {
		return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
	} catch (e) {
		return {};
	}
}

function writeSettings(patch) {
	const settings = { ...readSettings(), ...patch };
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
	} catch (e) {
		console.warn('Ошибка сохранения настроек напоминаний:', e);
	}
	return settings;
}

// Запасные тексты, если переводы ещё не подгрузились (lazy i18n при старте приложения)
const FALLBACK_TEXTS = [
	{ title: '📚 Time for German!', body: '5 minutes a day — and your goal is done' },
	{ title: '🔥 Keep your streak!', body: 'One quick lesson keeps your streak alive' },
	{ title: '🦔 Your hedgehog misses you', body: 'A new quest is waiting for you' }
];

// Переведённые тексты; по дням чередуются
function buildTexts(t) {
	return FALLBACK_TEXTS.map((fallback, i) => {
		const titleKey = `reminders.n${i + 1}Title`;
		const bodyKey = `reminders.n${i + 1}Body`;
		const title = t(titleKey);
		const body = t(bodyKey);
		return {
			title: title && title !== titleKey ? title : fallback.title,
			body: body && body !== bodyKey ? body : fallback.body
		};
	});
}

export function shouldAskForReminders() {
	if (!Capacitor.isNativePlatform()) return false;
	const settings = readSettings();
	if (settings.enabled || settings.denied) return false;
	if (!settings.askedAt) return true;
	return Date.now() - settings.askedAt > PROMPT_AGAIN_AFTER;
}

export function postponeReminderPrompt() {
	writeSettings({ askedAt: Date.now() });
}

export async function enableReminders(time, t) {
	writeSettings({ askedAt: Date.now() });
	if (!Capacitor.isNativePlatform()) return false;
	try {
		let { display } = await LocalNotifications.checkPermissions();
		if (display !== 'granted') {
			({ display } = await LocalNotifications.requestPermissions());
		}
		if (display !== 'granted') {
			writeSettings({ enabled: false, denied: true });
			return false;
		}
		writeSettings({ enabled: true, denied: false, time });
		await scheduleReminders(t);
		return true;
	} catch (e) {
		console.error('Ошибка включения напоминаний:', e);
		return false;
	}
}

export async function disableReminders() {
	writeSettings({ enabled: false });
	await cancelReminders();
}

async function cancelReminders() {
	if (!Capacitor.isNativePlatform()) return;
	try {
		const notifications = Array.from({ length: DAYS_AHEAD + 1 }, (_, i) => ({ id: BASE_ID + i }));
		await LocalNotifications.cancel({ notifications });
	} catch (e) {
		console.warn('Ошибка отмены напоминаний:', e);
	}
}

// Пересоздаёт напоминания на неделю вперёд; сегодняшнее пропускается, если урок уже пройден
export async function scheduleReminders(t) {
	if (!Capacitor.isNativePlatform()) return;
	const settings = readSettings();
	if (!settings.enabled || !settings.time) return;

	try {
		const { display } = await LocalNotifications.checkPermissions();
		if (display !== 'granted') return;

		await cancelReminders();

		const [hour, minute] = settings.time.split(':').map(Number);
		const doneToday = settings.lastDoneDate === getTodayKey();
		const texts = buildTexts(t);
		const now = Date.now();
		const notifications = [];

		for (let i = 0; i <= DAYS_AHEAD; i++) {
			if (i === 0 && doneToday) continue;
			const at = new Date();
			at.setDate(at.getDate() + i);
			at.setHours(hour, minute, 0, 0);
			if (at.getTime() <= now) continue;
			const text = texts[i % texts.length];
			notifications.push({
				id: BASE_ID + i,
				title: text.title,
				body: text.body,
				schedule: { at, allowWhileIdle: true }
			});
		}

		if (notifications.length) {
			await LocalNotifications.schedule({ notifications });
		}
	} catch (e) {
		console.error('Ошибка планирования напоминаний:', e);
	}
}

// Вызывать после успешно пройденного урока
export async function markLessonDoneToday(t) {
	writeSettings({ lastDoneDate: getTodayKey() });
	await scheduleReminders(t);
}
