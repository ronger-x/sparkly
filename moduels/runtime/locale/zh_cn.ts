import { zh_cn } from '@nuxt/ui/locale'
import { defineLocale } from '@nuxt/ui/composables/defineLocale.js'
import type { Messages } from '../types/locale'

export default defineLocale<Messages>({
  ...zh_cn,
  messages: {
    ...zh_cn.messages,
    button: {
      submit: '提交'
    }
  }
})
