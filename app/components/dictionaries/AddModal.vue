<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

const { t } = useI18n()

const emits = defineEmits(['success'])

const props = withDefaults(defineProps<{
  visible?: number
  dictTypeCode: string
  time?: number
}>(), {
  visible: 0,
  item: null
})

const schema = z.object({
  label: z.string().min(2, 'Too short'),
  value: z.string(),
  dictTypeCode: z.string(),
  color: z.string(),
  icon: z.string(),
  image: z.string(),
  sortNo: z.number()
})
const open = ref(false)

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  label: undefined,
  value: undefined,
  dictTypeCode: props.dictTypeCode,
  color: '#49E32B',
  icon: '',
  image: '',
  sortNo: 50
})

const chip = computed(() => ({ backgroundColor: state.color }))

const toast = useToast()
async function onSubmit(event: FormSubmitEvent<Schema>) {
  const { data, status } = await useAuthFetch('/admin/dict/post', {
    method: 'POST',
    body: event.data
  })
  if (status.value === 'success' && data.value.data) {
    toast.add({ title: 'Success', description: `${t('NewDict')} ${event.data.label} ${t('Success')}`, color: 'success' })
    open.value = false
    emits('success')
  }
}
</script>

<template>
  <UModal v-model:open="open" :title="t('NewDict')" :description="t('AddNewDict')">
    <UButton :label="t('NewDict')" icon="i-lucide-plus" />

    <template #body>
      <UForm
        :schema="schema"
        :state="state"
        class="space-y-4"
        @submit="onSubmit"
      >
        <UFormField :label="t('Code')" :placeholder="t('Enabled')" name="dictTypeCode">
          <UInput v-model="state.dictTypeCode" class="w-full" disabled />
        </UFormField>
        <UFormField :label="t('Label')" :placeholder="t('Enabled')" name="label">
          <UInput v-model="state.label" class="w-full" />
        </UFormField>
        <UFormField :label="t('Value')" placeholder="1" name="value">
          <UInput v-model="state.value" class="w-full" />
        </UFormField>
        <UFormField :label="t('Color')" placeholder="#FFFFFF" name="color">
          <UPopover>
            <UButton :label="state.color" color="neutral" variant="outline">
              <template #leading>
                <span :style="chip" class="size-3 rounded-full" />
              </template>
            </UButton>

            <template #content>
              <UColorPicker v-model="state.color" class="p-2" />
            </template>
          </UPopover>
        </UFormField>
        <UFormField :label="t('SortNo')" placeholder="50" name="sortNo">
          <UInputNumber v-model="state.sortNo" class="w-full" />
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
