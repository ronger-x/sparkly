<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import { upperFirst } from 'scule'
import { getPaginationRowModel, type Row } from '@tanstack/table-core'
import type { DictInfo, DictType, PageInfo } from '~/types'

const { t } = useI18n()

const UButton = resolveComponent('UButton')
const UBadge = resolveComponent('UBadge')
const UButtonGroup = resolveComponent('UButtonGroup')
const UCheckbox = resolveComponent('UCheckbox')

const toast = useToast()
const table = useTemplateRef('table')

const columnFilters = ref([{
  id: 'label',
  value: ''
}])
const columnVisibility = ref()
const rowSelection = ref()

const StatusOptions = [
  { label: 'All', value: 'all' },
  { label: 'Disabled', value: '0' },
  { label: 'Enabled', value: '1' }
]

const { data, status } = await useAuthFetch<PageInfo<DictType>>('/admin/dict-type/list', {
  lazy: true
})

const page = computed(() => {
  return data.value?.data || { records: [] }
})

const columns: TableColumn<DictType>[] = [
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
    cell: ({ row }) => row.original.typeCode
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
                  console.log(row.original)
                }
              }),
              h(UButton, {
                icon: 'i-lucide-wrench',
                color: 'neutral',
                variant: 'ghost',
                class: 'ml-auto',
                label: t('Config'),
                onClick: () => {
                  console.log(row.original)
                }
              })
            ]
        )
      )
    }
  }
]

const statusFilter = ref('all')

watch(() => statusFilter.value, (newVal) => {
  if (!table?.value?.tableApi) return

  const statusColumn = table.value.tableApi.getColumn('status')
  if (!statusColumn) return

  if (newVal === 'all') {
    statusColumn.setFilterValue(undefined)
  } else {
    statusColumn.setFilterValue(newVal)
  }
})

const pagination = ref({
  pageIndex: 0,
  pageSize: 10
})
</script>

<template>
  <UDashboardPanel id="dictionaries">
    <template #header>
      <UDashboardNavbar :title="t('Dictionaries')">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>

        <template #right>
          <DictionariesTypeAddModal />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="flex flex-wrap items-center justify-between gap-1.5">
        <UInput
          :model-value="(table?.tableApi?.getColumn('label')?.getFilterValue() as string)"
          class="max-w-sm"
          icon="i-lucide-search"
          :placeholder="t('FilterLabels')"
          @update:model-value="table?.tableApi?.getColumn('label')?.setFilterValue($event)"
        />

        <div class="flex flex-wrap items-center gap-1.5">
          <DictionariesTypeDeleteModal :count="table?.tableApi?.getFilteredSelectedRowModel().rows.length" :items="table?.tableApi?.getFilteredSelectedRowModel().rows">
            <UButton
              v-if="table?.tableApi?.getFilteredSelectedRowModel().rows.length"
              :label="t('Delete')"
              color="error"
              variant="subtle"
              icon="i-lucide-trash"
            >
              <template #trailing>
                <UKbd>
                  {{ table?.tableApi?.getFilteredSelectedRowModel().rows.length }}
                </UKbd>
              </template>
            </UButton>
          </DictionariesTypeDeleteModal>

          <USelect
            v-model="statusFilter"
            :items="StatusOptions"
            :ui="{ trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-200' }"
            :placeholder="t('FilterStatus')"
            class="min-w-28"
          />
          <UDropdownMenu
            :items="
              table?.tableApi
                ?.getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => ({
                  label: upperFirst(column.id),
                  type: 'checkbox' as const,
                  checked: column.getIsVisible(),
                  onUpdateChecked(checked: boolean) {
                    table?.tableApi?.getColumn(column.id)?.toggleVisibility(!!checked)
                  },
                  onSelect(e?: Event) {
                    e?.preventDefault()
                  }
                }))
            "
            :content="{ align: 'end' }"
          >
            <UButton
              label="Display"
              color="neutral"
              variant="outline"
              trailing-icon="i-lucide-settings-2"
            />
          </UDropdownMenu>
        </div>
      </div>

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
        :loading="status === 'pending'"
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
