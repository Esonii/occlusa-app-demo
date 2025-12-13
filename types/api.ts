/**
 * API request and response types
 * Shared types for frontend-backend communication
 */

// ============================================================================
// Authentication Types
// ============================================================================

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  userId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  token: string;
  expiresAt: string;
}

export interface SignupRequest {
  firstName: string;
  lastName: string;
  email: string;
  mobilePhone: string;
  password: string;
  dateOfBirth: string;
}

export interface SignupResponse {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  token: string;
  expiresAt: string;
}

// ============================================================================
// Appointment Types
// ============================================================================

export type AppointmentType = 'cleaning' | 'checkup' | 'consultation' | 'treatment' | 'other';
export type AppointmentStatus = 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';

export interface Appointment {
  id: string;
  userId: string;
  type: AppointmentType;
  status: AppointmentStatus;
  scheduledAt: string; // ISO 8601 date string
  duration: number; // Duration in minutes
  notes?: string;
  providerId?: string;
  providerName?: string;
  location?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AppointmentListResponse {
  appointments: Appointment[];
  total: number;
  page?: number;
  limit?: number;
}

export interface CreateCleaningAppointmentRequest {
  scheduledAt: string; // ISO 8601 date string
  duration?: number; // Default: 60 minutes
  notes?: string;
  providerId?: string;
  location?: string;
}

export interface CreateAppointmentRequest {
  type: AppointmentType;
  scheduledAt: string; // ISO 8601 date string
  duration: number; // Duration in minutes
  notes?: string;
  providerId?: string;
  providerName?: string;
  location?: string;
}

// ============================================================================
// Common Types
// ============================================================================

export interface ApiErrorResponse {
  message: string;
  code?: string;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

