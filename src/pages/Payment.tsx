import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, CheckCircle, CreditCard, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useOrderStore } from '@/stores/orderStore';
import { formatCurrency } from '@/utils/formatters';
import { toast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';

export default function Payment() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const order = useOrderStore((state) => state.getOrderById(orderId || ''));
  const updateOrderStatus = useOrderStore((state) => state.updateOrderStatus);

  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (!order) {
      navigate('/');
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [order, navigate]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePaymentSimulation = async () => {
    if (!order) return;

    setProcessing(true);

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Update order status
    updateOrderStatus(order.id, 'paid');

    toast({
      title: 'Payment Successful!',
      description: 'Your tickets have been purchased.',
    });

    // Navigate to success page
    navigate(`/payment-success/${order.id}`);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied!',
      description: 'Payment information copied to clipboard',
    });
  };

  if (!order) {
    return null;
  }

  const progressPercent = (timeLeft / 600) * 100;

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="space-y-6 animate-fade-in">
          {/* Timer */}
          <Card className="border-2 border-primary shadow-glow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Clock className="w-6 h-6 text-primary" />
                  <div>
                    <p className="font-medium">Complete your payment</p>
                    <p className="text-sm text-muted-foreground">Time remaining</p>
                  </div>
                </div>
                <div className="text-3xl font-bold text-primary">{formatTime(timeLeft)}</div>
              </div>
              <Progress value={progressPercent} className="h-2" />
            </CardContent>
          </Card>

          {/* Order Details */}
          <Card>
            <CardHeader>
              <CardTitle>Order Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Order ID</span>
                  <span className="font-mono font-medium">{order.id}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Payment Method</span>
                  <span className="font-medium capitalize">{order.paymentMethod.replace('-', ' ')}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Tickets</span>
                  <span className="font-medium">
                    {order.items.reduce((sum, item) => sum + item.quantity, 0)} tickets
                  </span>
                </div>
              </div>

              <div className="border-t border-border pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold">Total Amount</span>
                  <span className="text-2xl font-bold text-primary">
                    {formatCurrency(order.totalAmount)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Instructions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Payment Instructions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {order.paymentMethod === 'credit-card' && (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    This is a mock payment. In production, you would be redirected to a secure payment gateway.
                  </p>
                  <div className="space-y-2 p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm font-medium">Test Card Information:</p>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <p>Card Number: 4111 1111 1111 1111</p>
                      <p>Expiry: 12/25</p>
                      <p>CVV: 123</p>
                    </div>
                  </div>
                </div>
              )}

              {order.paymentMethod === 'bank-transfer' && (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Transfer dana ke rekening berikut:
                  </p>
                  <div className="space-y-2 p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Bank BCA</p>
                        <p className="text-lg font-mono font-bold">1234567890</p>
                        <p className="text-sm text-muted-foreground">PT. TixConcert Indonesia</p>
                      </div>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => copyToClipboard('1234567890')}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {order.paymentMethod === 'e-wallet' && (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Scan QR code dengan aplikasi e-wallet Anda:
                  </p>
                  <div className="flex justify-center p-6 bg-muted/50 rounded-lg">
                    <div className="w-48 h-48 bg-background rounded-lg flex items-center justify-center">
                      <p className="text-sm text-muted-foreground text-center">
                        QR Code<br />Placeholder
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <Button
                onClick={handlePaymentSimulation}
                className="w-full shadow-glow"
                size="lg"
                disabled={processing || timeLeft === 0}
              >
                {processing ? 'Processing Payment...' : 'Complete Payment (Mock)'}
                {!processing && <CheckCircle className="ml-2 w-5 h-5" />}
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                This is a simulated payment for demonstration purposes
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
