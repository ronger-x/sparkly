// plugins/auth.ts
import { defu } from 'defu'
import type { PublicConfig } from '~/types/config'
import { defineNuxtPlugin, useAuthSession, useRequestHeaders } from '#imports'

export default defineNuxtPlugin({
  name: 'auth',
  parallel: true,

  setup(nuxtApp) {
    const publicConfig = nuxtApp.$config.public.auth as PublicConfig

    // 合并 provider 和 flow 的功能
    const providerSetup = () => {
      const reqHeaders = useRequestHeaders(['user-agent'])

      const fetch = $fetch.create({
        baseURL: publicConfig.backendBaseUrl,

        async onRequest({ options }) {
          const accessToken = await useAuthSession().getAccessToken()

          if (accessToken) {
            options.headers = defu(options.headers, reqHeaders, {
              authorization: 'Bearer ' + accessToken
            })
          }

          options.credentials ||= 'omit'
        },

        async onResponseError({ response }) {
          await nuxtApp.callHook('auth:fetchError', response)
        }
      })

      return {
        fetch,
        _refreshPromise: null
      }
    }

    const flowSetup = async () => {
      const router = useRouter()
      const token = useAuthToken()
      const { _loggedInFlag } = useAuthSession()

      nuxtApp.hook('auth:loggedIn', (state) => {
        _loggedInFlag.value = state
      })

      // 跨标签页同步登录状态
      nuxtApp.hook('app:mounted', () => {
        window.onstorage = (event) => {
          if (event.key === publicConfig.loggedInFlagName) {
            if (event.oldValue === 'true' && event.newValue === 'false' && token.value) {
              useAuth()._onLogout()
            } else if (event.oldValue === 'false' && event.newValue === 'true') {
              location.reload()
            }
          }
        }
      })

      function isFirstTime() {
        const isPageFound = router.currentRoute.value?.matched.length > 0
        const isPrerenderd = typeof nuxtApp.payload.prerenderedAt === 'number'
        const isServerRendered = nuxtApp.payload.serverRendered
        const isServerValid = import.meta.server && !isPrerenderd && isPageFound
        const isClientValid = import.meta.client && (!isServerRendered || isPrerenderd || !isPageFound)
        return isServerValid || isClientValid
      }

      function canFetchUser() {
        const isCallback = router.currentRoute.value?.path === publicConfig.redirect.callback
        const isCallbackValid = isCallback && !router.currentRoute.value?.query.error
        const isRefreshTokenExists = !!useAuthSession()._refreshToken.get()
        return isCallbackValid || _loggedInFlag.value || isRefreshTokenExists
      }

      // 刷新 access token 和用户状态
      if (isFirstTime() && canFetchUser()) {
        await useAuthSession()._refresh()
        if (token.value) {
          await useAuth().fetchUser()
        }
      }

      // 设置登录状态
      if (token.value) {
        await nuxtApp.callHook('auth:loggedIn', true)
      } else {
        _loggedInFlag.value = false
      }
    }

    return {
      provide: {
        auth: {
          ...providerSetup(),
          _flowSetup: flowSetup
        }
      }
    }
  }
})
