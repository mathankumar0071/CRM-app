import { useContext } from 'react';
import { DataContext } from '../context/DataContext';

export const useCrm = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useCrm must be used within a DataProvider');
  }
  return context;
};