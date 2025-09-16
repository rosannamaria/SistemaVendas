import React from 'react';
import { useApp } from '../context/AppContext';
import { Users, Package, ShoppingCart, Wrench, TrendingUp, DollarSign } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { users, products, clients, sales, serviceSales, stock } = useApp();

  const activeUsers = users.filter(u => u.isActive).length;
  const activeProducts = products.filter(p => p.isActive).length;
  const activeClients = clients.filter(c => c.isActive).length;
  const totalSales = sales.reduce((sum, sale) => sum + sale.total, 0);
  const totalServiceSales = serviceSales.reduce((sum, sale) => sum + sale.total, 0);
  const totalStock = stock.reduce((sum, item) => sum + item.quantity, 0);

  const stats = [
    {
      title: 'Usuários Ativos',
      value: activeUsers,
      icon: Users,
      color: 'bg-blue-500',
      textColor: 'text-blue-600'
    },
    {
      title: 'Produtos Cadastrados',
      value: activeProducts,
      icon: Package,
      color: 'bg-green-500',
      textColor: 'text-green-600'
    },
    {
      title: 'Clientes Ativos',
      value: activeClients,
      icon: Users,
      color: 'bg-purple-500',
      textColor: 'text-purple-600'
    },
    {
      title: 'Itens em Estoque',
      value: totalStock,
      icon: Package,
      color: 'bg-orange-500',
      textColor: 'text-orange-600'
    },
    {
      title: 'Vendas de Produtos',
      value: `R$ ${totalSales.toFixed(2)}`,
      icon: ShoppingCart,
      color: 'bg-indigo-500',
      textColor: 'text-indigo-600'
    },
    {
      title: 'Vendas de Serviços',
      value: `R$ ${totalServiceSales.toFixed(2)}`,
      icon: Wrench,
      color: 'bg-pink-500',
      textColor: 'text-pink-600'
    }
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600 mt-2">Visão geral do sistema de vendas</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className={`text-2xl font-bold ${stat.textColor} mt-1`}>{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="text-white" size={24} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <TrendingUp className="mr-2" size={20} />
            Vendas Recentes
          </h2>
          <div className="space-y-3">
            {sales.slice(-5).map((sale) => (
              <div key={sale.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                <div>
                  <p className="font-medium text-gray-800">Venda #{sale.id.slice(-4)}</p>
                  <p className="text-sm text-gray-600">
                    {new Date(sale.createdAt).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <span className="font-semibold text-green-600">
                  R$ {sale.total.toFixed(2)}
                </span>
              </div>
            ))}
            {sales.length === 0 && (
              <p className="text-gray-500 text-center py-4">Nenhuma venda registrada</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <DollarSign className="mr-2" size={20} />
            Produtos em Baixo Estoque
          </h2>
          <div className="space-y-3">
            {stock
              .filter(item => item.quantity <= 5)
              .slice(0, 5)
              .map((item) => {
                const product = products.find(p => p.id === item.productId);
                return (
                  <div key={item.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                    <div>
                      <p className="font-medium text-gray-800">{product?.name}</p>
                      <p className="text-sm text-gray-600">{product?.category}</p>
                    </div>
                    <span className={`font-semibold px-2 py-1 rounded text-sm ${
                      item.quantity <= 2 ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-600'
                    }`}>
                      {item.quantity} unidades
                    </span>
                  </div>
                );
              })}
            {stock.filter(item => item.quantity <= 5).length === 0 && (
              <p className="text-gray-500 text-center py-4">Estoque em bom nível</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
