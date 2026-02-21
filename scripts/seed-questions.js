/**
 * Seed speaking question banks to Firestore.
 *
 * Usage:
 *   node scripts/seed-questions.js
 *
 * Requires service-account.json in project root (or GOOGLE_APPLICATION_CREDENTIALS env var).
 */
import { initializeApp, cert, getApps } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.resolve(__dirname, '..')

const saPath = process.env.GOOGLE_APPLICATION_CREDENTIALS || path.join(projectRoot, 'service-account.json')
if (!fs.existsSync(saPath)) {
	console.error(`Service account file not found: ${saPath}`)
	process.exit(1)
}

const serviceAccount = JSON.parse(fs.readFileSync(saPath, 'utf8'))

if (!getApps().length) {
	initializeApp({ credential: cert(serviceAccount) })
}

const db = getFirestore()

const questionsPath = path.join(projectRoot, 'public/speaking-questions/questions.json')
const questionBanks = JSON.parse(fs.readFileSync(questionsPath, 'utf8'))

async function seed() {
	const batch = db.batch()
	for (const [bankId, bankData] of Object.entries(questionBanks)) {
		const ref = db.collection('speakingQuestionBanks').doc(bankId)
		batch.set(ref, bankData)
		console.log(`  Queued: speakingQuestionBanks/${bankId} (${bankData.questions.length} questions)`)
	}
	await batch.commit()
	console.log('Done! All question banks seeded.')
}

seed().catch((err) => {
	console.error('Seed failed:', err)
	process.exit(1)
})
