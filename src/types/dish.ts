export interface Dish {
  id: number
  name: string
  description: string
  price: number | null
  category_id: string
  allergies: string[]
  image?: string
  has_variants: boolean
}
