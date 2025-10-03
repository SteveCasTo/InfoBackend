import { Request, Response, NextFunction } from 'express'
import { ZodError, ZodTypeAny } from 'zod'
import { Prisma } from '@prisma/client'

type AsyncMiddleware = (req: Request, res: Response, next: NextFunction) => Promise<unknown>

export interface CustomError extends Error {
  statusCode?: number
  code?: string
}

export const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response
) => {
  let statusCode = err.statusCode || 500
  let message = err.message || 'Error interno del servidor'
  let details: unknown = undefined

  console.error('Error capturado:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString()
  })

  if (err instanceof ZodError) {
    statusCode = 400
    message = 'Datos de entrada inválidos'
    details = err.issues.map((issue) => ({
      field: issue.path.join('.'),
      message: issue.message
    }))
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case 'P2002':
        statusCode = 409
        message = 'Ya existe un registro con esos datos únicos'
        details = {
          field: err.meta?.target,
          code: err.code
        }
        break
      case 'P2025':
        statusCode = 404
        message = 'Registro no encontrado'
        details = { code: err.code }
        break
      case 'P2003':
        statusCode = 400
        message = 'Error de referencia en base de datos'
        details = { code: err.code }
        break
      default:
        statusCode = 500
        message = 'Error en la base de datos'
        details = { code: err.code }
    }
  }

  if (err instanceof Prisma.PrismaClientInitializationError) {
    statusCode = 503
    message = 'Error de conexión a la base de datos'
    details = { type: 'database_connection' }
  }

  if (err.name === 'JsonWebTokenError') {
    statusCode = 401
    message = 'Token inválido'
    details = { type: 'jwt_error' }
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401
    message = 'Token expirado'
    details = { type: 'jwt_expired' }
  }

  const errorResponse = {
    success: false,
    error: message,
    ...(typeof details === 'object' && details !== null ? { details } : {}),
    ...(process.env.NODE_ENV === 'development' && { 
      stack: err.stack,
      originalError: err.message 
    })
  }

  res.status(statusCode).json(errorResponse)
}

export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  const error = new Error(`Ruta no encontrada: ${req.method} ${req.originalUrl}`) as CustomError
  error.statusCode = 404
  next(error)
}

export const asyncHandler = (fn: AsyncMiddleware) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}

export const createError = (message: string, statusCode: number = 500): CustomError => {
  const error = new Error(message) as CustomError
  error.statusCode = statusCode
  return error
}

export const validateRequest = (
  schema: ZodTypeAny,
  property: 'body' | 'query' | 'params' = 'body'
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req[property] = schema.parse(req[property])
      next()
    } catch (error) {
      next(error)
    }
  }
}