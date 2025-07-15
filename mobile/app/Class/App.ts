import { Float, Int32 } from "react-native/Libraries/Types/CodegenTypes";

export class House {
    name: string;
    code: string;
    description: string;
    completed: boolean;
    constructor(name: string, code: string, description: string, completed = false) {
        this.name = name;
        this.code = code;
        this.description = description;
        this.completed = completed;
    }
}

export class Material {
    static counter: number = 0; // static int equivalent

    house: House;
    id: number;
    product: string;
    no: Int32;
    price: Float;
    used: boolean;
    date: string;
    constructor(house: House, product: string, no: Int32, price: Float, date = "01-01-2025", used = false)
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