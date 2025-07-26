import React, { useState, useEffect, useContext } from 'react';
import { House, Material, Paints, Transactions, Wallets, Records } from '../Class/App'

type DataContextType = {
  houses: House[];
  materials: Material[];
  paints: Paints[];
  wallet: Wallets[];
  transactions: Transactions[];
  record: Records[];
  paintSum: { [key: string]: number };
  materialSum: { [key: string]: number };
  setHouses: (houses: House[]) => void;
  setMaterials: (materials: Material[]) => void;
  setPaints: (paints: Paints[]) => void;
  setWallets: (wallets: Wallets[]) => void;
  setTransactions: (transactions: Transactions[]) => void;
  setRecords: (records: Records[]) => void;
};

const DataContext = React.createContext<DataContextType | undefined>(undefined);
export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [houses, setHouses] = useState<House[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [paints, setPaints] = useState<Paints[]>([]);
  const [wallet, setWallets] = useState<Wallets[]>([]);
  const [transactions, setTransactions] = useState<Transactions[]>([]); 
  const [record, setRecords] = useState<Records[]>([]);
  const [paintSum, setPaintSum] = useState<{ [key: string]: number }>({});
  const [materialSum, setMaterialSum] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    const fetchData = async () => {
        const housesData = await House.getAllHouses();
        const materialsData = await Material.getAllMaterials();
        const paintsData = await Paints.getAllPaints();
        const walletsData = await Wallets.getAllWallets();
        const transactionsData = await Transactions.getAllTransactions();
        const recordsData = await Records.getAllRecords();
        const paintSumData = await Paints.getMonthlySum();
        const materialSumData = await Material.getMonthlySum();
        setHouses(housesData);
        setMaterials(materialsData);
        setPaints(paintsData);
        setWallets(walletsData);
        setTransactions(transactionsData);
        setRecords(recordsData);
        setPaintSum(paintSumData);
        setMaterialSum(materialSumData);
    }

    fetchData().catch(console.error);

  }, []);

  return (
    <DataContext.Provider value={{ houses, materials, paints, wallet, transactions, record, paintSum, materialSum, setHouses, setMaterials, setPaints, setWallets, setTransactions, setRecords }}>
      {children}
    </DataContext.Provider>
  );
};

export const useDataContext = (): DataContextType => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useDataContext must be used within a DataProvider');
  }
  return context;
};