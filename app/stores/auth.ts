import { defineStore } from "pinia";
import type {
  User,
  LoginCredentials,
  RegisterCredentials,
  AuthResponse,
} from "~/types/auth";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null as User | null,
    token: null as string | null,
    loading: false,
    error: null as string | null,
  }),

  getters: {
    isAuthenticated: (state): boolean => !!state.token,
    isAdmin: (state): boolean => state.user?.roles.includes("admin") ?? false,
    isVip: (state): boolean => state.user?.isVip ?? false,
    hasActiveVip: (state): boolean => {
      if (!state.user?.isVip || !state.user?.vipExpiresAt) return false;
      return new Date(state.user.vipExpiresAt) > new Date();
    },
  },

  actions: {
    async register(credentials: RegisterCredentials): Promise<AuthResponse> {
      this.loading = true;
      this.error = null;

      try {
        const { $api } = useNuxtApp();
        const { data } = await $api.post<AuthResponse>(
          "/auth/register",
          credentials,
        );

        this.token = data.accessToken;
        this.user = data.user;

        return data;
      } catch (error: any) {
        this.error = error.response?.data?.message || "Registration failed";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async login(credentials: LoginCredentials): Promise<AuthResponse> {
      this.loading = true;
      this.error = null;

      try {
        const { $api } = useNuxtApp();
        const { data } = await $api.post<AuthResponse>(
          "/auth/login",
          credentials,
        );

        this.token = data.accessToken;
        this.user = data.user;

        return data;
      } catch (error: any) {
        this.error = error.response?.data?.message || "Login failed";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async fetchUser(): Promise<void> {
      if (!this.token) return;

      try {
        const { $api } = useNuxtApp();
        const { data } = await $api.get<User>("/auth/me");
        this.user = data;
      } catch (error) {
        this.logout();
      }
    },

    logout(): void {
      this.user = null;
      this.token = null;
      this.error = null;

      navigateTo("/auth/login");
    },

    clearError(): void {
      this.error = null;
    },
  },

  persist: {
    storage: piniaPluginPersistedstate.cookies(), // 
    pick: ["user", "token"],
    
  },
});
