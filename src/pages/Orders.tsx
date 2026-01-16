import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Ticket, Calendar, MapPin, ChevronRight, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/stores/authStore';
import { formatCurrency, formatShortDate } from '@/utils/formatters';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081';

interface OrderItem {
  ticket_category_id: number;
  ticket_category_name: string;
  quantity: number;
  price: number;
  event_id: number;
  event_title: string;
}

interface Order {
  id: number;
  user_id: number;
  total_amount: number;
  status: string;
  payment_url: string;
  created_at: string;
  items: OrderItem[];
}

export default function Orders() {
  const token = useAuthStore((state) => state.token);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;

    const fetchOrders = async () => {
      try {
        const response = await fetch(`${API_URL}/api/my-orders`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setOrders(data || []);
        }
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen py-12 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold mb-2">
            <span className="bg-concert-gradient bg-clip-text text-transparent">My</span> Orders
          </h1>
          <p className="text-muted-foreground">Semua pesanan dan tiket Anda</p>
        </div>

        {orders.length > 0 ? (
          <div className="space-y-4">
            {orders.map((order, index) => (
              <Link
                key={order.id}
                to={`/dashboard/orders/${order.id}`}
                className="block animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <Card className="border-2 border-border hover:border-primary/50 transition-all hover:shadow-glow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-3">
                        {/* Order Header */}
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-mono text-sm text-muted-foreground">TIX-{order.id}</p>
                            <p className="text-xs text-muted-foreground">
                              {formatShortDate(order.created_at)}
                            </p>
                          </div>
                          <Badge
                            variant={
                              order.status === 'paid'
                                ? 'default'
                                : order.status === 'pending'
                                  ? 'secondary'
                                  : 'destructive'
                            }
                            className={`capitalize ${order.status === 'expired' ? 'bg-amber-500 hover:bg-amber-600' : ''}`}
                          >
                            {order.status}
                          </Badge>
                        </div>

                        {/* Events */}
                        <div className="space-y-2">
                          {order.items?.map((item, idx) => (
                            <div key={idx} className="space-y-1">
                              <h3 className="font-bold">{item.event_title || 'Unknown Event'}</h3>
                              <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Ticket className="w-3 h-3" />
                                  <span>
                                    {item.ticket_category_name} × {item.quantity}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Total */}
                        <div className="flex items-center justify-between pt-3 border-t border-border">
                          <span className="text-sm text-muted-foreground">Total Amount</span>
                          <span className="font-bold text-lg text-primary">
                            {formatCurrency(order.total_amount)}
                          </span>
                        </div>
                      </div>

                      <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-2" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <Card className="border-2 border-border animate-fade-in">
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                <Ticket className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-bold mb-2">No Orders Yet</h3>
              <p className="text-muted-foreground mb-6">
                Anda belum memiliki pesanan. Mulai jelajahi event dan pesan tiket favoritmu!
              </p>
              <Link to="/events">
                <button className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground font-medium h-10 px-6 shadow-glow hover:opacity-90 transition-opacity">
                  Browse Events
                </button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

