import { useParams, Link } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { Calendar, MapPin, Ticket, Download, ArrowLeft, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useOrderStore } from '@/stores/orderStore';
import { formatCurrency, formatDate, formatShortDate } from '@/utils/formatters';
import { Separator } from '@/components/ui/separator';

export default function OrderDetail() {
  const { orderId } = useParams<{ orderId: string }>();
  const order = useOrderStore((state) => state.getOrderById(orderId || ''));

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
                      Ordered on {formatDate(order.createdAt)}
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
                    className="capitalize text-lg px-4 py-1"
                  >
                    {order.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Order ID</span>
                    <span className="font-mono font-medium">{order.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Payment Method</span>
                    <span className="font-medium capitalize">
                      {order.paymentMethod.replace('-', ' ')}
                    </span>
                  </div>
                  {order.paidAt && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Paid At</span>
                      <span className="font-medium">{formatDate(order.paidAt)}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Tickets */}
            {order.items.map((item, index) => (
              <Card key={index} className="border-2 border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Ticket className="w-5 h-5" />
                    {item.eventTitle}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>{formatShortDate(item.eventDate)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span>{item.eventLocation}</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Ticket Type</span>
                      <span className="font-medium">{item.ticketCategoryName}</span>
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
                  <span className="font-bold">Total Paid</span>
                  <span className="font-bold text-primary">{formatCurrency(order.totalAmount)}</span>
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
                      <QRCodeSVG value={order.qrCode} size={200} level="H" />
                    </div>

                    <div className="text-center space-y-2">
                      <p className="text-sm font-medium">QR Code: {order.qrCode}</p>
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

            {!isPaid && (
              <Card className="border-2 border-border">
                <CardContent className="p-6 text-center space-y-4">
                  <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center">
                    <Ticket className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium mb-2">Payment Pending</p>
                    <p className="text-sm text-muted-foreground">
                      E-ticket akan tersedia setelah pembayaran berhasil
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
