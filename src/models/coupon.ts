import type DiscountType from './discount_type.ts'

export default interface Coupon {
  id?: number
  user: number
  user_name?: string
  discount_type: number | DiscountType
  discount_type_details?: DiscountType
  code: string
  expiration_date: string
  status_used: 'not_used' | 'used'
  status_scratched: 'scratched' | 'not_scratched'
  used_date?: string
  created_at?: string
}

