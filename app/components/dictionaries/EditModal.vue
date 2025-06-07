<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'
import type { Dict } from '~/types'

const { t } = useI18n()

const emits = defineEmits(['success'])

const schema = z.object({
  label: z.string().min(2, 'Too short'),
  value: z.string(),
  dictTypeCode: z.string(),
  color: z.string(),
  icon: z.string(),
  image: z.string(),
  sortNo: z.number()
})

const props = withDefaults(defineProps<{
  visible?: number
  item?: Dict
  time?: number
}>(), {
  visible: 0,
  item: null
})

const chip = computed(() => ({ backgroundColor: state.color }))

const openModal = ref(false)

watch(() => props.item, (item) => {
  if (item) {
    state.label = item.label
    state.value = item.value
    state.dictTypeCode = item.dictTypeCode
    state.color = item.color
    state.icon = item.icon
    state.image = item.image
    state.sortNo = item.sortNo
  }
})

watch(() => props.time, (item) => {
  if (item) {
    openModal.value = true
  }
})

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  label: undefined,
  value: undefined,
  color: undefined,
  icon: undefined,
  image: undefined,
  sortNo: undefined
})

const toast = useToast()
async function onSubmit(event: FormSubmitEvent<Schema>) {
  const body = {
    ...event.data,
    id: props.item?.id
  }
  const { data, status } = await useAuthFetch('/admin/dict/post', {
    method: 'PUT',
    body: body
  })
  if (status.value === 'success' && data.value.data) {
    toast.add({ title: 'Success', description: `${t('UpdateDict')} ${event.data.label} ${t('Success')}`, color: 'success' })
    openModal.value = false
    emits('success')
  }
}
</script>

<template>
  <UModal v-model:open="openModal" :title="t('UpdateDict')" :description="t('UpdateDictDescription')">
    <template #body>
      <UForm
        :schema="schema"
        :state="state"
        class="space-y-4"
        @submit="onSubmit"
      >
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
            label="Cancel"
            color="neutral"
            variant="subtle"
            @click="openModal = false"
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
