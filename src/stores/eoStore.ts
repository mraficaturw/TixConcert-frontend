
import { create } from 'zustand';
import { getAuthHeader } from './authStore';
import eventsData from '@/data/events.json';

// Demo mode - set to true to run without backend
const DEMO_MODE = true;

const API_URL = 'http://localhost:8081';

export type TicketCategory = {
    name: string;
    price: number;
    stock: number;
    benefits: string[];
};

export type Event = {
    title: string;
    description: string;
    banner_url: string;
    location: string;
    date: string;
    time: string;
    artist: string;
    category: string;
    ticket_categories: TicketCategory[];
};

// Local storage key for demo events
const DEMO_EVENTS_KEY = 'demo_eo_events';

// Get stored demo events or initialize with sample data
const getDemoEvents = (): any[] => {
    const stored = localStorage.getItem(DEMO_EVENTS_KEY);
    if (stored) {
        return JSON.parse(stored);
    }
    // Initialize with events from JSON
    const initialEvents = eventsData.map((event: any, index: number) => ({
        id: index + 1,
        title: event.title,
        description: event.description,
        image: event.image,
        location: event.location,
        date: event.date,
        time: event.time,
        artist: event.artist,
        category: event.category,
        ticketCategories: event.ticketCategories,
    }));
    localStorage.setItem(DEMO_EVENTS_KEY, JSON.stringify(initialEvents));
    return initialEvents;
};

// Save demo events to localStorage
const saveDemoEvents = (events: any[]) => {
    localStorage.setItem(DEMO_EVENTS_KEY, JSON.stringify(events));
};

interface EOState {
    isLoading: boolean;
    error: string | null;
    myEvents: any[];

    registerEO: (data: { name: string; description: string; contact: string }) => Promise<{ success: boolean; error?: string; accessToken?: string }>;
    createEvent: (data: Event) => Promise<{ success: boolean; error?: string }>;
    fetchMyEvents: () => Promise<void>;
    deleteEvent: (eventId: number) => Promise<{ success: boolean; error?: string }>;
    updateEvent: (eventId: number, data: Partial<Event>) => Promise<{ success: boolean; error?: string }>;
    fetchEventById: (eventId: number) => Promise<any | null>;
}

export const useEOStore = create<EOState>((set, get) => ({
    isLoading: false,
    error: null,
    myEvents: [],

    registerEO: async (data) => {
        set({ isLoading: true, error: null });
        try {
            if (DEMO_MODE) {
                await new Promise(resolve => setTimeout(resolve, 500));
                const fakeToken = 'demo_eo_token_' + Date.now();
                set({ isLoading: false });
                return { success: true, accessToken: fakeToken };
            }
            
            const response = await fetch(`${API_URL}/api/eo/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...getAuthHeader(),
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to register as EO');
            }

            const responseData = await response.json();

            set({ isLoading: false });
            return { success: true, accessToken: responseData.access_token };
        } catch (error: any) {
            set({ isLoading: false, error: error.message });
            return { success: false, error: error.message };
        }
    },

    createEvent: async (data) => {
        set({ isLoading: true, error: null });
        try {
            if (DEMO_MODE) {
                await new Promise(resolve => setTimeout(resolve, 500));
                const events = getDemoEvents();
                const newEvent = {
                    id: Date.now(),
                    title: data.title,
                    description: data.description,
                    image: data.banner_url,
                    location: data.location,
                    date: data.date,
                    time: data.time,
                    artist: data.artist,
                    category: data.category,
                    ticketCategories: data.ticket_categories.map((tc, idx) => ({
                        id: `cat-${Date.now()}-${idx}`,
                        name: tc.name,
                        price: tc.price,
                        stock: tc.stock,
                        benefits: tc.benefits,
                    })),
                };
                events.push(newEvent);
                saveDemoEvents(events);
                set({ isLoading: false });
                return { success: true };
            }
            
            const response = await fetch(`${API_URL}/api/events`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...getAuthHeader(),
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to create event');
            }

            set({ isLoading: false });
            return { success: true };
        } catch (error: any) {
            set({ isLoading: false, error: error.message });
            return { success: false, error: error.message };
        }
    },

    fetchMyEvents: async () => {
        set({ isLoading: true, error: null });
        try {
            if (DEMO_MODE) {
                await new Promise(resolve => setTimeout(resolve, 300));
                const events = getDemoEvents();
                set({ myEvents: events, isLoading: false });
                return;
            }
            
            const response = await fetch(`${API_URL}/api/my-events`, {
                headers: {
                    ...getAuthHeader(),
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch events');
            }

            const data = await response.json();
            set({ myEvents: data, isLoading: false });
        } catch (error: any) {
            set({ isLoading: false, error: error.message });
        }
    },

    deleteEvent: async (eventId: number) => {
        set({ isLoading: true, error: null });
        try {
            if (DEMO_MODE) {
                await new Promise(resolve => setTimeout(resolve, 300));
                const events = getDemoEvents().filter(e => e.id !== eventId);
                saveDemoEvents(events);
                set({
                    myEvents: events,
                    isLoading: false
                });
                return { success: true };
            }
            
            const response = await fetch(`${API_URL}/api/events/${eventId}`, {
                method: 'DELETE',
                headers: {
                    ...getAuthHeader(),
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to delete event');
            }

            const currentEvents = get().myEvents;
            set({
                myEvents: currentEvents.filter((e: any) => e.id !== eventId),
                isLoading: false
            });
            return { success: true };
        } catch (error: any) {
            set({ isLoading: false, error: error.message });
            return { success: false, error: error.message };
        }
    },

    updateEvent: async (eventId: number, data: Partial<Event>) => {
        set({ isLoading: true, error: null });
        try {
            if (DEMO_MODE) {
                await new Promise(resolve => setTimeout(resolve, 500));
                const events = getDemoEvents().map(e => {
                    if (e.id === eventId) {
                        return {
                            ...e,
                            ...data,
                            image: data.banner_url || e.image,
                        };
                    }
                    return e;
                });
                saveDemoEvents(events);
                set({ isLoading: false });
                return { success: true };
            }
            
            const response = await fetch(`${API_URL}/api/events/${eventId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    ...getAuthHeader(),
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to update event');
            }

            set({ isLoading: false });
            return { success: true };
        } catch (error: any) {
            set({ isLoading: false, error: error.message });
            return { success: false, error: error.message };
        }
    },

    fetchEventById: async (eventId: number) => {
        try {
            if (DEMO_MODE) {
                await new Promise(resolve => setTimeout(resolve, 200));
                const events = getDemoEvents();
                return events.find(e => e.id === eventId) || null;
            }
            
            const response = await fetch(`${API_URL}/api/events/${eventId}`, {
                headers: {
                    ...getAuthHeader(),
                },
            });

            if (!response.ok) {
                return null;
            }

            const data = await response.json();
            return data;
        } catch (error: any) {
            return null;
        }
    },
}));

