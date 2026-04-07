export interface OrderItem {
  id?: number
  dish_id: number
  quantity: number
}

export interface OrderCreateRequest {
  delivery_type: string
  delivery_name: string
  delivery_phone: string
  delivery_address?: string
  delivery_city?: string
  delivery_zip?: string
  payment_method: string
  coupon_code?: string
  comment?: string
  items: OrderItem[]
}

export interface Order {
  id?: number
  order_number: string
  user?: number
  coupon?: number
  created_at: string
  accepted_at?: string
  completed_at?: string
  original_price: number
  discount_amount: number
  delivery_fee: number
  total_price: number
  status:
    | 'pending'
    | 'accepted'
    | 'preparing'
    | 'ready'
    | 'in_delivery'
    | 'delivered'
    | 'completed'
    | 'canceled'
  payment_status: 'pending' | 'paid_with_card' | 'paid_on_delivery' | 'failed'
  payment_method: string
  delivery_type: string
  delivery_address?: string
  delivery_city?: string
  delivery_zip?: string
  delivery_phone: string
  delivery_name: string
  comment?: string
  admin_note?: string
  is_viewed_by_admin: boolean
  items?: OrderItem[]
}

export class OrderModel implements Order {
  id?: number
  order_number: string
  user?: number
  coupon?: number
  created_at: string
  accepted_at?: string
  completed_at?: string
  original_price: number
  discount_amount: number
  delivery_fee: number
  total_price: number
  status:
    | 'pending'
    | 'accepted'
    | 'preparing'
    | 'ready'
    | 'in_delivery'
    | 'delivered'
    | 'completed'
    | 'canceled'
  payment_status: 'pending' | 'paid_with_card' | 'paid_on_delivery' | 'failed'
  payment_method: string
  delivery_type: string
  delivery_address?: string
  delivery_city?: string
  delivery_zip?: string
  delivery_phone: string
  delivery_name: string
  comment?: string
  admin_note?: string
  is_viewed_by_admin: boolean
  items?: OrderItem[]

  constructor(data: Order) {
    this.order_number = data.order_number
    this.created_at = data.created_at
    this.original_price = data.original_price
    this.discount_amount = data.discount_amount
    this.delivery_fee = data.delivery_fee
    this.total_price = data.total_price
    this.status = data.status
    this.payment_status = data.payment_status
    this.payment_method = data.payment_method
    this.delivery_type = data.delivery_type
    this.delivery_phone = data.delivery_phone
    this.delivery_name = data.delivery_name
    this.is_viewed_by_admin = data.is_viewed_by_admin
    this.id = data.id
    this.user = data.user
    this.coupon = data.coupon
    this.accepted_at = data.accepted_at
    this.completed_at = data.completed_at
    this.delivery_address = data.delivery_address
    this.delivery_city = data.delivery_city
    this.delivery_zip = data.delivery_zip
    this.comment = data.comment
    this.admin_note = data.admin_note
    this.items = data.items
  }
}
