
import React, { useState, useEffect, useMemo } from 'react';
import { RecurringTransaction, RecurrenceFrequency } from '../../types.ts';
import { useAppContext } from '../../context/AppContext.tsx';

interface RecurringTransactionFormProps {
  onSubmit: (transaction: Omit<RecurringTransaction, 'id' | 'nextDueDate'> | RecurringTransaction) => void;
  initialData?: RecurringTransaction;
}

const RecurringTransactionForm: React.FC<RecurringTransactionFormProps> = ({ onSubmit, initialData }) => {
    const { categories } = useAppContext();
    const [title, setTitle] = useState('');
    const [amount, setAmount] = useState('');
    const [type, setType] = useState<'income' | 'expense'>('expense');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [frequency, setFrequency] = useState<RecurrenceFrequency>('monthly');
    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (initialData) {
            setTitle(initialData.title);
            setAmount(String(initialData.amount));
            setType(initialData.type);
            setCategory(initialData.category);
            setDescription(initialData.description || '');
            setFrequency(initialData.frequency);
            setStartDate(initialData.startDate);
            setEndDate(initialData.endDate || '');
        }
    }, [initialData]);
    
    const availableCategories = useMemo(() => {
        return categories.filter(c => c.type === type);
    }, [categories, type]);

    useEffect(() => {
        if (availableCategories.length > 0 && !availableCategories.find(c => c.name === category)) {
            setCategory(availableCategories[0].name);
        } else if (availableCategories.length === 0) {
            setCategory('');
        }
    }, [type, availableCategories, category]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !amount || !category || !startDate) {
            setError('Judul, Nominal, Kategori, dan Tanggal Mulai wajib diisi.');
            return;
        }
        const numericAmount = parseFloat(amount);
        if (isNaN(numericAmount) || numericAmount <= 0) {
            setError('Nominal harus berupa angka positif.');
            return;
        }

        if (endDate && startDate && new Date(endDate) < new Date(startDate)) {
            setError('Tanggal berakhir tidak boleh sebelum tanggal mulai.');
            return;
        }
        
        setError('');

        const transactionData: Omit<RecurringTransaction, 'id' | 'nextDueDate'> = {
            title,
            amount: numericAmount,
            type,
            category,
            description,
            frequency,
            startDate,
            endDate: endDate || undefined,
        };

        if (initialData) {
            onSubmit({ ...transactionData, id: initialData.id, nextDueDate: initialData.nextDueDate });
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
            
            <h3 className="text-lg font-semibold border-b border-gray-300 dark:border-dark-accent pb-2">Detail Transaksi</h3>

            <div>
                <label htmlFor="title" className="form-label">Judul</label>
                <input type="text" id="title" value={title} onChange={e => setTitle(e.target.value)} className="form-input" placeholder="e.g., Langganan Netflix" required />
            </div>

            <div>
                <label htmlFor="amount" className="form-label">Nominal (IDR)</label>
                <input type="number" id="amount" value={amount} onChange={e => setAmount(e.target.value)} className="form-input" placeholder="e.g., 186000" required />
            </div>

            <div>
                <label htmlFor="category" className="form-label">Kategori</label>
                <select id="category" value={category} onChange={e => setCategory(e.target.value)} className="form-input" required>
                    <option value="" disabled>Pilih kategori</option>
                    {availableCategories.map(cat => <option key={cat.id} value={cat.name}>{cat.name}</option>)}
                </select>
            </div>
            
            <div>
                <label htmlFor="description" className="form-label">Deskripsi (Opsional)</label>
                <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} rows={3} className="form-input" placeholder="Detail tambahan..."></textarea>
            </div>
            
            <h3 className="text-lg font-semibold border-b border-gray-300 dark:border-dark-accent pb-2 pt-4">Aturan Berulang</h3>

            <div>
                <label htmlFor="frequency" className="form-label">Frekuensi</label>
                <select id="frequency" value={frequency} onChange={e => setFrequency(e.target.value as RecurrenceFrequency)} className="form-input" required>
                    <option value="daily">Harian</option>
                    <option value="weekly">Mingguan</option>
                    <option value="monthly">Bulanan</option>
                    <option value="yearly">Tahunan</option>
                </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="startDate" className="form-label">Tanggal Mulai</label>
                    <input type="date" id="startDate" value={startDate} onChange={e => setStartDate(e.target.value)} className="form-input" required />
                </div>
                <div>
                    <label htmlFor="endDate" className="form-label">Tanggal Berakhir (Opsional)</label>
                    <input type="date" id="endDate" value={endDate} onChange={e => setEndDate(e.target.value)} className="form-input" />
                </div>
            </div>

            <button type="submit" className="w-full text-white bg-neon-blue hover:bg-neon-blue-light focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-3 text-center dark:focus:ring-blue-800">
                {initialData ? 'Update Transaksi Berulang' : 'Simpan Transaksi Berulang'}
            </button>
             <style>{`
                .form-label {
                    display: block;
                    margin-bottom: 0.5rem;
                    font-size: 0.875rem;
                    font-weight: 500;
                    color: #111827;
                }
                .dark .form-label {
                    color: #f8fafc;
                }
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

export default RecurringTransactionForm;