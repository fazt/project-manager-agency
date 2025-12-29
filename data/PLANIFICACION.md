# Planificación: Project Manager Agency

## Descripción General

Sistema de administración de proyectos de software para agencias, con modelo de suscripción. Permite gestionar proyectos asignados a clientes (personas o empresas) con funcionalidades de pagos integrados.

---

## Stack Tecnológico

| Capa | Tecnología |
|------|------------|
| Monorepo | TurboRepo |
| Frontend | Next.js (App Router) |
| UI Components | shadcn/ui + TailwindCSS |
| Formularios | react-hook-form + zod |
| Backend | NestJS |
| ORM | Prisma |
| Base de Datos | PostgreSQL |
| Almacenamiento | Cloudinary |
| Emails | Brevo (Sendinblue) |
| Pagos | Stripe |
| Autenticación | NextAuth.js / JWT |

---

## Estructura del Monorepo

```
project-manager-agency/
├── apps/
│   ├── web/                    # Next.js - Aplicación principal
│   │   ├── app/
│   │   │   ├── (landing)/      # Landing page pública
│   │   │   ├── (auth)/         # Autenticación
│   │   │   ├── (dashboard)/    # Panel de administración
│   │   │   └── api/            # API Routes de Next.js
│   │   └── ...
│   └── api/                    # NestJS - Backend API
│       ├── src/
│       │   ├── modules/
│       │   │   ├── auth/
│       │   │   ├── users/
│       │   │   ├── clients/
│       │   │   ├── projects/
│       │   │   ├── subscriptions/
│       │   │   ├── payments/
│       │   │   ├── uploads/
│       │   │   └── emails/
│       │   └── ...
│       └── ...
├── packages/
│   ├── ui/                     # Componentes compartidos (shadcn/ui)
│   ├── database/               # Prisma schema y cliente
│   ├── types/                  # TypeScript types compartidos
│   ├── validators/             # Schemas de Zod compartidos
│   ├── config/                 # Configuraciones compartidas
│   └── utils/                  # Utilidades compartidas
├── turbo.json
├── package.json
└── pnpm-workspace.yaml
```

---
## Módulos del Sistema

### 1. Módulo de Autenticación (auth)
- Registro de usuarios
- Login/Logout
- Recuperación de contraseña
- Verificación de email
- OAuth (Google, GitHub)
- JWT + Refresh tokens

### 2. Módulo de Usuarios (users)
- CRUD de usuarios
- Gestión de perfiles
- Subida de avatar (Cloudinary)
- Gestión de roles y permisos

### 3. Módulo de Clientes (clients)
- CRUD de clientes
- Gestión de personas
- Gestión de empresas
- Búsqueda y filtrado

### 4. Módulo de Proyectos (projects)
- CRUD de proyectos
- Asignación a clientes
- Estados y workflow
- Tareas del proyecto
- Documentos del proyecto

### 5. Módulo de Suscripciones (subscriptions)
- Planes de suscripción
- Integración con Stripe
- Gestión del ciclo de vida
- Webhooks de Stripe

### 6. Módulo de Pagos (payments)
- Procesamiento de pagos
- Historial de transacciones
- Facturas
- Métodos de pago

### 7. Módulo de Uploads (uploads)
- Subida de archivos a Cloudinary
- Gestión de documentos
- Optimización de imágenes

### 8. Módulo de Emails (emails)
- Emails transaccionales con Brevo
- Templates de emails
- Notificaciones

---

## Planes de Suscripción

| Plan | Precio | Proyectos | Clientes | Almacenamiento | Características |
|------|--------|-----------|----------|----------------|-----------------|
| Free | $0/mes | 1 | 2 | 100MB | Funciones básicas |
| Basic | $19/mes | 5 | 10 | 1GB | + Reportes básicos |
| Pro | $49/mes | 20 | 50 | 5GB | + API Access, Integraciones |
| Enterprise | $99/mes | Ilimitado | Ilimitado | 20GB | + Soporte prioritario |

---

## Páginas del Frontend

### Landing Page (Pública)
- `/` - Home
- `/features` - Características
- `/pricing` - Precios
- `/contact` - Contacto
- `/blog` - Blog (opcional)

### Autenticación
- `/login` - Inicio de sesión
- `/register` - Registro
- `/forgot-password` - Recuperar contraseña
- `/reset-password` - Restablecer contraseña
- `/verify-email` - Verificar email

### Dashboard (Privado)
- `/dashboard` - Panel principal
- `/dashboard/projects` - Lista de proyectos
- `/dashboard/projects/[id]` - Detalle de proyecto
- `/dashboard/projects/new` - Crear proyecto
- `/dashboard/clients` - Lista de clientes
- `/dashboard/clients/[id]` - Detalle de cliente
- `/dashboard/clients/new` - Crear cliente
- `/dashboard/settings` - Configuración
- `/dashboard/settings/profile` - Perfil
- `/dashboard/settings/billing` - Facturación
- `/dashboard/settings/subscription` - Suscripción

