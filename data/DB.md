
## Modelo de Datos

### Diagrama Entidad-Relación

```
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│    User     │       │   Client    │       │   Project   │
├─────────────┤       ├─────────────┤       ├─────────────┤
│ id          │       │ id          │       │ id          │
│ email       │       │ type        │──┐    │ name        │
│ password    │       │ name        │  │    │ description │
│ name        │       │ email       │  │    │ status      │
│ role        │       │ phone       │  │    │ startDate   │
  nickname
│ avatarUrl   │       │ address     │  │    │ endDate     │
│ createdAt   │       │ taxId       │  │    │ budget      │
│ updatedAt   │       │ companyName │  │    │ clientId    │──┐
└──────┬──────┘       │ userId      │──┼────│ createdAt   │  │
       │              │ createdAt   │  │    │ updatedAt   │  │
       │              └─────────────┘  │    └─────────────┘  │
       │                               │                     │
       │              ┌────────────────┘                     │
       │              │                                      │
       ▼              ▼                                      ▼
┌─────────────┐    ┌─────────────┐                  ┌─────────────┐
│Subscription │    │   Person    │                  │    Task     │
├─────────────┤    ├─────────────┤                  ├─────────────┤
│ id          │    │ firstName   │                  │ id          │
│ userId      │───▶│ lastName    │                  │ title       │
│ planId      │    │ document    │                  │ description │
│ priceId     │    │ birthDate   │                  │ status      │
│ status      │    └─────────────┘                  │ priority    │
│ stripeSubId │                                     │ projectId   │
│ startDate   │    ┌─────────────┐                  │ assignedTo  │
│ endDate     │    │   Company   │                  │ dueDate     │
│ createdAt   │    ├─────────────┤                  │ createdAt   │
└──────┬──────┘    │ legalName   │                  └─────────────┘
       │           │ tradeName   │
       │           │ taxId       │                  ┌─────────────┐
       ▼           │ industry    │                  │  Document   │
┌─────────────┐    └─────────────┘                  ├─────────────┤
│    Plan     │                                     │ id          │
├─────────────┤    ┌─────────────┐                  │ name        │
│ id          │    │   Payment   │                  │ url         │
│ name        │    ├─────────────┤                  │ type        │
│ displayName │    │ id          │                  │ projectId   │
│ maxProjects │    │ userId      │                  │ uploadedBy  │
│ maxClients  │    │ amount      │                  │ createdAt   │
│ maxStorage  │    │ currency    │                  └─────────────┘
│ features    │    │ status      │
│ isActive    │    │ stripePayId │
└──────┬──────┘    │ createdAt   │
       │           └─────────────┘
       ▼
┌─────────────┐
│    Price    │
├─────────────┤
│ id          │
│ planId      │
│ amount      │
│ currency    │
│ interval    │
│ stripePriceId│
│ isActive    │
└─────────────┘
```

### Entidades Principales

#### User
```typescript
{
  id: string (UUID)
  email: string (unique)
  password: string (hashed)
  name: string
  role: enum (ADMIN, MANAGER, USER)
  avatarUrl: string?
  isActive: boolean
  emailVerified: boolean
  createdAt: DateTime
  updatedAt: DateTime
}
```

#### Client
```typescript
{
  id: string (UUID)
  type: enum (PERSON, COMPANY)
  name: string
  email: string
  phone: string?
  address: string?
  userId: string (FK -> User)
  createdAt: DateTime
  updatedAt: DateTime
  // Relación polimórfica con Person o Company
}
```

#### Person (extends Client)
```typescript
{
  clientId: string (FK -> Client)
  firstName: string
  lastName: string
  documentType: string
  documentNumber: string
  birthDate: DateTime?
}
```

#### Company (extends Client)
```typescript
{
  clientId: string (FK -> Client)
  legalName: string
  tradeName: string?
  taxId: string
  industry: string?
  contactPerson: string?
}
```

#### Project
```typescript
{
  id: string (UUID)
  name: string
  description: string?
  status: enum (DRAFT, ACTIVE, PAUSED, COMPLETED, CANCELLED)
  startDate: DateTime?
  endDate: DateTime?
  budget: Decimal?
  currency: string
  clientId: string (FK -> Client)
  createdAt: DateTime
  updatedAt: DateTime
}
```

#### Plan
```typescript
{
  id: string (UUID)
  name: string (unique)          // FREE, BASIC, PRO, ENTERPRISE
  displayName: string            // "Plan Básico", "Plan Pro"
  description: string?
  maxProjects: number            // -1 para ilimitado
  maxClients: number             // -1 para ilimitado
  maxStorage: number             // En MB
  features: string[]             // ["feature1", "feature2"]
  isActive: boolean
  sortOrder: number              // Para ordenar en UI
  createdAt: DateTime
  updatedAt: DateTime
}
```

#### Price
```typescript
{
  id: string (UUID)
  planId: string (FK -> Plan)
  amount: Decimal                // 19.00, 49.00, etc.
  currency: string               // USD, EUR, MXN
  interval: enum (MONTH, YEAR)   // Intervalo de facturación
  intervalCount: number          // 1 = mensual, 12 = anual
  trialDays: number              // Días de prueba (0 si no hay)
  stripePriceId: string          // price_xxxxx de Stripe
  isActive: boolean
  createdAt: DateTime
  updatedAt: DateTime
}
```

#### Subscription
```typescript
{
  id: string (UUID)
  userId: string (FK -> User)
  planId: string (FK -> Plan)
  priceId: string (FK -> Price)
  status: enum (ACTIVE, CANCELLED, PAST_DUE, TRIALING, INCOMPLETE)
  stripeCustomerId: string
  stripeSubscriptionId: string
  currentPeriodStart: DateTime
  currentPeriodEnd: DateTime
  cancelAtPeriodEnd: boolean
  canceledAt: DateTime?
  createdAt: DateTime
  updatedAt: DateTime
}
```

#### Payment
```typescript
{
  id: string (UUID)
  userId: string (FK -> User)
  subscriptionId: string? (FK -> Subscription)
  amount: Decimal
  currency: string
  status: enum (PENDING, SUCCEEDED, FAILED, REFUNDED)
  stripePaymentIntentId: string
  invoiceUrl: string?
  createdAt: DateTime
}
```

---
