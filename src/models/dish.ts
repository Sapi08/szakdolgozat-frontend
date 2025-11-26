export default class Dish {
  id: number
  name: string
  description: string
  price: number | null
  category: string
  allergies: string[]
  image?: string

  constructor(id: number, name: string, description: string, price: number | null, category: string, allergies: string[], image?: string) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.price = price;
    this.category = category;
    this.allergies = allergies;
    this.image = image;
  }
}
