import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { TokenPayload } from '../types/auth'

/* eslint-disable @typescript-eslint/no-namespace */
declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload
    }
  }
}
/* eslint-enable @typescript-eslint/no-namespace */

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        error: 'Token de autorización requerido'
      })
      return
    }

    const token = authHeader.substring(7)
    const jwtSecret = process.env.JWT_SECRET || 'your-secret-key'
    
    const payload = jwt.verify(token, jwtSecret) as TokenPayload
    req.user = payload
    
    next()
  } catch {
      res.status(401).json({
      success: false,
      error: 'Token inválido'
    })
    return
  }
}