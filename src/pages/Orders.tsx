import { Link } from 'react-router-dom';
import { Ticket, Calendar, MapPin, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/stores/authStore';
import { useOrderStore } from '@/stores/orderStore';
import { formatCurrency, formatShortDate } from '@/utils/formatters';

export default function Orders() {
  const user = useAuthStore((state) => state.user);
  const orders = useOrderStore((state) => state.orders);
  const userOrders = user ? orders.filter((order) => order.userId === user.id) : [];

  const sortedOrders = [...userOrders].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold mb-2">
            <span className="bg-concert-gradient bg-clip-text text-transparent">My</span> Orders
          </h1>
          <p className="text-muted-foreground">Semua pesanan dan tiket Anda</p>
        </div>

        {sortedOrders.length > 0 ? (
          <div className="space-y-4">
            {sortedOrders.map((order, index) => (
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
                            <p className="font-mono text-sm text-muted-foreground">{order.id}</p>
                            <p className="text-xs text-muted-foreground">
                              {formatShortDate(order.createdAt)}
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
                            className="capitalize"
                          >
                            {order.status}
                          </Badge>
                        </div>

                        {/* Events */}
                        <div className="space-y-2">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="space-y-1">
                              <h3 className="font-bold">{item.eventTitle}</h3>
                              <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  <span>{formatShortDate(item.eventDate)}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <MapPin className="w-3 h-3" />
                                  <span className="line-clamp-1">{item.eventLocation}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Ticket className="w-3 h-3" />
                                  <span>
                                    {item.ticketCategoryName} × {item.quantity}
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
                            {formatCurrency(order.totalAmount)}
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
