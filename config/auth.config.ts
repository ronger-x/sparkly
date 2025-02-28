import type { ModuleOptions } from '~/types/config'

export const auth: Partial<ModuleOptions> = {

  oauth2Enabled: false,

  backendBaseUrl: process.env.NUXT_PUBLIC_AUTH_BASE_URL,

  baseUrl: process.env.NUXT_PUBLIC_BASE_URL,

  enableGlobalAuthMiddleware: true,

  loggedInFlagName: 'auth-logged-in',

  redirect: {
    login: '/auth/login',
    logout: '/auth/login',
    home: '/',
    callback: '/auth/callback',
    emailVerify: '/auth/verify-email',
    passwordReset: '/auth/reset-password'
  },

  endpoint: {
    login: '/api/auth/login',
    logout: '/api/auth/logout',
    register: '/api/auth/register',
    callback: '/api/auth/callback',
    user: '/api/auth/me',
    oauth2Callback: '/api/oauth2/callback',
    oauth2Login: '/api/oauth2/authorization/logto',
    refresh: '/api/auth/refresh',
    password: '/api/auth/password/request',
    resetPassword: '/api/auth/password/reset',
    email: '/api/auth/email/request',
    changePassword: '/api/auth/password/change'
  },

  accessToken: {
    jwtSecret: '',
    maxAge: 15 * 60 * 60,
    customClaims: {
      userId: 'id'
    }
  },

  refreshToken: {
    enabled: true,
    jwtSecret: '',
    maxAge: 15 * 60 * 60
  },

  registration: {
    enabled: true,
    requireEmailVerification: true,
    passwordValidationRegex: '^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{8,}$',
    emailValidationRegex: '^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\\.[a-zA-Z0-9-]+)*$',
    defaultRole: 'user'
  }
}
