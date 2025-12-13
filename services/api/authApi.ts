/**
 * Authentication API service
 * Handles user authentication with the Occlusa backend
 */

import { api, ApiError } from './config';
import type { LoginRequest, LoginResponse, SignupRequest, SignupResponse } from '../../types/api';

/**
 * Login with email and password
 * Returns user data and auth token
 */
export async function login(credentials: LoginRequest): Promise<LoginResponse> {
  try {
    const response = await api.post<LoginResponse>(
      '/auth/login',
      credentials,
      { skipAuth: true } // Login endpoint doesn't require auth
    );
    return response;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError('Login failed', 0, error);
  }
}

/**
 * Sign up a new user
 * Returns user data and auth token
 */
export async function signup(userData: SignupRequest): Promise<SignupResponse> {
  try {
    const response = await api.post<SignupResponse>(
      '/auth/signup',
      userData,
      { skipAuth: true } // Signup endpoint doesn't require auth
    );
    return response;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError('Signup failed', 0, error);
  }
}

/**
 * Logout the current user
 * Clears session on the backend
 */
export async function logout(): Promise<void> {
  try {
    await api.post('/auth/logout');
  } catch (error) {
    // Logout errors are non-critical, just log them
    console.warn('Logout error:', error);
  }
}

/**
 * Refresh the authentication token
 * Useful for keeping sessions alive
 */
export async function refreshToken(): Promise<{ token: string }> {
  try {
    const response = await api.post<{ token: string }>('/auth/refresh');
    return response;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError('Token refresh failed', 0, error);
  }
}

/**
 * Verify if the current user is authenticated
 * Returns user info if authenticated, null otherwise
 */
export async function verifyAuth(): Promise<{ userId: string; email: string } | null> {
  try {
    const response = await api.get<{ userId: string; email: string }>('/auth/verify');
    return response;
  } catch (error) {
    // Not authenticated or token expired
    return null;
  }
}

