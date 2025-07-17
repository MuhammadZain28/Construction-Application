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
    static async getHouseByCode(code: string): Promise<House | null> {
        const db = await Database();
        const houseRef = ref(db, `houses/${code}`);
        try {
            const snapshot = await get(houseRef);
            if (snapshot.exists()) {
                const data = snapshot.val();
                return new House(
                    data.name,
                    data.code,
                    data.description,
                    data.completed,
                    data.date
                );
            } else {
                console.warn(`House with code ${code} does not exist.`);
                return null;
            }
        } catch (error) {
            console.error('Error fetching house:', error);
            return null;
        }
    }
}

export class Material {

    house: string;
    id: string;
    product: string;
    no: number;
    price: number;
    used: boolean;
    date: string;
    constructor(id: string, house: string, product: string, no: number, price: number, date = "01-01-2025", used = false)
    {
        this.id = id;
        this.house = house;
        this.product = product;
        this.no = no;
        this.price = price;
        this.date = date;
        this.used = used
    }
    static async save(house: string, product: string, no: number, price: number, date: string, used: boolean): Promise<string> {
        const db = await Database();
        const materialsRef = ref(db, 'materials');
        const newMaterialRef = push(materialsRef);
        await set(newMaterialRef, {
            house: house,
            product: product,
            no: no,
            price: price,
            date: date,
            used: used
        });
        return newMaterialRef.key; 
    }
    static async getAllMaterials(): Promise<Material[]> {
        const db = await Database();
        const materialsRef = ref(db, 'materials');
        try {
            const snapshot = await get(materialsRef);
            const materials: Material[] = [];
            if (snapshot.exists()) {
                snapshot.forEach((childSnapshot) => {
                    const data = childSnapshot.val();
                    const material = new Material(
                        childSnapshot.key,
                        data.house,
                        data.product,
                        data.no,
                        data.price,
                        data.date,
                        data.used
                    );
                    materials.push(material);
                });
            }
            return materials;
        } catch (error) {
            console.error('Error fetching materials:', error);
            return [];
        }
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