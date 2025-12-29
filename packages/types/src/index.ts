// Shared TypeScript types

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export enum UserRole {
  ADMIN = "ADMIN",
  USER = "USER",
}

export interface Client {
  id: string;
  type: ClientType;
  name: string;
  email: string;
  phone?: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum ClientType {
  PERSON = "PERSON",
  COMPANY = "COMPANY",
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  status: ProjectStatus;
  clientId: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum ProjectStatus {
  PENDING = "PENDING",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

export interface Subscription {
  id: string;
  userId: string;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  stripeSubscriptionId?: string;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  createdAt: Date;
  updatedAt: Date;
}

export enum SubscriptionPlan {
  FREE = "FREE",
  BASIC = "BASIC",
  PRO = "PRO",
  ENTERPRISE = "ENTERPRISE",
}

export enum SubscriptionStatus {
  ACTIVE = "ACTIVE",
  CANCELLED = "CANCELLED",
  PAST_DUE = "PAST_DUE",
  TRIALING = "TRIALING",
}
