import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Plus, Wrench, Printer, Wifi, FileText } from 'lucide-react';

const ServicesPage: React.FC = () => {
  const { services, clients, addServiceSale, currentUser } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [saleData, setSaleData] = useState({
    clientId: '',
    serviceId: '',
    quantity: 1
  });

  const getServiceIcon = (serviceName: string) => {
    if (serviceName.toLowerCase().includes('xerox') || serviceName.toLowerCase().includes('impressão')) {
      return Printer;
    }
    if (serviceName.toLowerCase().includes('internet')) {
      return Wifi;
    }
    if (serviceName.toLowerCase().includes('documento')) {
      return FileText;
    }
    return Wrench;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const service = services.find(s => s.id === saleData.serviceId);
    if (!service) return;

    addServiceSale({
      clientId: saleData.clientId,
      serviceId: saleData.serviceId,
      quantity: saleData.quantity,
      total: service.price * saleData.quantity,
      createdBy: currentUser?.id || ''
    });

    setSaleData({ clientId: '', serviceId: '', quantity: 1 });
    setShowModal(false);
    alert('Serviço registrado com sucesso!');
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Serviços</h1>
          <p className="text-gray-600 mt-2">Gerencie vendas de serviços</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
        >
          <Plus size={20} className="mr-2" />
          Registrar Serviço
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {services.map((service) => {
          const Icon = getServiceIcon(service.name);
          return (
            <div key={service.id} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 p-3 rounded-lg mr-4">
                  <Icon className="text-blue-600" size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{service.name}</h3>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-green-600">
                  R$ {service.price.toFixed(2)}
                </span>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  service.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {service.isActive ? 'Ativo' : 'Inativo'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Serviços Mais Vendidos</h2>
        <div className="space-y-3">
          {services.map((service) => {
            const Icon = getServiceIcon(service.name);
            return (
              <div key={service.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                <div className="flex items-center">
                  <Icon className="text-gray-600 mr-3" size={20} />
                  <div>
                    <p className="font-medium text-gray-800">{service.name}</p>
                    <p className="text-sm text-gray-600">R$ {service.price.toFixed(2)} por unidade</p>
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  Vendas: 0 {/* Aqui seria a contagem real de vendas */}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal Registrar Serviço */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Registrar Serviço</h2>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Serviço
                </label>
                <select
                  required
                  value={saleData.serviceId}
                  onChange={(e) => setSaleData({ ...saleData, serviceId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Selecione um serviço</option>
                  {services.filter(s => s.isActive).map(service => (
                    <option key={service.id} value={service.id}>
                      {service.name} - R$ {service.price.toFixed(2)}
                    </option>
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
                  value={saleData.quantity}
                  onChange={(e) => setSaleData({ ...saleData, quantity: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {saleData.serviceId && (
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total:</span>
                    <span className="font-bold text-lg text-green-600">
                      R$ {(services.find(s => s.id === saleData.serviceId)?.price || 0) * saleData.quantity}
                    </span>
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
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Registrar Serviço
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicesPage;
