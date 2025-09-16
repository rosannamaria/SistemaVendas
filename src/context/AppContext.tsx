import React, { createContext, useContext, useState, ReactNode } from 'react';
import { faker } from '@faker-js/faker';
import { User, Product, Client, StockItem, Sale, Service, ServiceSale, ServiceOrder } from '../types';

interface AppContextType {
  currentUser: User | null;
  users: User[];
  products: Product[];
  clients: Client[];
  stock: StockItem[];
  sales: Sale[];
  services: Service[];
  serviceSales: ServiceSale[];
  serviceOrders: ServiceOrder[];
  login: (email: string, password: string) => boolean;
  logout: () => void;
  addUser: (user: Omit<User, 'id' | 'createdAt'>) => void;
  toggleUserStatus: (id: string) => void;
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => void;
  updateProduct: (id: string, product: Partial<Omit<Product, 'id' | 'createdAt'>>) => void;
  toggleProductStatus: (id: string) => void;
  addClient: (client: Omit<Client, 'id' | 'createdAt'>) => void;
  updateClient: (id: string, client: Partial<Client>) => void;
  toggleClientStatus: (id: string) => void;
  addStockEntry: (entry: Omit<StockItem, 'id' | 'entryDate'>) => void;
  removeFromStock: (productId: string, quantity: number, reason: string) => void;
  addSale: (sale: Omit<Sale, 'id' | 'createdAt'>) => void;
  addServiceSale: (serviceSale: Omit<ServiceSale, 'id' | 'createdAt'>) => void;
  addServiceOrder: (order: Omit<ServiceOrder, 'id' | 'createdAt'>) => void;
  updateServiceOrder: (id: string, order: Partial<ServiceOrder>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Dados iniciais mockados
const generateMockData = () => {
  const masterUser: User = {
    id: '1',
    name: 'Administrador',
    email: 'admin@sistema.com',
    userType: 'master',
    isActive: true,
    createdAt: new Date()
  };

  const users: User[] = [
    masterUser,
    {
      id: '2',
      name: faker.person.fullName(),
      email: faker.internet.email(),
      userType: 'gerente',
      isActive: true,
      createdAt: faker.date.past()
    },
    {
      id: '3',
      name: faker.person.fullName(),
      email: faker.internet.email(),
      userType: 'recepcao',
      isActive: true,
      createdAt: faker.date.past()
    },
    {
      id: '4',
      name: faker.person.fullName(),
      email: faker.internet.email(),
      userType: 'tecnico',
      isActive: true,
      createdAt: faker.date.past()
    }
  ];

  const products: Product[] = Array.from({ length: 5 }, (_, i) => ({
    id: `prod-${i + 1}`,
    name: faker.commerce.productName(),
    category: faker.commerce.department(),
    description: faker.commerce.productDescription(),
    isActive: true,
    createdAt: faker.date.past()
  }));

  const clients: Client[] = Array.from({ length: 8 }, (_, i) => ({
    id: `client-${i + 1}`,
    name: faker.person.fullName(),
    phone: faker.phone.number(),
    address: faker.location.streetAddress(),
    email: faker.internet.email(),
    isActive: true,
    createdAt: faker.date.past()
  }));

  const services: Service[] = [
    { id: '1', name: 'Xerox', price: 0.50, isActive: true },
    { id: '2', name: 'Acesso à Internet', price: 3.00, isActive: true },
    { id: '3', name: 'Emissão de Documentos', price: 5.00, isActive: true },
    { id: '4', name: 'Impressão', price: 1.00, isActive: true }
  ];

  return { users, products, clients, services };
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const mockData = generateMockData();
  
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(mockData.users);
  const [products, setProducts] = useState<Product[]>(mockData.products);
  const [clients, setClients] = useState<Client[]>(mockData.clients);
  const [stock, setStock] = useState<StockItem[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [services] = useState<Service[]>(mockData.services);
  const [serviceSales, setServiceSales] = useState<ServiceSale[]>([]);
  const [serviceOrders, setServiceOrders] = useState<ServiceOrder[]>([]);

  const login = (email: string, password: string): boolean => {
    const user = users.find(u => u.email === email && u.isActive);
    if (user) {
      setCurrentUser(user);
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const addUser = (user: Omit<User, 'id' | 'createdAt'>) => {
    const newUser: User = {
      ...user,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    setUsers(prev => [...prev, newUser]);
  };

  const toggleUserStatus = (id: string) => {
    setUsers(prev => prev.map(user => 
      user.id === id ? { ...user, isActive: !user.isActive } : user
    ));
  };

  const addProduct = (product: Omit<Product, 'id' | 'createdAt'>) => {
    const newProduct: Product = {
      ...product,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    setProducts(prev => [...prev, newProduct]);
  };

  const updateProduct = (id: string, productData: Partial<Product>) => {
    setProducts(prev => prev.map(product => 
      product.id === id ? { ...product, ...productData } : product
    ));
  };

  const toggleProductStatus = (id: string) => {
    setProducts(prev => prev.map(product => 
      product.id === id ? { ...product, isActive: !product.isActive } : product
    ));
  };

  const addClient = (client: Omit<Client, 'id' | 'createdAt'>) => {
    const newClient: Client = {
      ...client,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    setClients(prev => [...prev, newClient]);
  };

  const updateClient = (id: string, clientData: Partial<Client>) => {
    setClients(prev => prev.map(client => 
      client.id === id ? { ...client, ...clientData } : client
    ));
  };

  const toggleClientStatus = (id: string) => {
    setClients(prev => prev.map(client => 
      client.id === id ? { ...client, isActive: !client.isActive } : client
    ));
  };

  const addStockEntry = (entry: Omit<StockItem, 'id' | 'entryDate'>) => {
    const newEntry: StockItem = {
      ...entry,
      id: Date.now().toString(),
      entryDate: new Date()
    };
    setStock(prev => [...prev, newEntry]);
  };

  const removeFromStock = (productId: string, quantity: number, reason: string) => {
    // Implementar lógica de remoção do estoque
    console.log('Removendo do estoque:', { productId, quantity, reason });
  };

  const addSale = (sale: Omit<Sale, 'id' | 'createdAt'>) => {
    const newSale: Sale = {
      ...sale,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    setSales(prev => [...prev, newSale]);
  };

  const addServiceSale = (serviceSale: Omit<ServiceSale, 'id' | 'createdAt'>) => {
    const newServiceSale: ServiceSale = {
      ...serviceSale,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    setServiceSales(prev => [...prev, newServiceSale]);
  };

  const addServiceOrder = (order: Omit<ServiceOrder, 'id' | 'createdAt'>) => {
    const newOrder: ServiceOrder = {
      ...order,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    setServiceOrders(prev => [...prev, newOrder]);
  };

  const updateServiceOrder = (id: string, orderData: Partial<ServiceOrder>) => {
    setServiceOrders(prev => prev.map(order => 
      order.id === id ? { ...order, ...orderData } : order
    ));
  };

  return (
    <AppContext.Provider value={{
      currentUser,
      users,
      products,
      clients,
      stock,
      sales,
      services,
      serviceSales,
      serviceOrders,
      login,
      logout,
      addUser,
      toggleUserStatus,
      addProduct,
      updateProduct,
      toggleProductStatus,
      addClient,
      updateClient,
      toggleClientStatus,
      addStockEntry,
      removeFromStock,
      addSale,
      addServiceSale,
      addServiceOrder,
      updateServiceOrder
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
