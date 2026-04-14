export interface ContactMessage {
  id?: number
  name: string
  email: string
  subject: string
  message: string
  created_at?: string
  seen_by_admin?: boolean
}
