import api from './axios';
import { getCookie } from '../utils/cookie';

export interface ForgotPasswordResponse {
  message: string;
}

export interface VerifyOtpResponse {
  message: string;
}

export interface ResetPasswordResponse {
  message: string;
}

export interface ResendRegistrationOtpResponse {
  message: string;
}

export const authApi = {
  forgotPassword: async (email: string): Promise<ForgotPasswordResponse> => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },

  resendRegistrationOtp: async (email: string): Promise<ResendRegistrationOtpResponse> => {
    const response = await api.post('/auth/resend-verification-otp', { email });
    return response.data;
  },

  verifyOtp: async (email: string, otp: string): Promise<VerifyOtpResponse> => {
    const response = await api.post('/auth/verify-otp', { email, otp });
    return response.data;
  },

  resetPassword: async (email: string, otp: string, newPassword: string): Promise<ResetPasswordResponse> => {
    const response = await api.post('/auth/reset-password', { email, otp, newPassword });
    return response.data;
  },

  logout: async (): Promise<{ message: string }> => {
    const refreshToken = getCookie('refreshToken');
    const response = await api.post('/auth/logout', { refreshToken });
    return response.data;
  },
};
