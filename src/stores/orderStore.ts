import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem } from './cartStore';

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  totalAmount: number;
  paymentMethod: string;
  status: 'pending' | 'paid' | 'cancelled';
  createdAt: string;
  paidAt?: string;
  qrCode: string;
}

interface OrderState {
  orders: Order[];
  createOrder: (userId: string, items: CartItem[], totalAmount: number, paymentMethod: string) => Order;
  getOrderById: (orderId: string) => Order | undefined;
  getUserOrders: (userId: string) => Order[];
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
}

export const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => ({
      orders: [],

      createOrder: (userId, items, totalAmount, paymentMethod) => {
        const order: Order = {
          id: 'ORD-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
          userId,
          items,
          totalAmount,
          paymentMethod,
          status: 'pending',
          createdAt: new Date().toISOString(),
          qrCode: 'QR-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
        };

        set((state) => ({
          orders: [order, ...state.orders],
        }));

        return order;
      },

      getOrderById: (orderId) => {
        return get().orders.find((order) => order.id === orderId);
      },

      getUserOrders: (userId) => {
        return get().orders.filter((order) => order.userId === userId);
      },

      updateOrderStatus: (orderId, status) => {
        set((state) => ({
          orders: state.orders.map((order) =>
            order.id === orderId
              ? {
                  ...order,
                  status,
                  paidAt: status === 'paid' ? new Date().toISOString() : order.paidAt,
                }
              : order
          ),
        }));
      },
    }),
    {
      name: 'order-storage',
    }
  )
);
