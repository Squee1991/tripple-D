import { getAuth } from 'firebase/auth'
import { getFirestore, doc, updateDoc } from 'firebase/firestore'

// Язык приложения сохраняется в users/{uid}.locale, чтобы облачные функции
// (например, пуш-напоминания sendScheduledReminders) писали на этом же языке
let lastSaved = ''

export async function saveUserLocale(locale) {
	const user = getAuth().currentUser
	const code = String(locale || '').trim()
	if (!user || !code) return
	const key = `${user.uid}:${code}`
	if (key === lastSaved) return
	try {
		// updateDoc, а не setDoc: не создаём документ пользователю, у которого его ещё нет
		await updateDoc(doc(getFirestore(), 'users', user.uid), { locale: code })
		lastSaved = key
	} catch (error) {
		console.error('saveUserLocale:', error)
	}
}
