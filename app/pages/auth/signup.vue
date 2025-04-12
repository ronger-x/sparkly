<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

const { t } = useI18n()

definePageMeta({
  layout: 'auth',
  auth: {
    unauthenticatedOnly: true
  }
})

useSeoMeta({
  title: 'Sign up'
})

const toast = useToast()

const fields = [{
  name: 'nickname',
  type: 'text' as const,
  label: t('Nickname'),
  placeholder: t('NicknamePlaceholder')
}, {
  name: 'email',
  type: 'text' as const,
  label: t('Email'),
  placeholder: t('EmailPlaceholder')
}, {
  name: 'password',
  label: t('Password'),
  type: 'password' as const,
  placeholder: t('PasswordPlaceholder')
}]

const providers = [{
  label: 'Google',
  icon: 'i-simple-icons-google',
  onClick: () => {
    toast.add({ title: 'Google', description: 'Login with Google' })
  }
}, {
  label: 'GitHub',
  icon: 'i-simple-icons-github',
  onClick: () => {
    toast.add({ title: 'GitHub', description: 'Login with GitHub' })
  }
}]

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Must be at least 8 characters')
})

type Schema = z.output<typeof schema>

function onSubmit(payload: FormSubmitEvent<Schema>) {
  console.log('Submitted', payload)
}
</script>

<template>
  <UAuthForm
    :fields="fields"
    :schema="schema"
    :providers="providers"
    :title="t('CreateAnAccount')"
    :submit="{ label: t('CreateAccount') }"
    @submit="onSubmit"
  >
    <template #description>
      {{ t('AlreadyHaveAnAccount') }}? <ULink
        to="/auth/login"
        class="text-primary-500 font-medium"
      >{{ t('Login') }}</ULink>.
    </template>

    <template #footer>
      {{ t('SignUp') }}{{ t('TermsOfServiceTips') }} <ULink
        to="/public"
        class="text-primary-500 font-medium"
      >{{ t('TermsOfService') }}</ULink>
    </template>
  </UAuthForm>
</template>
