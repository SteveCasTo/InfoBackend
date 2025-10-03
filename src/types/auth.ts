export interface GoogleUserInfo {
  id: string
  email: string
  name: string
  picture?: string
}

export interface TokenPayload {
  userId: number
  email: string
  role: string
}

export interface AuthResponse {
  success: boolean
  data?: {
    user: unknown
    token: string
  }
  error?: string
}