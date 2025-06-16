<!-- eslint-disable import/first -->
<!-- eslint-disable import/order -->
<!-- eslint-disable vue/block-tag-newline -->
<script lang="ts">
import type { TreeRootProps, TreeRootEmits } from 'reka-ui'
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/rymcu/check-tree'
import type { DynamicSlots, GetItemKeys, GetModelValue, GetModelValueEmits, NestedItem } from '../types/utils'
import type { ComponentConfig } from '../types/tv'

type CheckTree = ComponentConfig<typeof theme, AppConfig, 'checkTree', 'rymcu'>

export type CheckTreeItem = {
  /** checkbox  */
  checked?: boolean | 'indeterminate'
  /**
   * @IconifyIcon
   */
  icon?: string
  label?: string
  key: string
  /**
   * @IconifyIcon
   */
  trailingIcon?: string
  defaultExpanded?: boolean
  disabled?: boolean
  value?: string
  slot?: string
  children?: CheckTreeItem[]
  onToggle?(e: Event): void
  onSelect?(e?: Event): void
  class?: any
  ui?: Pick<CheckTree['slots'], 'item' | 'itemWithChildren' | 'link' | 'linkLeadingIcon' | 'linkLabel' | 'linkTrailing' | 'linkTrailingIcon' | 'listWithChildren'>
  [key: string]: any
}

export interface CheckTreeProps<T extends CheckTreeItem[] = CheckTreeItem[], VK extends GetItemKeys<T> = 'value', M extends boolean = false> extends Pick<TreeRootProps<T>, 'expanded' | 'defaultExpanded' | 'selectionBehavior' | 'propagateSelect' | 'disabled' | 'bubbleSelect'> {
  /**
   * The element or component this component should render as.
   * @defaultValue 'ul'
   */
  as?: any
  /**
   * @defaultValue 'primary'
   */
  color?: CheckTree['variants']['color']
  /**
   * @defaultValue 'md'
   */
  size?: CheckTree['variants']['size']
  /**
   * The key used to get the value from the item.
   * @defaultValue 'value'
   */
  valueKey?: VK
  /**
   * The key used to get the label from the item.
   * @defaultValue 'label'
   */
  labelKey?: keyof NestedItem<T>
  /**
   * The icon displayed on the right side of a parent node.
   * @defaultValue appConfig.ui.icons.chevronDown
   * @IconifyIcon
   */
  trailingIcon?: string
  /**
   * The icon displayed when a parent node is expanded.
   * @defaultValue appConfig.ui.icons.folderOpen
   * @IconifyIcon
   */
  expandedIcon?: string
  /**
   * The icon displayed when a parent node is collapsed.
   * @defaultValue appConfig.ui.icons.folder
   * @IconifyIcon
   */
  collapsedIcon?: string
  items?: T
  /** The controlled value of the Tree. Can be bind as `v-model`. */
  modelValue?: GetModelValue<T, VK, M>
  /** The value of the Tree when initially rendered. Use when you do not need to control the state of the Tree. */
  defaultValue?: GetModelValue<T, VK, M>
  /** Whether multiple options can be selected or not. */
  multiple?: M & boolean
  class?: any
  ui?: CheckTree['slots']
}

interface FoundItemWithPath {
  item: CheckTreeItem
  path: CheckTreeItem[]
}

export type TreeEmits<A extends CheckTreeItem[], VK extends GetItemKeys<A> | undefined, M extends boolean> = Omit<TreeRootEmits, 'update:modelValue'> & GetModelValueEmits<A, VK, M> & {
  'update:checkedKeys': [keys: string[]]
}

type SlotProps<T extends CheckTreeItem> = (props: { item: T, index: number, level: number, expanded: boolean, selected: boolean }) => any

export type TreeSlots<
  A extends CheckTreeItem[] = CheckTreeItem[],
  T extends NestedItem<A> = NestedItem<A>
> = {
  'item': SlotProps<T>
  'item-leading': SlotProps<T>
  'item-label': SlotProps<T>
  'item-trailing': SlotProps<T>
} & DynamicSlots<T, undefined, { index: number, level: number, expanded: boolean, selected: boolean }>

</script>

<!-- eslint-disable import/first -->
<!-- eslint-disable import/order -->
<!-- eslint-disable vue/block-tag-newline -->
<script setup lang="ts" generic="T extends CheckTreeItem[], VK extends GetItemKeys<T> = 'value', M extends boolean = false">
import { computed } from 'vue'
import { TreeRoot, TreeItem, useForwardPropsEmits } from 'reka-ui'
import { reactivePick, createReusableTemplate } from '@vueuse/core'
import { useAppConfig } from '#imports'
import { get } from '../utils'
import { tv } from '../utils/tv'
import UIcon from '@nuxt/ui/components/Icon.vue'
import UCheckbox from '@nuxt/ui/components/Checkbox.vue'

