import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  eventId: string;
  eventTitle: string;
  eventDate: string;
  eventLocation: string;
  eventImage: string;
  ticketCategoryId: string;
  ticketCategoryName: string;
  price: number;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (eventId: string, ticketCategoryId: string) => void;
  updateQuantity: (eventId: string, ticketCategoryId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addToCart: (item) => {
        set((state) => {
          const existingItemIndex = state.items.findIndex(
            (i) => i.eventId === item.eventId && i.ticketCategoryId === item.ticketCategoryId
          );

          if (existingItemIndex > -1) {
            const newItems = [...state.items];
            newItems[existingItemIndex].quantity += item.quantity;
            return { items: newItems };
          }

          return { items: [...state.items, item] };
        });
      },

      removeFromCart: (eventId, ticketCategoryId) => {
        set((state) => ({
          items: state.items.filter(
            (item) => !(item.eventId === eventId && item.ticketCategoryId === ticketCategoryId)
          ),
        }));
      },

      updateQuantity: (eventId, ticketCategoryId, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(eventId, ticketCategoryId);
          return;
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.eventId === eventId && item.ticketCategoryId === ticketCategoryId
              ? { ...item, quantity }
              : item
          ),
        }));
      },

      clearCart: () => {
        set({ items: [] });
      },

      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);
