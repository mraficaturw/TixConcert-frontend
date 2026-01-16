import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { CheckCircle, Download, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuthStore } from '@/stores/authStore';
import { formatCurrency, formatDate } from '@/utils/formatters';
import confetti from 'canvas-confetti';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081';

interface OrderItem {
  ticket_category_id: number;
  ticket_category_name: string;
  quantity: number;
  price: number;
  event_id: number;
  event_title: string;
  event_date?: string;
  event_location?: string;
  event_image?: string;
}

interface Order {
  id: number;
  user_id: number;
  total_amount: number;
  status: string;
  payment_url: string;
  snap_token?: string;
  created_at: string;
  items: OrderItem[];
}

export default function PaymentSuccess() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const token = useAuthStore((state) => state.token);

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId || !token) {
        navigate('/');
        return;
      }

      try {
        const response = await fetch(`${API_URL}/api/my-orders/${orderId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
          const data = await response.json();
          setOrder(data);
        } else {
          navigate('/');
        }
      } catch (error) {
        console.error('Failed to fetch order:', error);
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, token, navigate]);

  useEffect(() => {
    if (!order || loading) return;

    // Trigger confetti animation
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#A855F7', '#EC4899', '#F97316'],
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#A855F7', '#EC4899', '#F97316'],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();
  }, [order, loading]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!order) {
    return null;
  }

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="space-y-8 animate-scale-in text-center">
          {/* Success Icon */}
          <div className="flex justify-center">
            <div className="w-24 h-24 rounded-full bg-concert-gradient flex items-center justify-center shadow-glow animate-pulse-glow">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
          </div>

          {/* Success Message */}
          <div className="space-y-2">
            <h1 className="text-4xl font-bold">
              <span className="bg-concert-gradient bg-clip-text text-transparent">Payment</span>{' '}
              Successful!
            </h1>
            <p className="text-xl text-muted-foreground">
              Terima kasih! Pesanan Anda telah berhasil diproses.
            </p>
          </div>

          {/* Order Info Card */}
          <Card className="border-2 border-border shadow-card text-left">
            <CardContent className="p-6 space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-4 border-b border-border">
                  <span className="text-sm text-muted-foreground">Order ID</span>
                  <span className="font-mono font-bold">TIX-{order.id}</span>
                </div>

                <div className="space-y-3">
                  {order.items?.map((item, index) => (
                    <div key={index} className="space-y-1">
                      <div className="flex justify-between">
                        <span className="font-medium">{item.event_title}</span>
                      </div>
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>
                          {item.ticket_category_name} × {item.quantity}
                        </span>
                        <span>{formatCurrency(item.price * item.quantity)}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-border pt-4">
                  <div className="flex justify-between items-center text-xl">
                    <span className="font-bold">Total Paid</span>
                    <span className="font-bold text-primary">{formatCurrency(order.total_amount)}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-4 border-t border-border text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <span className="font-medium capitalize text-green-500">{order.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Payment Date</span>
                  <span className="font-medium">
                    {formatDate(order.created_at)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <div className="space-y-3 text-sm text-muted-foreground bg-muted/30 p-6 rounded-lg">
            <p className="font-medium text-foreground text-base">📧 What's Next?</p>
            <ul className="space-y-2 text-left list-disc list-inside">
              <li>E-ticket telah dikirim ke email Anda</li>
              <li>Tiket dapat dilihat di dashboard "My Orders"</li>
              <li>Tunjukkan QR code saat masuk venue</li>
              <li>Simpan e-ticket Anda dengan baik</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link to={`/dashboard/orders/${order.id}`} className="flex-1 sm:flex-none">
              <Button className="w-full sm:w-auto shadow-glow" size="lg">
                <Download className="w-5 h-5 mr-2" />
                View My Ticket
              </Button>
            </Link>
            <Link to="/events" className="flex-1 sm:flex-none">
              <Button variant="outline" className="w-full sm:w-auto" size="lg">
                Browse More Events
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
