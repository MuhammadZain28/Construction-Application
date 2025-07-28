import { Database } from '../Firebase/firebase';
import { ref, set, push, get, update, remove, query, orderByChild, limitToLast, equalTo } from 'firebase/database';

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
    static async getMonthlySum(): Promise<{ [key: string]: number }> {
        const db = await Database();
        const materialsRef = ref(db, 'materials');
        const snapshot = await get(materialsRef);
        let sums: { [key: string]: number } = {};
        for (let i = 1; i <= 12; i++) {
            sums[`2025-${String(i).padStart(2, '0')}`] = 0; 
        }
        snapshot.forEach((childSnapshot) => {
            const data = childSnapshot.val();
            const month = data.date.split('-')[1];
            const year = data.date.split('-')[0];
            const key = `${year}-${month}`;
            if (sums[key] !== undefined) {
                sums[key] += data.price * data.no;
            }
        });
        return sums;
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
    static async getMonthlySum(): Promise<{ [key: string]: number }> {
        const db = await Database();
        const paintsRef = ref(db, 'paints');
        const snapshot = await get(paintsRef);
        let sums: { [key: string]: number } = {};

        for (let i = 1; i <= 12; i++) {
            sums[`2025-${String(i).padStart(2, '0')}`] = 0;
        }
        snapshot.forEach((childSnapshot) => {
            const data = childSnapshot.val();
            const month = data.date.split('-')[1];
            const year = data.date.split('-')[0];
            const key = `${year}-${month}`;
            if (sums[key] !== undefined) {
                sums[key] += data.price * data.no;
            }
        });
        return sums;
    }
}

export class Wallets {
    id: string;
    name: string;
    house: string;
    amount: number;
    date: string;

    constructor(id: string, name: string, house: string, amount: number, date = new Date().toISOString().split('T')[0]) {
        this.id = id;
        this.name = name;
        this.house = house;
        this.amount = amount;
        this.date = date;
    }

    static async save(name: string, house: string, amount: number, date: string): Promise<string> {
        const db = await Database();
        const walletsRef = ref(db, 'wallets');
        const newWalletRef = push(walletsRef);
        await set(newWalletRef, {
            name: name,
            house: house,
            amount: amount,
            date: date,
            lastCashIn: amount,
            lastUpdated: date,
        });
        return newWalletRef.key; 
    }

    static async getAllWallets(): Promise<Wallets[]> {
        const db = await Database();
        const walletsRef = ref(db, 'wallets');
        try {
            const snapshot = await get(walletsRef);
            const wallets: Wallets[] = [];
            if (snapshot.exists()) {
                snapshot.forEach((childSnapshot) => {
                    const data = childSnapshot.val();
                    const wallet = new Wallets(
                        childSnapshot.key,
                        data.name,
                        data.house,
                        data.amount,
                        data.date
                    );
                    wallets.push(wallet);
                });
            }
            return wallets;
        } catch (error) {
            console.error('Error fetching wallets:', error);
            return [];
        }
    }

    static async UpdateWallet(id: string, name: string, house: string, amount: number, date: string): Promise<void> {
        const db = await Database();
        const walletRef = ref(db, `wallets/${id}`);
        await update(walletRef, {
            name: name,
            house: house,
            amount: amount,
            date: date
        });
    }

    static async UpdateAmount(id: string, amount: number, date: string, cash: number): Promise<void> {
        const db = await Database();
        const walletRef = ref(db, `wallets/${id}`);
        await update(walletRef, {
            amount: amount,
            lastUpdated: date,
            lastCashIn: cash
        });
    }

    static async deleteWallet(id: string): Promise<void> {
        const db = await Database();
        const walletRef = ref(db, `wallets/${id}`);
        await remove(walletRef);
    }

    static async getMonthlySum(month: string, walletId: string): Promise<number> {
        const db = await Database();
        const walletsRef = ref(db, `wallets/${walletId}`);
        const snapshot = await get(walletsRef);
        let sum = 0;
        console.log(snapshot);
        if (!snapshot.exists()) {
            return 0;
        }
        else {
            const data = snapshot.val();
            const walletMonth = data.lastUpdated.split('-')[1];
            const walletYear = data.lastUpdated.split('-')[0];
            if (`${walletYear}-${walletMonth}` === month ) {
                sum += data.lastCashIn;
            }
        }
        return sum;
    }
}

export class Transactions {
    id: string;
    wallet: string;
    amount: number;
    type: 'In' | 'Out';
    date: string;
    reason?: string;
    name: string;

    constructor(id: string, wallet: string, amount: number, type: 'In' | 'Out', date = new Date().toISOString().split('T')[0], name: string, reason?: string, ) {
        this.id = id;
        this.wallet = wallet;
        this.amount = amount;
        this.type = type;
        this.date = date;
        this.reason = reason;
        this.name = name;
    }

    static async save(wallet: string, amount: number, type: 'In' | 'Out', date: string, reason?: string, name?: string ): Promise<string> {
        const db = await Database();
        const transactionsRef = ref(db, 'transactions');
        const newTransactionRef = push(transactionsRef);
        await set(newTransactionRef, {
            wallet: wallet,
            amount: type === 'In' ? amount : -amount,
            type: type,
            date: date,
            reason: reason,
            name: name
        });
        return newTransactionRef.key; 
    }

