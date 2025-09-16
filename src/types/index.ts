export interface User {
  id: string;
  name: string;
  email: string;
  userType: 'master' | 'gerente' | 'recepcao' | 'tecnico';
  isActive: boolean;
  createdAt: Date;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  description?: string;
  isActive: boolean;
  createdAt: Date;
}

export interface Client {
  id: string;
  name: string;
  phone: string;
  address: string;
  email: string;
  isActive: boolean;
  createdAt: Date;
}

export interface StockItem {
  id: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  expiryDate: Date;
  entryDate: Date;
  createdBy: string;
}

export interface StockMovement {
  id: string;
  productId: string;
  quantity: number;
  type: 'entrada' | 'saida';
  reason?: string;
  createdBy: string;
  createdAt: Date;
}

export interface Sale {
  id: string;
  clientId: string;
  items: SaleItem[];
  total: number;
  createdBy: string;
  createdAt: Date;
}

export interface SaleItem {
  productId: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Service {
  id: string;
  name: string;
  price: number;
  isActive: boolean;
}

export interface ServiceSale {
  id: string;
  clientId: string;
  serviceId: string;
  quantity: number;
  total: number;
  createdBy: string;
  createdAt: Date;
}

export interface ServiceOrder {
  id: string;
  clientId: string;
  entryDate: Date;
  equipment: 'PC' | 'Laptop';
  receivedBy: string;
  defectDescription: string;
  accessories: string[];
  partsValue: number;
  serviceValue: number;
  totalValue: number;
  technicianId?: string;
  status: 'recebido' | 'orcamento' | 'aprovado' | 'em_andamento' | 'concluido';
  createdAt: Date;
}
