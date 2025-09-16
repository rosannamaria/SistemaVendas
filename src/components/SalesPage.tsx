import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Plus, ShoppingCart, Trash2 } from 'lucide-react';

const SalesPage: React.FC = () => {
  const { products, clients, stock, addSale, currentUser } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [saleData, setSaleData] = useState({
    clientId: '',
    items: [] as Array<{ productId: string; quantity: number; unitPrice: number }>
  });

  const getAvailableStock = (productId: string) => {
    return stock
      .filter(item => item.productId === productId)
      .reduce((sum, item) => sum + item.quantity, 0);
  };

  const addItem = () => {
    setSaleData({
      ...saleData,
      items: [...saleData.items, { productId: '', quantity: 1, unitPrice: 0 }]
    });
  };

  const updateItem = (index: number, field: string, value: any) => {
    const updatedItems = [...saleData.items];
    if (field === 'productId') {
      // Buscar preço do produto no estoque
      const stockItem = stock.find(item => item.productId === value);
      updatedItems[index] = {
        ...updatedItems[index],
        [field]: value,
        unitPrice: stockItem?.unitPrice || 0
      };
    } else {
      updatedItems[index] = { ...updatedItems[index], [field]: value };
    }
    setSaleData({ ...saleData, items: updatedItems });
  };

  const removeItem = (index: number) => {
    const updatedItems = saleData.items.filter((_, i) => i !== index);
    setSaleData({ ...saleData, items: updatedItems });
  };

  const calculateTotal = () => {
    return saleData.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const saleItems = saleData.items.map(item => ({
      ...item,
      total: item.quantity * item.unitPrice
    }));

    addSale({
      clientId: saleData.clientId,
      items: saleItems,
      total: calculateTotal(),
      createdBy: currentUser?.id || ''
    });

    setSaleData({ clientId: '', items: [] });
    setShowModal(false);
    alert('Venda registrada com sucesso!');
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Vendas de Produtos</h1>
          <p className="text-gray-600 mt-2">Registre vendas de produtos</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
        >
          <Plus size={20} className="mr-2" />
          Nova Venda
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Produtos Disponíveis</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => {
            const stockQuantity = getAvailableStock(product.id);
            const avgPrice = stock
              .filter(item => item.productId === product.id)
              .reduce((sum, item, _, arr) => sum + item.unitPrice / arr.length, 0);

            return (
              <div key={product.id} className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800">{product.name}</h3>
                <p className="text-sm text-gray-600">{product.category}</p>
                <div className="mt-2 flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    Estoque: {stockQuantity} un.
                  </span>
                  <span className="font-semibold text-green-600">
                    R$ {avgPrice.toFixed(2)}
                  </span>
                </div>
                {stockQuantity <= 5 && (
                  <span className="inline-block mt-2 px-2 py-1 text-xs bg-red-100 text-red-800 rounded">
                    Estoque baixo
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal Nova Venda */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Nova Venda</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cliente
                </label>
                <select
                  required
                  value={saleData.clientId}
                  onChange={(e) => setSaleData({ ...saleData, clientId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Selecione um cliente</option>
                  {clients.filter(c => c.isActive).map(client => (
                    <option key={client.id} value={client.id}>{client.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold text-gray-800">Itens da Venda</h3>
                  <button
                    type="button"
                    onClick={addItem}
                    className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                  >
                    Adicionar Item
                  </button>
                </div>

                {saleData.items.map((item, index) => (
                  <div key={index} className="grid grid-cols-12 gap-2 mb-2 items-end">
                    <div className="col-span-5">
                      <label className="block text-xs text-gray-600 mb-1">Produto</label>
                      <select
                        required
                        value={item.productId}
                        onChange={(e) => updateItem(index, 'productId', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                      >
                        <option value="">Selecione</option>
                        {products.map(product => {
                          const stockQty = getAvailableStock(product.id);
                          return (
                            <option key={product.id} value={product.id} disabled={stockQty === 0}>
                              {product.name} ({stockQty} disponível)
                            </option>
                          );
                        })}
                      </select>
                    </div>
                    <div className="col-span-2">
                      <label className="block text-xs text-gray-600 mb-1">Qtd</label>
                      <input
                        type="number"
                        required
                        min="1"
                        max={getAvailableStock(item.productId)}
                        value={item.quantity}
                        onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value))}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                      />
                    </div>
                    <div className="col-span-3">
                      <label className="block text-xs text-gray-600 mb-1">Preço Un.</label>
                      <input
                        type="number"
                        required
                        min="0"
                        step="0.01"
                        value={item.unitPrice}
                        onChange={(e) => updateItem(index, 'unitPrice', parseFloat(e.target.value))}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                      />
                    </div>
                    <div className="col-span-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-600">
                          R$ {(item.quantity * item.unitPrice).toFixed(2)}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeItem(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {saleData.items.length === 0 && (
                  <p className="text-gray-500 text-center py-4">
                    Nenhum item adicionado. Clique em "Adicionar Item" para começar.
                  </p>
                )}
              </div>

              {saleData.items.length > 0 && (
                <div className="border-t pt-4">
                  <div className="flex justify-end">
                    <div className="text-lg font-bold text-gray-800">
                      Total: R$ {calculateTotal().toFixed(2)}
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saleData.items.length === 0}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  Registrar Venda
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesPage;