    static async getAllTransactions(): Promise<Transactions[]> {
        const db = await Database();
        const transactionsRef = ref(db, 'transactions');
        try {
            const snapshot = await get(transactionsRef);
            const transactions: Transactions[] = [];
            if (snapshot.exists()) {
                snapshot.forEach((childSnapshot) => {
                    const data = childSnapshot.val();
                    const transaction = new Transactions(
                        childSnapshot.key,
                        data.wallet,
                        data.amount,
                        data.type,
                        data.date,
                        data.name,
                        data.reason
                    );
                    transactions.push(transaction);
                });
            }
            return transactions;
        } catch (error) {
            console.error('Error fetching transactions:', error);
            return [];
        }
    }

    static async deleteTransaction(id: string): Promise<void> {
        const db = await Database();
        const transactionRef = ref(db, `transactions/${id}`);
        await remove(transactionRef);
    }
    static async update(id: string, wallet: string, amount: number, type: 'In' | 'Out', date: string, reason?: string, name?: string): Promise<void> {
        const db = await Database();
        const transactionRef = ref(db, `transactions/${id}`);
        await update(transactionRef, {
            wallet: wallet,
            amount: type === 'In' ? amount : -amount,
            type: type,
            date: date,
            reason: reason,
            name: name
        });
    }
    static async getMonthlySum(month: string, type: 'In' | 'Out', wallet: string): Promise<number> {
        const db = await Database();
        const transactionsRef = ref(db, 'transactions');
        const snapshot = await get(transactionsRef);
        let sum = 0;
        snapshot.forEach((childSnapshot) => {
            const data = childSnapshot.val();
            const transactionMonth = data.date.split('-')[1];
            const transactionYear = data.date.split('-')[0];
            if (`${transactionYear}-${transactionMonth}` === month && data.type === type && data.wallet === wallet) {
                sum += data.amount;
            }
        });
        return sum;
    }
    static async getLastTransaction(walletId: string): Promise<number> {
        const db = await Database();
        const transactionsRef = ref(db, 'transactions');
        const q = query(transactionsRef, orderByChild('type'), equalTo('In'), orderByChild('wallet'), equalTo(walletId), orderByChild('date'), limitToLast(1));
        const snapshot = await get(q);
        if (snapshot.exists()) {
            const data = snapshot.val();
            const lastTransactionKey = Object.keys(data)[0];
            return data[lastTransactionKey].amount;
        } else {
            return 0; // No transactions found
        }
    }
}

export class Records {
    id: string;
    name: string;
    wallet: string;
    amount: number;
    type: 'In' | 'Out';
    date: string;
    reason?: string;
    constructor(id: string, name: string, wallet: string, amount: number, type: 'In' | 'Out', date = new Date().toISOString().split('T')[0], reason?: string) {
        this.id = id;
        this.name = name;
        this.wallet = wallet;
        this.amount = amount;
        this.type = type;
        this.date = date;
        this.reason = reason;
    }
    static async save(name: string, wallet: string, amount: number, type: 'In' | 'Out', date: string, reason?: string): Promise<string> {
        const db = await Database();
        const recordsRef = ref(db, 'records');
        const newRecordRef = push(recordsRef);
        await set(newRecordRef, {
            name: name,
            wallet: wallet,
            amount: type === 'In' ? amount : -amount,
            type: type,
            date: date,
            reason: reason
        });
        return newRecordRef.key; 
    }
    static async getAllRecords(): Promise<Records[]> {
        const db = await Database();
        const recordsRef = ref(db, 'records');
        try {
            const snapshot = await get(recordsRef);
            const records: Records[] = [];
            if (snapshot.exists()) {
                snapshot.forEach((childSnapshot) => {
                    const data = childSnapshot.val();
                    const record = new Records(
                        childSnapshot.key,
                        data.name,
                        data.wallet,
                        data.amount,
                        data.type,
                        data.date,
                        data.reason
                    );
                    records.push(record);
                });
            }
            return records;
        } catch (error) {
            console.error('Error fetching records:', error);
            return [];
        }
    }
    static async deleteRecord(id: string): Promise<void> {
        const db = await Database();
        const recordRef = ref(db, `records/${id}`);
        await remove(recordRef);
    }
    static async UpdateRecord(id: string, name: string, wallet: string, amount: number, type: 'In' | 'Out', date: string, reason?: string): Promise<void> {
        const db = await Database();
        const recordRef = ref(db, `records/${id}`);
        await update(recordRef, {
            name: name,
            wallet: wallet,
            amount: type === 'In' ? amount : -amount,
            type: type,
            date: date,
            reason: reason
        });
    }
    static async getMonthlySum(month: string, type: 'In' | 'Out', wallet: string): Promise<number> {
        const db = await Database();
        const recordsRef = ref(db, 'records');
        const snapshot = await get(recordsRef);
        let sum = 0;
        snapshot.forEach((childSnapshot) => {
            const data = childSnapshot.val();
            const recordMonth = data.date.split('-')[1];
            const recordYear = data.date.split('-')[0];
            if (`${recordYear}-${recordMonth}` === month && data.type === type && data.wallet === wallet) {
                sum += data.amount;
            }
        });
        return sum;
    }
}