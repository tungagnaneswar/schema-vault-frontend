import api from './axios';

export interface ForgotPasswordResponse {
  message: string;
}

export interface VerifyOtpResponse {
  resetToken: string;
}

export interface ResetPasswordResponse {
  message: string;
}

export const authApi = {
  forgotPassword: async (email: string): Promise<ForgotPasswordResponse> => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },

  verifyOtp: async (email: string, otp: string): Promise<VerifyOtpResponse> => {
    const response = await api.post('/auth/verify-otp', { email, otp });
    return response.data;
  },

  resetPassword: async (resetToken: string, newPassword: string): Promise<ResetPasswordResponse> => {
    const response = await api.post('/auth/reset-password', { resetToken, newPassword });
    return response.data;
  },
};
