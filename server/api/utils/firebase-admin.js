import { initializeApp, cert, getApps } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const serviceAccountPath = process.env.ENV_FILE === '.env.dev' ? resolve(process.cwd(), 'service-account-dev.json') : resolve(process.cwd(), 'service-account.json')

const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'))

if (!getApps().length) {
    initializeApp({
        credential: cert(serviceAccount)
    })
}

export const db = getFirestore()