import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Plus, Minus, Package, Calendar, DollarSign } from 'lucide-react';

const StockPage: React.FC = () => {
  const { products, stock, addStockEntry, removeFromStock, currentUser } = useApp();
  const [showEntryModal, setShowEntryModal] = useState(false);
  const [showRemovalModal, setShowRemovalModal] = useState(false);
  const [entryData, setEntryData] = useState({
    productId: '',
    quantity: 0,
    unitPrice: 0,
    expiryDate: ''
  });
  const [removalData, setRemovalData] = useState({
    productId: '',
    quantity: 0,
    reason: ''
  });

  const handleEntry = (e: React.FormEvent) => {
    e.preventDefault();
    addStockEntry({
      ...entryData,
      expiryDate: new Date(entryData.expiryDate),
      createdBy: currentUser?.id || ''
    });
    setEntryData({ productId: '', quantity: 0, unitPrice: 0, expiryDate: '' });
    setShowEntryModal(false);
  };

  const handleRemoval = (e: React.FormEvent) => {
    e.preventDefault();
    removeFromStock(removalData.productId, removalData.quantity, removalData.reason);
    setRemovalData({ productId: '', quantity: 0, reason: '' });
    setShowRemovalModal(false);
  };

  const getProductStock = (productId: string) => {
    return stock
      .filter(item => item.productId === productId)
      .reduce((sum, item) => sum + item.quantity, 0);
  };

  const getProductValue = (productId: string) => {
    const productStock = stock.filter(item => item.productId === productId);
    return productStock.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Controle de Estoque</h1>
          <p className="text-gray-600 mt-2">Gerencie entradas e saídas do estoque</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowRemovalModal(true)}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center"
          >
            <Minus size={20} className="mr-2" />
            Retirar Estoque
          </button>
          <button
            onClick={() => setShowEntryModal(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
          >
            <Plus size={20} className="mr-2" />
            Entrada Estoque
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => {
          const stockQuantity = getProductStock(product.id);
          const stockValue = getProductValue(product.id);
          return (
            <div key={product.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 p-3 rounded-lg mr-4">
                  <Package className="text-blue-600" size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
                  <p className="text-sm text-gray-600">{product.category}</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Quantidade:</span>
                  <span className={`font-semibold ${
                    stockQuantity <= 5 ? 'text-red-600' : 
                    stockQuantity <= 10 ? 'text-yellow-600' : 'text-green-600'
                  }`}>
                    {stockQuantity} unidades
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Valor Total:</span>
                  <span className="font-semibold text-blue-600">
                    R$ {stockValue.toFixed(2)}
                  </span>
                </div>

                {stockQuantity <= 5 && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-red-800 text-sm font-medium">
                      ⚠️ Estoque baixo!
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Detalhes do Estoque */}
      <div className="mt-8 bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Movimentações Recentes</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Produto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantidade
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Valor Unitário
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Validade
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data Entrada
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {stock.slice(-10).map((item) => {
                const product = products.find(p => p.id === item.productId);
                const isExpiring = new Date(item.expiryDate) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
                
                return (
                  <tr key={item.id} className={isExpiring ? 'bg-red-50' : ''}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{product?.name}</div>
                      <div className="text-sm text-gray-500">{product?.category}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.quantity} unidades
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      R$ {item.unitPrice.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(item.expiryDate).toLocaleDateString('pt-BR')}
                      {isExpiring && (
                        <span className="ml-2 text-red-600 text-xs">⚠️ Vencendo</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(item.entryDate).toLocaleDateString('pt-BR')}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Entrada */}
      {showEntryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Entrada de Estoque</h2>
            <form onSubmit={handleEntry} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Produto
                </label>
                <select
                  required
                  value={entryData.productId}
                  onChange={(e) => setEntryData({ ...entryData, productId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Selecione um produto</option>
                  {products.map(product => (
                    <option key={product.id} value={product.id}>{product.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantidade
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={entryData.quantity}
                  onChange={(e) => setEntryData({ ...entryData, quantity: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Valor Unitário
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={entryData.unitPrice}
                  onChange={(e) => setEntryData({ ...entryData, unitPrice: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data de Validade
                </label>
                <input
                  type="date"
                  required
                  value={entryData.expiryDate}
                  onChange={(e) => setEntryData({ ...entryData, expiryDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowEntryModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                >
                  Adicionar ao Estoque
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Retirada */}
      {showRemovalModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Retirada de Estoque</h2>
            <form onSubmit={handleRemoval} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Produto
                </label>
                <select
                  required
                  value={removalData.productId}
                  onChange={(e) => setRemovalData({ ...removalData, productId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Selecione um produto</option>
                  {products.map(product => (
                    <option key={product.id} value={product.id}>{product.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantidade
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={removalData.quantity}
                  onChange={(e) => setRemovalData({ ...removalData, quantity: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Motivo da Retirada
                </label>
                <select
                  required
                  value={removalData.reason}
                  onChange={(e) => setRemovalData({ ...removalData, reason: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Selecione o motivo</option>
                  <option value="Validade vencida">Validade vencida</option>
                  <option value="Produto danificado">Produto danificado</option>
                  <option value="Transferência">Transferência</option>
                  <option value="Outros">Outros</option>
                </select>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowRemovalModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                >
                  Retirar do Estoque
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StockPage;
