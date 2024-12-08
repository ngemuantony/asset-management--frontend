import { axiosInstance } from './axios';
import {
    LoginCredentials,
    RegisterCredentials,
    LoginResponse,
    RegisterResponse,
} from '../types/auth.types';

class AuthService {
    async login(credentials: LoginCredentials): Promise<LoginResponse> {
        const response = await axiosInstance.post<LoginResponse>('/auth/login/', credentials);
        if (response.data.tokens) {
            localStorage.setItem('tokens', JSON.stringify(response.data.tokens));
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data;
    }

    async register(credentials: RegisterCredentials): Promise<RegisterResponse> {
        const response = await axiosInstance.post<RegisterResponse>('/auth/register/', credentials);
        return response.data;
    }

    async logout(): Promise<void> {
        const tokens = localStorage.getItem('tokens');
        if (tokens) {
            const { refresh } = JSON.parse(tokens);
            try {
                await axiosInstance.post('/auth/logout/', { refresh });
            } catch (error) {
                console.error('Logout error:', error);
            }
        }
        localStorage.removeItem('tokens');
        localStorage.removeItem('user');
    }

    async refreshToken(refresh: string) {
        const response = await axiosInstance.post('/auth/token/refresh/', { refresh });
        return response.data;
    }

    async changePassword(oldPassword: string, newPassword: string) {
        const response = await axiosInstance.post('/auth/password/change/', {
            oldPassword,
            newPassword,
            newPasswordConfirm: newPassword
        });
        return response.data;
    }

    async requestPasswordReset(email: string) {
        const response = await axiosInstance.post('/auth/password/reset/', { email });
        return response.data;
    }

    async resetPassword(uid: string, token: string, newPassword: string) {
        const response = await axiosInstance.post(`/auth/password/reset-confirm/${uid}/${token}/`, {
            new_password: newPassword,
            confirm_new_password: newPassword
        });
        return response.data;
    }

    getStoredUser() {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    }

    getStoredTokens() {
        const tokens = localStorage.getItem('tokens');
        return tokens ? JSON.parse(tokens) : null;
    }
}

export const authService = new AuthService();
