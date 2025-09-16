import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { User, Mail, Lock, UserPlus } from 'lucide-react';

const LoginPage: React.FC = () => {
  const { login, addUser } = useApp();
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    userType: 'recepcao' as 'gerente' | 'recepcao' | 'tecnico'
  });
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isRegistering) {
      addUser({
        name: formData.name,
        email: formData.email,
        userType: formData.userType,
        isActive: true
      });
      setIsRegistering(false);
      setError('');
      alert('Usuário criado com sucesso! Faça login agora.');
    } else {
      const success = login(formData.email, formData.password);
      if (!success) {
        setError('Email ou senha inválidos');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="text-blue-600" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Sistema de Vendas</h1>
          <p className="text-gray-600 mt-2">
            {isRegistering ? 'Criar nova conta' : 'Faça login para continuar'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegistering && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome Completo
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Digite seu nome completo"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Digite seu email"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Senha
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Digite sua senha"
              />
            </div>
          </div>

          {isRegistering && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de Usuário
              </label>
              <select
                value={formData.userType}
                onChange={(e) => setFormData({ ...formData, userType: e.target.value as any })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="recepcao">Recepção</option>
                <option value="tecnico">Técnico</option>
                <option value="gerente">Gerente</option>
              </select>
            </div>
          )}

          {error && (
            <div className="text-red-600 text-sm text-center">{error}</div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
          >
            {isRegistering ? (
              <>
                <UserPlus size={20} className="mr-2" />
                Criar Conta
              </>
            ) : (
              <>
                <User size={20} className="mr-2" />
                Entrar
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsRegistering(!isRegistering)}
            className="text-blue-600 hover:text-blue-700 text-sm"
          >
            {isRegistering 
              ? 'Já tem uma conta? Faça login' 
              : 'Não tem uma conta? Cadastre-se'
            }
          </button>
        </div>

        {!isRegistering && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 text-center mb-2">Conta de teste:</p>
            <p className="text-xs text-gray-500 text-center">
              Email: admin@sistema.com<br />
              Senha: qualquer senha
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
