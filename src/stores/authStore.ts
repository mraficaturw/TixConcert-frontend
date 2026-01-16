import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { signInWithGoogle, signOutFromFirebase } from '@/lib/firebase';

// Demo mode - set to true to run without backend
const DEMO_MODE = true;

export type UserRole = 'USER' | 'EO' | 'ADMIN';

export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: UserRole;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  loginWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: { name: string; email: string; password: string }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
  setToken: (token: string) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      loginWithGoogle: async () => {
        set({ isLoading: true });
        try {
          if (DEMO_MODE) {
            // In demo mode, still use Firebase for Google login
            // This ensures Google login button works as expected
            const firebaseIdToken = await signInWithGoogle();
            
            // Decode basic info from Firebase token (simplified for demo)
            // In real app, this would be validated by backend
            const tokenParts = firebaseIdToken.split('.');
            let userInfo = { name: 'Google User', email: 'user@gmail.com' };
            
            try {
              if (tokenParts[1]) {
                const payload = JSON.parse(atob(tokenParts[1]));
                userInfo = {
                  name: payload.name || payload.email?.split('@')[0] || 'Google User',
                  email: payload.email || 'user@gmail.com',
                };
              }
            } catch (e) {
              // Use default userInfo if decoding fails
            }
            
            const demoUser: User = {
              id: Date.now(),
              name: userInfo.name,
              email: userInfo.email,
              role: 'USER',
            };
            
            const fakeToken = 'demo_google_' + btoa(userInfo.email);
            
            set({
              user: demoUser,
              token: fakeToken,
              isAuthenticated: true,
              isLoading: false,
            });
            
            return { success: true };
          }
          
          // Non-demo mode: use backend
          const firebaseIdToken = await signInWithGoogle();
          const response = await fetch('http://localhost:8081/api/auth/firebase-login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              firebase_id_token: firebaseIdToken
            })
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Login failed');
          }

          const data = await response.json();

          set({
            user: data.user,
            token: data.access_token,
            isAuthenticated: true,
            isLoading: false,
          });

          return { success: true };
        } catch (error: any) {
          set({ isLoading: false });
          console.error('Google login error:', error);
          return { success: false, error: error.message || 'Login gagal' };
        }
      },

      login: async (email: string, password: string) => {
        set({ isLoading: true });
        try {
          if (DEMO_MODE) {
            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Accept any email/password in demo mode
            const name = email.split('@')[0];
            const fakeToken = 'demo_token_' + btoa(email);
            
            const demoUser: User = {
              id: Date.now(),
              name: name,
              email: email,
              role: 'USER',
            };
            
            set({
              user: demoUser,
              token: fakeToken,
              isAuthenticated: true,
              isLoading: false,
            });
            
            return { success: true };
          }
          
          // Non-demo mode: use backend
          const response = await fetch('http://localhost:8081/api/auth/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password })
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Login failed');
          }

          const data = await response.json();

          set({
            user: data.user,
            token: data.access_token,
            isAuthenticated: true,
            isLoading: false,
          });

          return { success: true };
        } catch (error: any) {
          set({ isLoading: false });
          return { success: false, error: error.message || 'Email atau password salah' };
        }
      },

      register: async (data) => {
        set({ isLoading: true });
        try {
          if (DEMO_MODE) {
            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 500));
            // Always succeed in demo mode
            set({ isLoading: false });
            return { success: true };
          }
          
          // Non-demo mode: use backend
          const response = await fetch('http://localhost:8081/api/auth/register', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Registration failed');
          }

          set({ isLoading: false });
          return { success: true };
        } catch (error: any) {
          set({ isLoading: false });
          return { success: false, error: error.message || 'Registrasi gagal' };
        }
      },

      logout: async () => {
        try {
          await signOutFromFirebase();
        } catch (e) {
          // Ignore Firebase sign-out errors
        }
        set({ user: null, token: null, isAuthenticated: false });
      },

      updateProfile: (data) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...data } : null,
        }));
      },

      setToken: (token: string) => {
        set({ token });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);

// Helper to get auth header
export function getAuthHeader(): Record<string, string> {
  const token = useAuthStore.getState().token;
  if (token) {
    return { Authorization: `Bearer ${token}` };
  }
  return {};
}
