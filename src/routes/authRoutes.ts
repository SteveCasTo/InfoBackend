import { Router } from 'express'
import { AuthController } from '../controllers/authController'
import { authMiddleware } from '../middleware/auth'
import { validateRequest } from '../middleware/errorHandler'
import { loginSchema } from '../validators/authValidator'

const router = Router()

const authController = new AuthController()

// Ngrok (skip browser warning)
router.use((req, res, next) => {
  res.set('ngrok-skip-browser-warning', 'true')
  next()
})

router.post('/login', 
  validateRequest(loginSchema, 'body'),
  authController.login
)

router.post('/google', authController.googleAuth)
router.post('/google/store-session', authController.storeTokenBySession)
router.get('/google/poll-session', authController.pollSession)
router.post('/verify-firebase-token', authController.verifyFirebaseToken)

router.get('/profile', authMiddleware, authController.getProfile)
router.post('/logout', authMiddleware, authController.logout)

export { router as authRoutes }