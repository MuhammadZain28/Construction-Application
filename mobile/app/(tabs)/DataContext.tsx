import React, { useState, useEffect, useContext } from 'react';
import { House, Material, Paints, Transactions, Wallets, Records } from '../Class/App'
import { signInWithEmailAndPassword } from "firebase/auth"
import { FirebaseAuth } from '../Firebase/firebaseAuth';

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
  loading : boolean;
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
  const [loading, setLoading] = useState<boolean>(false);

    const fetchHouses = async () => {
        setLoading(true);
        const housesData = await House.getAllHouses();
        await new Promise(resolve => setTimeout(resolve, 1000));
        setHouses(housesData);
        setIsHouseUpdated(false);
        setLoading(false);
    }
    const fetchMaterials = async () => {
        setLoading(true);
        const materialsData = await Material.getAllMaterials();
        const materialSumData = await Material.getMonthlySum();
        await new Promise(resolve => setTimeout(resolve, 1000));
        setMaterials(materialsData);
        setMaterialSum(materialSumData);
        setIsMaterialUpdated(false);
        setLoading(false);
    }
    const fetchPaints = async () => {
        setLoading(true);
        const paintsData = await Paints.getAllPaints();
        const paintSumData = await Paints.getMonthlySum();
        await new Promise(resolve => setTimeout(resolve, 1000));
        setPaints(paintsData);
        setPaintSum(paintSumData);
        setIsPaintUpdated(false);
        setLoading(false);
    }
    const fetchWallets = async () => {
        setLoading(true);
        const walletsData = await Wallets.getAllWallets();
        await new Promise(resolve => setTimeout(resolve, 1000));
        setWallets(walletsData);
        setIsWalletUpdated(false);
        setLoading(false);
    }
    const fetchTransactions = async () => {
        setLoading(true);
        const transactionsData = await Transactions.getAllTransactions();
        await new Promise(resolve => setTimeout(resolve, 1000));
        setTransactions(transactionsData);
        setIsTransactionUpdated(false);
        setLoading(false);
    }
    const fetchRecords = async () => {
        setLoading(true);
        const recordsData = await Records.getAllRecords();
        await new Promise(resolve => setTimeout(resolve, 1000));
        setRecords(recordsData);
        setIsRecordUpdated(false);
        setLoading(false);
    }

    const logIn = async () => {
            try {
              const auth = await FirebaseAuth();
              const credentials = await signInWithEmailAndPassword(
                auth,
                'zaina.azhar2005@gmail.com',
                'admin123'
              );
              console.log('Signed in existing user:', credentials.user.email);
              return true;
            } catch (signInError) {
              console.error("Sign-in failed:", signInError);
              alert("Failed to sign in.");
              return false;
            }
          }

  useEffect(() => {
    try {
      if (!isDataLoaded) {
        logIn().catch(error => {
          console.error("Login failed:", error);
          alert("Failed to log in.");
          return;
        });
      }
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

  [ isHouseUpdated, isMaterialUpdated, isPaintUpdated, isWalletUpdated, isTransactionUpdated, isRecordUpdated, isDataLoaded ]);

  return (
    <DataContext.Provider value={{ houses, isHouseUpdated, setIsHouseUpdated, materials, isMaterialUpdated, setIsMaterialUpdated, paints, isPaintUpdated, setIsPaintUpdated, wallet, isWalletUpdated, setIsWalletUpdated, transactions, isTransactionUpdated, setIsTransactionUpdated, record, isRecordUpdated, setIsRecordUpdated, paintSum, materialSum, isDataLoaded, setIsDataLoaded, loading }}>
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