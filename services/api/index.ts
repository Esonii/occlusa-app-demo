/**
 * API Services - Main export file
 * 
 * Import services from this file for cleaner imports:
 * 
 * import { login, signup } from '@/services/api';
 * import { fetchAppointments, createCleaningAppointment } from '@/services/api';
 */

export * from './authApi';
export * from './appointmentsApi';
export { api, apiRequest, ApiError } from './config';
export type { ApiRequestOptions } from './config';

