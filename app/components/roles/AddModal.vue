<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

const { t } = useI18n()

const emits = defineEmits(['success'])

const schema = z.object({
  label: z.string().min(2, 'Too short'),
  permission: z.string().min(2, 'Too short')
})
const open = ref(false)

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  label: undefined,
  permission: undefined
})

const toast = useToast()
async function onSubmit(event: FormSubmitEvent<Schema>) {
  const { data, status } = await useAuthFetch('/admin/role/post', {
    method: 'POST',
    body: event.data
  })
  if (status.value === 'success' && data.value.data) {
    toast.add({ title: 'Success', description: `${t('NewRole')} ${event.data.label} ${t('Success')}`, color: 'success' })
    open.value = false
    emits('success')
  }
}
</script>

<template>
  <UModal v-model:open="open" :title="t('NewRole')" :description="t('AddNewRole')">
    <UButton :label="t('NewRole')" icon="i-lucide-plus" />

    <template #body>
      <UForm
        :schema="schema"
        :state="state"
        class="space-y-4"
        @submit="onSubmit"
      >
        <UFormField :label="t('Label')" placeholder="User" name="label">
          <UInput v-model="state.label" class="w-full" />
        </UFormField>
        <UFormField :label="t('Permission')" placeholder="User" name="permission">
          <UInput v-model="state.permission" class="w-full" />
        </UFormField>
        <div class="flex justify-end gap-2">
          <UButton
            :label="t('Cancel')"
            color="neutral"
            variant="subtle"
            @click="open = false"
          />
          <UButton
            :label="t('Create')"
            color="primary"
            variant="solid"
            type="submit"
          />
        </div>
      </UForm>
    </template>
  </UModal>
</template>
