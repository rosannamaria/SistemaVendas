import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Plus, Calendar, Laptop, Monitor, Send, FileText } from 'lucide-react';

const ServiceOrdersPage: React.FC = () => {
  const { clients, users, serviceOrders, addServiceOrder, updateServiceOrder, currentUser } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [orderData, setOrderData] = useState({
    clientId: '',
    entryDate: new Date().toISOString().split('T')[0],
    equipment: 'PC' as 'PC' | 'Laptop',
    defectDescription: '',
    accessories: [] as string[],
    partsValue: 0,
    serviceValue: 0,
    technicianId: ''
  });

  const accessories = [
    'Carregador',
    'Fonte',
    'USB do mouse',
    'Cabo',
    'Capa'
  ];

  const technicians = users.filter(u => u.userType === 'tecnico' && u.isActive);

  const handleAccessoryChange = (accessory: string, checked: boolean) => {
    if (checked) {
      setOrderData({
        ...orderData,
        accessories: [...orderData.accessories, accessory]
      });
    } else {
      setOrderData({
        ...orderData,
        accessories: orderData.accessories.filter(a => a !== accessory)
      });
    }
  };

  const getTotalValue = () => {
    return orderData.partsValue + orderData.serviceValue;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newOrder = {
      ...orderData,
      entryDate: new Date(orderData.entryDate),
      receivedBy: currentUser?.id || '',
      totalValue: getTotalValue(),
      status: 'recebido' as const
    };

    addServiceOrder(newOrder);
    
    // Simular envio de email para cliente
    alert('Ordem de serviço criada! Email enviado para o cliente com o orçamento.');
    
    resetForm();
    setShowModal(false);
  };

  const resetForm = () => {
    setOrderData({
      clientId: '',
      entryDate: new Date().toISOString().split('T')[0],
      equipment: 'PC',
      defectDescription: '',
      accessories: [],
      partsValue: 0,
      serviceValue: 0,
      technicianId: ''
    });
  };

  const assignTechnician = (orderId: string, technicianId: string) => {
    updateServiceOrder(orderId, { 
      technicianId,
      status: 'em_andamento' 
    });
    
    // Simular envio de email para técnico
    alert('Técnico atribuído! Email enviado com a ordem de serviço em PDF.');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'recebido': return 'bg-blue-100 text-blue-800';
      case 'orcamento': return 'bg-yellow-100 text-yellow-800';
      case 'aprovado': return 'bg-green-100 text-green-800';
      case 'em_andamento': return 'bg-purple-100 text-purple-800';
      case 'concluido': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'recebido': return 'Recebido';
      case 'orcamento': return 'Orçamento';
      case 'aprovado': return 'Aprovado';
      case 'em_andamento': return 'Em Andamento';
      case 'concluido': return 'Concluído';
      default: return status;
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Ordens de Serviço</h1>
          <p className="text-gray-600 mt-2">Gerencie ordens de serviço técnico</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
        >
          <Plus size={20} className="mr-2" />
          Nova Ordem
        </button>
      </div>

      {/* Lista de Ordens */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {serviceOrders.map((order) => {
          const client = clients.find(c => c.id === order.clientId);
          const receivedByUser = users.find(u => u.id === order.receivedBy);
          const technician = users.find(u => u.id === order.technicianId);
          
          return (
            <div key={order.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    OS #{order.id.slice(-4)}
                  </h3>
                  <p className="text-sm text-gray-600">{client?.name}</p>
                </div>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                  {getStatusText(order.status)}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar size={16} className="mr-2" />
                  Entrada: {new Date(order.entryDate).toLocaleDateString('pt-BR')}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  {order.equipment === 'Laptop' ? <Laptop size={16} className="mr-2" /> : <Monitor size={16} className="mr-2" />}
                  {order.equipment}
                </div>
                <div className="text-sm text-gray-600">
                  <strong>Defeito:</strong> {order.defectDescription}
                </div>
                {order.accessories.length > 0 && (
                  <div className="text-sm text-gray-600">
                    <strong>Acessórios:</strong> {order.accessories.join(', ')}
                  </div>
                )}
                <div className="text-sm text-gray-600">
                  <strong>Recebido por:</strong> {receivedByUser?.name}
                </div>
              </div>

              {order.totalValue > 0 && (
                <div className="bg-gray-50 p-3 rounded-lg mb-4">
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Peças:</span>
                      <span>R$ {order.partsValue.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Serviço:</span>
                      <span>R$ {order.serviceValue.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-semibold text-green-600 border-t pt-1">
                      <span>Total:</span>
                      <span>R$ {order.totalValue.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              )}

              {order.status === 'recebido' && technicians.length > 0 && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Atribuir Técnico:
                  </label>
                  <div className="flex space-x-2">
                    <select
                      onChange={(e) => e.target.value && assignTechnician(order.id, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      defaultValue=""
                    >
                      <option value="">Selecionar técnico...</option>
                      {technicians.map(tech => (
                        <option key={tech.id} value={tech.id}>{tech.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {technician && (
                <div className="mt-3 text-sm text-gray-600">
                  <strong>Técnico:</strong> {technician.name}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {serviceOrders.length === 0 && (
        <div className="text-center py-12">
          <FileText className="mx-auto text-gray-400 mb-4" size={48} />
          <p className="text-gray-500">Nenhuma ordem de serviço cadastrada</p>
        </div>
      )}

      {/* Modal Nova Ordem */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Nova Ordem de Serviço</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cliente
                  </label>
                  <select
                    required
                    value={orderData.clientId}
                    onChange={(e) => setOrderData({ ...orderData, clientId: e.target.value })}
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
                    Data de Entrada
                  </label>
                  <input
                    type="date"
                    required
                    value={orderData.entryDate}
                    onChange={(e) => setOrderData({ ...orderData, entryDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Equipamento
                </label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="PC"
                      checked={orderData.equipment === 'PC'}
                      onChange={(e) => setOrderData({ ...orderData, equipment: e.target.value as 'PC' | 'Laptop' })}
                      className="mr-2"
                    />
                    <Monitor size={16} className="mr-1" />
                    PC
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="Laptop"
                      checked={orderData.equipment === 'Laptop'}
                      onChange={(e) => setOrderData({ ...orderData, equipment: e.target.value as 'PC' | 'Laptop' })}
                      className="mr-2"
                    />
                    <Laptop size={16} className="mr-1" />
                    Laptop
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descrição do Defeito
                </label>
                <textarea
                  required
                  value={orderData.defectDescription}
                  onChange={(e) => setOrderData({ ...orderData, defectDescription: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Descreva o problema reportado pelo cliente..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Acessórios Entregues
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {accessories.map(accessory => (
                    <label key={accessory} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={orderData.accessories.includes(accessory)}
                        onChange={(e) => handleAccessoryChange(accessory, e.target.checked)}
                        className="mr-2"
                      />
                      {accessory}
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Valor das Peças (R$)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={orderData.partsValue}
                    onChange={(e) => setOrderData({ ...orderData, partsValue: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Valor do Serviço (R$)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={orderData.serviceValue}
                    onChange={(e) => setOrderData({ ...orderData, serviceValue: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {(orderData.partsValue > 0 || orderData.serviceValue > 0) && (
                <div className="bg-green-50 p-3 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-green-800">Valor Total:</span>
                    <span className="text-lg font-bold text-green-600">
                      R$ {getTotalValue().toFixed(2)}
                    </span>
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
                >
                  <Send size={16} className="mr-2" />
                  Criar Ordem
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceOrdersPage;
