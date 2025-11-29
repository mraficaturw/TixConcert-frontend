import { useState } from 'react';
import { Minus, Plus, Check } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { formatCurrency } from '@/utils/formatters';
import { TicketCategory } from '@/utils/api';

interface TicketSelectorProps {
  category: TicketCategory;
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  disabled?: boolean;
}

export const TicketSelector = ({ category, quantity, onQuantityChange, disabled }: TicketSelectorProps) => {
  const handleIncrement = () => {
    if (quantity < category.stock) {
      onQuantityChange(quantity + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 0) {
      onQuantityChange(quantity - 1);
    }
  };

  const isOutOfStock = category.stock === 0;
  const isMaxed = quantity >= category.stock;

  return (
    <Card className={`border-2 transition-all ${quantity > 0 ? 'border-primary shadow-glow' : 'border-border'} ${isOutOfStock ? 'opacity-60' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">{category.name}</CardTitle>
          <Badge variant={isOutOfStock ? 'destructive' : 'secondary'}>
            {isOutOfStock ? 'Sold Out' : `${category.stock} left`}
          </Badge>
        </div>
        <p className="text-2xl font-bold text-primary mt-2">{formatCurrency(category.price)}</p>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Benefits */}
        <div className="space-y-1">
          {category.benefits.map((benefit, index) => (
            <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
              <Check className="w-4 h-4 text-primary flex-shrink-0" />
              <span>{benefit}</span>
            </div>
          ))}
        </div>

        {/* Quantity Selector */}
        {!isOutOfStock && (
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <span className="text-sm font-medium">Quantity:</span>
            <div className="flex items-center gap-3">
              <Button
                size="icon"
                variant="outline"
                onClick={handleDecrement}
                disabled={disabled || quantity === 0}
                className="h-8 w-8"
              >
                <Minus className="w-4 h-4" />
              </Button>
              <span className="text-lg font-bold w-8 text-center">{quantity}</span>
              <Button
                size="icon"
                variant="outline"
                onClick={handleIncrement}
                disabled={disabled || isMaxed}
                className="h-8 w-8"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Total Price */}
        {quantity > 0 && (
          <div className="flex items-center justify-between pt-3 border-t border-border">
            <span className="font-medium">Subtotal:</span>
            <span className="text-xl font-bold text-primary">
              {formatCurrency(category.price * quantity)}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
