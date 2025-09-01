
import { Transaction, Category, RecurringTransaction } from '../types.ts';
import { DEFAULT_EXPENSE_CATEGORIES, DEFAULT_INCOME_CATEGORIES } from '../constants.ts';

const TRANSACTIONS_KEY = 'keena_transactions';
const CATEGORIES_KEY = 'keena_categories';
const RECURRING_TRANSACTIONS_KEY = 'keena_recurring_transactions';

const getTransactions = async (): Promise<Transaction[]> => {
  const data = localStorage.getItem(TRANSACTIONS_KEY);
  return data ? JSON.parse(data).sort((a: Transaction, b: Transaction) => new Date(b.date).getTime() - new Date(a.date).getTime()) : [];
};

const addTransaction = async (transaction: Omit<Transaction, 'id'>, existingList?: Transaction[]): Promise<Transaction> => {
  const transactions = existingList ?? await getTransactions();
  const newTransaction: Transaction = {
    ...transaction,
    id: `txn_${new Date().getTime()}_${Math.random().toString(36).substr(2, 9)}`,
  };
  const updatedTransactions = [newTransaction, ...transactions];
  localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(updatedTransactions));
  return newTransaction;
};

const updateTransaction = async (transaction: Transaction): Promise<Transaction> => {
    const transactions = await getTransactions();
    const index = transactions.findIndex(t => t.id === transaction.id);
    if (index === -1) throw new Error("Transaction not found");
    
    transactions[index] = transaction;
    localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));
    return transaction;
};

const deleteTransaction = async (id: string): Promise<void> => {
    let transactions = await getTransactions();
    transactions = transactions.filter(t => t.id !== id);
    localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));
};

const getCategories = async (): Promise<Category[]> => {
    const data = localStorage.getItem(CATEGORIES_KEY);
    if (data) {
        return JSON.parse(data);
    }
    const defaultCategories = [...DEFAULT_INCOME_CATEGORIES, ...DEFAULT_EXPENSE_CATEGORIES];
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(defaultCategories));
    return defaultCategories;
};

const saveCategories = async (categories: Category[]): Promise<void> => {
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
};

const getRecurringTransactions = async (): Promise<RecurringTransaction[]> => {
  const data = localStorage.getItem(RECURRING_TRANSACTIONS_KEY);
  return data ? JSON.parse(data) : [];
};

const addRecurringTransaction = async (transaction: Omit<RecurringTransaction, 'id'>): Promise<RecurringTransaction> => {
  const recurringTxs = await getRecurringTransactions();
  const newRecurringTx: RecurringTransaction = {
    ...transaction,
    id: `rectxn_${new Date().getTime()}_${Math.random().toString(36).substr(2, 9)}`,
  };
  const updatedRecurringTxs = [newRecurringTx, ...recurringTxs];
  localStorage.setItem(RECURRING_TRANSACTIONS_KEY, JSON.stringify(updatedRecurringTxs));
  return newRecurringTx;
};

const updateRecurringTransaction = async (transaction: RecurringTransaction): Promise<RecurringTransaction> => {
    const recurringTxs = await getRecurringTransactions();
    const index = recurringTxs.findIndex(t => t.id === transaction.id);
    if (index === -1) throw new Error("Recurring transaction not found");
    
    recurringTxs[index] = transaction;
    localStorage.setItem(RECURRING_TRANSACTIONS_KEY, JSON.stringify(recurringTxs));
    return transaction;
};

const deleteRecurringTransaction = async (id: string): Promise<void> => {
    let recurringTxs = await getRecurringTransactions();
    recurringTxs = recurringTxs.filter(t => t.id !== id);
    localStorage.setItem(RECURRING_TRANSACTIONS_KEY, JSON.stringify(recurringTxs));
};

export const dbService = {
  getTransactions,
  addTransaction,
  updateTransaction,
  deleteTransaction,
  getCategories,
  saveCategories,
  getRecurringTransactions,
  addRecurringTransaction,
  updateRecurringTransaction,
  deleteRecurringTransaction,
};