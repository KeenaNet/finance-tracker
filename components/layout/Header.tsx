import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import Icon from '../common/Icon.tsx';
import { useAppContext } from '../../context/AppContext.tsx';

const Header: React.FC = () => {
    const { theme, toggleTheme } = useAppContext();

    const navLinkClasses = "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors";
    const activeNavLinkClasses = "bg-neon-blue text-white";
    const inactiveNavLinkClasses = "text-gray-500 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-accent";

    return (
        <header className="bg-white dark:bg-dark-secondary shadow-md sticky top-0 z-10">
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="flex items-center justify-between h-16">
                    <Link to="/" className="flex items-center gap-3">
                        <img src="/logo.png" alt="KeenaNet Finance Tracker Logo" className="h-8 md:h-10 object-contain" />
                        <span className="text-lg md:text-xl font-bold text-gray-800 dark:text-white">KeenaNet Finance Tracker</span>
                    </Link>
                    <div className="flex items-center gap-2">
                        <nav className="hidden md:flex items-center gap-2">
                            <NavLink to="/" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : inactiveNavLinkClasses}`}>
                                <Icon name="dashboard" className="w-5 h-5" /> Dashboard
                            </NavLink>
                            <NavLink to="/add" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : inactiveNavLinkClasses}`}>
                                <Icon name="add" className="w-5 h-5" /> Add
                            </NavLink>
                            <NavLink to="/reports" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : inactiveNavLinkClasses}`}>
                                <Icon name="reports" className="w-5 h-5" /> Reports
                            </NavLink>
                            <NavLink to="/settings" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : inactiveNavLinkClasses}`}>
                                <Icon name="settings" className="w-5 h-5" /> Settings
                            </NavLink>
                        </nav>
                        <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-dark-accent transition-colors">
                            <Icon name={theme === 'dark' ? 'sun' : 'moon'} className="w-5 h-5 text-gray-500 dark:text-gray-300" />
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;