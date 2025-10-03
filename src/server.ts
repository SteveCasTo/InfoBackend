import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import { authRoutes } from './routes/authRoutes'
import { errorHandler, notFoundHandler } from './middleware/errorHandler'
import { connectDatabase } from './config/database'
import { initializeFirebase } from './config/firebase'
import { PORT, IS_DEVELOPMENT } from './utils/constants'

const app = express()

app.use(helmet())
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

if (IS_DEVELOPMENT) {
  app.use(morgan('dev'))
}

// Rutas
app.use('/api/auth', authRoutes)

app.use(notFoundHandler)
app.use(errorHandler)

const startServer = async () => {
  try {
    await connectDatabase()
    
    initializeFirebase()
    
    app.listen(PORT, () => {
      if (IS_DEVELOPMENT) {
        console.log(`Servidor corriendo en puerto ${PORT}`)
        console.log(`Modo: ${IS_DEVELOPMENT ? 'Desarrollo' : 'Producción'}`)
      }
    })
  } catch (error) {
    console.error('Error iniciando el servidor:', error)
    process.exit(1)
  }
}

startServer()

export default app