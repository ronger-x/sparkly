<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import { getPaginationRowModel } from '@tanstack/table-core'
import type { Dict, DictInfo, DictType, PageInfo } from '~/types'

const { t } = useI18n()

const UButton = resolveComponent('UButton')
const UBadge = resolveComponent('UBadge')
const UButtonGroup = resolveComponent('UButtonGroup')
const UCheckbox = resolveComponent('UCheckbox')
const table = useTemplateRef('table')

const columnFilters = ref([{
  id: 'label',
  value: ''
}])
const columnVisibility = ref()
const rowSelection = ref()

const dictType = reactive<Partial<DictType>>({
  label: undefined,
  id: undefined,
  description: undefined,
  typeCode: undefined
})

let page = reactive<Partial<PageInfo<Dict>>>({
  records: undefined
})

const loadStatus = ref()

const loadData = async () => {
  const { data, status } = await useAuthFetch<PageInfo<Dict>>('/admin/dict/list', {
    lazy: true,
    params: {
      dictTypeCode: dictType.typeCode
    }
  })
  page = data.value?.data || { records: [] }
  loadStatus.value = status
  rowSelection.value = []
}

const props = withDefaults(defineProps<{
  visible?: number
  item?: DictType
  time?: number
}>(), {
  visible: 0,
  item: null
})

const openModal = ref(false)

const editModal = ref({
  item: null,
  time: new Date().getTime()
})

const columns: TableColumn<Dict>[] = [
  {
    id: 'select',
    header: ({ table }) =>
      h(UCheckbox, {
        'modelValue': table.getIsSomePageRowsSelected()
          ? 'indeterminate'
          : table.getIsAllPageRowsSelected(),
        'onUpdate:modelValue': (value: boolean | 'indeterminate') =>
          table.toggleAllPageRowsSelected(!!value),
        'ariaLabel': 'Select all'
      }),
    cell: ({ row }) =>
      h(UCheckbox, {
        'modelValue': row.getIsSelected(),
        'onUpdate:modelValue': (value: boolean | 'indeterminate') => row.toggleSelected(!!value),
        'ariaLabel': 'Select row'
      })
  },
  {
    accessorKey: 'label',
    header: t('Label')
  },
  {
    accessorKey: 'typeCode',
    header: t('Code'),
    cell: ({ row }) => row.original.value
  },
  {
    accessorKey: 'status',
    header: t('Status'),
    filterFn: (row, column, filterValue) => {
      const status = row.original.status as DictInfo
      return status.value === filterValue
    },
    cell: ({ row }) => {
      return h(UBadge, { class: 'capitalize', variant: 'subtle' }, () =>
        typeof row.original.status === 'string'
          ? row.original.status
          : row.original.status?.label
      )
    }
  },
  {
    accessorKey: 'createdTime',
    header: t('CreatedTime')
  },
  {
    id: 'actions',
    header: t('Actions'),
    cell: ({ row }) => {
      return h(
        'div',
        h(
          UButtonGroup,
          {
            content: {
              align: 'end'
            }
          },
          () =>
            [
              h(UButton, {
                icon: 'i-lucide-square-pen',
                color: 'neutral',
                variant: 'ghost',
                class: 'ml-auto',
                label: t('Edit'),
                onClick: () => {
                  editModal.value = {
                    item: row.original,
                    time: new Date().getTime()
                  }
                }
              })
            ]
        )
      )
    }
  }
]

watch(() => props.item, (item) => {
  if (item) {
    dictType.id = props.item.id
    dictType.label = props.item.label
    dictType.typeCode = props.item.typeCode
    dictType.description = props.item.description || props.item.label
  }
})

watch(() => props.time, (item) => {
  if (item) {
    openModal.value = true
  }
  if (props.item) {
    dictType.id = props.item.id
    dictType.label = props.item.label
    dictType.typeCode = props.item.typeCode
    dictType.description = props.item.description || props.item.label
  }
  loadData()
})

const pagination = ref({
  pageIndex: 0,
  pageSize: 10
})
</script>

<template>
  <UDrawer
    v-model:open="openModal"
    :title="dictType.label"
    :description="dictType.description"
    direction="right"
    :ui="{ container: 'max-w-xl mx-auto' }"
  >
    <template #content>
      <UDashboardPanel id="dictItems">
        <template #header>
          <UDashboardNavbar :title="dictType.label">
            <template #right>
              <DictionariesAddModal :dict-type-code="dictType.typeCode" @success="loadData" />
              <DictionariesEditModal :item="editModal.item" :time="editModal.time" @success="loadData" />
            </template>
          </UDashboardNavbar>
        </template>

        <template #body>
          <UTable
            ref="table"
            v-model:column-filters="columnFilters"
            v-model:column-visibility="columnVisibility"
            v-model:row-selection="rowSelection"
            v-model:pagination="pagination"
            :pagination-options="{
              getPaginationRowModel: getPaginationRowModel()
            }"
            class="shrink-0"
            :data="page.records"
            :columns="columns"
            :loading="loadStatus === 'pending'"
            :ui="{
              base: 'table-fixed border-separate border-spacing-0',
              thead: '[&>tr]:bg-(--ui-bg-elevated)/50 [&>tr]:after:content-none',
              tbody: '[&>tr]:last:[&>td]:border-b-0',
              th: 'py-1 first:rounded-l-[calc(var(--ui-radius)*2)] last:rounded-r-[calc(var(--ui-radius)*2)] border-y border-(--ui-border) first:border-l last:border-r',
              td: 'border-b border-(--ui-border)'
            }"
          />

          <div class="flex items-center justify-between gap-3 border-t border-(--ui-border) pt-4 mt-auto">
            <div class="text-sm text-(--ui-text-muted)">
              {{ table?.tableApi?.getFilteredSelectedRowModel().rows.length || 0 }} of
              {{ table?.tableApi?.getFilteredRowModel().rows.length || 0 }} row(s) selected.
            </div>

            <div class="flex items-center gap-1.5">
              <UPagination
                :default-page="(table?.tableApi?.getState().pagination.pageIndex || 0) + 1"
                :items-per-page="table?.tableApi?.getState().pagination.pageSize"
                :total="table?.tableApi?.getFilteredRowModel().rows.length"
                @update:page="(p) => table?.tableApi?.setPageIndex(p - 1)"
              />
            </div>
          </div>
        </template>
      </UDashboardPanel>
    </template>
  </UDrawer>
</template>

<style scoped>

</style>
