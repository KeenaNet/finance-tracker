export type IconName = 'dashboard' | 'add' | 'reports' | 'settings' | 'income' | 'expense' | 'edit' | 'delete' | 'close' | 'logout' | 'login' | 'sun' | 'moon' | 'download' | 'back' | 'food' | 'transport' | 'bills' | 'shopping' | 'health' | 'salary' | 'gift' | 'home' | 'car' | 'briefcase' | 'plus' | 'sort' | 'recurring' | 'arrow-trending-up' | 'arrow-trending-down' | 'wallet' | 'tiktok';

export type RecurrenceFrequency = 'daily' | 'weekly' | 'monthly' | 'yearly';

export interface RecurringTransaction {
  id: string;
  title: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  description?: string;
  frequency: RecurrenceFrequency;
  startDate: string; // ISO 8601 format
  endDate?: string; // ISO 8601 format
  nextDueDate: string; // ISO 8601 format
}

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  date: string; // ISO 8601 format
  description?: string;
  recurringTransactionId?: string;
}

export interface Category {
    id: string;
    name: string;
    type: 'income' | 'expense';
    icon: string; // Emoji character
    color: string; // Hex color code
}