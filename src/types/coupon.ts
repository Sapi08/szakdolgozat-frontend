export interface DiscountTypeDetails {
  id?: number
  name: string
  description?: string
  image?: string
  discount_category: string
  value: number
}

export interface Coupon {
  id?: number
  code?: string
  user: number
  user_name?: string
  discount_type: number | DiscountTypeDetails
  discount_type_details?: DiscountTypeDetails
  start_date: string
  expiration_date: string
  is_scratched: boolean
  is_used: boolean
  used_date?: string
  created_at?: string
}
