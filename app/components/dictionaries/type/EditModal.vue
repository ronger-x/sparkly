<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

const { t } = useI18n()

const schema = z.object({
  label: z.string().min(2, 'Too short'),
  typeCode: z.string(),
  sortNo: z.number()
})
const open = ref(false)

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  label: undefined,
  typeCode: undefined,
  sortNo: undefined
})

const toast = useToast()
async function onSubmit(event: FormSubmitEvent<Schema>) {
  toast.add({ title: 'Success', description: `${t('UpdateDictType')} ${event.data.label} ${t('Success')}`, color: 'success' })
  open.value = false
}
</script>

<template>
  <UModal v-model:open="open" :title="t('UpdateDictType')" :description="t('UpdateDictType')">
    <UButton :label="t('UpdateDictType')" icon="i-lucide-plus" />

    <template #body>
      <UForm
        :schema="schema"
        :state="state"
        class="space-y-4"
        @submit="onSubmit"
      >
        <UFormField :label="t('Label')" :placeholder="t('Status')" name="label">
          <UInput v-model="state.label" class="w-full" />
        </UFormField>
        <UFormField :label="t('Code')" placeholder="1" name="typeCode">
          <UInput v-model="state.typeCode" class="w-full" />
        </UFormField>
        <UFormField :label="t('SortNo')" placeholder="50" name="sortNo">
          <UInput v-model="state.sortNo" class="w-full" />
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
