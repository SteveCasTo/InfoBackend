import { Router } from 'express'
import { AuthController } from '../controllers/authController'
import { authMiddleware } from '../middleware/auth'
import { validateRequest } from '../middleware/errorHandler'
import { loginSchema } from '../validators/authValidator'

const router = Router()

const authController = new AuthController()

router.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' })
})

router.post('/login', 
  validateRequest(loginSchema, 'body'),
  authController.login
)

router.post('/google', authController.googleAuth)
router.post('/verify-firebase-token', authController.verifyFirebaseToken)

router.get('/profile', authMiddleware, authController.getProfile)
router.post('/logout', authMiddleware, authController.logout)

export { router as authRoutes }