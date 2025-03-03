// https://nuxt.com/docs/api/configuration/nuxt-config
import apiConfig from './config/api.config'
import { auth } from './config'

export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui-pro',
    '@vueuse/nuxt'
  ],

  plugins: [
    '~/plugins/auth'
  ],

  devtools: {
    enabled: true
  },

  css: ['~/assets/css/main.css'],

  ui: {
    fonts: false
  },

  runtimeConfig: {
    public: {
      auth
    }
  },

  routeRules: {
    // Temporary workaround for prerender regression. see https://github.com/nuxt/nuxt/issues/27490
    '/api/**': { proxy: apiConfig.BASE + '/**' }
  },

  future: {
    compatibilityVersion: 4
  },

  compatibilityDate: '2024-07-11',

  nitro: {
    prerender: {
      autoSubfolderIndex: false
    }
  },

  typescript: {
    strict: false
  },

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  },

  devServer: {
    https: {
      key: './key.pem',
      cert: './cert.pem'
    },
    host: '0.0.0.0',
    port: 3000
  }
})
