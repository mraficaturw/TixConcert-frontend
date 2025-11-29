import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: { name: string; email: string; password: string; phone?: string }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));

        // Mock validation
        if (!email || !password) {
          return { success: false, error: 'Email dan password harus diisi' };
        }

        if (password.length < 6) {
          return { success: false, error: 'Password minimal 6 karakter' };
        }

        // Mock success login
        const mockUser: User = {
          id: 'user-' + Date.now(),
          name: email.split('@')[0],
          email: email,
          avatar: `https://ui-avatars.com/api/?name=${email.split('@')[0]}&background=random`,
        };

        set({ user: mockUser, isAuthenticated: true });
        return { success: true };
      },

      register: async (data) => {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));

        // Mock validation
        if (!data.name || !data.email || !data.password) {
          return { success: false, error: 'Semua field harus diisi' };
        }

        if (data.password.length < 6) {
          return { success: false, error: 'Password minimal 6 karakter' };
        }

        if (!data.email.includes('@')) {
          return { success: false, error: 'Format email tidak valid' };
        }

        // Mock success registration
        const mockUser: User = {
          id: 'user-' + Date.now(),
          name: data.name,
          email: data.email,
          phone: data.phone,
          avatar: `https://ui-avatars.com/api/?name=${data.name}&background=random`,
        };

        set({ user: mockUser, isAuthenticated: true });
        return { success: true };
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      },

      updateProfile: (data) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...data } : null,
        }));
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
