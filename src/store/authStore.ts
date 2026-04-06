import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { UserRole } from "../constants/roles";
import { STORAGE_KEYS } from "../services/storage";

type AuthState = {
  hasHydrated: boolean;
  isAuthenticated: boolean;
  hasCompletedOnboarding: boolean;
  role: UserRole | null;
  token: string | null;
  setHasCompletedOnboarding: (value: boolean) => void;
  setHasHydrated: (value: boolean) => void;
  login: (payload: { token: string; role: UserRole }) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      hasHydrated: false,
      isAuthenticated: false,
      hasCompletedOnboarding: false,
      role: null,
      token: null,
      setHasCompletedOnboarding: (value) => set({ hasCompletedOnboarding: value }),
      setHasHydrated: (value) => set({ hasHydrated: value }),
      login: ({ token, role }) =>
        set({
          isAuthenticated: true,
          hasCompletedOnboarding: true,
          token,
          role,
        }),
      logout: () =>
        set({
          isAuthenticated: false,
          role: null,
          token: null,
          hasCompletedOnboarding: true, // Keep onboarding state if desired, or reset if needed
        }),
    }),
    {
      name: STORAGE_KEYS.AUTH,
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        hasCompletedOnboarding: state.hasCompletedOnboarding,
        role: state.role,
        token: state.token,
      }),
    },
  ),
);
