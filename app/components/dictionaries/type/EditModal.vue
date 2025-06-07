<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'
import type { DictType } from '~/types'

const { t } = useI18n()

const emits = defineEmits(['success'])

const schema = z.object({
  label: z.string().min(2, 'Too short'),
  typeCode: z.string(),
  sortNo: z.number()
})

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  label: undefined,
  typeCode: undefined,
  sortNo: undefined
})

const props = withDefaults(defineProps<{
  visible?: number
  item?: DictType
  time?: number
}>(), {
  visible: 0,
  item: null
})

const openModal = ref(false)

watch(() => props.item, (item) => {
  if (item) {
    state.label = item.label
    state.typeCode = item.typeCode
    state.sortNo = item.sortNo
  }
})

watch(() => props.time, (item) => {
  if (item) {
    openModal.value = true
  }
})

const toast = useToast()

async function onSubmit(event: FormSubmitEvent<Schema>) {
  const body = {
    ...event.data,
    id: props.item?.id
  }
  const { data, status } = await useAuthFetch('/admin/dict-type/post', {
    method: 'PUT',
    body: body
  })
  if (status.value === 'success' && data.value.data) {
    toast.add({ title: 'Success', description: `${t('UpdateDictType')} ${event.data.label} ${t('Success')}`, color: 'success' })
    openModal.value = false
    emits('success')
  }
}
</script>

<template>
  <UModal v-model:open="openModal" :title="t('UpdateDictType')" :description="t('UpdateDictType')">
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
          <UInputNumber v-model="state.sortNo" class="w-full" />
        </UFormField>
        <div class="flex justify-end gap-2">
          <UButton
            :label="t('Cancel')"
            color="neutral"
            variant="subtle"
            @click="openModal = false"
          />
          <UButton
            :label="t('Update')"
            color="primary"
            variant="solid"
            type="submit"
          />
        </div>
      </UForm>
    </template>
  </UModal>
</template>
