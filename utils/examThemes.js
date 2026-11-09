// Названия тем экзаменов: в файлах public/exams и в сохранённых результатах они на немецком,
// на экране показываем перевод на язык приложения (i18n examThemes). Незнакомая тема остаётся как есть.
const THEME_KEYS = {
	"Gemischter Test": "mixed",
	"Ich und meine Familie": "family",
	"Wohnen und Alltag": "homeDaily",
	"Essen und Einkaufen": "foodShopping",
	"Stadt und Verkehr": "cityTransport",
	"Freizeit und Wetter": "leisureWeather",
	"Kleidung und Farben": "clothesColors",
	"Schule und Sprachkurs": "schoolCourse",
	"Reisen und Urlaub": "travel",
	"Einkaufen und Dienstleistungen": "shoppingServices",
	"Arbeit und Tagesablauf": "workRoutine",
	"Gesundheit und Körper": "healthBody",
	"Feste und Traditionen": "holidays",
	"Restaurant und Kochen": "restaurantCooking",
	"Sport und Hobbys": "sportHobbies",
	"Arbeit und Beruf": "workJob",
	"Bildung und Sprachenlernen": "educationLanguages",
	"Gesundheit und Lebensstil": "healthLifestyle",
	"Umwelt und Stadtleben": "environmentCity",
	"Medien und Technik": "mediaTech",
	"Beziehungen und Gesellschaft": "relationsSociety",
	"Ämter und Behörden": "authorities",
	"Arbeitswelt im Wandel": "workChange",
	"Wohnen und Stadtentwicklung": "housingCity",
	"Bildung und Persönlichkeit": "educationPersonality",
	"Gesundheit und Psyche": "healthPsyche",
	"Medien und Kultur": "mediaCulture",
	"Konsum und Geld": "consumerMoney",
	"Wissenschaft und Technik": "scienceTech"
}

export function examThemeLabel(t, theme) {
	const key = THEME_KEYS[String(theme || '').trim()]
	return key ? t(`examThemes.${key}`) : (theme || '')
}
