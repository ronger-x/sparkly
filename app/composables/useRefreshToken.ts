import { useState } from '#imports'

interface RefreshTokenStore {
  refresh_token: string
  expires?: number
}

function memoryStorage() {
  let store: RefreshTokenStore | null = null

  return {
    get value() {
      return store
    },
    set value(data: RefreshTokenStore | null) {
      if (import.meta.client) {
        store = data
      }
    }
  }
}

const memory = memoryStorage()

/**
 * This composable permits the storage of refresh token in memory
 * On server-side, it's stored with `useState`. On client-side its stored in a scoped memory.
 * Given that `useState` is accessible on global context, it's cleared on client-side.
 */
export function useRefreshToken() {
  const state = useState<RefreshTokenStore | null>('refresh-token', () => null)

  if (import.meta.client && state.value) {
    memory.value = { ...state.value }
    state.value = null
  }

  return {
    get value() {
      return import.meta.client ? memory.value : state.value
    },

    set value(data: RefreshTokenStore | null) {
      if (import.meta.client) {
        memory.value = data
      } else {
        state.value = data
      }
    },

    get expired() {
      if (this.value && this.value.expires) {
        const msRefreshBeforeExpires = 10000
        const expires = this.value.expires - msRefreshBeforeExpires
        return expires < Date.now()
      }
      return false
    },

    /**
     * Clear the refresh token
     */
    clear() {
      if (import.meta.client) {
        memory.value = null
      } else {
        state.value = null
      }
    }
  }
}
