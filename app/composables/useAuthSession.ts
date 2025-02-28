import type { Ref } from 'vue'
import { useAuthToken } from './useAuthToken'
import { useRefreshToken } from './useRefreshToken'
import type { AuthenticationData } from '~/types/common'
import type { PublicConfig } from '~/types/config'
import type { User } from '~/types/adapter'
import { useRuntimeConfig, useState, useRequestHeaders, useNuxtApp, useAuth } from '#imports'

export function useAuthSession() {
  const publicConfig = useRuntimeConfig().public.auth as PublicConfig
  const nuxtApp = useNuxtApp()

  const _loggedInFlag = {
    get value() {
      return import.meta.client ? localStorage.getItem(publicConfig.loggedInFlagName!) === 'true' : false
    },
    set value(value: boolean) {
      if (import.meta.client) {
        localStorage.setItem(publicConfig.loggedInFlagName!, value.toString())
      }
    }
  }

  const user: Ref<User | null | undefined> = useState<User | null | undefined>('auth-user', () => null)

  /**
   * Asynchronously refreshes the authentication session.
   * If the request is successful, updates the access token and its expiration time.
   * If the request fails, clears the refresh token and logs out the user.
   *
   * @return {Promise<void>} A promise that resolves when the refresh operation is complete.
   */
  async function _refresh(): Promise<void> {
    async function handler() {
      const refreshToken = getRefreshToken()
      const reqHeaders = useRequestHeaders(['cookie', 'user-agent'])
      const { _onLogout } = useAuth()

      await $fetch
        .raw<AuthenticationData>(publicConfig.endpoint.refresh, {
          baseURL: publicConfig.backendBaseUrl,
          method: 'POST',
          // Cloudflare Workers does not support "credentials" field
          ...(import.meta.client ? { credentials: 'include' } : {}),
          headers: import.meta.server ? reqHeaders : {},
          body: {
            refreshToken
          },
          async  onResponseError({ response }) {
            await nuxtApp.callHook('auth:fetchError', response)
          }
        })
        .then((res) => {
          if (res._data) {
            setUniversalToken(res._data.access_token, res._data.refresh_token)
          }
        })
        .catch(async () => {
          await _onLogout()
        })
    }

    nuxtApp.$auth._refreshPromise ||= handler()
    await nuxtApp.$auth._refreshPromise.finally(() => {
      nuxtApp.$auth._refreshPromise = null
    })
  }

  /**
   * Retrieves the access token.
   *
   * @return {Promise<string | null | undefined>} The access token, or null if it is expired and cannot be refreshed, or undefined if the token is not set.
   */
  async function getAccessToken(): Promise<string | null | undefined> {
    const token = useAuthToken()

    if (token.expired) {
      await _refresh()
    }

    return token.value?.access_token
  }

  /**
   * Retrieves the refresh token.
   *
   * @return {Promise<string | null | undefined>} The refresh token, or null if it is expired and cannot be refreshed, or undefined if the token is not set.
   */
  async function getRefreshToken(): Promise<string | null | undefined> {
    const refreshToken = useRefreshToken()
    const { _onLogout } = useAuth()

    if (refreshToken.expired) {
      refreshToken.value = null
      await _onLogout()
    }

    return refreshToken.value?.refresh_token
  }

  /**
   * Set the universal token
   *
   * @param {string} accessToken - The access token
   * @param {string} refreshToken - The refresh token
   */
  async function setUniversalToken(accessToken: string, refreshToken: string) {
    const token = useAuthToken()
    const refreshAuthToken = useRefreshToken()
    token.value = {
      access_token: accessToken,
      expires: new Date().getTime() + publicConfig.accessToken.maxAge * 1000
    }
    refreshAuthToken.value = {
      refresh_token: refreshToken,
      expires: new Date().getTime() + publicConfig.refreshToken.maxAge * 1000
    }
  }

  return {
    _loggedInFlag,
    user,
    _refresh,
    getRefreshToken,
    getAccessToken,
    setUniversalToken
  }
}
