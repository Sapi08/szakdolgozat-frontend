export default class CouponType {
  id?: number
  name: string
  description?: string
  image?: string
  discount_category: string
  value: number

  constructor(
    name: string,
    discount_category: string,
    value: number,
    id?: number,
    description?: string,
    image?: string
  ) {
    this.id = id
    this.name = name
    this.description = description
    this.image = image
    this.discount_category = discount_category
    this.value = value
  }
}

