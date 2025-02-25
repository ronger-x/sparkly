// https://nuxt.com/docs/api/configuration/nuxt-config
import apiConfig from './config/api.config'

export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui-pro',
    '@vueuse/nuxt',
    '@sidebase/nuxt-auth',
    '@logto/nuxt'
  ],

  devtools: {
    enabled: true
  },

  css: ['~/assets/css/main.css'],

  ui: {
    fonts: false
  },

  routeRules: {
    // Temporary workaround for prerender regression. see https://github.com/nuxt/nuxt/issues/27490
    '/api/**': { proxy: apiConfig.BASE + '/**' },
    '/': { prerender: true }
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

  auth: {
    baseURL: apiConfig.AUTH,
    sessionRefresh: {
      enablePeriodically: 14 * 60 * 1000, // 14 min
      enableOnWindowFocus: false
    },
    provider: {
      type: 'local',
      endpoints: {
        signIn: { path: '/login', method: 'post' },
        signOut: { path: '/logout', method: 'post' },
        signUp: { path: '/register', method: 'post' },
        getSession: { path: '/user', method: 'get' }
      },
      token: {
        signInResponseTokenPointer: '/data/token',
        maxAgeInSeconds: 60 * 15, // 15 min
        sameSiteAttribute: 'lax'
      },
      refresh: {
        isEnabled: true,
        endpoint: {
          path: '/refresh-token', method: 'post'
        },
        refreshOnlyToken: false,
        token: {
          signInResponseRefreshTokenPointer: '/data/refreshToken',
          maxAgeInSeconds: 60 * 120, // 120 min
          refreshRequestTokenPointer: '/refreshToken'
        }
      },
      session: {
        dataResponsePointer: '/data/user',
        dataType: {
          account: 'string',
          nickname: 'string',
          avatar: 'string',
          permissions: 'string[]',
          roles: 'string[]'
        }
      }
    },
    globalAppMiddleware: {
      isEnabled: true
    }
  },

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  }
})
