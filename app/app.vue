<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
      <Toaster position="top-right" richColors closeButton />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import { Toaster } from "@hoppscotch/vue-sonner";

useHead({
  title: "Success Secrets Bet - Your Ultimate Football Companion",
  meta: [
    {
      name: "description",
      content:
        "Discover the ultimate football companion with Success Secrets Bet. Get real-time scores, in-depth stats, and personalized insights for leagues worldwide. Stay ahead of the game with our comprehensive football platform.",
    },
    {
      name: "keywords",
      content:
        "football, soccer, live scores, football stats, football leagues, football news, football predictions, football analysis, football app",
    },
  ],

  // ✅ Add favicon links
  link: [
    { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
    {
      rel: "icon",
      type: "image/png",
      sizes: "16x16",
      href: "/favicon-16x16.png?v=1",
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "32x32",
      href: "/favicon-32x32.png?v=1",
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "48x48",
      href: "/favicon-48x48.png?v=1",
    },
    {
      rel: "apple-touch-icon",
      sizes: "180x180",
      href: "/apple-touch-icon.png?v=1",
    },

    // ✅ Web manifest
    { rel: "manifest", href: "/site.webmanifest" },
  ],
});
</script>
