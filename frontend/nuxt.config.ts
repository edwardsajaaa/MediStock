export default defineNuxtConfig({
  ssr: false, // Since this is a dashboard originally built as SPA
  devtools: { enabled: true },
  css: ['~/assets/index.css']
})
