import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '@/lib/supabase';
import type { User, UserPreferences } from '@/types';

interface AuthState {
  user: User | null;
  session: any | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ error: any }>;
  register: (email: string, password: string, fullName: string, birthDate: string) => Promise<{ error: any }>;
  loginWithGoogle: () => Promise<{ error: any }>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<{ error: any }>;
  updatePreferences: (preferences: Partial<UserPreferences>) => Promise<{ error: any }>;
  fetchUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      session: null,
      isLoading: true,
      isAuthenticated: false,

      login: async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (!error && data.session) {
          set({ session: data.session, isAuthenticated: true });
          await get().fetchUser();
        }
        return { error };
      },

      register: async (email, password, fullName, birthDate) => {
        const { data, error } = await supabase.auth.signUp({
          email, password,
          options: { data: { full_name: fullName, birth_date: birthDate } }
        });
        if (!error && data.user) {
          await supabase.from('users').insert({
            id: data.user.id,
            email: data.user.email,
            full_name: fullName,
            birth_date: birthDate,
            avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.user.id}`,
            preferences: { lang: 'es', theme: 'light', unlockedThemes: [] }
          });
        }
        return { error };
      },

      loginWithGoogle: async () => {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: { redirectTo: `${window.location.origin}/auth/callback` }
        });
        return { error };
      },

      logout: async () => {
        await supabase.auth.signOut();
        set({ user: null, session: null, isAuthenticated: false });
      },

      updateProfile: async (data) => {
        const { user } = get();
        if (!user) return { error: new Error('No user') };
        const { error } = await supabase.from('users').update(data).eq('id', user.id);
        if (!error) set({ user: { ...user, ...data } });
        return { error };
      },

      updatePreferences: async (preferences) => {
        const { user } = get();
        if (!user) return { error: new Error('No user') };
        const newPreferences = { ...user.preferences, ...preferences };
        const { error } = await supabase.from('users').update({ preferences: newPreferences }).eq('id', user.id);
        if (!error) set({ user: { ...user, preferences: newPreferences } });
        return { error };
      },

      fetchUser: async () => {
        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (authUser) {
          const { data: profile } = await supabase.from('users').select('*').eq('id', authUser.id).single();
          if (profile) {
            set({ user: profile as User, isAuthenticated: true });
          } else {
            const { data: newProfile } = await supabase.from('users').insert({
              id: authUser.id,
              email: authUser.email,
              full_name: authUser.user_metadata?.full_name || authUser.email?.split('@')[0],
              avatar_url: authUser.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${authUser.id}`,
              preferences: { lang: 'es', theme: 'light', unlockedThemes: [] }
            }).select().single();
            if (newProfile) set({ user: newProfile as User, isAuthenticated: true });
          }
        }
        set({ isLoading: false });
      }
    }),
    { name: 'auth-storage', partialize: (state) => ({ user: state.user, session: state.session, isAuthenticated: state.isAuthenticated }) }
  )
);
