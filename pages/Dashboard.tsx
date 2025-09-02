
import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext.tsx';
import Icon from '../components/common/Icon.tsx';
import TransactionList from '../components/transactions/TransactionList.tsx';
import { IconName } from '../types.ts';

const SummaryCard: React.FC<{ title: string; amount: number; color: string; icon: IconName }> = ({ title, amount, color, icon }) => (
    <div className="bg-white dark:bg-dark-secondary p-4 rounded-xl shadow-md flex items-center gap-4">
        <div className={`p-3 rounded-full ${color}`}>
            <Icon name={icon} className="w-6 h-6 text-white" />
        </div>
        <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
            <p className="text-xl font-bold text-gray-800 dark:text-white">
                {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(amount)}
            </p>
        </div>
    </div>
);

const Dashboard: React.FC = () => {
    const { transactions, loading } = useAppContext();

    const { totalIncome, totalExpense, balance } = useMemo(() => {
        return transactions.reduce((acc, t) => {
            if (t.type === 'income') {
                acc.totalIncome += t.amount;
            } else {
                acc.totalExpense += t.amount;
            }
            acc.balance = acc.totalIncome - acc.totalExpense;
            return acc;
        }, { totalIncome: 0, totalExpense: 0, balance: 0 });
    }, [transactions]);

    if (loading) {
        return <div className="text-center p-8">Loading data...</div>;
    }
    
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Dashboard</h1>
                <p className="text-gray-500 dark:text-gray-400">Welcome back to your financial tracker.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <SummaryCard title="Total Pemasukan" amount={totalIncome} color="bg-green-500" icon="arrow-trending-up" />
                <SummaryCard title="Total Pengeluaran" amount={totalExpense} color="bg-red-500" icon="arrow-trending-down" />
                <div className="bg-white dark:bg-dark-secondary p-4 rounded-xl shadow-md flex items-center gap-4">
                    <div className="p-3 rounded-full bg-blue-500">
                        <Icon name="wallet" className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Saldo Saat Ini</p>
                        <p className={`text-xl font-bold ${balance >= 0 ? 'text-neon-blue' : 'text-red-500'} dark:text-neon-blue-light`}>
                            {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(balance)}
                        </p>
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-dark-secondary p-4 sm:p-6 rounded-xl shadow-md">
                 <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Transaksi Terakhir</h2>
                    <Link to="/transactions" className="text-sm font-medium text-neon-blue hover:underline">
                        Lihat Semua
                    </Link>
                </div>
                {transactions.length > 0 ? (
                   <TransactionList transactions={transactions.slice(0, 5)} />
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

export default Dashboard;
