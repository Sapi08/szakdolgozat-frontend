export default class User {
  email: string;
  name: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  birth_date?: string;
  points?: number;

  constructor(
    email: string,
    name: string,
    first_name?: string,
    last_name?: string,
    phone?: string,
    birth_date?: string,
    points?: number
  ) {
    this.email = email;
    this.name = name;
    this.first_name = first_name;
    this.last_name = last_name;
    this.phone = phone;
    this.birth_date = birth_date;
    this.points = points;
  }
};
