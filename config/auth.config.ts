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
    login: { path: '/api/auth/login', method: 'post' },
    logout: { path: '/api/auth/logout', method: 'post' },
    register: { path: '/api/auth/register', method: 'post' },
    callback: { path: '/api/auth/callback', method: 'post' },
    user: { path: '/api/auth/me', method: 'get' },
    refresh: { path: '/api/auth/refresh', method: 'post' },
    password: { path: '/api/auth/password/request', method: 'post' },
    resetPassword: { path: '/api/auth/password/reset', method: 'put' },
    email: { path: '/api/auth/email/request', method: 'post' },
    changePassword: { path: '/api/auth/password/change', method: 'put' }
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
