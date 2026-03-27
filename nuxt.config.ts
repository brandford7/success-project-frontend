export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  experimental: {
    appManifest: false,
  },

  srcDir: "app/",
  devtools: {
    enabled: true,
  },

  modules: [
    "@pinia/nuxt",
    "@nuxtjs/tailwindcss",
    "pinia-plugin-persistedstate/nuxt",

    "nuxt-gtag",
  ],
  gtag: {
    id: process.env.NUXT_PUBLIC_GA_MEASUREMENT_ID as string,
  },
  css: ["./app/assets/css/main.css"],

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE,
      paystackPublicKey: process.env.NUXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
      gaMeasurementId: process.env.NUXT_PUBLIC_GA_MEASUREMENT_ID || "",
    },
  },

  app: {
    head: {
      title: "Success Secrets Bet- Your Ultimate Sports Betting Companion",
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
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
      script: [
        { src: "https://js.paystack.co/v1/inline.js", defer: true },
        {
          src: "https://korablobstorage.blob.core.windows.net/modal-bucket/korapay-collections.min.js",
          defer: true,
        },
      ],
    },
  },
  // ✅ Use node-server for local dev
  /*  nitro: {
    preset: "node-server", // Change from cloudflare-pages for local dev
  },*/
});
