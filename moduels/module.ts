import { createResolver, defineNuxtModule, installModule, hasNuxtModule, addComponentsDir } from '@nuxt/kit'
import defu from 'defu'
import { name, version } from '../package.json'
import icons from './theme/icons'
import { addTemplates } from './templates'

export interface ModuleOptions {
  prefix?: string
  mdc?: boolean
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name,
    version,
    doc: 'https://rymcu.com',
    configKey: 'rymcu',
    compatibility: {
      nuxt: '>=3.16.0'
    }
  },
  defaults: {
    prefix: 'R',
    mdc: false
  },
  async setup(options, nuxt) {
    nuxt.options.appConfig.ui = defu(nuxt.options.appConfig.ui || {}, { icons })
    if (!hasNuxtModule('@nuxt/ui')) await installModule('@nuxt/ui')
    const { resolve } = createResolver(import.meta.url)
    nuxt.options.alias['#rymcu'] = resolve('./runtime')
    nuxt.options.appConfig.rymcu = defu(nuxt.options.appConfig.rymcu || {}, {})
    nuxt.options.router.options.scrollBehaviorType = 'smooth'
    addComponentsDir({
      path: resolve('./runtime/components'),
      pathPrefix: false,
      prefix: options.prefix || 'R'
    })
    addTemplates(options, nuxt)
  }
})
