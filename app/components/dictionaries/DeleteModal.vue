<script setup lang="ts">
import type { Row } from '@tanstack/table-core'
import type { Dict } from '~/types'

const props = withDefaults(defineProps<{
  count?: number
  items?: Row<Dict>[]
}>(), {
  count: 0,
  items: null
})

const { t } = useI18n()

const open = ref(false)

async function onSubmit() {
  const { data, status } = await useAuthFetch('/admin/dict/batch-update-del-flag', {
    method: 'PATCH',
    body: {
      ids: props.items?.map(item => item.original.id)
    }
  })
  if (status.value === 'success' && data.value.data) {
    open.value = false
  }
}
</script>

<template>
  <UModal
    v-model:open="open"
    :title="`${t('Delete')} ${count} ${t('Dict')}`"
    :description="t('DeleteTips')"
  >
    <slot />

    <template #body>
      <div class="flex justify-end gap-2">
        <UButton
          label="Cancel"
          color="neutral"
          variant="subtle"
          @click="open = false"
        />
        <UButton
          label="Delete"
          color="error"
          variant="solid"
          loading-auto
          @click="onSubmit"
        />
      </div>
    </template>
  </UModal>
</template>
