import { defu } from 'defu'
import type { FetchError, FetchResponse } from 'ofetch'
import { hash } from 'ohash'
import type { AsyncData, UseFetchOptions } from '#app'
import type { KeysOf } from '#app/composables/asyncData'

type UrlType = string | Request | Ref<string | Request> | (() => string | Request)

type HttpOption<T> = UseFetchOptions<ResOptions<T>, T, KeysOf<T>, any>

export interface ResOptions<T> {
  data: T
  code: number
  message: boolean
  err?: string[]
}

function handleError<T>(
  _method: string | undefined,
  _response: FetchResponse<ResOptions<T>> & FetchResponse<any>
) {
  // Implement error handling logic here
  if (_response?._data?.statusCode === 401) {
    // setUser('')
  }
  console.error(`[useHttp] [error] ${_method}:`, _response)
}

function checkRef(obj: Record<string, any>) {
  return Object.keys(obj).some(key => isRef(obj[key]))
}

function fetch<T>(url: UrlType, opts: HttpOption<T>): AsyncData<ResOptions<T>, FetchError<ResOptions<T>>> {
  // Check the `key` option
  const { key, params, watch } = opts
  if (!key && ((params && checkRef(params)) || (watch && checkRef(watch))))
    console.error('\x1B[31m%s\x1B[0m %s', '[useHttp] [error]', 'The `key` option is required when `params` or `watch` has ref properties, please set a unique key for the current request.')

  const options = opts as UseFetchOptions<ResOptions<T>>
  options.lazy = options.lazy ?? true

  const { baseURL } = useRuntimeConfig().public

  const { token } = useAuth()

  return useFetch<ResOptions<T>>(url, {
    // Request interception
    onRequest({ options }) {
      // Set the base URL
      options.baseURL = baseURL
      if (token.value) {
        // set the headers
        const reqHeaders = useRequestHeaders(['user-agent'])
        // 使用 defu 合并 headers
        options.headers = defu(options.headers, reqHeaders, {
          Authorization: `${token.value}`
        })
      }
    },
    // Response interception
    onResponse(_context) {
      // Handle the response
      if (_context.response._data?.code !== 200) {
        console.log('error', _context.error)
        throw createError({
          statusCode: _context.response._data?.code,
          statusMessage: _context.response._data?.message,
          data: _context.response._data?.err
        })
      }
    },
    // Error interception
    onResponseError({ response, options: { method } }) {
      handleError<T>(method, response)
    },
    // Set the cache key
    key: key ?? hash(['api-fetch', url, JSON.stringify({ method: options.method, params: options.params })]),
    // Merge the options
    ...options
  }) as AsyncData<ResOptions<T>, FetchError<ResOptions<T>>>
}

export function useAuthFetch<T>(
  url: UrlType,
  options: HttpOption<T>
) {
  return fetch<T>(url, options)
}
