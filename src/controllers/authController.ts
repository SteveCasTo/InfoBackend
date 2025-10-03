import { Request, Response } from 'express'
import asyncHandler from 'express-async-handler'
import { AuthService } from '../services/authService'
import { createError } from '../middleware/errorHandler'
import { validateLogin } from '../validators/authValidator'
import { AuthResponse } from '../types/auth'

export class AuthController {
  private authService: AuthService

  constructor() {
    this.authService = new AuthService()
  }

  login = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = validateLogin(req.body)
    
    const result = await this.authService.loginWithCredentials(email, password)
    
    const response: AuthResponse = {
      success: true,
      data: result
    }
    
    res.json(response)
  })

  googleAuth = asyncHandler(async (req: Request, res: Response) => {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw createError('Token de Firebase requerido', 401)
    }

    const firebaseToken = authHeader.substring(7)

    const result = await this.authService.authenticateWithGoogle(firebaseToken)

    const response: AuthResponse = {
      success: true,
      data: result
    }

    res.json(response)
  })

  getProfile = asyncHandler(async (req: Request, res: Response) => {
    const user = req.user

    if (!user) {
      throw createError('Usuario no autenticado', 401)
    }

    const userProfile = await this.authService.getUserById(user.userId)

    res.json({
      success: true,
      data: userProfile
    })
  })

  logout = asyncHandler(async (req: Request, res: Response) => {
    res.json({
      success: true,
      message: 'Logout exitoso'
    })
  })

  storeTokenBySession = asyncHandler(async (req, res) => {
    const authHeader = req.headers.authorization
    const { sessionId } = req.body

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw createError('Token de Firebase requerido', 401)
    }
    if (!sessionId) throw createError('Session ID requerido', 400)

    const firebaseToken = authHeader.substring(7)

    this.authService.storeTokenBySession(sessionId, firebaseToken)

    res.json({
      success: true,
      message: 'Token almacenado'
    })
  })

  pollSession = asyncHandler(async (req: Request, res: Response) => {
    const { sessionId } = req.query as { sessionId: string }

    if (!sessionId) {
      res.json({ success: false, message: 'Session ID requerido' })
      return;
    }

    const firebaseToken = this.authService.getTokenBySession(sessionId)

    if (!firebaseToken) {
      res.json({ success: true, data: null })
      return;
    }

    const result = await this.authService.authenticateWithGoogle(firebaseToken)
    this.authService.deleteSession(sessionId)

    res.json({ success: true, data: result })
  })

  verifyFirebaseToken = asyncHandler(async (req: Request, res: Response) => {
    const authHeader = req.headers.authorization
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw createError('Token Firebase requerido', 401)
    }

    const firebaseToken = authHeader.substring(7)
    
    try {
      const result = await this.authService.authenticateWithGoogle(firebaseToken)
      res.json({
        success: true,
        data: result
      })
    } catch {
      throw createError('Error verificando token Firebase', 401)
    }
  })
}