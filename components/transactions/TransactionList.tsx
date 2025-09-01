import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Transaction } from '../../types.ts';
import Icon from '../common/Icon.tsx';
import { useAppContext } from '../../context/AppContext.tsx';

interface TransactionListProps {
  transactions: Transaction[];
}

const TransactionItem: React.FC<{ transaction: Transaction }> = ({ transaction }) => {
    const navigate = useNavigate();
    const { deleteTransaction, categories } = useAppContext();
    
    const category = useMemo(() => categories.find(c => c.name === transaction.category), [categories, transaction.category]);

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        if(window.confirm('Apakah Anda yakin ingin menghapus transaksi ini?')) {
            deleteTransaction(transaction.id);
        }
    };
    
    const handleEdit = () => {
        navigate(`/edit/${transaction.id}`);
    };

    const isIncome = transaction.type === 'income';
    const amountColor = isIncome ? 'text-green-500' : 'text-red-500';
    const sign = isIncome ? '+' : '-';
    
    return (
        <div className="flex items-start justify-between p-3 hover:bg-gray-100 dark:hover:bg-dark-accent rounded-lg cursor-pointer" onClick={handleEdit}>
            <div className="flex items-center gap-4 flex-grow min-w-0">
                 <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: category?.color ? `${category.color}33` : '#E5E7EB' }}
                >
                    <span className="text-xl">{category?.icon || '📁'}</span>
                </div>
                <div className="flex-grow min-w-0">
                    <div className="flex items-center gap-2">
                        <p className="font-semibold text-gray-800 dark:text-white truncate">{transaction.title}</p>
                        {transaction.recurringTransactionId && <Icon name="recurring" className="w-4 h-4 text-blue-500 flex-shrink-0" title="Recurring Transaction" />}
                    </div>
                    <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 mt-1 flex-wrap">
                        <span>{transaction.category}</span>
                        <span>&bull;</span>
                        <span>{new Date(transaction.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-2 pl-2">
                <p className={`font-semibold text-right whitespace-nowrap ${amountColor}`}>
                    {sign} {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(transaction.amount)}
                </p>
                <button onClick={handleDelete} className="p-1 text-gray-400 hover:text-red-500 transition-colors" aria-label="Delete transaction">
                    <Icon name="delete" className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

const TransactionList: React.FC<TransactionListProps> = ({ transactions }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('date');
    const [sortOrder, setSortOrder] = useState('desc');

    const processedTransactions = useMemo(() => {
        let filtered = transactions.filter(t => 
            t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (t.description && t.description.toLowerCase().includes(searchTerm.toLowerCase()))
        );

        filtered.sort((a, b) => {
            if (sortBy === 'date') {
                const val = new Date(b.date).getTime() - new Date(a.date).getTime();
                return sortOrder === 'asc' ? -val : val;
            }
            if (sortBy === 'amount') {
                const val = b.amount - a.amount;
                return sortOrder === 'asc' ? -val : val;
            }
            if (sortBy === 'category') {
                const val = a.category.localeCompare(b.category);
                return sortOrder === 'desc' ? -val : val;
            }
            return 0;
        });

        return filtered;
    }, [transactions, searchTerm, sortBy, sortOrder]);

    return (
    <div className="space-y-4">
      <div className="p-3 bg-gray-50 dark:bg-dark-accent rounded-lg space-y-3 sm:space-y-0 sm:flex sm:items-center sm:justify-between sm:gap-4">
        <div className="flex-grow">
          <input 
            type="text"
            placeholder="Cari transaksi..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input w-full"
            aria-label="Search transactions"
          />
        </div>
        <div className="flex items-center justify-between sm:justify-start gap-2">
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="form-input" aria-label="Sort by">
            <option value="date">Tanggal</option>
            <option value="amount">Nominal</option>
            <option value="category">Kategori</option>
          </select>
          <button onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')} className="p-2 rounded-lg bg-gray-200 dark:bg-dark-secondary hover:bg-gray-300 dark:hover:bg-slate-600" aria-label={`Sort order: ${sortOrder}`}>
            <Icon name="sort" className={`w-5 h-5 transition-transform ${sortOrder === 'asc' ? 'transform rotate-180' : ''}`}/>
          </button>
        </div>
      </div>

      <div className="space-y-2">
        {processedTransactions.map(transaction => (
          <TransactionItem key={transaction.id} transaction={transaction} />
        ))}
      </div>
       <style>{`
                .form-input {
                    padding: 0.5rem 0.75rem;
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
                }
                .dark .form-input {
                    background-color: #334155;
                    color: #f8fafc;
                    border-color: #475569;
                }
             `}</style>
    </div>
  );
};

export default TransactionList;