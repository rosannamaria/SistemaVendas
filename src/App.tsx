import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import LoginPage from './components/LoginPage';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import UsersPage from './components/UsersPage';
import ProductsPage from './components/ProductsPage';
import ClientsPage from './components/ClientsPage';
import StockPage from './components/StockPage';
import SalesPage from './components/SalesPage';
import ServicesPage from './components/ServicesPage';
import ServiceOrdersPage from './components/ServiceOrdersPage';

const AppContent: React.FC = () => {
  const { currentUser } = useApp();
  const [currentPage, setCurrentPage] = useState('dashboard');

  if (!currentUser) {
    return <LoginPage />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'users':
        return <UsersPage />;
      case 'products':
        return <ProductsPage />;
      case 'clients':
        return <ClientsPage />;
      case 'stock':
        return <StockPage />;
      case 'sales':
        return <SalesPage />;
      case 'services':
        return <ServicesPage />;
      case 'orders':
        return <ServiceOrdersPage />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout currentPage={currentPage} onNavigate={setCurrentPage}>
      {renderPage()}
    </Layout>
  );
};

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
