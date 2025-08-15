import React, { useState } from 'react';
import Navigation from './Navigation.jsx';
import DashboardHome from './HomeDashboard.jsx';
import UsersManagement from './UsersManagement.jsx';
import BorrowedBooks from './BorrowedBooks.jsx';
import Returns from './Returns.jsx';
import BooksManagement from './BooksManagement.jsx';
import SettingsPanel from './SettingsPanel.jsx';

const LibraryDashboard = () => {
  const [activeTab, setActiveTab] = useState('home');

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <DashboardHome />;
      case 'users':
        return <UsersManagement />;
      case 'books':
        return <BooksManagement />;
      case 'borrowed':
        return <BorrowedBooks />;
      case 'returns':
        return <Returns />;
      case 'settings':
        return <SettingsPanel />;
      default:
        return <DashboardHome />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Library Management System
            </h2>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500">
                Welcome back, Admin
              </div>
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">A</span>
              </div>
            </div>
          </div>
        </header>

        <main className="p-6">
          {renderContent()}
        
        </main>
        </div>
        </div>
  );
}
export default LibraryDashboard;