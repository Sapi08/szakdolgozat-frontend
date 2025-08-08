export default class Dish {
  id: number
  name: string
  description: string
  price: number
  category: string
  allergies: string[]

  constructor(id: number, name: string, description: string, price: number, category: string, allergies: string[]) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.price = price;
    this.category = category;
    this.allergies = allergies;
  }
}
