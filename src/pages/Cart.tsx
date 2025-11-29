import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, ArrowRight, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CartItem as CartItemComponent } from '@/components/CartItem';
import { useCartStore } from '@/stores/cartStore';
import { formatCurrency } from '@/utils/formatters';
import { Card, CardContent } from '@/components/ui/card';
import { useAuthStore } from '@/stores/authStore';

export default function Cart() {
  const navigate = useNavigate();
  const { items, updateQuantity, removeFromCart, getTotalPrice, getTotalItems, clearCart } = useCartStore();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/checkout');
      return;
    }
    navigate('/checkout');
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center py-12">
        <div className="text-center space-y-6 animate-fade-in">
          <div className="w-24 h-24 mx-auto rounded-full bg-muted flex items-center justify-center">
            <ShoppingBag className="w-12 h-12 text-muted-foreground" />
          </div>
          <div>
            <h2 className="text-3xl font-bold mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-4">Belum ada tiket di keranjang Anda</p>
          </div>
          <Link to="/events">
            <Button size="lg">
              Browse Events
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold mb-2">
            <span className="bg-concert-gradient bg-clip-text text-transparent">Shopping</span> Cart
          </h1>
          <p className="text-muted-foreground">{getTotalItems()} item{getTotalItems() !== 1 ? 's' : ''} in your cart</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4 animate-fade-in">
            {items.map((item) => (
              <CartItemComponent
                key={`${item.eventId}-${item.ticketCategoryId}`}
                item={item}
                onUpdateQuantity={(qty) => updateQuantity(item.eventId, item.ticketCategoryId, qty)}
                onRemove={() => removeFromCart(item.eventId, item.ticketCategoryId)}
              />
            ))}

            <Button
              variant="ghost"
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={clearCart}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear Cart
            </Button>
          </div>

          {/* Order Summary */}
          <div className="animate-fade-in" style={{ animationDelay: '100ms' }}>
            <div className="sticky top-4">
              <Card className="border-2 border-border shadow-card">
                <CardContent className="p-6 space-y-6">
                  <h2 className="text-2xl font-bold">Order Summary</h2>

                  <div className="space-y-3 text-sm">
                    {items.map((item) => (
                      <div key={`${item.eventId}-${item.ticketCategoryId}`} className="flex justify-between">
                        <span className="text-muted-foreground">
                          {item.eventTitle} - {item.ticketCategoryName} × {item.quantity}
                        </span>
                        <span className="font-medium">{formatCurrency(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-border pt-4">
                    <div className="flex justify-between items-center text-sm mb-2">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-medium">{formatCurrency(getTotalPrice())}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm mb-2">
                      <span className="text-muted-foreground">Service Fee</span>
                      <span className="font-medium">{formatCurrency(5000)}</span>
                    </div>
                  </div>

                  <div className="border-t border-border pt-4">
                    <div className="flex justify-between items-center text-xl">
                      <span className="font-bold">Total</span>
                      <span className="font-bold text-primary">{formatCurrency(getTotalPrice() + 5000)}</span>
                    </div>
                  </div>

                  <Button className="w-full shadow-glow" size="lg" onClick={handleCheckout}>
                    Proceed to Checkout
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>

                  <Link to="/events">
                    <Button variant="ghost" className="w-full">
                      Continue Shopping
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
