/**
 * Appointments API service
 * Handles appointment-related operations with the Occlusa backend
 */

import type {
  Appointment,
  AppointmentListResponse,
  CreateAppointmentRequest,
  CreateCleaningAppointmentRequest,
} from '../../types/api';
import { api, ApiError } from './config';

/**
 * Fetch all appointments for the current user
 * Supports filtering by status (upcoming, past, all)
 */
export async function fetchAppointments(
  status?: 'upcoming' | 'past' | 'all'
): Promise<Appointment[]> {
  try {
    const params = status && status !== 'all' ? `?status=${status}` : '';
    const response = await api.get<AppointmentListResponse>(
      `/appointments${params}`
    );
    return response.appointments || [];
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError('Failed to fetch appointments', 0, error);
  }
}

/**
 * Fetch a single appointment by ID
 */
export async function fetchAppointmentById(appointmentId: string): Promise<Appointment> {
  try {
    const response = await api.get<Appointment>(`/appointments/${appointmentId}`);
    return response;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError('Failed to fetch appointment', 0, error);
  }
}

/**
 * Create a cleaning appointment
 * Simplified helper for the most common appointment type
 */
export async function createCleaningAppointment(
  payload: CreateCleaningAppointmentRequest
): Promise<Appointment> {
  try {
    const request: CreateAppointmentRequest = {
      type: 'cleaning',
      duration: payload.duration ?? 60, // Default to 60 minutes for cleanings
      ...payload,
    };
    const response = await api.post<Appointment>('/appointments', request);
    return response;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError('Failed to create appointment', 0, error);
  }
}

/**
 * Create a custom appointment
 * Generic method for creating any type of appointment
 */
export async function createAppointment(
  payload: CreateAppointmentRequest
): Promise<Appointment> {
  try {
    const response = await api.post<Appointment>('/appointments', payload);
    return response;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError('Failed to create appointment', 0, error);
  }
}

/**
 * Update an existing appointment
 */
export async function updateAppointment(
  appointmentId: string,
  updates: Partial<CreateAppointmentRequest>
): Promise<Appointment> {
  try {
    const response = await api.patch<Appointment>(
      `/appointments/${appointmentId}`,
      updates
    );
    return response;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError('Failed to update appointment', 0, error);
  }
}

/**
 * Cancel an appointment
 */
export async function cancelAppointment(appointmentId: string): Promise<void> {
  try {
    await api.delete(`/appointments/${appointmentId}`);
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError('Failed to cancel appointment', 0, error);
  }
}

