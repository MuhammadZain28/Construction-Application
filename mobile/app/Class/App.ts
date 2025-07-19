import { Database } from '../Firebase/firebase';
import { ref, set, push, get, update, remove } from 'firebase/database';

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
    const housesRef = ref(db, `houses/${house.code}`);

    await update(housesRef, {
        name: house.name,
        description: house.description,
        completed: house.completed,
        date: house.date
        }) ;
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
                    childSnapshot.key,
                    data.description,
                    data.completed,
                    data.date
                );
                houses.push(house);
            });
        }

            return houses;
        } catch (error) {
            console.error('Error fetching houses:', error);
            return [];
        }
    }
    static async updateHouse(code: string, house: House): Promise<void> {
        const db = await Database();
        const houseRef = ref(db, `houses/${code}`);
        await update(houseRef, {
            name: house.name,
            description: house.description,
            completed: house.completed,
            date: house.date
        });
    }
    static async deleteHouse(code: string): Promise<void> {
        const db = await Database();
        const houseRef = ref(db, `houses/${code}`);
        await remove(houseRef);
        
    }
    static async updateCompleted(code: string, status: boolean): Promise<void> {
        const db = await Database();
        const houseRef = ref(db, `houses/${code}`);
        await update(houseRef, {
            completed: status
        });
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
    static async UpdateMaterial(id: string, house: string, product: string, no: number, price: number, date: string): Promise<void> {
        const db = await Database();
        const materialRef = ref(db, `materials/${id}`);
        await update(materialRef, {
            house: house,
            product: product,
            no: no,
            price: price,
            date: date,
        });
    }
    static async deleteMaterial(id: string): Promise<void> {
        const db = await Database();
        const materialRef = ref(db, `materials/${id}`);
        await remove(materialRef);
    }
    static async UpdateUsed(id: string, status: boolean): Promise<void> {
        const db = await Database();
        const materialRef = ref(db, `materials/${id}`);
        await update(materialRef, {
            used: status
        });
    }
}
export class Paints {

    id: string;
    name: string;
    house: string;
    no: number;
    color: string;
    price: number;
    date: string;
    used: boolean;
    constructor(id: string, name: string, color: string, house: string, no: number, price: number, date = "01-01-2025", used = false) {
        this.id = id;
        this.name = name;
        this.color = color;
        this.house = house;
        this.no = no;
        this.price = price;
        this.date = date;
        this.used = used; 
    }
    static async save(name: string, color: string, house: string, no: number, price: number, date: string, used: boolean): Promise<string> {
        const db = await Database();
        const paintsRef = ref(db, 'paints');
        const newPaintRef = push(paintsRef);
        await set(newPaintRef, {
            name: name,
            color: color,
            house: house,
            no: no,
            price: price,
            date: date,
            used: used
        });
        return newPaintRef.key; 
    }
    static async getAllPaints(): Promise<Paints[]> {
        const db = await Database();
        const paintsRef = ref(db, 'paints');
        try {
            const snapshot = await get(paintsRef);
            const paints: Paints[] = [];
            if (snapshot.exists()) {
                snapshot.forEach((childSnapshot) => {
                    const data = childSnapshot.val();
                    const paint = new Paints(
                        childSnapshot.key,
                        data.name,
                        data.color,
                        data.house,
                        data.no,
                        data.price,
                        data.date,
                        data.used
                    );
                    paints.push(paint);
                });
            }
            return paints;
        } catch (error) {
            console.error('Error fetching paints:', error);
            return [];
        }
    }
    static async UpdatePaint(id: string, name: string, color: string, house: string, no: number, price: number, date: string): Promise<void> {
        const db = await Database();
        const paintRef = ref(db, `paints/${id}`);
        await update(paintRef, {
            name: name,
            color: color,
            house: house,
            no: no,
            price: price,
            date: date
        });
    }
    static async deletePaint(id: string): Promise<void> {
        const db = await Database();
        const paintRef = ref(db, `paints/${id}`);
        await remove(paintRef);
    }
    static async UpdateUsed(id: string, status: boolean): Promise<void> {
        const db = await Database();
        const paintRef = ref(db, `paints/${id}`);
        await update(paintRef, {
            used: status
        });
    }
}