import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ArrowRight, Sparkles, Calendar, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EventCard } from '@/components/EventCard';
import { api, Event } from '@/utils/api';
import heroImage from '@/assets/hero-concert.jpg';
import CurvedLoop from '@/components/CurvedLoop';

export default function Home() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await api.getEvents();
        setEvents(data.slice(0, 6)); // Show first 6 events
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Concert Hero"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/20" />
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center space-y-6 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm animate-pulse-glow">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground">Live Your Concert Dreams</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold max-w-4xl mx-auto">
            <span className="bg-concert-gradient bg-clip-text text-transparent">
              Experience
            </span>{' '}
            <br className="hidden md:block" />
            <span className="text-foreground">Unforgettable Music</span>
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Dapatkan tiket konser dan festival musik terbaik. Mudah, cepat, dan aman.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link to="/events">
              <Button size="lg" className="group shadow-glow">
                Browse Events
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/events">
              <Button size="lg" variant="outline" className="border-primary/20 hover:bg-primary/10">
                See All Events
              </Button>
            </Link>
          </div>
        </div>
      </section>
      {/* Marquee Section */}
       <CurvedLoop 
              marqueeText="Let's ✦ Make ✦ Music ✦ like ✦ Our ✦ Life"
              speed={3}
              curveAmount={200}
              direction="right"
              interactive={true}
              className="my-4"
            />
      {/* Features Section */}
      <section className="py-20 bg-card/30 border-y border-border/40">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center space-y-3 p-6 rounded-xl hover:bg-card/50 transition-colors">
              <div className="w-12 h-12 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-bold text-xl">Easy Booking</h3>
              <p className="text-muted-foreground">
                Pesan tiket favoritmu hanya dalam beberapa klik. Proses cepat dan mudah.
              </p>
            </div>

            <div className="text-center space-y-3 p-6 rounded-xl hover:bg-card/50 transition-colors">
              <div className="w-12 h-12 mx-auto rounded-full bg-secondary/10 flex items-center justify-center">
                <MapPin className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="font-bold text-xl">Verified Events</h3>
              <p className="text-muted-foreground">
                Semua event terverifikasi dan terpercaya. Nikmati konser dengan aman.
              </p>
            </div>

            <div className="text-center space-y-3 p-6 rounded-xl hover:bg-card/50 transition-colors">
              <div className="w-12 h-12 mx-auto rounded-full bg-accent/10 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-accent" />
              </div>
              <h3 className="font-bold text-xl">Best Experience</h3>
              <p className="text-muted-foreground">
                Dapatkan pengalaman terbaik dengan fasilitas lengkap dan support 24/7.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Events */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-4xl font-bold mb-2">
                <span className="bg-concert-gradient bg-clip-text text-transparent">Featured</span>{' '}
                Events
              </h2>
              <p className="text-muted-foreground">Jangan lewatkan konser-konser spektakuler ini</p>
            </div>
            <Link to="/events">
              <Button variant="ghost" className="group">
                View All
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-[400px] rounded-xl bg-muted/50 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
              {events.map((event, index) => (
                <div key={event.id} style={{ animationDelay: `${index * 100}ms` }}>
                  <EventCard event={event} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-gradient" />
        <div className="container mx-auto px-4 relative z-10 text-center space-y-6">
          <h2 className="text-4xl md:text-5xl font-bold">
            Ready to Rock?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto pb-6">
            Bergabunglah dengan ribuan music lovers dan nikmati pengalaman konser terbaik.
          </p>
          <Link to="/events">
            <Button size="lg" className="shadow-glow">
              Get Your Tickets Now
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
