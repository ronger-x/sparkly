<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

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
  label: 'Email',
  placeholder: 'Enter your email',
  required: true
}, {
  name: 'password',
  label: 'Password',
  type: 'password' as const,
  placeholder: 'Enter your password'
}, {
  name: 'remember',
  label: 'Remember me',
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
  account: z.string().email('Invalid email'),
  password: z.string().min(8, 'Must be at least 8 characters')
})

type Schema = z.output<typeof schema>

async function onSubmit(payload: FormSubmitEvent<Schema>) {
  const { account, password } = payload.data
  try {
    await signIn({ account, password }, { callbackUrl: useRoute().query.redirect as string ?? '/', external: true })
  } catch (error) {
    console.error(error)
    toast.add({ title: 'Login failed', description: 'Invalid credentials' })
  }
}
</script>

<template>
  <UAuthForm
    :fields="fields"
    :schema="schema"
    :providers="providers"
    title="Welcome back"
    icon="i-lucide-lock"
    @submit="onSubmit"
  >
    <template #description>
      Don't have an account? <ULink
        to="/auth/signup"
        class="text-primary-500 font-medium"
      >Sign up</ULink>.
    </template>

    <template #password-hint>
      <ULink
        to="/auth/forgot-password"
        class="text-primary-500 font-medium"
      >Forgot password?</ULink>
    </template>

    <template #footer>
      By signing in, you agree to our <ULink
        to="/public"
        class="text-primary-500 font-medium"
      >Terms of Service</ULink>.
    </template>
  </UAuthForm>
</template>
