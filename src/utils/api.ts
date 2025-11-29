import axios from 'axios';
import eventsData from '@/data/events.json';

// Simulated delay for API calls
const delay = (ms: number = 600) => new Promise(resolve => setTimeout(resolve, ms));

export interface Event {
  id: string;
  title: string;
  artist: string;
  location: string;
  date: string;
  time: string;
  image: string;
  description: string;
  category: string;
  ticketCategories: TicketCategory[];
}

export interface TicketCategory {
  id: string;
  name: string;
  price: number;
  stock: number;
  benefits: string[];
}

// Mock API functions
export const api = {
  // Get all events
  getEvents: async (): Promise<Event[]> => {
    await delay();
    return eventsData as Event[];
  },

  // Get event by ID
  getEventById: async (id: string): Promise<Event | null> => {
    await delay();
    const event = eventsData.find((e) => e.id === id);
    return event ? (event as Event) : null;
  },

  // Search events
  searchEvents: async (query: string): Promise<Event[]> => {
    await delay();
    const lowercaseQuery = query.toLowerCase();
    return eventsData.filter(
      (e) =>
        e.title.toLowerCase().includes(lowercaseQuery) ||
        e.artist.toLowerCase().includes(lowercaseQuery) ||
        e.category.toLowerCase().includes(lowercaseQuery)
    ) as Event[];
  },

  // Filter events by category
  filterEventsByCategory: async (category: string): Promise<Event[]> => {
    await delay();
    if (category === 'all') return eventsData as Event[];
    return eventsData.filter((e) => e.category.toLowerCase() === category.toLowerCase()) as Event[];
  },

  // Login user (mock)
  loginUser: async (email: string, password: string): Promise<{ success: boolean; token?: string; error?: string }> => {
    await delay(800);
    
    if (!email || !password) {
      return { success: false, error: 'Email dan password harus diisi' };
    }

    if (password.length < 6) {
      return { success: false, error: 'Password minimal 6 karakter' };
    }

    // Mock successful login
    return {
      success: true,
      token: 'mock-jwt-token-' + Date.now(),
    };
  },

  // Register user (mock)
  registerUser: async (data: {
    name: string;
    email: string;
    password: string;
    phone?: string;
  }): Promise<{ success: boolean; token?: string; error?: string }> => {
    await delay(800);

    if (!data.name || !data.email || !data.password) {
      return { success: false, error: 'Semua field harus diisi' };
    }

    if (data.password.length < 6) {
      return { success: false, error: 'Password minimal 6 karakter' };
    }

    if (!data.email.includes('@')) {
      return { success: false, error: 'Format email tidak valid' };
    }

    // Mock successful registration
    return {
      success: true,
      token: 'mock-jwt-token-' + Date.now(),
    };
  },

  // Create order (mock)
  createOrderMock: async (orderData: any): Promise<{ success: boolean; orderId?: string; error?: string }> => {
    await delay(1000);

    if (!orderData.items || orderData.items.length === 0) {
      return { success: false, error: 'Keranjang kosong' };
    }

    // Mock successful order creation
    return {
      success: true,
      orderId: 'ORD-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
    };
  },

  // Process payment (mock)
  processPayment: async (paymentData: {
    orderId: string;
    amount: number;
    method: string;
  }): Promise<{ success: boolean; error?: string }> => {
    await delay(1500);

    if (paymentData.amount <= 0) {
      return { success: false, error: 'Jumlah pembayaran tidak valid' };
    }

    // Mock successful payment
    return { success: true };
  },
};
