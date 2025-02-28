import type { ModuleOptions } from '~/types/config'

export const auth: Partial<ModuleOptions> = {

  oauth2Enabled: false,

  backendBaseUrl: process.env.NUXT_PUBLIC_AUTH_BASE_URL,

  enableGlobalAuthMiddleware: true,

  refreshToken: {
    cookieName: 'refresh_token',
    jwtSecret: '',
    maxAge: 15 * 60 * 60
  },

  redirect: {
    login: '/auth/login',
    logout: '/auth/login',
    home: '/',
    callback: '/auth/callback',
    emailVerify: '/auth/verify-email',
    passwordReset: '/auth/reset-password'
  }
}
