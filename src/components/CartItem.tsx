import { Minus, Plus, Trash2, Calendar, MapPin } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { formatCurrency, formatShortDate } from '@/utils/formatters';
import { CartItem as CartItemType } from '@/stores/cartStore';

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (quantity: number) => void;
  onRemove: () => void;
}

export const CartItem = ({ item, onUpdateQuantity, onRemove }: CartItemProps) => {
  const handleIncrement = () => {
    onUpdateQuantity(item.quantity + 1);
  };

  const handleDecrement = () => {
    if (item.quantity > 1) {
      onUpdateQuantity(item.quantity - 1);
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex gap-4">
          {/* Event Image */}
          <div className="w-24 h-24 rounded-lg bg-concert-gradient flex-shrink-0" />

          {/* Content */}
          <div className="flex-1 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-bold line-clamp-1">{item.eventTitle}</h3>
                <p className="text-sm text-primary font-semibold">{item.ticketCategoryName} Ticket</p>
              </div>
              <Button
                size="icon"
                variant="ghost"
                onClick={onRemove}
                className="text-destructive hover:text-destructive hover:bg-destructive/10 flex-shrink-0"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-1 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="w-3 h-3" />
                <span>{formatShortDate(item.eventDate)}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3 h-3" />
                <span className="line-clamp-1">{item.eventLocation}</span>
              </div>
            </div>

            {/* Price and Quantity */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-3">
                <Button
                  size="icon"
                  variant="outline"
                  onClick={handleDecrement}
                  className="h-7 w-7"
                >
                  <Minus className="w-3 h-3" />
                </Button>
                <span className="font-semibold w-6 text-center">{item.quantity}</span>
                <Button
                  size="icon"
                  variant="outline"
                  onClick={handleIncrement}
                  className="h-7 w-7"
                >
                  <Plus className="w-3 h-3" />
                </Button>
              </div>

              <div className="text-right">
                <p className="text-xs text-muted-foreground">
                  {formatCurrency(item.price)} × {item.quantity}
                </p>
                <p className="font-bold text-lg text-primary">
                  {formatCurrency(item.price * item.quantity)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
