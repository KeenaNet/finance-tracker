
import React from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';
import { AppProvider } from './context/AppContext.tsx';
import Dashboard from './pages/Dashboard.tsx';
import AddOrEditTransaction from './pages/AddOrEditTransaction.tsx';
import Reports from './pages/Reports.tsx';
import Settings from './pages/Settings.tsx';
import BottomNav from './components/layout/BottomNav.tsx';
import Header from './components/layout/Header.tsx';
import RecurringTransactions from './pages/RecurringTransactions.tsx';
import AddOrEditRecurringTransaction from './pages/AddOrEditRecurringTransaction.tsx';
import Icon from './components/common/Icon.tsx';
import AllTransactions from './pages/AllTransactions.tsx';

const App: React.FC = () => {
  return (
    <AppProvider>
      <HashRouter>
        <div className="flex flex-col h-screen font-sans">
          <Header />
          <main className="flex-grow overflow-y-auto pb-20 md:pb-4 bg-gray-50 dark:bg-dark-primary text-gray-900 dark:text-gray-100 flex flex-col">
            <div className="container mx-auto p-4 max-w-4xl flex-grow">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/transactions" element={<AllTransactions />} />
                <Route path="/add" element={<AddOrEditTransaction />} />
                <Route path="/edit/:id" element={<AddOrEditTransaction />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/recurring" element={<RecurringTransactions />} />
                <Route path="/recurring/add" element={<AddOrEditRecurringTransaction />} />
                <Route path="/recurring/edit/:id" element={<AddOrEditRecurringTransaction />} />
              </Routes>
            </div>
             <footer className="text-center p-4 text-sm text-gray-500 dark:text-gray-400">
                <p>
                    Powered By KeenaNet 2025 | <a href="https://www.tiktok.com/@keenanet_technetwork" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 underline hover:text-neon-blue">
                        <Icon name="tiktok" className="w-4 h-4" />
                        @keenanet_technetwork
                    </a>
                </p>
                <p className="mt-2 text-xs">Versi 1.1.1</p>
            </footer>
          </main>
          <BottomNav />
        </div>
      </HashRouter>
    </AppProvider>
  );
};

export default App;