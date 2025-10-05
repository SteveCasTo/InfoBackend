# InfoBackend - Backend para Plataforma de Intercambio de Material Académico

## 🛠️ Tecnologías Utilizadas

- **Runtime**: Node.js con TypeScript
- **Framework**: Express.js
- **Base de Datos**: PostgreSQL
- **ORM**: Prisma
- **Autenticación**: JWT + Firebase Admin SDK
- **Validación**: Zod
- **Seguridad**: Helmet, CORS, bcrypt
- **Logging**: Morgan
- **Desarrollo**: Nodemon, ESLint

## 📦 Estructura del Proyecto

```
src/
├── config/          # Configuraciones (DB, Firebase)
├── controllers/     # Controladores de rutas
├── middleware/      # Middlewares (auth, errors)
├── routes/          # Definición de rutas
├── services/        # Lógica de negocio
├── types/           # Tipos TypeScript
├── utils/           # Utilidades y constantes
└── validators/      # Esquemas de validación
```

## 🗄️ Modelo de Base de Datos

La base de datos incluye las siguientes entidades principales:

- **Users**: Gestión de usuarios con roles y autenticación
- **Publications**: Material académico compartido
- **Comments**: Sistema de comentarios en publicaciones
- **Ratings**: Valoraciones (like/dislike)
- **Reports**: Sistema de reportes de contenido
- **Files**: Gestión de archivos adjuntos
- **Subjects**: Organización por materias
- **Notifications**: Sistema de notificaciones
- **Statistics**: Métricas de usuario y actividad

## 🔧 Instalación y Configuración

### Prerrequisitos

- Node.js (v18 o superior)
- PostgreSQL
- npm o yarn

### 1. Clonar el repositorio

```bash
git clone https://github.com/SteveCasTo/InfoBackend.git
cd InfoBackend
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar base de datos

```bash
# Generar cliente Prisma
npm run db:generate

# Ejecutar migraciones
npm run db:migrate

# O hacer push del schema (desarrollo)
npm run db:push
```

Se puede utilizar los comandos nativos de prisma esto es solo una configuració de scripts


## 🚀 Uso y Despliegue

### Desarrollo Local

```bash
# Modo desarrollo con recarga automática
npm run dev

# Verificar linting y compilación
npm run check
```

### Producción

```bash
# Compilar TypeScript y ejecutar migraciones
npm run build

# Iniciar servidor en producción
npm start
```

## 📱 Configuración para Desarrollo Móvil

### Opción 1: Usar tu máquina local

Si quieres conectar tu aplicación móvil a tu servidor local:

1. **Encuentra tu IP local:**
   ```bash
   ipconfig
   ```

2. **Actualiza la URL en tu app móvil:**
   - Cambia `localhost` por tu IP local (ej: `192.168.1.100`)
   - URL completa: `http://192.168.1.100:3001`

### Opción 2: Usar el servidor desplegado

Si no puedes usar tu IP local, utiliza el dominio del deploy configurado en el archivo `.env`:

- El proyecto ya incluye configuración para el servidor desplegado
- Simplemente usa la URL del `BACKEND_URL` configurada en producción

### Opción 3: Usar ngrok (por si les da problema localmente y quieran uso en tiempo real del backend)

```bash
# Instalar ngrok globalmente
npm install -g ngrok

# Exponer puerto local
ngrok http 3001

# Usar la URL https generada en tu app móvil
```

## 📋 API Endpoints

### Autenticación
- `GET /api/auth/health` - Health check
- `POST /api/auth/login` - Login con credenciales
- `POST /api/auth/google` - Autenticación con Google
- `POST /api/auth/verify-firebase-token` - Verificar token Firebase
- `GET /api/auth/profile` - Obtener perfil (requiere auth)
- `POST /api/auth/logout` - Cerrar sesión (requiere auth)

## 🔒 Seguridad

- Middlewares de seguridad (Helmet, CORS)
- Validación de datos con Zod
- Manejo centralizado de errores

## 🧪 Testing y Desarrollo

```bash
# Verificar compilación y Linting
npm run check
```

## 📝 Scripts Disponibles

- `npm run dev` - Desarrollo con nodemon
- `npm run build` - Compilar para producción
- `npm run start` - Iniciar servidor compilado
- `npm run lint` - Verificar código con ESLint
- `npm run check` - Lint + build
- `npm run db:generate` - Generar cliente Prisma
- `npm run db:push` - Push schema a DB
- `npm run db:migrate` - Ejecutar migraciones

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)

## 📄 Licencia

Este proyecto está bajo la Licencia de Danielitusxd.

⚡ **Tip**: Para desarrollo móvil, asegúrate de que tu dispositivo y servidor estén en la misma red WiFi cuando uses IP local.