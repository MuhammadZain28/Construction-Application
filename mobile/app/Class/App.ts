
export class House {
    name: string;
    code: string;
    description: string;
    completed: boolean;
    date: string;
    constructor(name: string, code: string, description: string, completed = false, date = "01-01-2025") {
        this.name = name;
        this.code = code;
        this.description = description;
        this.completed = completed;
        this.date = date;
    }
}

export class Material {
    static counter: number = 0; // static int equivalent

    house: House;
    id: number;
    product: string;
    no: number;
    price: number;
    used: boolean;
    date: string;
    constructor(house: House, product: string, no: number, price: number, date = "01-01-2025", used = false)
    {
        this.id = Material.counter++;
        this.house = house;
        this.product = product;
        this.no = no;
        this.price = price;
        this.date = date;
        this.used = used
    }
}
export class Paints {
    static counter: number = 0; // static int equivalent

    id: number;
    name: string;
    house: House;
    no: number;
    color: string;
    price: number;
    date: string;
    used: boolean;
    constructor(name: string, color: string, house: House, no: number, price: number, date = "01-01-2025", used = false) {
        this.id = Paints.counter++;
        this.name = name;
        this.color = color;
        this.house = house;
        this.no = no;
        this.price = price;
        this.date = date;
        this.used = used; 
    }
}