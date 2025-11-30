import { Link } from 'react-router-dom';
import { Calendar, MapPin, Ticket } from 'lucide-react';
import { Card, CardContent, CardFooter } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { formatCurrency, formatShortDate } from '@/utils/formatters';
import { Event } from '@/utils/api';

interface EventCardProps {
  event: Event;
}

export const EventCard = ({ event }: EventCardProps) => {
  const minPrice = Math.min(...event.ticketCategories.map((cat) => cat.price));

  return (
    <Card className="overflow-hidden group hover:shadow-glow transition-all duration-300 border-border/50 bg-card/50 backdrop-blur">
      <Link to={`/events/${event.id}`}>
        <div className="relative h-14 overflow-hidden bg-muted">
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent z-10" />
          <div className="w-full h-full bg-concert-gradient opacity-50" />
          <Badge className="absolute top-3 right-3 z-20 bg-primary/90 backdrop-blur">
            {event.category}
          </Badge>
        </div>
      </Link>

      <CardContent className="p-4 space-y-3">
        <Link to={`/events/${event.id}`}>
        <img src={event.image} alt={event.title} className="px-4 py-4" />
          <h3 className="font-bold text-lg line-clamp-1 group-hover:text-primary transition-colors">
            {event.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-1">{event.artist}</p>
        </Link>

        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="w-4 h-4 text-primary" />
            <span>{formatShortDate(event.date)}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="w-4 h-4 text-primary" />
            <span className="line-clamp-1">{event.location}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Ticket className="w-4 h-4 text-primary" />
            <span className="font-semibold text-foreground">From {formatCurrency(minPrice)}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Link to={`/events/${event.id}`} className="w-full">
          <Button className="w-full group-hover:shadow-glow transition-all">
            View Details
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};
