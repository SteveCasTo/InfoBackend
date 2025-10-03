import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres')
})

export const googleCallbackSchema = z.object({
  code: z.string().min(1, 'Código de autorización requerido'),
  redirectUri: z.string().optional()
})

export type LoginInput = z.infer<typeof loginSchema>

export const validateLogin = (data: unknown) => {
  return loginSchema.parse(data)
}

export const validateGoogleCallback = (data: unknown) => {
  return googleCallbackSchema.parse(data)
}