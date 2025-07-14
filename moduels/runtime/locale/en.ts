import { en } from '@nuxt/ui/locale'
import { defineLocale } from '@nuxt/ui/composables/defineLocale.js'
import type { Messages } from '../types/locale'

export default defineLocale<Messages>({
  ...en,
  messages: {
    ...en.messages,
    button: {
      submit: 'submit'
    }
  }
})
