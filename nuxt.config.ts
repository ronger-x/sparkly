// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxt/eslint', '@nuxt/ui-pro', '@vueuse/nuxt', '@sidebase/nuxt-auth', '@nuxtjs/i18n'],

  devtools: {
    enabled: true
  },

  css: ['~/assets/css/main.css'],

  ui: {
    fonts: false
  },

  runtimeConfig: {
    public: {
      baseURL: 'https://rymcu.local/api'
    }
  },

  devServer: {
    host: '0.0.0.0',
    port: 3000
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
    baseURL: 'https://rymcu.local/api',
    sessionRefresh: {
      enablePeriodically: 14 * 60 * 1000, // 14 min
      enableOnWindowFocus: false
    },
    provider: {
      type: 'local',
      pages: {
        login: '/auth/login'
      },
      endpoints: {
        signIn: { path: '/auth/login', method: 'post' },
        signOut: { path: '/auth/logout', method: 'post' },
        signUp: { path: '/auth/register', method: 'post' },
        getSession: { path: '/auth/me', method: 'get' }
      },
      token: {
        signInResponseTokenPointer: '/data/token',
        maxAgeInSeconds: 60 * 15, // 15 min
        sameSiteAttribute: 'lax',
        cookieName: 'auth.token-sparkly'
      },
      refresh: {
        isEnabled: true,
        endpoint: {
          path: '/auth/refresh-token', method: 'post'
        },
        refreshOnlyToken: false,
        token: {
          signInResponseRefreshTokenPointer: '/data/refreshToken',
          maxAgeInSeconds: 60 * 120, // 120 min
          refreshRequestTokenPointer: '/refreshToken',
          cookieName: 'auth.refresh-token-sparkly'
        }
      },
      session: {
        dataResponsePointer: '/data/user',
        dataType: {
          account: 'string',
          nickname: 'string',
          email: 'string',
          avatar: 'string',
          permissions: 'string[]',
          role: 'string[]'
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
  },

  i18n: {
    defaultLocale: 'zh-CN',
    locales: [{
      code: 'zh-CN',
      name: '简体中文',
      file: 'zh-CN.json'
    }, {
      code: 'en',
      name: 'English',
      file: 'en.json'
    }],
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected'
    }
  }
})
