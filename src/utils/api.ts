import axios from 'axios';
import eventsData from '@/data/events.json';

// Demo mode - set to true to run without backend
const DEMO_MODE = true;

// Backend URL (only used when DEMO_MODE is false)
const BASE_URL = 'http://localhost:8081/api';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface Event {
  ID: number;
  id?: string;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt: string | null;
  title: string;
  artist: string;
  location: string;
  date: string;
  time: string;
  image: string;
  description: string;
  category: string;
  eo_id: number;
  ticketCategories: TicketCategory[];
}

export interface TicketCategory {
  ID: number;
  id?: string;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt: string | null;
  event_id: number;
  name: string;
  price: number;
  stock: number;
  benefits: string[];
}

// Map event data to frontend format
const mapEvent = (e: any): any => ({
  ...e,
  id: (e.ID || e.id || '').toString(),
  ticketCategories: e.ticketCategories?.map((tc: any) => ({
    ...tc,
    id: (tc.ID || tc.id || '').toString(),
  })) || e.TicketCategories?.map((tc: any) => ({
    ...tc,
    id: (tc.ID || tc.id || '').toString(),
  })) || [],
});

// Get demo events from JSON file
const getDemoEvents = (): any[] => {
  return eventsData.map((event: any) => ({
    ...event,
    ID: parseInt(event.id.replace('evt-', '')),
    CreatedAt: new Date().toISOString(),
    UpdatedAt: new Date().toISOString(),
    DeletedAt: null,
    eo_id: 1,
    ticketCategories: event.ticketCategories.map((tc: any) => ({
      ...tc,
      ID: parseInt(tc.id.replace(/cat-\d+-/, '')),
      CreatedAt: new Date().toISOString(),
      UpdatedAt: new Date().toISOString(),
      DeletedAt: null,
      event_id: parseInt(event.id.replace('evt-', '')),
    })),
  }));
};

export const api = {
  // Get all events
  getEvents: async (): Promise<any[]> => {
    if (DEMO_MODE) {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 300));
      return getDemoEvents().map(mapEvent);
    }
    
    try {
      const response = await axiosInstance.get('/events');
      return response.data.map(mapEvent);
    } catch (error) {
      console.error("API Error:", error);
      return [];
    }
  },

  // Get event by ID
  getEventById: async (id: string): Promise<any | null> => {
    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 200));
      const events = getDemoEvents();
      const event = events.find(e => e.id === id || e.ID.toString() === id);
      return event ? mapEvent(event) : null;
    }
    
    try {
      const response = await axiosInstance.get(`/events/${id}`);
      return mapEvent(response.data);
    } catch (error) {
      console.error("API Error:", error);
      return null;
    }
  },

  // Search events
  searchEvents: async (query: string): Promise<any[]> => {
    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 200));
      const lowercaseQuery = query.toLowerCase();
      return getDemoEvents().map(mapEvent).filter(
        (e: any) =>
          e.title.toLowerCase().includes(lowercaseQuery) ||
          e.artist.toLowerCase().includes(lowercaseQuery) ||
          e.category.toLowerCase().includes(lowercaseQuery)
      );
    }
    
    try {
      const response = await axiosInstance.get('/events');
      const lowercaseQuery = query.toLowerCase();
      return response.data.map(mapEvent).filter(
        (e: any) =>
          e.title.toLowerCase().includes(lowercaseQuery) ||
          e.artist.toLowerCase().includes(lowercaseQuery) ||
          e.category.toLowerCase().includes(lowercaseQuery)
      );
    } catch (error) {
      console.error("API Error:", error);
      return [];
    }
  },

  // Filter events by category
  filterEventsByCategory: async (category: string): Promise<any[]> => {
    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 200));
      const events = getDemoEvents().map(mapEvent);
      if (category === 'all') return events;
      return events.filter((e: any) => e.category.toLowerCase() === category.toLowerCase());
    }
    
    try {
      const response = await axiosInstance.get('/events');
      const events = response.data.map(mapEvent);
      if (category === 'all') return events;
      return events.filter((e: any) => e.category.toLowerCase() === category.toLowerCase());
    } catch (error) {
      console.error("API Error:", error);
      return [];
    }
  },

  // Login user (demo mode accepts any valid email/password)
  loginUser: async (email: string, password: string): Promise<{ success: boolean; token?: string; error?: string; role?: string; name?: string }> => {
    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 500));
      // Accept any email/password in demo mode
      const name = email.split('@')[0];
      const fakeToken = 'demo_token_' + btoa(email);
      localStorage.setItem('token', fakeToken);
      localStorage.setItem('user_role', 'customer');
      localStorage.setItem('user_name', name);
      return { success: true, token: fakeToken, role: 'customer', name };
    }
    
    try {
      const response = await axiosInstance.post('/auth/login', { email, password });
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user_role', response.data.role);
        localStorage.setItem('user_name', response.data.name);
        return { success: true, token: response.data.token, role: response.data.role, name: response.data.name };
      }
      return { success: false, error: 'Login failed' };
    } catch (error: any) {
      return { success: false, error: error.response?.data?.error || 'Login failed' };
    }
  },

  // Register user (demo mode accepts any valid registration)
  registerUser: async (data: {
    name: string;
    email: string;
    password: string;
    phone?: string;
  }): Promise<{ success: boolean; token?: string; error?: string }> => {
    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 500));
      // Always succeed in demo mode
      return { success: true };
    }
    
    try {
      await axiosInstance.post('/auth/register', { ...data, role: 'customer' });
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.response?.data?.error || 'Registration failed' };
    }
  },

  // Create order
  createOrderMock: async (orderData: any): Promise<{ success: boolean; orderId?: string; error?: string }> => {
    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 500));
      const orderId = 'DEMO-' + Date.now();
      return { success: true, orderId };
    }
    
    try {
      const payload = {
        items: orderData.items.map((item: any) => ({
          ticket_category_id: parseInt(item.id),
          quantity: item.quantity
        }))
      };

      const response = await axiosInstance.post('/checkout', payload);
      return { success: true, orderId: response.data.ID.toString() };
    } catch (error: any) {
      return { success: false, error: error.response?.data?.error || 'Checkout failed' };
    }
  },

  // Process payment
  processPayment: async (paymentData: {
    orderId: string;
    amount: number;
    method: string;
  }): Promise<{ success: boolean; error?: string }> => {
    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { success: true };
    }
    return { success: true };
  },
};
