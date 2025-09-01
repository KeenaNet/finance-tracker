
import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import TransactionForm from '../components/transactions/TransactionForm.tsx';
import { useAppContext } from '../context/AppContext.tsx';
import { Transaction } from '../types.ts';
import Icon from '../components/common/Icon.tsx';

const AddOrEditTransaction: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { transactions, addTransaction, updateTransaction } = useAppContext();
    
    const isEditing = Boolean(id);
    const transactionToEdit = isEditing ? transactions.find(t => t.id === id) : undefined;

    const handleSubmit = async (transactionData: Omit<Transaction, 'id'> | Transaction) => {
        if (isEditing && 'id' in transactionData) {
            await updateTransaction(transactionData as Transaction);
        } else {
            await addTransaction(transactionData as Omit<Transaction, 'id'>);
        }
        navigate('/');
    };
    
    return (
        <div>
            <div className="flex items-center gap-4 mb-6">
                <Link to="/" className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-dark-accent">
                    <Icon name="back" className="w-6 h-6"/>
                </Link>
                <h1 className="text-2xl font-bold">{isEditing ? 'Edit Transaksi' : 'Tambah Transaksi'}</h1>
            </div>
            <TransactionForm 
                onSubmit={handleSubmit} 
                initialData={transactionToEdit}
            />
        </div>
    );
};

export default AddOrEditTransaction;