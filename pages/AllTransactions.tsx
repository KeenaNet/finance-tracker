
import React from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext.tsx';
import Icon from '../components/common/Icon.tsx';
import TransactionList from '../components/transactions/TransactionList.tsx';

const AllTransactions: React.FC = () => {
    const { transactions, loading } = useAppContext();

    if (loading) {
        return <div className="text-center p-8">Loading data...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link to="/" className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-dark-accent">
                    <Icon name="back" className="w-6 h-6"/>
                </Link>
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Semua Transaksi</h1>
            </div>
            
            <div className="bg-white dark:bg-dark-secondary p-4 sm:p-6 rounded-xl shadow-md">
                {transactions.length > 0 ? (
                   <TransactionList transactions={transactions} />
                ) : (
                    <div className="text-center py-8 border-2 border-dashed border-gray-300 dark:border-dark-accent rounded-lg">
                        <p className="text-gray-500 dark:text-gray-400">Belum ada transaksi.</p>
                        <Link to="/add" className="mt-2 inline-flex items-center gap-2 px-4 py-2 bg-neon-blue text-white rounded-lg hover:bg-neon-blue-light transition-colors">
                            <Icon name="add" className="w-5 h-5"/>
                            Tambah Transaksi Pertama
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AllTransactions;
