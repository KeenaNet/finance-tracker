
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Transaction, Category, RecurringTransaction } from '../types.ts';
import { dbService } from '../services/dbService.ts';
import { dateService } from '../services/dateService.ts';

interface AppContextType {
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, 'id'>) => Promise<void>;
  updateTransaction: (transaction: Transaction) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  categories: Category[];
  setCategories: (categories: Category[]) => Promise<void>;
  recurringTransactions: RecurringTransaction[];
  addRecurringTransaction: (transaction: Omit<RecurringTransaction, 'id' | 'nextDueDate'>) => Promise<void>;
  updateRecurringTransaction: (transaction: RecurringTransaction) => Promise<void>;
  deleteRecurringTransaction: (id: string) => Promise<void>;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
  loading: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategoriesState] = useState<Category[]>([]);
  const [recurringTransactions, setRecurringTransactions] = useState<RecurringTransaction[]>([]);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const processRecurringTransactions = useCallback(async (
    recurringTxs: RecurringTransaction[],
    currentTxs: Transaction[]
  ): Promise<{ updatedRecurringTxs: RecurringTransaction[], newTxs: Transaction[] }> => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const newTxs: Transaction[] = [];
    const updatedRecurringTxs = [...recurringTxs];

    for (let i = 0; i < updatedRecurringTxs.length; i++) {
        const rt = updatedRecurringTxs[i];
        let nextDueDate = new Date(rt.nextDueDate);
        const endDate = rt.endDate ? new Date(rt.endDate) : null;
        let transactionCreatedInLoop = false; // FIX: Moved inside the loop

        while (nextDueDate <= today) {
            if (endDate && nextDueDate > endDate) {
                // Stop if we've passed the end date
                break;
            }
            
            transactionCreatedInLoop = true;
            // Create a new transaction for this due date
            const newTransaction = {
                title: rt.title,
                amount: rt.amount,
                type: rt.type,
                category: rt.category,
                date: nextDueDate.toISOString().split('T')[0],
                description: rt.description,
                recurringTransactionId: rt.id,
            };
            
            const createdTx = await dbService.addTransaction(newTransaction, currentTxs.concat(newTxs));
            newTxs.push(createdTx);
            
            // Calculate the next due date
            nextDueDate = dateService.calculateNextDueDate(nextDueDate.toISOString().split('T')[0], rt.frequency);
        }

        if (transactionCreatedInLoop) {
          updatedRecurringTxs[i].nextDueDate = nextDueDate.toISOString().split('T')[0];
          await dbService.updateRecurringTransaction(updatedRecurringTxs[i]); // Persist update
        }
    }
    
    return { updatedRecurringTxs, newTxs };
  }, []);


  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      
      let [storedTransactions, storedCategories, storedRecurring] = await Promise.all([
          dbService.getTransactions(),
          dbService.getCategories(),
          dbService.getRecurringTransactions(),
      ]);
      
      const { updatedRecurringTxs, newTxs } = await processRecurringTransactions(storedRecurring, storedTransactions);

      if (newTxs.length > 0) {
          storedTransactions = [...newTxs, ...storedTransactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      }

      setTransactions(storedTransactions);
      setCategoriesState(storedCategories);
      setRecurringTransactions(updatedRecurringTxs);

      const storedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
      if (storedTheme) {
        setTheme(storedTheme);
        document.documentElement.classList.toggle('dark', storedTheme === 'dark');
      } else {
        document.documentElement.classList.add('dark');
      }
      
      const storedAuth = localStorage.getItem('isAuthenticated');
      setIsAuthenticated(storedAuth === 'true');

      setLoading(false);
    };
    loadInitialData();
  }, [processRecurringTransactions]);

  const addTransaction = useCallback(async (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction = await dbService.addTransaction(transaction);
    setTransactions(prev => [newTransaction, ...prev]);
  }, []);

  const updateTransaction = useCallback(async (transaction: Transaction) => {
    const updatedTransaction = await dbService.updateTransaction(transaction);
    setTransactions(prev => prev.map(t => t.id === updatedTransaction.id ? updatedTransaction : t));
  }, []);

  const deleteTransaction = useCallback(async (id: string) => {
    await dbService.deleteTransaction(id);
    setTransactions(prev => prev.filter(t => t.id !== id));
  }, []);

  const setCategories = useCallback(async (newCategories: Category[]) => {
      await dbService.saveCategories(newCategories);
      setCategoriesState(newCategories);
  }, []);

  const addRecurringTransaction = useCallback(async (recTransaction: Omit<RecurringTransaction, 'id' | 'nextDueDate'>) => {
    const transactionWithDueDate = {
      ...recTransaction,
      nextDueDate: recTransaction.startDate,
    }
    const newRecTransaction = await dbService.addRecurringTransaction(transactionWithDueDate);
    setRecurringTransactions(prev => [newRecTransaction, ...prev]);
  }, []);

  const updateRecurringTransaction = useCallback(async (recTransaction: RecurringTransaction) => {
    const updated = await dbService.updateRecurringTransaction(recTransaction);
    setRecurringTransactions(prev => prev.map(rt => rt.id === updated.id ? updated : rt));
  }, []);

  const deleteRecurringTransaction = useCallback(async (id: string) => {
    await dbService.deleteRecurringTransaction(id);
    setRecurringTransactions(prev => prev.filter(rt => rt.id !== id));
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(prevTheme => {
      const newTheme = prevTheme === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', newTheme);
      document.documentElement.classList.toggle('dark', newTheme === 'dark');
      return newTheme;
    });
  }, []);

  const login = useCallback(() => {
      localStorage.setItem('isAuthenticated', 'true');
      setIsAuthenticated(true);
  }, []);

  const logout = useCallback(() => {
      localStorage.removeItem('isAuthenticated');
      setIsAuthenticated(false);
  }, []);

  const value = {
    transactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    categories,
    setCategories,
    recurringTransactions,
    addRecurringTransaction,
    updateRecurringTransaction,
    deleteRecurringTransaction,
    theme,
    toggleTheme,
    isAuthenticated,
    login,
    logout,
    loading,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};