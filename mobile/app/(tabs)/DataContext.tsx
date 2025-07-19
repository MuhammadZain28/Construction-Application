import React, { useState, useEffect, useContext } from 'react';
import { House, Material, Paints } from '../Class/App'

type DataContextType = {
  houses: House[];
  materials: Material[];
  paints: Paints[];
  setHouses: (houses: House[]) => void;
  setMaterials: (materials: Material[]) => void;
  setPaints: (paints: Paints[]) => void;
};

const DataContext = React.createContext<DataContextType | undefined>(undefined);
export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [houses, setHouses] = useState<House[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [paints, setPaints] = useState<Paints[]>([]);

  useEffect(() => {
    const fetchData = async () => {
        const housesData = await House.getAllHouses();
        const materialsData = await Material.getAllMaterials();
        const paintsData = await Paints.getAllPaints();
        setHouses(housesData);
        setMaterials(materialsData);
        setPaints(paintsData);
    }

    fetchData().catch(console.error);

  }, []);

  return (
    <DataContext.Provider value={{ houses, materials, paints, setHouses, setMaterials, setPaints }}>
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