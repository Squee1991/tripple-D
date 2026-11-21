// Если ключа нет в текущей локали, показываем английский текст, а не сам ключ
export default defineI18nConfig(() => ({
	fallbackLocale: 'en',
	fallbackWarn: false,
	missingWarn: false,
}))
