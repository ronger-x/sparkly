import { createSharedComposable } from '@vueuse/core'
import type { BaseOption } from '~/types'

const _useDictOptionsFetch = (code: string) => {
  const { data: options } = useAuthFetch<BaseOption[]>('/admin/dict/options', {
    params: {
      code
    },
    transform(res) {
      return res.data
    },
    lazy: true
  })
  return {
    options
  }
}

export const useDictOptionsFetch = createSharedComposable(_useDictOptionsFetch)