const props = withDefaults(defineProps<CheckTreeProps<T, VK, M>>(), {
  labelKey: 'label' as never,
  valueKey: 'value' as never
})
const emits = defineEmits<TreeEmits<T, VK, M>>()
const slots = defineSlots<TreeSlots<T>>()

const appConfig = useAppConfig() as CheckTree['AppConfig']

const rootProps = useForwardPropsEmits(reactivePick(props, 'as', 'modelValue', 'defaultValue', 'items', 'multiple', 'expanded', 'disabled', 'propagateSelect', 'bubbleSelect'), emits)

const [DefineTreeTemplate, ReuseTreeTemplate] = createReusableTemplate<{ items?: CheckTreeItem[], level: number }, TreeSlots<T>>()

const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.rymcu?.checkTree || {}) })({
  color: props.color,
  size: props.size
}))

function getItemLabel<Item extends CheckTreeItem = NestedItem<T>>(item: Item): string {
  return get(item, props.labelKey as string)
}

function getItemValue(item: NestedItem<T>): string {
  return get(item, props.valueKey as string) ?? get(item, props.labelKey as string)
}

function getDefaultOpenedItems(item: NestedItem<T>): string[] {
  const currentItem = item.defaultExpanded ? getItemValue(item) : null
  const childItems = item.children?.flatMap((child: CheckTreeItem) => getDefaultOpenedItems(child as NestedItem<T>)) ?? []

  return [currentItem, ...childItems].filter(Boolean) as string[]
}

function findItemAndPath(
  key: string,
  currentItems: CheckTreeItem[] | undefined,
  currentPath: CheckTreeItem[] = []
): FoundItemWithPath | null {
  if (!currentItems) return null
  for (const item of currentItems) {
    if (item.key === key) {
      return { item, path: currentPath }
    }
    if (item.children) {
      const found = findItemAndPath(key, item.children, [...currentPath, item])
      if (found) return found
    }
  }
  return null
}

function setChildrenCheckedStateRecursive(children: CheckTreeItem[] | undefined, state: boolean) {
  if (!children) return
  for (const child of children) {
    child.checked = state
    if (child.children) {
      setChildrenCheckedStateRecursive(child.children, state)
    }
  }
}

function calculateParentCheckedState(children: CheckTreeItem[] | undefined): boolean | 'indeterminate' {
  if (!children || children.length === 0) {
    return false
  }

  let allChildrenTrue = true
  let someChildrenTrue = false
  let someChildrenIndeterminate = false

  for (const child of children) {
    if (child.checked === 'indeterminate') {
      someChildrenIndeterminate = true
      break
    }
    if (child.checked === true) {
      someChildrenTrue = true
    } else {
      allChildrenTrue = false
    }
  }

  if (someChildrenIndeterminate) {
    return 'indeterminate'
  }
  if (allChildrenTrue) {
    return true
  }
  if (someChildrenTrue) {
    return 'indeterminate'
  }
  return false
}

function getCheckedKeysRecursive(items: CheckTreeItem[] | undefined): string[] {
  if (!items) return []
  let keys: string[] = []
  for (const item of items) {
    if (item.checked === true) {
      keys.push(item.key)
    }
    if (item.children && item.children.length > 0) {
      keys = keys.concat(getCheckedKeysRecursive(item.children))
    }
  }
  return keys
}

function onCheckedChange(key: string) {
  const itemPathResult = findItemAndPath(key, props.items as CheckTreeItem[])
  if (!itemPathResult) {
    return
  }

  const { item: directlyChangedItem, path: parentPath } = itemPathResult

  if (typeof directlyChangedItem.checked === 'boolean') {
    setChildrenCheckedStateRecursive(directlyChangedItem.children, directlyChangedItem.checked)
  }

  for (let i = parentPath.length - 1; i >= 0; i--) {
    const parentItem = parentPath[i]
    if (parentItem && parentItem.children) {
      parentItem.checked = calculateParentCheckedState(parentItem.children)
    }
  }

  const allCheckedOrIndeterminateKeys = getCheckedKeysRecursive(props.items as CheckTreeItem[])
  emits('update:checkedKeys', allCheckedOrIndeterminateKeys)
}

const defaultExpanded = computed(() =>
  props.defaultExpanded ?? props.items?.flatMap(item => getDefaultOpenedItems(item as NestedItem<T>))
)
</script>

