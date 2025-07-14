import { kebabCase } from 'scule'
import { addTemplate, addTypeTemplate } from '@nuxt/kit'
import type { Nuxt, NuxtTemplate, NuxtTypeTemplate, NuxtOptions } from '@nuxt/schema'
import type { ModuleOptions } from './module'
import * as theme from './theme'

export function getTemplates(options: ModuleOptions, uiOptions: NuxtOptions['ui']) {
  const templates: NuxtTemplate[] = []

  function writeThemeTemplate(theme: Record<string, any>, path?: string) {
    for (const component in theme) {
      templates.push({
        filename: `rymcu/${path ? path + '/' : ''}${kebabCase(component)}.ts`,
        write: true,
        getContents: async () => {
          const template = (theme as any)[component]
          const result = typeof template === 'function' ? template(uiOptions) : template

          const variants = Object.entries(result.variants || {})
            .filter(([_, values]) => {
              const keys = Object.keys(values as Record<string, unknown>)
              return keys.some(key => key !== 'true' && key !== 'false')
            })
            .map(([key]) => key)

          let json = JSON.stringify(result, null, 2)

          for (const variant of variants) {
            json = json.replace(new RegExp(`("${variant}": "[^"]+")`, 'g'), `$1 as typeof ${variant}[number]`)
            json = json.replace(new RegExp(`("${variant}": \\[\\s*)((?:"[^"]+",?\\s*)+)(\\])`, 'g'), (_, before, match, after) => {
              const replaced = match.replace(/("[^"]+")/g, `$1 as typeof ${variant}[number]`)
              return `${before}${replaced}${after}`
            })
          }

          function generateVariantDeclarations(variants: string[]) {
            return variants.filter(variant => json.includes(`as typeof ${variant}`)).map((variant) => {
              const keys = Object.keys(result.variants[variant])
              return `const ${variant} = ${JSON.stringify(keys, null, 2)} as const`
            })
          }

          // For production build
          return [
            ...generateVariantDeclarations(variants),
            `export default ${json}`
          ].join('\n\n')
        }
      })
    }
  }

  writeThemeTemplate(theme)

  templates.push({
    filename: 'rymcu.css',
    write: true,
    getContents: () => `@source "./rymcu";`
  })

  templates.push({
    filename: 'rymcu/index.ts',
    write: true,
    getContents: () => {
      const contents = Object.keys(theme).map(component => `export { default as ${component} } from './${kebabCase(component)}'`).join('\n')
      return contents
    }
  })

  templates.push({
    filename: 'types/rymcu.d.ts',
    getContents: () => `import * as rymcu from '#build/rymcu'
import type { TVConfig } from '@nuxt/ui'

type AppConfigrymcu = TVConfig<typeof rymcu>

declare module '@nuxt/schema' {
  interface AppConfigInput {
    rymcu?: AppConfigrymcu
  }
}

export {}
`
  })

  return templates
}

export function addTemplates(options: ModuleOptions, nuxt: Nuxt) {
  const templates = getTemplates(options, nuxt.options.ui)
  for (const template of templates) {
    if (template.filename!.endsWith('.d.ts')) {
      addTypeTemplate(template as NuxtTypeTemplate)
    } else {
      addTemplate(template)
    }
  }
}
