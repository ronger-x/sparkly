<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'
import { useAuthFetch } from '~/composables/useAuthFetch'

definePageMeta({
  layout: 'auth',
  auth: {
    unauthenticatedOnly: true
  }
})

useSeoMeta({
  title: 'Forgot password'
})

const toast = useToast()

const fields = [{
  name: 'email',
  type: 'text' as const,
  label: 'Email',
  placeholder: 'Enter your email',
  required: true
}]

const schema = z.object({
  email: z.string().email('Invalid email')
})

type Schema = z.output<typeof schema>

function onSubmit(payload: FormSubmitEvent<Schema>) {
  const { email } = payload.data
  console.log('Submitted', payload)
  useAuthFetch('/auth/password/request', {
    method: 'get',
    params: { email }
  }).then(() => {
    toast.add({ title: 'Success', description: 'Password reset email sent' })
  })
}
</script>

<template>
  <UAuthForm
    :fields="fields"
    :schema="schema"
    title="Forgot password"
    icon="i-lucide-lock"
    @submit="onSubmit"
  >
    <template #description>
      Don't have an account? <ULink
        to="/auth/signup"
        class="text-primary-500 font-medium"
      >Sign up</ULink>.
    </template>
  </UAuthForm>
</template>

<style scoped>

</style>
