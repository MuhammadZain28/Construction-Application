import React, { useState, useEffect, useContext } from 'react';
import { House, Material, Paints, Transactions, Wallets, Records } from '../Class/App'

type DataContextType = {
  houses: House[];
  isHouseUpdated: boolean;
  setIsHouseUpdated: React.Dispatch<React.SetStateAction<boolean>>;
  materials: Material[];
  isMaterialUpdated: boolean;
  setIsMaterialUpdated: React.Dispatch<React.SetStateAction<boolean>>;
  paints: Paints[];
  isPaintUpdated: boolean;
  setIsPaintUpdated: React.Dispatch<React.SetStateAction<boolean>>;
  wallet: Wallets[];
  isWalletUpdated: boolean;
  setIsWalletUpdated: React.Dispatch<React.SetStateAction<boolean>>;
  transactions: Transactions[];
  isTransactionUpdated: boolean;
  setIsTransactionUpdated: React.Dispatch<React.SetStateAction<boolean>>;
  record: Records[];
  isRecordUpdated: boolean;
  setIsRecordUpdated: React.Dispatch<React.SetStateAction<boolean>>;
  paintSum: { [key: string]: number };
  materialSum: { [key: string]: number };
  isDataLoaded: boolean;
  setIsDataLoaded: React.Dispatch<React.SetStateAction<boolean>>;
};

const DataContext = React.createContext<DataContextType | undefined>(undefined);
export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [houses, setHouses] = useState<House[]>([]);
  const [isHouseUpdated, setIsHouseUpdated] = useState<boolean>(true);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [isMaterialUpdated, setIsMaterialUpdated] = useState<boolean>(true);
  const [isPaintUpdated, setIsPaintUpdated] = useState<boolean>(true);
  const [isTransactionUpdated, setIsTransactionUpdated] = useState<boolean>(true);
  const [isWalletUpdated, setIsWalletUpdated] = useState<boolean>(true);
  const [isRecordUpdated, setIsRecordUpdated] = useState<boolean>(true);
  const [paints, setPaints] = useState<Paints[]>([]);
  const [wallet, setWallets] = useState<Wallets[]>([]);
  const [transactions, setTransactions] = useState<Transactions[]>([]);
  const [record, setRecords] = useState<Records[]>([]);
  const [paintSum, setPaintSum] = useState<{ [key: string]: number }>({});
  const [materialSum, setMaterialSum] = useState<{ [key: string]: number }>({});
  const [isDataLoaded, setIsDataLoaded] = useState<boolean>(false);

    const fetchHouses = async () => {
        const housesData = await House.getAllHouses();
        setHouses(housesData);
        setIsHouseUpdated(false);
    }
    const fetchMaterials = async () => {
        const materialsData = await Material.getAllMaterials();
        const materialSumData = await Material.getMonthlySum();
        setMaterials(materialsData);
        setMaterialSum(materialSumData);
        setIsMaterialUpdated(false);
    }
    const fetchPaints = async () => {
        const paintsData = await Paints.getAllPaints();
        const paintSumData = await Paints.getMonthlySum();
        setPaints(paintsData);
        setPaintSum(paintSumData);
        setIsPaintUpdated(false);
    }
    const fetchWallets = async () => {
        const walletsData = await Wallets.getAllWallets();
        setWallets(walletsData);
        setIsWalletUpdated(false);
    }
    const fetchTransactions = async () => {
        const transactionsData = await Transactions.getAllTransactions();
        setTransactions(transactionsData);
        setIsTransactionUpdated(false);
    }
    const fetchRecords = async () => {
        const recordsData = await Records.getAllRecords();
        setRecords(recordsData);
        setIsRecordUpdated(false);
    }

  useEffect(() => {
    try {
      if (isHouseUpdated) {
        fetchHouses();
      }
      if (isMaterialUpdated) {
        fetchMaterials();
      }
      if (isPaintUpdated) {
        fetchPaints();
      }
      if (isWalletUpdated) {
        fetchWallets();
      }
      if (isTransactionUpdated) {
        fetchTransactions();
      }
      if (isRecordUpdated) {
        fetchRecords();
      }
    }
    catch (error) {
      console.error('Error fetching data:', error);
    }
    finally {
      setIsDataLoaded(true);
    }

  },

  [ isHouseUpdated, isMaterialUpdated, isPaintUpdated, isWalletUpdated, isTransactionUpdated, isRecordUpdated ]);

  return (
    <DataContext.Provider value={{ houses, isHouseUpdated, setIsHouseUpdated, materials, isMaterialUpdated, setIsMaterialUpdated, paints, isPaintUpdated, setIsPaintUpdated, wallet, isWalletUpdated, setIsWalletUpdated, transactions, isTransactionUpdated, setIsTransactionUpdated, record, isRecordUpdated, setIsRecordUpdated, paintSum, materialSum, isDataLoaded, setIsDataLoaded }}>
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