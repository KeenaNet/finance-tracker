import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext.tsx';
import Icon from '../components/common/Icon.tsx';
import { Category } from '../types.ts';
import EmojiPicker from '../components/common/EmojiPicker.tsx';

const Settings: React.FC = () => {
    const { 
        theme, 
        toggleTheme, 
        isAuthenticated, 
        login, 
        logout, 
        categories, 
        setCategories 
    } = useAppContext();

    const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [newCategoryType, setNewCategoryType] = useState<'income' | 'expense'>('expense');
    const [newCategoryIcon, setNewCategoryIcon] = useState('🛍️');
    const [newCategoryColor, setNewCategoryColor] = useState('#FF9B9B');

    const incomeCategories = useMemo(() =>
        categories
            .filter(c => c.type === 'income')
            .sort((a, b) => a.name.localeCompare(b.name)),
        [categories]
    );

    const expenseCategories = useMemo(() =>
        categories
            .filter(c => c.type === 'expense')
            .sort((a, b) => a.name.localeCompare(b.name)),
        [categories]
    );

    const handleAddCategory = (e: React.FormEvent) => {
        e.preventDefault();
        if (newCategoryName.trim() === '' || categories.find(c => c.name.toLowerCase() === newCategoryName.trim().toLowerCase())) {
            // Add error handling feedback if desired
            return;
        }
        const newCategory: Category = {
            id: `cat_${new Date().getTime()}`,
            name: newCategoryName.trim(),
            type: newCategoryType,
            icon: newCategoryIcon,
            color: newCategoryColor,
        };
        setCategories([...categories, newCategory]);
        setNewCategoryName('');
        setNewCategoryIcon('🛍️');
        setNewCategoryColor('#FF9B9B');
    };

    const handleDeleteCategory = (id: string) => {
        const categoryToDelete = categories.find(c => c.id === id);
        if (window.confirm(`Apakah Anda yakin ingin menghapus kategori "${categoryToDelete?.name}"? Tindakan ini tidak dapat diurungkan.`)) {
            setCategories(categories.filter(c => c.id !== id));
        }
    };

    return (
        <div className="space-y-8">
            <h1 className="text-2xl font-bold">Pengaturan</h1>

            <div className="bg-white dark:bg-dark-secondary p-4 rounded-lg shadow">
                <h2 className="font-semibold mb-2">Tema Tampilan</h2>
                <div className="flex items-center justify-between">
                    <span>Mode {theme === 'dark' ? 'Gelap' : 'Terang'}</span>
                    <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-dark-accent">
                        <Icon name={theme === 'dark' ? 'sun' : 'moon'} className="w-6 h-6 text-neon-blue" />
                    </button>
                </div>
            </div>

             <div className="bg-white dark:bg-dark-secondary p-4 rounded-lg shadow">
                <h2 className="font-semibold mb-2">Automasi</h2>
                 <Link to="/recurring" className="flex items-center justify-between py-2 hover:bg-gray-50 dark:hover:bg-dark-accent rounded-md -mx-2 px-2">
                    <div className="flex items-center gap-3">
                        <Icon name="recurring" className="w-6 h-6 text-neon-blue" />
                        <span>Kelola Transaksi Berulang</span>
                    </div>
                    <Icon name="back" className="w-5 h-5 text-gray-400 transform -rotate-180" />
                </Link>
            </div>

            <div className="bg-white dark:bg-dark-secondary p-4 rounded-lg shadow">
                <h2 className="font-semibold mb-2">Akun</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Sinkronisasi data antar perangkat (fitur simulasi).</p>
                {isAuthenticated ? (
                    <button onClick={logout} className="w-full inline-flex justify-center items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                        <Icon name="logout" className="w-5 h-5"/>
                        Logout
                    </button>
                ) : (
                    <button onClick={login} className="w-full inline-flex justify-center items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        <Icon name="login" className="w-5 h-5"/>
                        Login dengan Google (Simulasi)
                    </button>
                )}
            </div>

            <div className="bg-white dark:bg-dark-secondary p-4 rounded-lg shadow">
                <h2 className="font-semibold mb-4">Kelola Kategori</h2>
                
                <div className="border-b border-gray-200 dark:border-dark-accent pb-4 mb-4">
                    <h3 className="text-md font-medium mb-3">Tambah Kategori</h3>
                     <form onSubmit={handleAddCategory} className="space-y-4">
                        <div className="flex justify-center gap-4">
                            <div>
                                <label className="block text-center text-sm font-medium text-gray-500 dark:text-gray-400">Pilih emoji</label>
                                <button type="button" onClick={() => setIsEmojiPickerOpen(true)} className="mt-1 w-20 h-20 bg-gray-100 dark:bg-dark-accent rounded-lg flex items-center justify-center text-4xl hover:bg-gray-200 dark:hover:bg-slate-600">
                                    {newCategoryIcon}
                                </button>
                            </div>
                            <div>
                                <label className="block text-center text-sm font-medium text-gray-500 dark:text-gray-400">Pilih warna</label>
                                <div className="relative mt-1 w-20 h-20 bg-gray-100 dark:bg-dark-accent rounded-lg flex items-center justify-center hover:bg-gray-200 dark:hover:bg-slate-600">
                                    <div className="w-12 h-12 rounded-lg" style={{ backgroundColor: newCategoryColor }}></div>
                                    <input 
                                        type="color"
                                        value={newCategoryColor}
                                        onChange={(e) => setNewCategoryColor(e.target.value)}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="newCategoryName" className="block text-sm font-medium text-gray-900 dark:text-white">Nama</label>
                            <input 
                                id="newCategoryName"
                                type="text" 
                                value={newCategoryName}
                                onChange={(e) => setNewCategoryName(e.target.value)}
                                placeholder="Nama kategori"
                                className="mt-1 form-input"
                                required
                            />
                        </div>
                        
                        <div>
                            <label htmlFor="newCategoryType" className="block text-sm font-medium text-gray-900 dark:text-white">Tipe</label>
                            <select 
                                id="newCategoryType"
                                value={newCategoryType}
                                onChange={(e) => setNewCategoryType(e.target.value as 'income' | 'expense')}
                                className="mt-1 form-input"
                            >
                                <option value="expense">Pengeluaran</option>
                                <option value="income">Pemasukan</option>
                            </select>
                        </div>

                        <button type="submit" className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-neon-blue text-white rounded-lg hover:bg-neon-blue-light transition-colors">
                            <Icon name="plus" className="w-5 h-5" />
                            Tambah Kategori
                        </button>
                    </form>

                    {isEmojiPickerOpen && (
                        <EmojiPicker 
                            onSelect={setNewCategoryIcon}
                            onClose={() => setIsEmojiPickerOpen(false)}
                        />
                    )}
                </div>

                <div className="max-h-72 overflow-y-auto space-y-4">
                    <div>
                        <h4 className="text-md font-semibold text-gray-600 dark:text-gray-300 mb-2 border-b border-gray-200 dark:border-dark-accent pb-1">Kategori Pemasukan</h4>
                        <div className="space-y-2 pt-2">
                            {incomeCategories.length > 0 ? (
                                incomeCategories.map(cat => (
                                    <div key={cat.id} className="flex items-center justify-between p-2 bg-gray-100 dark:bg-dark-accent rounded">
                                        <div className="flex items-center gap-3">
                                           <div className="w-8 h-8 rounded-full flex items-center justify-center text-lg" style={{ backgroundColor: cat.color }}>
                                                {cat.icon}
                                            </div>
                                            <span>{cat.name}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button onClick={() => handleDeleteCategory(cat.id)} className="text-gray-400 hover:text-red-500" aria-label={`Delete ${cat.name} category`}>
                                                <Icon name="delete" className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-gray-500 dark:text-gray-400 px-2">Belum ada kategori pemasukan.</p>
                            )}
                        </div>
                    </div>
                    <div>
                        <h4 className="text-md font-semibold text-gray-600 dark:text-gray-300 mb-2 border-b border-gray-200 dark:border-dark-accent pb-1">Kategori Pengeluaran</h4>
                        <div className="space-y-2 pt-2">
                             {expenseCategories.length > 0 ? (
                                expenseCategories.map(cat => (
                                    <div key={cat.id} className="flex items-center justify-between p-2 bg-gray-100 dark:bg-dark-accent rounded">
                                        <div className="flex items-center gap-3">
                                           <div className="w-8 h-8 rounded-full flex items-center justify-center text-lg" style={{ backgroundColor: cat.color }}>
                                                {cat.icon}
                                            </div>
                                            <span>{cat.name}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button onClick={() => handleDeleteCategory(cat.id)} className="text-gray-400 hover:text-red-500" aria-label={`Delete ${cat.name} category`}>
                                                <Icon name="delete" className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))
                             ) : (
                                <p className="text-sm text-gray-500 dark:text-gray-400 px-2">Belum ada kategori pengeluaran.</p>
                             )}
                        </div>
                    </div>
                </div>

                 <style>{`
                    .form-input {
                        display: block;
                        width: 100%;
                        padding: 0.75rem;
                        border-radius: 0.5rem;
                        border: 1px solid #d1d5db;
                        background-color: #f9fafb;
                        color: #111827;
                    }
                    .dark .form-input {
                        background-color: #334155;
                        color: #f8fafc;
                        border-color: #475569;
                    }
                 `}</style>
            </div>
        </div>
    );
};

export default Settings;