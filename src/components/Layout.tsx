import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  LogOut, 
  Users, 
  Package, 
  ShoppingCart, 
  UserCheck, 
  Wrench,
  BarChart3,
  ClipboardList
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, currentPage, onNavigate }) => {
  const { currentUser, logout } = useApp();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'users', label: 'Usuários', icon: Users, masterOnly: true },
    { id: 'products', label: 'Produtos', icon: Package },
    { id: 'clients', label: 'Clientes', icon: UserCheck },
    { id: 'stock', label: 'Estoque', icon: ClipboardList },
    { id: 'sales', label: 'Vendas', icon: ShoppingCart },
    { id: 'services', label: 'Serviços', icon: Wrench },
    { id: 'orders', label: 'Ordens de Serviço', icon: ClipboardList }
  ];

  const filteredMenuItems = menuItems.filter(item => 
    !item.masterOnly || currentUser?.userType === 'master'
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6 border-b">
          <h1 className="text-xl font-bold text-gray-800">Sistema de Vendas</h1>
          <p className="text-sm text-gray-600 mt-1">{currentUser?.name}</p>
          <span className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded mt-1">
            {currentUser?.userType}
          </span>
        </div>
        
        <nav className="mt-6">
          {filteredMenuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center px-6 py-3 text-left hover:bg-gray-50 transition-colors ${
                  currentPage === item.id ? 'bg-blue-50 border-r-2 border-blue-500 text-blue-600' : 'text-gray-700'
                }`}
              >
                <Icon size={20} className="mr-3" />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="absolute bottom-0 w-64 p-6 border-t">
          <button
            onClick={logout}
            className="w-full flex items-center px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut size={20} className="mr-3" />
            Sair
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        {children}
      </div>
    </div>
  );
};

export default Layout;