---

## API Endpoints (NestJS)

### Auth
```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
POST   /api/auth/refresh
POST   /api/auth/forgot-password
POST   /api/auth/reset-password
GET    /api/auth/verify-email/:token
```

### Users
```
GET    /api/users/me
PATCH  /api/users/me
DELETE /api/users/me
POST   /api/users/me/avatar
```

### Clients
```
GET    /api/clients
POST   /api/clients
GET    /api/clients/:id
PATCH  /api/clients/:id
DELETE /api/clients/:id
```

### Projects
```
GET    /api/projects
POST   /api/projects
GET    /api/projects/:id
PATCH  /api/projects/:id
DELETE /api/projects/:id
GET    /api/projects/:id/tasks
POST   /api/projects/:id/tasks
GET    /api/projects/:id/documents
POST   /api/projects/:id/documents
```

### Subscriptions
```
GET    /api/subscriptions/plans
GET    /api/subscriptions/current
POST   /api/subscriptions/checkout
POST   /api/subscriptions/cancel
POST   /api/subscriptions/webhook (Stripe)
```

### Payments
```
GET    /api/payments
GET    /api/payments/:id
GET    /api/payments/:id/invoice
```

---

## Configuración de Servicios Externos

### Stripe
```env
STRIPE_SECRET_KEY=sk_...
STRIPE_PUBLISHABLE_KEY=pk_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### Cloudinary
```env
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

### Brevo (Emails)
```env
BREVO_API_KEY=...
BREVO_SENDER_EMAIL=...
BREVO_SENDER_NAME=...
```

### Base de Datos
```env
DATABASE_URL=postgresql://user:password@host:5432/database
```

---

## Fases de Desarrollo

### Fase 1: Fundamentos
- [ ] Configurar monorepo con TurboRepo
- [ ] Configurar Next.js con TailwindCSS y shadcn/ui
- [ ] Configurar NestJS
- [ ] Configurar Prisma con PostgreSQL
- [ ] Configurar paquetes compartidos (types, validators, ui)

### Fase 2: Autenticación
- [ ] Implementar registro de usuarios
- [ ] Implementar login/logout
- [ ] Implementar JWT + refresh tokens
- [ ] Implementar verificación de email
- [ ] Implementar recuperación de contraseña

### Fase 3: Landing Page
- [ ] Crear página de inicio
- [ ] Crear página de características
- [ ] Crear página de precios
- [ ] Crear página de contacto
- [ ] Implementar formulario de registro

### Fase 4: Gestión de Clientes
- [ ] CRUD de clientes (persona)
- [ ] CRUD de clientes (empresa)
- [ ] Listado con filtros y búsqueda
- [ ] Detalle de cliente

### Fase 5: Gestión de Proyectos
- [ ] CRUD de proyectos
- [ ] Asignación de clientes
- [ ] Estados y workflow
- [ ] Tareas del proyecto
- [ ] Dashboard de proyectos

### Fase 6: Sistema de Archivos
- [ ] Integración con Cloudinary
- [ ] Subida de avatares
- [ ] Documentos de proyectos
- [ ] Galería de archivos

### Fase 7: Suscripciones y Pagos
- [ ] Integración con Stripe
- [ ] Planes de suscripción
- [ ] Checkout y facturación
- [ ] Webhooks de Stripe
- [ ] Portal del cliente

### Fase 8: Emails
- [ ] Integración con Brevo
- [ ] Email de bienvenida
- [ ] Email de verificación
- [ ] Notificaciones de pagos
- [ ] Recordatorios

### Fase 9: Finalización
- [ ] Testing (unit, integration, e2e)
- [ ] Optimización de rendimiento
- [ ] SEO
- [ ] Documentación
- [ ] Despliegue (Vercel + Railway/Render)

---

## Comandos del Monorepo

```bash
# Instalar dependencias
pnpm install

# Desarrollo
pnpm dev              # Ejecutar todo
pnpm dev --filter web # Solo frontend
pnpm dev --filter api # Solo backend

# Build
pnpm build

# Base de datos
pnpm db:generate      # Generar cliente Prisma
pnpm db:push          # Push schema a DB
pnpm db:migrate       # Ejecutar migraciones
pnpm db:studio        # Abrir Prisma Studio

# Testing
pnpm test
pnpm test:e2e

# Linting
pnpm lint
pnpm format
```

---

## Notas Adicionales

- Usar **pnpm** como gestor de paquetes por su eficiencia en monorepos
- Implementar **rate limiting** en la API
- Usar **Redis** para caché y sesiones (opcional)
- Implementar **logging** con Winston o Pino
- Configurar **CI/CD** con GitHub Actions
- Usar **Docker** para desarrollo local
