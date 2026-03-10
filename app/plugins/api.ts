import axios, { type AxiosInstance } from "axios";

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();
  const authStore = useAuthStore();

  const api: AxiosInstance = axios.create({
    baseURL: config.public.apiBase as string,
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Request interceptor - Add token to requests
  api.interceptors.request.use(
    (config) => {
      const token = authStore.token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    },
  );

  // Response interceptor - Handle errors
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        // Token expired or invalid
        authStore.logout();
      }
      return Promise.reject(error);
    },
  );

  return {
    provide: {
      api,
    },
  };
});
