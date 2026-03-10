import { useAuthStore } from "~/stores/auth";

/**
 * Prevents authenticated users from accessing guest-only pages
 * Usage: Add definePageMeta({ middleware: 'guest' }) to login/register pages
 */
export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore();

  // If already authenticated, redirect to home
  if (authStore.isAuthenticated) {
    return navigateTo("/");
  }
});
