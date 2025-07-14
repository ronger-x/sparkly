import type { Messages as UIMessages } from '@nuxt/ui'

export type Messages = UIMessages & {
  button: {
    submit: string
  }
}
