
import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext.tsx';
import Icon from '../components/common/Icon.tsx';
import { RecurringTransaction } from '../types.ts';

const RecurringTransactionItem: React.FC<{ transaction: RecurringTransaction }> = ({ transaction }) => {
    const navigate = useNavigate();
    const { deleteRecurringTransaction } = useAppContext();

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        if(window.confirm('Are you sure you want to delete this recurring transaction? This will not affect any transactions already created.')) {
            deleteRecurringTransaction(transaction.id);
        }
    };

    const handleEdit = () => {
        navigate(`/recurring/edit/${transaction.id}`);
    };

    const isIncome = transaction.type === 'income';
    const amountColor = isIncome ? 'text-green-500' : 'text-red-500';
    const sign = isIncome ? '+' : '-';

    return (
        <div className="flex items-center justify-between p-3 hover:bg-gray-100 dark:hover:bg-dark-accent rounded-lg cursor-pointer" onClick={handleEdit}>
            <div className="flex items-center gap-4 flex-grow min-w-0">
                <div className={`p-2 rounded-full ${isIncome ? 'bg-green-100 dark:bg-green-900' : 'bg-red-100 dark:bg-red-900'}`}>
                    <Icon name={'recurring'} className={`w-5 h-5 ${isIncome ? 'text-green-600' : 'text-red-600'}`} />
                </div>
                <div className="flex-grow min-w-0">
                    <p className="font-semibold text-gray-800 dark:text-white truncate">{transaction.title}</p>
                    <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 mt-1 flex-wrap">
                        <span className="capitalize">{transaction.frequency}</span>
                        <span>&bull;</span>
                        <span>Next: {new Date(transaction.nextDueDate).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                        {transaction.endDate && (
                            <>
                                <span>&bull;</span>
                                <span className="text-xs italic">Ends: {new Date(transaction.endDate).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })}</span>
                            </>
                        )}
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-2 pl-2">
                <p className={`font-semibold text-right whitespace-nowrap ${amountColor}`}>
                    {sign} {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(transaction.amount)}
                </p>
                <button onClick={handleDelete} className="p-1 text-gray-400 hover:text-red-500 transition-colors" aria-label="Delete recurring transaction">
                    <Icon name="delete" className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};


const RecurringTransactions: React.FC = () => {
    const { recurringTransactions } = useAppContext();
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('nextDueDate');
    const [sortOrder, setSortOrder] = useState('asc');

    const processedTransactions = useMemo(() => {
        let filtered = recurringTransactions.filter(t => 
            t.title.toLowerCase().includes(searchTerm.toLowerCase())
        );

        filtered.sort((a, b) => {
            let val = 0;
            switch(sortBy) {
                case 'nextDueDate':
                    val = new Date(a.nextDueDate).getTime() - new Date(b.nextDueDate).getTime();
                    break;
                case 'amount':
                    val = b.amount - a.amount;
                    break;
                case 'title':
                    val = a.title.localeCompare(b.title);
                    break;
            }
            return sortOrder === 'asc' ? val : -val;
        });

        return filtered;
    }, [recurringTransactions, searchTerm, sortBy, sortOrder]);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                     <Link to="/settings" className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-dark-accent">
                        <Icon name="back" className="w-6 h-6"/>
                    </Link>
                    <h1 className="text-2xl font-bold">Transaksi Berulang</h1>
                </div>
                <Link to="/recurring/add" className="inline-flex items-center gap-2 px-4 py-2 bg-neon-blue text-white rounded-lg hover:bg-neon-blue-light transition-colors text-sm font-medium">
                    <Icon name="plus" className="w-5 h-5" />
                    <span>Baru</span>
                </Link>
            </div>
            
            <div className="p-3 bg-gray-50 dark:bg-dark-accent rounded-lg space-y-3 sm:space-y-0 sm:flex sm:items-center sm:justify-between sm:gap-4">
                <div className="flex-grow">
                    <input 
                        type="text"
                        placeholder="Cari berdasarkan judul..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="form-input w-full"
                        aria-label="Search recurring transactions"
                    />
                </div>
                <div className="flex items-center justify-between sm:justify-start gap-2">
                    <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="form-input" aria-label="Sort by">
                        <option value="nextDueDate">Tanggal Berikutnya</option>
                        <option value="title">Judul</option>
                        <option value="amount">Nominal</option>
                    </select>
                    <button onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')} className="p-2 rounded-lg bg-gray-200 dark:bg-dark-secondary hover:bg-gray-300 dark:hover:bg-slate-600" aria-label={`Sort order: ${sortOrder}`}>
                        <Icon name="sort" className={`w-5 h-5 transition-transform ${sortOrder === 'desc' ? 'transform rotate-180' : ''}`}/>
                    </button>
                </div>
            </div>

            {processedTransactions.length > 0 ? (
                <div className="space-y-2 bg-white dark:bg-dark-secondary p-2 rounded-lg">
                    {processedTransactions.map(rt => <RecurringTransactionItem key={rt.id} transaction={rt} />)}
                </div>
            ) : (
                <div className="text-center py-12 border-2 border-dashed border-gray-300 dark:border-dark-accent rounded-lg">
                    <p className="text-gray-500 dark:text-gray-400">Tidak ada transaksi berulang yang cocok.</p>
                     <Link to="/recurring/add" className="mt-2 inline-flex items-center gap-2 text-neon-blue hover:underline">
                        Buat Transaksi Berulang
                    </Link>
                </div>
            )}
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

export default RecurringTransactions;