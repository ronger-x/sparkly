import type { AvatarProps, SelectItem } from '@nuxt/ui'

export type UserStatus = 'subscribed' | 'unsubscribed' | 'bounced'
export type SaleStatus = 'paid' | 'failed' | 'refunded'

export interface BaseOption extends SelectItem {
  label: string
  value: string
}

export interface DictInfo {
  label: string
  value: string
  color: string
  icon: string
  image: string
}

export interface User {
  id: number
  account: string
  nickname: string
  email: string
  avatar?: AvatarProps
  status: string | DictInfo
  location: string
}

export interface Mail {
  id: number
  unread?: boolean
  from: User
  subject: string
  body: string
  date: string
}

export interface Member {
  name: string
  username: string
  role: 'member' | 'owner'
  avatar: Avatar
}

export interface Stat {
  title: string
  icon: string
  value: number | string
  variation: number
  formatter?: (value: number) => string
}

export interface Sale {
  id: string
  date: string
  status: SaleStatus
  email: string
  amount: number
}

export interface Notification {
  id: number
  unread?: boolean
  sender: User
  body: string
  date: string
}

export type Period = 'daily' | 'weekly' | 'monthly'

export interface Range {
  start: Date
  end: Date
}

export type Status = 'enabled' | 'disabled'

export interface DictType {
  id: number
  typeCode: string
  label: string
  sortNo: number
  description: string
  status: string | DictInfo
  createdTime: string
}

export interface Dict {
  id: number
  dictTypeCode: string
  label: string
  value: string
  color: string
  icon: string
  image: string
  sortNo: number
  description: string
  status: string | DictInfo
  createdTime: string
}

export interface Role {
  id: number
  label: string
  permission: string
  status: string | DictInfo
  createdTime: string
}

export interface PageInfo<T> {
  records: T[]
  total: number
  size: number
  current: number
  pages: number
}

export interface ResultInfo<T> {
  code: number
  data: T
  message: string
}
