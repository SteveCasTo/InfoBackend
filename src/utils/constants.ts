import dotenv from 'dotenv'
import path from 'path'
import { Secret, SignOptions } from 'jsonwebtoken';

dotenv.config()

const requiredEnvVars = [
  'DATABASE_URL',
  'JWT_SECRET',
  'PORT'
]

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Variable de entorno requerida no encontrada: ${envVar}`)
  }
}

export const DATABASE_URL = process.env.DATABASE_URL as string

export const JWT_SECRET: Secret = process.env.JWT_SECRET as string
export const JWT_EXPIRATION = process.env.JWT_EXPIRATION as SignOptions['expiresIn'] || '7d';

export const NODE_ENV = process.env.NODE_ENV || 'development'
export const PORT = parseInt(process.env.PORT as string, 10)
export const IS_PRODUCTION = NODE_ENV === 'production'
export const IS_DEVELOPMENT = NODE_ENV === 'development'

export const FIREBASE_SERVICE_ACCOUNT_PATH = process.env.FIREBASE_SERVICE_ACCOUNT_PATH 
  ? path.resolve(process.cwd(), process.env.FIREBASE_SERVICE_ACCOUNT_PATH)
  : path.resolve(process.cwd(), 'serviceAccountKey.json')

export const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:8081'
export const BACKEND_URL = process.env.BACKEND_URL || `http://localhost:${PORT}`

export const ALLOWED_ORIGINS = [
  FRONTEND_URL,
  'http://localhost:8081',
  'http://192.168.42.125:8081',
  'exp://192.168.42.125:8081'
]

// Default user values
export const DEFAULT_USER_ROLE = 'student'
export const DEFAULT_USER_STATUS = 'active'
export const DEFAULT_PROFILE_PICTURE = 'https://ui-avatars.com/api/?name='

export const ACCESS_TOKEN_EXPIRATION = '7d'
export const REFRESH_TOKEN_EXPIRATION = '30d'