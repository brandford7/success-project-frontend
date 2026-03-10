export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",

  devtools: {
    enabled: true,
  },

  modules: ["@pinia/nuxt", "@pinia-plugin-persistedstate/nuxt"],

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
    },
  },

  app: {
    head: {
      title: "Success Secrets Bet- Your Ultimate Sports Betting Companion",
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
      ],
      script: [
        {
          src: "https://js.paystack.co/v1/inline.js",
          defer: true,
        },
      ],
    },
  },
});
