export interface OrderItem {
  dish: number
  dish_variant?: number | null
  quantity: number
  special_request?: string
  // Backend által visszaadott mezők
  dish_name?: string
  variant_detail?: string
  unit_price?: number
  total_price?: number
}

export interface OrderCreateRequest {
  delivery_type: 'delivery' | 'pickup'
  delivery_name: string
  delivery_phone: string
  delivery_address: string
  delivery_city: string
  delivery_zip: string
  payment_method: 'card' | 'cash_on_delivery'
  coupon_code?: string
  comment?: string
  items: OrderItem[]
}

export interface Order {
  id: number
  order_number: string
  user: number
  items: OrderItem[]
  original_price: number
  discount_amount: number
  delivery_fee: number
  total_price: number
  status: 'pending' | 'accepted' | 'preparing' | 'ready' | 'in_delivery' | 'delivered' | 'completed' | 'canceled'
  payment_status: 'pending' | 'paid_with_card' | 'cash_on_delivery' | 'failed'
  payment_method: string
  delivery_type: string
  delivery_name: string
  delivery_phone: string
  delivery_address: string
  delivery_city: string
  delivery_zip: string
  comment?: string
  admin_note?: string
  coupon?: any
  is_viewed_by_admin: boolean
  created_at: string
  accepted_at?: string
  completed_at?: string
}

export class OrderModel implements Order {
  id: number
  order_number: string
  user: number
  items: OrderItem[]
  original_price: number
  discount_amount: number
  delivery_fee: number
  total_price: number
  status: 'pending' | 'accepted' | 'preparing' | 'ready' | 'in_delivery' | 'delivered' | 'completed' | 'canceled'
  payment_status: 'pending' | 'paid_with_card' | 'cash_on_delivery' | 'failed'
  payment_method: string
  delivery_type: string
  delivery_name: string
  delivery_phone: string
  delivery_address: string
  delivery_city: string
  delivery_zip: string
  comment?: string
  admin_note?: string
  coupon?: any
  is_viewed_by_admin: boolean
  created_at: string
  accepted_at?: string
  completed_at?: string

  constructor(data: Partial<Order>) {
    this.id = data.id || 0
    this.order_number = data.order_number || ''
    this.user = data.user || 0
    this.items = data.items || []
    this.original_price = data.original_price || 0
    this.discount_amount = data.discount_amount || 0
    this.delivery_fee = data.delivery_fee || 0
    this.total_price = data.total_price || 0
    this.status = data.status || 'pending'
    this.payment_status = data.payment_status || 'pending'
    this.payment_method = data.payment_method || 'cash_on_delivery'
    this.delivery_type = data.delivery_type || 'delivery'
    this.delivery_name = data.delivery_name || ''
    this.delivery_phone = data.delivery_phone || ''
    this.delivery_address = data.delivery_address || ''
    this.delivery_city = data.delivery_city || ''
    this.delivery_zip = data.delivery_zip || ''
    this.comment = data.comment
    this.admin_note = data.admin_note
    this.coupon = data.coupon
    this.is_viewed_by_admin = data.is_viewed_by_admin || false
    this.created_at = data.created_at || ''
    this.accepted_at = data.accepted_at
    this.completed_at = data.completed_at
  }

  getStatusLabel(): string {
    const labels: Record<Order['status'], string> = {
      pending: 'Függőben',
      accepted: 'Elfogadva',
      preparing: 'Készítés alatt',
      ready: 'Kész',
      in_delivery: 'Szállítás alatt',
      delivered: 'Kiszállítva',
      completed: 'Lezárva',
      canceled: 'Törölve'
    }
    return labels[this.status]
  }

  getStatusColor(): string {
    const colors: Record<Order['status'], string> = {
      pending: '#ffc107',
      accepted: '#17a2b8',
      preparing: '#fd7e14',
      ready: '#28a745',
      in_delivery: '#9c27b0',
      delivered: '#607d8b',
      completed: '#4caf50',
      canceled: '#dc3545'
    }
    return colors[this.status]
  }

  getFullAddress(): string {
    return `${this.delivery_address}, ${this.delivery_city} ${this.delivery_zip}`
  }
}

