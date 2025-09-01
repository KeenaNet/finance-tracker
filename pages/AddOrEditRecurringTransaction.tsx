
import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext.tsx';
import { RecurringTransaction } from '../types.ts';
import Icon from '../components/common/Icon.tsx';
import RecurringTransactionForm from '../components/transactions/RecurringTransactionForm.tsx';

const AddOrEditRecurringTransaction: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { recurringTransactions, addRecurringTransaction, updateRecurringTransaction } = useAppContext();
    
    const isEditing = Boolean(id);
    const transactionToEdit = isEditing ? recurringTransactions.find(t => t.id === id) : undefined;

    const handleSubmit = async (transactionData: Omit<RecurringTransaction, 'id' | 'nextDueDate'> | RecurringTransaction) => {
        if (isEditing && 'id' in transactionData) {
            await updateRecurringTransaction(transactionData as RecurringTransaction);
        } else {
            await addRecurringTransaction(transactionData as Omit<RecurringTransaction, 'id' | 'nextDueDate'>);
        }
        navigate('/recurring');
    };
    
    return (
        <div>
            <div className="flex items-center gap-4 mb-6">
                <Link to="/recurring" className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-dark-accent">
                    <Icon name="back" className="w-6 h-6"/>
                </Link>
                <h1 className="text-2xl font-bold">{isEditing ? 'Edit Transaksi Berulang' : 'Tambah Transaksi Berulang'}</h1>
            </div>
            <RecurringTransactionForm 
                onSubmit={handleSubmit} 
                initialData={transactionToEdit}
            />
        </div>
    );
};

export default AddOrEditRecurringTransaction;