<!-- eslint-disable vue/no-template-shadow -->
<template>
  <ClientOnly>
    <DefineTreeTemplate v-slot="{ items, level }">
      <li
        v-for="(item, index) in items"
        :key="`${level}-${index}`"
        :class="level > 0 ? ui.itemWithChildren({ class: [props.ui?.itemWithChildren, item.ui?.itemWithChildren] }) : ui.item({ class: [props.ui?.item, item.ui?.item] })"
      >
        <TreeItem
          v-slot="{ isExpanded, isSelected }"
          as-child
          :level="level"
          :value="item"
          @toggle="item.onToggle"
          @select="item.onSelect"
        >
          <button
            :disabled="item.disabled || disabled"
            :class="ui.link({ class: [props.ui?.link, item.ui?.link, item.class], selected: isSelected, disabled: item.disabled || disabled })"
          >
            <UCheckbox
              :key="item.key"
              v-model="item.checked"
              @click.stop
              @update:model-value="onCheckedChange(item.key)"
            />
            <slot
              :name="((item.slot || 'item') as keyof TreeSlots<T>)"
              v-bind="{ index, level, expanded: isExpanded, selected: isSelected }"
              :item="(item as Extract<NestedItem<T>, { slot: string; }>)"
            >
              <slot
                :name="((item.slot ? `${item.slot}-leading` : 'item-leading') as keyof TreeSlots<T>)"
                v-bind="{ index, level, expanded: isExpanded, selected: isSelected }"
                :item="(item as Extract<NestedItem<T>, { slot: string; }>)"
              >
                <UIcon
                  v-if="item.icon"
                  :name="item.icon"
                  :class="ui.linkLeadingIcon({ class: [props.ui?.linkLeadingIcon, item.ui?.linkLeadingIcon] })"
                />
                <UIcon
                  v-else-if="item.children?.length"
                  :name="isExpanded ? (expandedIcon ?? appConfig.ui.icons.folderOpen) : (collapsedIcon ?? appConfig.ui.icons.folder)"
                  :class="ui.linkLeadingIcon({ class: [props.ui?.linkLeadingIcon, item.ui?.linkLeadingIcon] })"
                />
              </slot>

              <span
                v-if="getItemLabel(item) || !!slots[(item.slot ? `${item.slot}-label` : 'item-label') as keyof TreeSlots<T>]"
                :class="ui.linkLabel({ class: [props.ui?.linkLabel, item.ui?.linkLabel] })"
              >
                <slot
                  :name="((item.slot ? `${item.slot}-label` : 'item-label') as keyof TreeSlots<T>)"
                  v-bind="{ item, index, level, expanded: isExpanded, selected: isSelected }"
                  :item="(item as Extract<NestedItem<T>, { slot: string; }>)"
                >
                  {{ getItemLabel(item) }}
                </slot>
              </span>

              <span
                v-if="item.trailingIcon || item.children?.length || !!slots[(item.slot ? `${item.slot}-trailing` : 'item-trailing') as keyof TreeSlots<T>]"
                :class="ui.linkTrailing({ class: [props.ui?.linkTrailing, item.ui?.linkTrailing] })"
              >
                <slot
                  :name="((item.slot ? `${item.slot}-trailing` : 'item-trailing') as keyof TreeSlots<T>)"
                  v-bind="{ item, index, level, expanded: isExpanded, selected: isSelected }"
                  :item="(item as Extract<NestedItem<T>, { slot: string; }>)"
                >
                  <UIcon
                    v-if="item.trailingIcon"
                    :name="item.trailingIcon"
                    :class="ui.linkTrailingIcon({ class: [props.ui?.linkTrailingIcon, item.ui?.linkTrailingIcon] })"
                  />
                  <UIcon
                    v-else-if="item.children?.length"
                    :name="trailingIcon ?? appConfig.ui.icons.chevronDown"
                    :class="ui.linkTrailingIcon({ class: [props.ui?.linkTrailingIcon, item.ui?.linkTrailingIcon] })"
                  />
                </slot>
              </span>
            </slot>
          </button>

          <ul
            v-if="item.children?.length && isExpanded"
            :class="ui.listWithChildren({ class: [props.ui?.listWithChildren, item.ui?.listWithChildren] })"
          >
            <ReuseTreeTemplate :items="item.children" :level="level + 1" />
          </ul>
        </TreeItem>
      </li>
    </DefineTreeTemplate>

    <TreeRoot
      v-bind="(rootProps as unknown as TreeRootProps<NestedItem<T>>)"
      :class="ui.root({ class: [props.ui?.root, props.class] })"
      :get-key="getItemValue"
      :default-expanded="defaultExpanded"
      :selection-behavior="selectionBehavior"
    >
      <ReuseTreeTemplate :items="items" :level="0" />
    </TreeRoot>
  </ClientOnly>
</template>
