// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  ssr: true,
  css: ['@/assets/css/tailwind.css'],
  modules: [
    '@nuxt/fonts',
    '@nuxt/eslint',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxtjs/tailwindcss'
  ],
  routeRules: {
    // Cache WordPress API calls for 1 day (client-side)
    '/api/wordpress/**': {
      cache: { 
        swr: true,
        maxAge: 86400, // 1 day
        staleMaxAge: 172800 // 2 days fallback
      }
    },
    // Pre-render home page
    '/': { prerender: true },
    // Cache blog pages for 1 hour
    '/blog/**': { swr: 3600 }
  },
  plugins: [
    '~/plugins/pageCache.js'],
})