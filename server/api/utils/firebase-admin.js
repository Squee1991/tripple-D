import { initializeApp, cert, getApps } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import fs from 'fs'
import path from 'path'

const saPath = path.resolve(process.cwd(),
    process.env.GOOGLE_APPLICATION_CREDENTIALS || 'service-account.json'
)

if (!fs.existsSync(saPath)) {
    console.error(`❌ Service account file not found: ${saPath}`)
    process.exit(1)
}

console.log(`🔥 Firebase mode: ${process.env.FIREBASE_PROJECT_ID}`)
console.log(`🗝️ Using service account: ${saPath}`)

const serviceAccount = JSON.parse(fs.readFileSync(saPath, 'utf8'))

if (!getApps().length) {
    initializeApp({ credential: cert(serviceAccount) })
}

export const db = getFirestore()
