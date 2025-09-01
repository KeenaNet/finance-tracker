
import React, { useState, useEffect, useMemo } from 'react';
import { Transaction } from '../../types.ts';
import { useAppContext } from '../../context/AppContext.tsx';

interface TransactionFormProps {
  onSubmit: (transaction: Omit<Transaction, 'id'> | Transaction) => void;
  initialData?: Transaction;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ onSubmit, initialData }) => {
    const { categories } = useAppContext();
    const [title, setTitle] = useState('');
    const [amount, setAmount] = useState('');
    const [type, setType] = useState<'income' | 'expense'>('expense');
    const [category, setCategory] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (initialData) {
            setTitle(initialData.title);
            setAmount(String(initialData.amount));
            setType(initialData.type);
            setCategory(initialData.category);
            setDate(initialData.date);
            setDescription(initialData.description || '');
        }
    }, [initialData]);

    const availableCategories = useMemo(() => {
        return categories.filter(c => c.type === type);
    }, [categories, type]);

    useEffect(() => {
        // If the selected category is not available for the new type, reset it.
        if (availableCategories.length > 0 && !availableCategories.find(c => c.name === category)) {
            setCategory(availableCategories[0].name);
        } else if (availableCategories.length === 0) {
            setCategory('');
        }
    }, [type, availableCategories, category]);


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !amount || !category) {
            setError('Judul, nominal, dan kategori wajib diisi.');
            return;
        }
        const numericAmount = parseFloat(amount);
        if (isNaN(numericAmount) || numericAmount <= 0) {
            setError('Nominal harus berupa angka positif.');
            return;
        }
        setError('');

        const transactionData = {
            title,
            amount: numericAmount,
            type,
            category,
            date,
            description,
        };

        if (initialData) {
            onSubmit({ ...transactionData, id: initialData.id });
        } else {
            onSubmit(transactionData);
        }
    };
    
    return (
        <form onSubmit={handleSubmit} className="space-y-4 bg-white dark:bg-dark-secondary p-6 rounded-lg shadow-md">
            {error && <div className="p-3 bg-red-100 text-red-700 rounded-md">{error}</div>}
            
            <div className="grid grid-cols-2 gap-4">
                <button 
                    type="button" 
                    onClick={() => setType('expense')}
                    className={`p-3 rounded-lg font-semibold transition-colors ${type === 'expense' ? 'bg-red-500 text-white' : 'bg-gray-200 dark:bg-dark-accent'}`}
                >
                    Pengeluaran
                </button>
                <button 
                    type="button" 
                    onClick={() => setType('income')}
                    className={`p-3 rounded-lg font-semibold transition-colors ${type === 'income' ? 'bg-green-500 text-white' : 'bg-gray-200 dark:bg-dark-accent'}`}
                >
                    Pemasukan
                </button>
            </div>

            <div>
                <label htmlFor="title" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Judul</label>
                <input type="text" id="title" value={title} onChange={e => setTitle(e.target.value)} className="form-input" placeholder="e.g., Beli Sparepart" required />
            </div>

            <div>
                <label htmlFor="amount" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nominal (IDR)</label>
                <input type="number" id="amount" value={amount} onChange={e => setAmount(e.target.value)} className="form-input" placeholder="e.g., 50000" required />
            </div>

            <div>
                <label htmlFor="category" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Kategori</label>
                <select id="category" value={category} onChange={e => setCategory(e.target.value)} className="form-input" required>
                    <option value="" disabled>Pilih kategori</option>
                    {availableCategories.map(cat => <option key={cat.id} value={cat.name}>{cat.name}</option>)}
                </select>
            </div>

            <div>
                <label htmlFor="date" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Tanggal</label>
                <input type="date" id="date" value={date} onChange={e => setDate(e.target.value)} className="form-input" required />
            </div>

            <div>
                <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Deskripsi (Opsional)</label>
                <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} rows={3} className="form-input" placeholder="Detail tambahan..."></textarea>
            </div>

            <button type="submit" className="w-full text-white bg-neon-blue hover:bg-neon-blue-light focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-3 text-center dark:focus:ring-blue-800">
                {initialData ? 'Update Transaksi' : 'Simpan Transaksi'}
            </button>
             <style>{`
                .form-input {
                    display: block;
                    width: 100%;
                    padding: 0.75rem;
                    border-radius: 0.5rem;
                    border: 1px solid;
                    background-color: #f9fafb;
                    color: #111827;
                    border-color: #d1d5db;
                }
                .form-input:focus {
                    outline: 2px solid transparent;
                    outline-offset: 2px;
                    border-color: #2563eb;
                    box-shadow: 0 0 0 2px #2563eb;
                }
                .dark .form-input {
                    background-color: #334155;
                    color: #f8fafc;
                    border-color: #475569;
                }
             `}</style>
        </form>
    );
};

export default TransactionForm;