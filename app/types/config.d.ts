interface MailSendgridProvider {
  name: 'sendgrid'
  apiKey: string
}

interface MailResendProvider {
  name: 'resend'
  apiKey: string
}

interface MailHookProvider {
  name: 'hook'
}

type OauthBase = Record<string, {
  clientId: string
  clientSecret: string
  scopes: string
  authorizeUrl: string
  tokenUrl: string
  userUrl: string
  customParams?: Record<string, unknown>
}>

type OauthGoogle = {
  google?: {
    clientId: string
    clientSecret: string
    scopes: 'email profile'
    authorizeUrl: 'https://accounts.google.com/o/oauth2/auth'
    tokenUrl: 'https://accounts.google.com/o/oauth2/token'
    userUrl: 'https://www.googleapis.com/oauth2/v3/userinfo'
    customParams?: Record<string, unknown>
  }
}

type OauthGitHub = {
  github?: {
    clientId: string
    clientSecret: string
    scopes: 'user:email'
    authorizeUrl: 'https://github.com/login/oauth/authorize'
    tokenUrl: 'https://github.com/login/oauth/access_token'
    userUrl: 'https://api.github.com/user'
    customParams?: Record<string, unknown>
  }
}

export type PrivateConfigWithoutBackend = {
  oauth2Enabled: false
}

export type PrivateConfigWithBackend = {
  oauth2Enabled: true

  oauth?: OauthBase & OauthGoogle & OauthGitHub
}

export type PublicConfig = {
  oauth2Enabled?: boolean
  backendBaseUrl?: string
  baseUrl: string
  enableGlobalAuthMiddleware?: boolean
  loggedInFlagName?: string
  redirect: {
    login: string
    logout: string
    home: string
    callback?: string
    passwordReset?: string
    emailVerify?: string
  }
  endpoint: {
    login: string
    logout: string
    callback: string
    user: string
    oauth2Callback: string
    oauth2Login: string
    refresh: string
    password: string
    verifyEmail: string
    newPassword: string
    changePassword: string
  }
  accessToken: {
    jwtSecret: string
    maxAge?: number
    customClaims?: Record<string, unknown>
  }

  refreshToken: {
    cookieName?: string
    jwtSecret: string
    maxAge?: number
  }

  registration: {
    enabled?: boolean
    requireEmailVerification?: boolean
    passwordValidationRegex?: string
    emailValidationRegex?: string
    defaultRole?: string
  }
}

export type PrivateConfig = PrivateConfigWithBackend | PrivateConfigWithoutBackend

export type ModuleOptions = PrivateConfig & PublicConfig
