
import { Category } from './types.ts';

export const DEFAULT_EXPENSE_CATEGORIES: Category[] = [
    { id: 'cat-exp-1', name: 'Belanja', type: 'expense', icon: '🛍️', color: '#FF9B9B' },
    { id: 'cat-exp-2', name: 'Bisnis', type: 'expense', icon: '💼', color: '#FFD6A5' },
    { id: 'cat-exp-3', name: 'Dapur', type: 'expense', icon: '🍳', color: '#FDFFAB' },
    { id: 'cat-exp-4', name: 'Kesehatan', type: 'expense', icon: '💊', color: '#CBFFA9' },
    { id: 'cat-exp-5', name: 'Langganan', type: 'expense', icon: '🔁', color: '#93E9BE' },
    { id: 'cat-exp-6', name: 'Main', type: 'expense', icon: '🎮', color: '#A5DEE5' },
    { id: 'cat-exp-7', name: 'Makan & Minum', type: 'expense', icon: '🍔', color: '#A5C0EE' },
    { id: 'cat-exp-8', name: 'Perawatan', type: 'expense', icon: '💆‍♀️', color: '#A5A6EE' },
    { id: 'cat-exp-9', name: 'Rumah', type: 'expense', icon: '🏠', color: '#C9A5EE' },
    { id: 'cat-exp-10', name: 'Tagihan', type: 'expense', icon: '🧾', color: '#EEA5E3' },
    { id: 'cat-exp-11', name: 'Transportasi', type: 'expense', icon: '🚗', color: '#EEA5BB' },
    { id: 'cat-exp-12', name: 'Lain-lain', type: 'expense', icon: '📁', color: '#CCCCCC' },
];

export const DEFAULT_INCOME_CATEGORIES: Category[] = [
    { id: 'cat-inc-1', name: 'Gaji', type: 'income', icon: '💰', color: '#86E3CE' },
    { id: 'cat-inc-2', name: 'Proyek', type: 'income', icon: '🏗️', color: '#FFDD94' },
    { id: 'cat-inc-3', name: 'Penjualan', type: 'income', icon: '📈', color: '#FA897B' },
];