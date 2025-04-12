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
  title: 'Login'
})

const toast = useToast()

const fields = [{
  name: 'account',
  type: 'text' as const,
  label: t('Email'),
  placeholder: t('EmailPlaceholder'),
  required: true
}, {
  name: 'password',
  label: t('Password'),
  type: 'password' as const,
  placeholder: t('PasswordPlaceholder'),
  required: true
}, {
  name: 'remember',
  label: t('RememberMe'),
  type: 'checkbox' as const
}]

const providers = [{
  label: 'Open ID Connect',
  icon: 'i-simple-icons-openid',
  onClick: () => {
    window.location.href = '/api/oauth2/authorization/logto'
  }
}]

const { signIn } = useAuth()

const schema = z.object({
  account: z.string().email(t('InvalidEmail')),
  password: z.string().min(8, t('PasswordTooShort'))
})

type Schema = z.output<typeof schema>

async function onSubmit(payload: FormSubmitEvent<Schema>) {
  const { account, password } = payload.data
  try {
    await signIn({ account, password }, { callbackUrl: useRoute().query.redirect as string ?? '/', external: true })
  } catch (error) {
    console.error(error)
    toast.add({ title: t('LoginFailed'), description: t('InvalidCredentials') })
  }
}
</script>

<template>
  <UAuthForm
    :fields="fields"
    :schema="schema"
    :providers="providers"
    :title="t('WelcomeBack')"
    icon="i-lucide-lock"
    :submit="{ label: t('Login') }"
    @submit="onSubmit"
  >
    <template #description>
      {{ t('DontHaveAnAccount') }}? <ULink
        to="/auth/signup"
        class="text-primary-500 font-medium"
      >{{ t('SignUp') }}</ULink>
    </template>

    <template #password-hint>
      <ULink
        to="/auth/forgot-password"
        class="text-primary-500 font-medium"
      >{{ t('ForgotPassword') }}?</ULink>
    </template>

    <template #footer>
      {{ t('Login') }}{{ t('TermsOfServiceTips') }} <ULink
        to="/public"
        class="text-primary-500 font-medium"
      >{{ t('TermsOfService') }}</ULink>
    </template>
  </UAuthForm>
</template>
