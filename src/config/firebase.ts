import admin from 'firebase-admin'
import { FIREBASE_SERVICE_ACCOUNT_PATH, IS_DEVELOPMENT } from '../utils/constants'
import fs from 'fs'

let firebaseAdmin: admin.app.App

export const initializeFirebase = (): admin.app.App => {
  if (firebaseAdmin) {
    return firebaseAdmin
  }

  try {
    if (!fs.existsSync(FIREBASE_SERVICE_ACCOUNT_PATH)) {
      throw new Error(
        `Archivo de credenciales de Firebase no encontrado en: ${FIREBASE_SERVICE_ACCOUNT_PATH}`
      )
    }

    const serviceAccount = JSON.parse(
      fs.readFileSync(FIREBASE_SERVICE_ACCOUNT_PATH, 'utf8')
    )

    firebaseAdmin = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    })

    if (IS_DEVELOPMENT) {
      console.log('Firebase Admin inicializado correctamente')
    }

    return firebaseAdmin
  } catch (error) {
    console.error('Error inicializando Firebase Admin:', error)
    throw new Error('No se pudo inicializar Firebase Admin')
  }
}

export const getFirebaseAdmin = (): admin.app.App => {
  if (!firebaseAdmin) {
    return initializeFirebase()
  }
  return firebaseAdmin
}

export const verifyFirebaseToken = async (token: string): Promise<admin.auth.DecodedIdToken> => {
  try {
    const app = getFirebaseAdmin()
    const decodedToken = await app.auth().verifyIdToken(token)
    return decodedToken
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Token inválido: ${error.message}`)
    }
    throw new Error('Token inválido')
  }
}