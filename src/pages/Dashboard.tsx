import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Ticket, User, ShoppingBag, Calendar, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/stores/authStore';
import { formatCurrency } from '@/utils/formatters';
import { Badge } from '@/components/ui/badge';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081';

interface DashboardStats {
  total_orders: number;
  total_tickets: number;
  total_spent: number;
}

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

export default function Dashboard() {
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);

  const [stats, setStats] = useState<DashboardStats>({ total_orders: 0, total_tickets: 0, total_spent: 0 });
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;

    const fetchDashboardData = async () => {
      try {
        // Fetch stats
        const statsRes = await fetch(`${API_URL}/api/dashboard-stats`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStats(statsData);
        }

        // Fetch recent orders
        const ordersRes = await fetch(`${API_URL}/api/my-orders`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (ordersRes.ok) {
          const ordersData = await ordersRes.json();
          setRecentOrders((ordersData || []).slice(0, 3));
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();

    // Refetch when window gains focus (e.g., after returning from payment)
    const handleFocus = () => {
      fetchDashboardData();
    };

    window.addEventListener('focus', handleFocus);

    // Also poll every 30 seconds for updates
    const interval = setInterval(fetchDashboardData, 30000);

    return () => {
      window.removeEventListener('focus', handleFocus);
      clearInterval(interval);
    };
  }, [token]);

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold mb-2">
            <span className="bg-concert-gradient bg-clip-text text-transparent">Dashboard</span>
          </h1>
          <p className="text-muted-foreground">Selamat datang kembali, {user?.name}!</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-2 border-border hover:border-primary/50 transition-colors animate-fade-in">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Orders</p>
                  <p className="text-3xl font-bold">{loading ? <Loader2 className="w-6 h-6 animate-spin" /> : stats.total_orders}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <ShoppingBag className="w-6 h-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-border hover:border-primary/50 transition-colors animate-fade-in" style={{ animationDelay: '100ms' }}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Tickets</p>
                  <p className="text-3xl font-bold">{loading ? <Loader2 className="w-6 h-6 animate-spin" /> : stats.total_tickets}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center">
                  <Ticket className="w-6 h-6 text-secondary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-border hover:border-primary/50 transition-colors animate-fade-in" style={{ animationDelay: '200ms' }}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Spent</p>
                  <p className="text-2xl font-bold">{loading ? <Loader2 className="w-6 h-6 animate-spin" /> : formatCurrency(stats.total_spent)}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-accent" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <Card className="animate-fade-in" style={{ animationDelay: '300ms' }}>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <Link to="/events">
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="w-4 h-4 mr-2" />
                  Browse Events
                </Button>
              </Link>
              <Link to="/dashboard/orders">
                <Button variant="outline" className="w-full justify-start mt-6 mb-6">
                  <Ticket className="w-4 h-4 mr-2" />
                  My Orders
                </Button>
              </Link>
              <Link to="/dashboard/profile">
                <Button variant="outline" className="w-full justify-start">
                  <User className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="animate-fade-in" style={{ animationDelay: '400ms' }}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recent Orders</CardTitle>
                <Link to="/dashboard/orders">
                  <Button variant="ghost" size="sm">
                    View All
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {recentOrders.length > 0 ? (
                <div className="space-y-3">
                  {recentOrders.map((order) => (
                    <Link
                      key={order.id}
                      to={`/dashboard/orders/${order.id}`}
                      className="block p-3 rounded-lg border border-border hover:border-primary/50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-sm line-clamp-1">
                            {order.items[0]?.event_title || 'Unknown Event'}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {order.items?.reduce((sum, item) => sum + item.quantity, 0) || 0} tickets
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
                          className={order.status === 'expired' ? 'bg-amber-500 hover:bg-amber-600' : ''}
                        >
                          {order.status}
                        </Badge>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No orders yet</p>
                  <Link to="/events">
                    <Button variant="link" className="mt-2">
                      Start browsing events
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
