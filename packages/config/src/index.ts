// Shared configuration

export const config = {
  app: {
    name: "Project Manager Agency",
    description: "Sistema de administración de proyectos para agencias",
  },
  subscription: {
    plans: {
      FREE: {
        name: "Free",
        price: 0,
        projects: 1,
        clients: 2,
        storage: 100, // MB
      },
      BASIC: {
        name: "Basic",
        price: 19,
        projects: 5,
        clients: 10,
        storage: 1024, // MB
      },
      PRO: {
        name: "Pro",
        price: 49,
        projects: 20,
        clients: 50,
        storage: 5120, // MB
      },
      ENTERPRISE: {
        name: "Enterprise",
        price: 99,
        projects: -1, // Unlimited
        clients: -1, // Unlimited
        storage: 20480, // MB
      },
    },
  },
  projectStatus: {
    PENDING: { label: "Pendiente", color: "yellow" },
    IN_PROGRESS: { label: "En Progreso", color: "blue" },
    COMPLETED: { label: "Completado", color: "green" },
    CANCELLED: { label: "Cancelado", color: "red" },
  },
} as const;

export type Config = typeof config;
