import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { prisma } from '../config/database'
import { verifyFirebaseToken } from '../config/firebase'
import { JWT_SECRET, JWT_EXPIRATION, DEFAULT_PROFILE_PICTURE } from '../utils/constants'
import { TokenPayload } from '../types/auth'
import { User, UserRole, UserStatus } from '@prisma/client'

export class AuthService {
  
  private sessionTokens: Map<string, string> = new Map();

  setTokenBySession(sessionId: string, token: string) {
    this.sessionTokens.set(sessionId, token);
  }

  getTokenBySession(sessionId: string) {
    return this.sessionTokens.get(sessionId);
  }

  deleteSession(sessionId: string) {
    this.sessionTokens.delete(sessionId);
  }

  async loginWithCredentials(email: string, password: string) {
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      throw new Error('Credenciales inválidas')
    }

    if (user.status !== UserStatus.active || !user.active) {
      throw new Error('Usuario inactivo o suspendido')
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash)

    if (!isPasswordValid) {
      throw new Error('Credenciales inválidas')
    }

    const token = this.generateToken({
      userId: user.user_id,
      email: user.email,
      role: user.user_role
    })

    return {
      user: {
        user_id: user.user_id,
        email: user.email,
        username: user.username,
        user_role: user.user_role,
        profile_picture: user.profile_picture
      },
      token
    }
  }

  async authenticateWithGoogle(firebaseToken: string) {
    try {
      const decodedToken = await verifyFirebaseToken(firebaseToken)

      const { uid, email, name, picture } = decodedToken

      if (!email) {
        throw new Error('Email no proporcionado por Google')
      }

      let user = await prisma.user.findUnique({
        where: { email }
      })

      if (!user) {
        const username = name || email.split('@')[0]
        
        user = await prisma.user.create({
          data: {
            google_id: uid,
            email,
            username,
            password_hash: await bcrypt.hash(Math.random().toString(36), 10),
            user_role: UserRole.student,
            profile_picture: picture || `${DEFAULT_PROFILE_PICTURE}${encodeURIComponent(username)}`,
            status: UserStatus.active,
            active: true
          }
        })
      } else {
        user = await prisma.user.update({
          where: { email },
          data: {
            google_id: uid,
            username: name || user.username,
            profile_picture: picture || user.profile_picture
          }
        })
      }

      const appToken = this.generateToken({
        userId: user.user_id,
        email: user.email,
        role: user.user_role
      })

      return {
        user: {
          user_id: user.user_id,
          email: user.email,
          username: user.username,
          user_role: user.user_role,
          profile_picture: user.profile_picture,
          google_id: user.google_id
        },
        token: appToken
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error en autenticación con Google: ${error.message}`)
      }
      throw new Error('Error en autenticación con Google')
    }
  }

  private generateToken(payload: TokenPayload): string {
    return jwt.sign(payload, JWT_SECRET, {
      expiresIn: JWT_EXPIRATION
    })
  }

  async getUserById(userId: number) {
    const user = await prisma.user.findUnique({
      where: { user_id: userId }
    })

    if (!user) {
      throw new Error('Usuario no encontrado')
    }

    if (user.status !== UserStatus.active || !user.active) {
      throw new Error('Usuario inactivo o suspendido')
    }

    return {
      user_id: user.user_id,
      email: user.email,
      username: user.username,
      user_role: user.user_role,
      profile_picture: user.profile_picture,
      google_id: user.google_id,
      status: user.status,
      registration_date: user.registration_date
    }
  }

  async findUserByEmail(email: string) {
    return await prisma.user.findUnique({ where: { email } })
  }

  async createUser(userData: {
    email: string
    name: string
    googleId: string
    photoURL?: string
    provider: string
  }) {
    return await prisma.user.create({
      data: {
        google_id: userData.googleId,
        email: userData.email,
        username: userData.name,
        password_hash: await bcrypt.hash(Math.random().toString(36), 10),
        user_role: UserRole.student,
        profile_picture: userData.photoURL || DEFAULT_PROFILE_PICTURE,
        status: UserStatus.active,
        active: true
      }
    })
  }

  async updateUser(userId: number, updateData: User) {
    return await prisma.user.update({
      where: { user_id: userId },
      data: updateData
    })
  }
}