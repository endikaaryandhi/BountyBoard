import { createContext, useContext } from 'react';
import { useBounties } from '/hooks/useBounties.js';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const { data: bounties = [], isLoading, refetch } = useBounties();

  return (
    <DataContext.Provider value={{ bounties, loading: isLoading, refreshData: refetch }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);