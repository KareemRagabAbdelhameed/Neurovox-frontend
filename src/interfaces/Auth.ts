// src/types/Auth.ts
export interface User {
    id: number;
    name: string;
    role: "admin" | "user"; // ممكن تزود roles تانية
  }
  
  export interface AuthResponse {
    token: string;
    user: User;
  }
  
  export interface AuthState {
    user: User | null;
    token: string | null;
    loading: boolean;
    error: string | null;
  }
  