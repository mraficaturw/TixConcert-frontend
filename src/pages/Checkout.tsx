import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Wallet, Building2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useCartStore } from '@/stores/cartStore';
import { useAuthStore } from '@/stores/authStore';
import { useOrderStore } from '@/stores/orderStore';
import { formatCurrency } from '@/utils/formatters';
import { toast } from '@/hooks/use-toast';

export default function Checkout() {
  const navigate = useNavigate();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const user = useAuthStore((state) => state.user);
  const createOrder = useOrderStore((state) => state.createOrder);

  const [paymentMethod, setPaymentMethod] = useState('credit-card');
  const [loading, setLoading] = useState(false);

  const serviceFee = 5000;
  const totalPrice = getTotalPrice() + serviceFee;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast({
        title: 'Error',
        description: 'User not authenticated',
        variant: 'destructive',
      });
      navigate('/login');
      return;
    }

    if (items.length === 0) {
      toast({
        title: 'Cart is empty',
        description: 'Please add items to your cart',
        variant: 'destructive',
      });
      navigate('/cart');
      return;
    }

    setLoading(true);

    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Create order
    const order = createOrder(user.id, items, totalPrice, paymentMethod);

    // Clear cart
    clearCart();

    // Navigate to payment page
    navigate(`/payment/${order.id}`);
  };

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        <h1 className="text-4xl font-bold mb-8 animate-fade-in">
          <span className="bg-concert-gradient bg-clip-text text-transparent">Checkout</span>
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Payment Information */}
            <div className="lg:col-span-2 space-y-6 animate-fade-in">
              {/* Customer Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Customer Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" defaultValue={user?.name} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" defaultValue={user?.email} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" type="tel" defaultValue={user?.phone} placeholder="+62" required />
                  </div>
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card>
                <CardHeader>
                  <CardTitle>Payment Method</CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                    <div className="space-y-3">
                      <label
                        htmlFor="credit-card"
                        className={`flex items-center space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          paymentMethod === 'credit-card'
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <RadioGroupItem value="credit-card" id="credit-card" />
                        <CreditCard className="w-5 h-5 text-primary" />
                        <div className="flex-1">
                          <p className="font-medium">Credit / Debit Card</p>
                          <p className="text-sm text-muted-foreground">Visa, Mastercard, JCB</p>
                        </div>
                      </label>

                      <label
                        htmlFor="e-wallet"
                        className={`flex items-center space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          paymentMethod === 'e-wallet'
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <RadioGroupItem value="e-wallet" id="e-wallet" />
                        <Wallet className="w-5 h-5 text-primary" />
                        <div className="flex-1">
                          <p className="font-medium">E-Wallet</p>
                          <p className="text-sm text-muted-foreground">GoPay, OVO, Dana, ShopeePay</p>
                        </div>
                      </label>

                      <label
                        htmlFor="bank-transfer"
                        className={`flex items-center space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          paymentMethod === 'bank-transfer'
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <RadioGroupItem value="bank-transfer" id="bank-transfer" />
                        <Building2 className="w-5 h-5 text-primary" />
                        <div className="flex-1">
                          <p className="font-medium">Bank Transfer</p>
                          <p className="text-sm text-muted-foreground">BCA, Mandiri, BNI, BRI</p>
                        </div>
                      </label>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="animate-fade-in" style={{ animationDelay: '100ms' }}>
              <div className="sticky top-4">
                <Card className="border-2 border-border shadow-card">
                  <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-3 text-sm">
                      {items.map((item) => (
                        <div key={`${item.eventId}-${item.ticketCategoryId}`} className="space-y-1">
                          <div className="flex justify-between">
                            <span className="font-medium line-clamp-1">{item.eventTitle}</span>
                          </div>
                          <div className="flex justify-between text-muted-foreground">
                            <span>
                              {item.ticketCategoryName} × {item.quantity}
                            </span>
                            <span>{formatCurrency(item.price * item.quantity)}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-border pt-4 space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span>{formatCurrency(getTotalPrice())}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Service Fee</span>
                        <span>{formatCurrency(serviceFee)}</span>
                      </div>
                    </div>

                    <div className="border-t border-border pt-4">
                      <div className="flex justify-between items-center text-xl">
                        <span className="font-bold">Total</span>
                        <span className="font-bold text-primary">{formatCurrency(totalPrice)}</span>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full shadow-glow"
                      size="lg"
                      disabled={loading}
                    >
                      {loading ? 'Processing...' : 'Proceed to Payment'}
                      {!loading && <ArrowRight className="ml-2 w-5 h-5" />}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
