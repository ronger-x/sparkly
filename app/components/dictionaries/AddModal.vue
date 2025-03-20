<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

const schema = z.object({
  label: z.string().min(2, 'Too short'),
  value: z.string(),
  sortNo: z.number()
})
const open = ref(false)

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  label: undefined,
  value: undefined,
  sortNo: undefined
})

const toast = useToast()
async function onSubmit(event: FormSubmitEvent<Schema>) {
  toast.add({ title: 'Success', description: `New dict ${event.data.label} added`, color: 'success' })
  open.value = false
}
</script>

<template>
  <UModal v-model:open="open" title="New dict" description="Add a new dict to the database">
    <UButton label="New dict" icon="i-lucide-plus" />

    <template #body>
      <UForm
        :schema="schema"
        :state="state"
        class="space-y-4"
        @submit="onSubmit"
      >
        <UFormField label="Label" placeholder="Enabled" name="label">
          <UInput v-model="state.label" class="w-full" />
        </UFormField>
        <UFormField label="Value" placeholder="1" name="value">
          <UInput v-model="state.value" class="w-full" />
        </UFormField>
        <UFormField label="SortNo" placeholder="1" name="sortNo">
          <UInput v-model="state.sortNo" class="w-full" />
        </UFormField>
        <div class="flex justify-end gap-2">
          <UButton
            label="Cancel"
            color="neutral"
            variant="subtle"
            @click="open = false"
          />
          <UButton
            label="Create"
            color="primary"
            variant="solid"
            type="submit"
          />
        </div>
      </UForm>
    </template>
  </UModal>
</template>
