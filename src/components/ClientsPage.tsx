import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Plus, Edit, UserX, UserCheck, Mail, Phone, MapPin } from 'lucide-react';

const ClientsPage: React.FC = () => {
  const { clients, addClient, updateClient, toggleClientStatus } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [editingClient, setEditingClient] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    email: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingClient) {
      updateClient(editingClient, formData);
      setEditingClient(null);
    } else {
      addClient({
        ...formData,
        isActive: true
      });
    }
    setFormData({ name: '', phone: '', address: '', email: '' });
    setShowModal(false);
  };

  const handleEdit = (client: any) => {
    setEditingClient(client.id);
    setFormData({
      name: client.name,
      phone: client.phone,
      address: client.address,
      email: client.email
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingClient(null);
    setFormData({ name: '', phone: '', address: '', email: '' });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Clientes</h1>
          <p className="text-gray-600 mt-2">Gerencie seus clientes</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
        >
          <Plus size={20} className="mr-2" />
          Novo Cliente
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clients.map((client) => (
          <div key={client.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold text-gray-800">{client.name}</h3>
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                client.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {client.isActive ? 'Ativo' : 'Inativo'}
              </span>
            </div>
            
            <div className="space-y-2 mb-4">
              <div className="flex items-center text-gray-600 text-sm">
                <Mail size={16} className="mr-2" />
                {client.email}
              </div>
              <div className="flex items-center text-gray-600 text-sm">
                <Phone size={16} className="mr-2" />
                {client.phone}
              </div>
              <div className="flex items-start text-gray-600 text-sm">
                <MapPin size={16} className="mr-2 mt-0.5" />
                <span className="flex-1">{client.address}</span>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">
                {new Date(client.createdAt).toLocaleDateString('pt-BR')}
              </span>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(client)}
                  className="text-blue-600 hover:text-blue-900"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => toggleClientStatus(client.id)}
                  className={client.isActive 
                    ? 'text-red-600 hover:text-red-900' 
                    : 'text-green-600 hover:text-green-900'
                  }
                >
                  {client.isActive ? <UserX size={16} /> : <UserCheck size={16} />}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              {editingClient ? 'Editar Cliente' : 'Novo Cliente'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Celular
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Endereço
                </label>
                <textarea
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  {editingClient ? 'Salvar' : 'Criar Cliente'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientsPage;
