export default class DishVariant {
  id: number
  dish_id: number
  detail: string
  price: number | string

  constructor(id: number, dish_id: number, detail: string, price: number | string) {
    this.id = id;
    this.dish_id = dish_id;
    this.detail = detail;
    this.price = price;
  }
}
