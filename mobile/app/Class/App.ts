import { Database } from '../Firebase/firebase';
import { ref, set, push, get } from 'firebase/database';
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
    static async save(house: House): Promise<void> {
    const db = await Database();
    const housesRef = ref(db, 'houses');
    const newHouseRef = push(housesRef); // creates unique ID

    await set(newHouseRef, {
        name: house.name,
        code: house.code,
        description: house.description,
        completed: house.completed,
        date: house.date
    });
}

    static async getAllHouses(): Promise<House[]> {
    const db = await Database();
    const housesRef = ref(db, 'houses');

    try {
        const snapshot = await get(housesRef);
        const houses: House[] = [];

        if (snapshot.exists()) {
            snapshot.forEach((childSnapshot) => {
                const data = childSnapshot.val();
                const house = new House(
                    data.name,
                    data.code,
                    data.description,
                    data.completed,
                    data.date
                );
                alert("House fetched: " + data.name);
                houses.push(house);
            });
        }

        return houses;
    } catch (error) {
        console.error('Error fetching houses:', error);
        return [];
    }
}

}

export class Material {

    house: House;
    id: string;
    product: string;
    no: number;
    price: number;
    used: boolean;
    date: string;
    constructor(id: string, house: House, product: string, no: number, price: number, date = "01-01-2025", used = false)
    {
        this.id = id;
        this.house = house;
        this.product = product;
        this.no = no;
        this.price = price;
        this.date = date;
        this.used = used
    }
    static async save(house: House, product: string, no: number, price: number, date: string, used: boolean): Promise<string> {
        const db = await Database();
        const materialsRef = ref(db, 'materials');
        const newMaterialRef = push(materialsRef);
        await set(newMaterialRef, {
            house: house.code,
            product: product,
            no: no,
            price: price,
            date: date,
            used: used
        });
        return newMaterialRef.key; 
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