import { initializeApp, cert, getApps } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import fs from 'fs'
import path from 'path'

let serviceAccount

if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
    console.log(`🔥 Firebase mode: ${process.env.FIREBASE_PROJECT_ID}`)
    console.log(`🗝️ Using service account from env variable`)
} else {
    const defaultSA = process.env.NODE_ENV === 'production'
        ? 'service-account.json'
        : 'service-account-dev.json'

    const saPath = path.resolve(process.cwd(),
        process.env.GOOGLE_APPLICATION_CREDENTIALS || defaultSA
    )

    if (!fs.existsSync(saPath)) {
        throw new Error(`Service account not found: ${saPath}. Set FIREBASE_SERVICE_ACCOUNT env variable or provide the file.`)
    }

    serviceAccount = JSON.parse(fs.readFileSync(saPath, 'utf8'))
    console.log(`🔥 Firebase mode: ${process.env.FIREBASE_PROJECT_ID}`)
    console.log(`🗝️ Using service account: ${saPath}`)
}

if (!getApps().length) {
    initializeApp({ credential: cert(serviceAccount) })
}

export const db = getFirestore()
