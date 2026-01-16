import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { Calendar, MapPin, Ticket, Download, ArrowLeft, CheckCircle, CreditCard, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/stores/authStore';
import { formatCurrency, formatDate, formatShortDate } from '@/utils/formatters';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081';

interface OrderItem {
  ticket_category_id: number;
  ticket_category_name: string;
  quantity: number;
  price: number;
  event_id: number;
  event_title: string;
  event_date: string;
  event_location: string;
  event_image: string;
}

interface Order {
  id: number;
  user_id: number;
  total_amount: number;
  status: string;
  payment_url: string;
  snap_token: string;
  created_at: string;
  items: OrderItem[];
}

export default function OrderDetail() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const token = useAuthStore((state) => state.token);

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);

  useEffect(() => {
    if (!token || !orderId) return;

    const fetchOrder = async () => {
      try {
        const response = await fetch(`${API_URL}/api/my-orders/${orderId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setOrder(data);
        }
      } catch (error) {
        console.error('Failed to fetch order:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [token, orderId]);

  const handleContinuePayment = () => {
    if (!order?.snap_token) {
      toast({
        title: 'Payment Unavailable',
        description: 'Payment token has expired. Please contact support.',
        variant: 'destructive',
      });
      return;
    }

    setPaymentLoading(true);

    if (window.snap) {
      window.snap.pay(order.snap_token, {
        onSuccess: (result: any) => {
          console.log('Payment success:', result);
          toast({
            title: 'Payment Successful!',
            description: 'Your tickets have been purchased.',
          });
          navigate(`/payment-success/${order.id}`);
        },
        onPending: (result: any) => {
          console.log('Payment pending:', result);
          toast({
            title: 'Payment Pending',
            description: 'Please complete your payment.',
          });
          window.location.reload();
        },
        onError: (result: any) => {
          console.error('Payment error:', result);
          toast({
            title: 'Payment Failed',
            description: 'There was an error processing your payment.',
            variant: 'destructive',
          });
          setPaymentLoading(false);
        },
        onClose: () => {
          toast({
            title: 'Payment Cancelled',
            description: 'You closed the payment window.',
          });
          setPaymentLoading(false);
        },
      });
    } else {
      toast({
        title: 'Error',
        description: 'Payment gateway not available',
        variant: 'destructive',
      });
      setPaymentLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-2xl font-bold">Order not found</p>
          <Link to="/dashboard/orders">
            <Button>Back to Orders</Button>
          </Link>
        </div>
      </div>
    );
  }

  const isPaid = order.status === 'paid';
  const isPending = order.status === 'pending';

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Back Button */}
        <Link to="/dashboard/orders">
          <Button variant="ghost" className="mb-6 group">
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Orders
          </Button>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Details */}
          <div className="lg:col-span-2 space-y-6 animate-fade-in">
            {/* Header */}
            <Card className="border-2 border-border">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Order Details</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      Ordered on {formatDate(order.created_at)}
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
                    className={`capitalize text-lg px-4 py-1 ${order.status === 'expired' ? 'bg-amber-500 hover:bg-amber-600' : ''}`}
                  >
                    {order.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Order ID</span>
                    <span className="font-mono font-medium">TIX-{order.id}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tickets */}
            {order.items?.map((item, index) => (
              <Card key={index} className="border-2 border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Ticket className="w-5 h-5" />
                    {item.event_title || 'Unknown Event'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {item.event_date && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span>{formatShortDate(item.event_date)}</span>
                      </div>
                    )}
                    {item.event_location && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        <span>{item.event_location}</span>
                      </div>
                    )}
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Ticket Type</span>
                      <span className="font-medium">{item.ticket_category_name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Quantity</span>
                      <span className="font-medium">{item.quantity} ticket(s)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Price per Ticket</span>
                      <span className="font-medium">{formatCurrency(item.price)}</span>
                    </div>
                    <div className="flex justify-between text-lg pt-2 border-t border-border">
                      <span className="font-bold">Subtotal</span>
                      <span className="font-bold text-primary">
                        {formatCurrency(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Total */}
            <Card className="border-2 border-primary shadow-glow">
              <CardContent className="p-6">
                <div className="flex justify-between items-center text-2xl">
                  <span className="font-bold">{isPaid ? 'Total Paid' : 'Total Amount'}</span>
                  <span className="font-bold text-primary">{formatCurrency(order.total_amount)}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* QR Code & Actions */}
          <div className="space-y-6 animate-fade-in" style={{ animationDelay: '100ms' }}>
            {isPaid && (
              <>
                <Card className="border-2 border-border sticky top-4">
                  <CardHeader>
                    <CardTitle className="text-center">Your E-Ticket</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex justify-center p-6 bg-white rounded-lg">
                      <QRCodeSVG value={`TIX-${order.id}`} size={200} level="H" />
                    </div>

                    <div className="text-center space-y-2">
                      <p className="text-sm font-medium">Order ID: TIX-{order.id}</p>
                      <p className="text-xs text-muted-foreground">
                        Tunjukkan QR code ini saat masuk venue
                      </p>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <Button className="w-full shadow-glow">
                        <Download className="w-4 h-4 mr-2" />
                        Download Ticket
                      </Button>
                      <Button variant="outline" className="w-full">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Add to Wallet
                      </Button>
                    </div>

                    <div className="bg-muted/30 p-4 rounded-lg text-sm space-y-2">
                      <p className="font-medium">Important Notes:</p>
                      <ul className="space-y-1 text-muted-foreground text-xs list-disc list-inside">
                        <li>Simpan e-ticket ini dengan baik</li>
                        <li>Satu QR code hanya berlaku untuk 1x scan</li>
                        <li>Datang 1 jam sebelum event dimulai</li>
                        <li>Bawa ID Card yang valid</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}

            {isPending && (
              <Card className="border-2 border-border">
                <CardContent className="p-6 text-center space-y-4">
                  <div className="w-16 h-16 mx-auto rounded-full bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center">
                    <CreditCard className="w-8 h-8 text-orange-500" />
                  </div>
                  <div>
                    <p className="font-medium mb-2">Payment Pending</p>
                    <p className="text-sm text-muted-foreground mb-4">
                      Selesaikan pembayaran untuk mendapatkan e-ticket Anda
                    </p>
                    <Button
                      className="w-full shadow-glow"
                      onClick={handleContinuePayment}
                      disabled={paymentLoading}
                    >
                      {paymentLoading ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <CreditCard className="w-4 h-4 mr-2" />
                      )}
                      {paymentLoading ? 'Processing...' : 'Continue Payment'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {!isPaid && !isPending && (
              <Card className="border-2 border-border">
                <CardContent className="p-6 text-center space-y-4">
                  <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center">
                    <Ticket className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium mb-2">Payment {order.status}</p>
                    <p className="text-sm text-muted-foreground">
                      This order has been {order.status}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

