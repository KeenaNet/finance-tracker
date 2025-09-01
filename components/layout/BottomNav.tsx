
import React from 'react';
import { NavLink } from 'react-router-dom';
import Icon from '../common/Icon.tsx';

const BottomNav: React.FC = () => {
    const navLinkClasses = "flex flex-col items-center justify-center w-full pt-2 pb-1 transition-colors duration-200";
    const activeNavLinkClasses = "text-neon-blue";
    const inactiveNavLinkClasses = "text-gray-500 dark:text-gray-400";
    
    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white dark:bg-dark-secondary border-t border-gray-200 dark:border-dark-accent shadow-lg flex justify-around items-center z-10">
            <NavLink to="/" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : inactiveNavLinkClasses}`}>
                <Icon name="dashboard" className="w-6 h-6 mb-1" />
                <span className="text-xs font-medium">Dashboard</span>
            </NavLink>
            <NavLink to="/add" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : inactiveNavLinkClasses}`}>
                <Icon name="add" className="w-6 h-6 mb-1" />
                <span className="text-xs font-medium">Add</span>
            </NavLink>
            <NavLink to="/reports" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : inactiveNavLinkClasses}`}>
                <Icon name="reports" className="w-6 h-6 mb-1" />
                <span className="text-xs font-medium">Reports</span>
            </NavLink>
            <NavLink to="/settings" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : inactiveNavLinkClasses}`}>
                <Icon name="settings" className="w-6 h-6 mb-1" />
                <span className="text-xs font-medium">Settings</span>
            </NavLink>
        </nav>
    );
};

export default BottomNav;