import { User, UserRole, UserStatus } from '@prisma/client'

export interface CreateUserData {
  google_id?: string
  email: string
  username: string
  password_hash: string
  user_role: UserRole
  profile_picture?: string
  status: UserStatus
}

export interface UpdateUserData {
  username?: string
  google_id?: string
  profile_picture?: string
  status?: UserStatus
}

export interface UserWithStats extends User {
  _count?: {
    publications: number
    comments: number
    reports_made: number
  }
}