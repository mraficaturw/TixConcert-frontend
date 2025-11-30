import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Calendar, MapPin, Clock, ArrowLeft, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TicketSelector } from '@/components/TicketSelector';
import { api, Event } from '@/utils/api';
import { useCartStore } from '@/stores/cartStore';
import { formatCurrency, formatDate, formatTime } from '@/utils/formatters';
import { toast } from '@/hooks/use-toast';

export default function EventDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const addToCart = useCartStore((state) => state.addToCart);

  useEffect(() => {
    const fetchEvent = async () => {
      if (!id) return;

      try {
        const data = await api.getEventById(id);
        setEvent(data);
        
        // Initialize quantities
        if (data) {
          const initialQuantities: Record<string, number> = {};
          data.ticketCategories.forEach((cat) => {
            initialQuantities[cat.id] = 0;
          });
          setQuantities(initialQuantities);
        }
      } catch (error) {
        console.error('Error fetching event:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const handleQuantityChange = (categoryId: string, quantity: number) => {
    setQuantities((prev) => ({
      ...prev,
      [categoryId]: quantity,
    }));
  };

  const handleAddToCart = () => {
    if (!event) return;

    const selectedTickets = event.ticketCategories.filter(
      (cat) => quantities[cat.id] > 0
    );

    if (selectedTickets.length === 0) {
      toast({
        title: 'Pilih tiket terlebih dahulu',
        description: 'Silakan pilih minimal 1 tiket untuk melanjutkan.',
        variant: 'destructive',
      });
      return;
    }

    selectedTickets.forEach((cat) => {
      addToCart({
        eventId: event.id,
        eventTitle: event.title,
        eventDate: event.date,
        eventLocation: event.location,
        eventImage: event.image,
        ticketCategoryId: cat.id,
        ticketCategoryName: cat.name,
        price: cat.price,
        quantity: quantities[cat.id],
      });
    });

    toast({
      title: 'Berhasil ditambahkan ke keranjang!',
      description: `${selectedTickets.length} jenis tiket telah ditambahkan.`,
    });

    navigate('/cart');
  };

  const getTotalPrice = () => {
    if (!event) return 0;
    return event.ticketCategories.reduce((total, cat) => {
      return total + cat.price * (quantities[cat.id] || 0);
    }, 0);
  };

  const getTotalQuantity = () => {
    return Object.values(quantities).reduce((sum, qty) => sum + qty, 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full border-4 border-primary border-t-transparent animate-spin" />
          <p className="text-muted-foreground">Loading event details...</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-2xl font-bold">Event not found</p>
          <Link to="/events">
            <Button>Browse Events</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <Link to="/events">
          <Button variant="ghost" className="mb-6 group">
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Events
          </Button>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Event Image & Info */}
          <div className="space-y-6 animate-fade-in">
            <div className="relative h-fit rounded-2xl overflow-hidden shadow-card">
              <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-concert-gradient opacity-50" />
              <Badge className="absolute top-4 right-4 bg-primary/90 backdrop-blur">
                {event.category}
              </Badge>
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl font-bold">{event.title}</h1>
              <p className="text-xl text-primary font-semibold">{event.artist}</p>
              <p className="text-muted-foreground leading-relaxed">{event.description}</p>

              <div className="space-y-3 pt-4">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Calendar className="w-5 h-5 text-primary" />
                  <span>{formatDate(event.date)}</span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Clock className="w-5 h-5 text-primary" />
                  <span>{formatTime(event.time)}</span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <MapPin className="w-5 h-5 text-primary" />
                  <span>{event.location}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Ticket Selection */}
          <div className="space-y-6 animate-fade-in" style={{ animationDelay: '200ms' }}>
            <div>
              <h2 className="text-2xl font-bold mb-2">Select Tickets</h2>
              <p className="text-muted-foreground">Pilih kategori dan jumlah tiket yang Anda inginkan</p>
            </div>

            <div className="space-y-4">
              {event.ticketCategories.map((category) => (
                <TicketSelector
                  key={category.id}
                  category={category}
                  quantity={quantities[category.id] || 0}
                  onQuantityChange={(qty) => handleQuantityChange(category.id, qty)}
                />
              ))}
            </div>

            {/* Summary */}
            {getTotalQuantity() > 0 && (
              <div className="sticky bottom-4 p-6 rounded-xl bg-card border-2 border-primary shadow-glow space-y-4">
                <div className="flex items-center justify-between text-lg">
                  <span className="font-medium">Total Tickets:</span>
                  <span className="font-bold">{getTotalQuantity()}</span>
                </div>
                <div className="flex items-center justify-between text-2xl">
                  <span className="font-bold">Total Price:</span>
                  <span className="font-bold text-primary">{formatCurrency(getTotalPrice())}</span>
                </div>
                <Button className="w-full shadow-glow" size="lg" onClick={handleAddToCart}>
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Add to Cart
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
