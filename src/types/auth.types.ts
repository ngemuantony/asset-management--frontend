export interface LoginCredentials {
    usernameOrEmail: string;
    password: string;
}

export interface RegisterCredentials {
    username: string;
    email: string;
    password: string;
    password2: string;
    firstName: string;
    lastName: string;
}

export interface User {
    id?: number;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    role?: string;
}

export interface AuthTokens {
    access: string;
    refresh: string;
}

export interface AuthState {
    user: User | null;
    tokens: AuthTokens | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}

export interface LoginResponse {
    message: string;
    user: User;
    tokens: AuthTokens;
}

export interface RegisterResponse {
    message: string;
    user: User;
}

export interface AuthError {
    error: string;
    detail?: string | Record<string, string[]>;
}
