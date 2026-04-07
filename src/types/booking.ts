export interface Booking {
  id: number
  name: string
  email: string
  phone: string
  date: string
  time: string
  number_of_people: number
  comment?: string
  type_of_event: 'wedding' | 'birthday_party' | 'corporate_event' | 'holiday' | 'other'
  confirmed: boolean
  seen_by_admin: boolean
  created_at: string
}

export interface CreateBookingRequest {
  name: string
  email: string
  phone: string
  date: string
  time: string
  number_of_people: number
  type_of_event: string
  comment?: string
}
