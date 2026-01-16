
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Plus, Trash, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { useEOStore, TicketCategory } from '@/stores/eoStore';
import ImageUpload from '@/components/ImageUpload';

export default function EditEvent() {
    const { eventId } = useParams<{ eventId: string }>();
    const navigate = useNavigate();
    const { updateEvent, fetchEventById, isLoading } = useEOStore();

    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        title: '',
        artist: '',
        description: '',
        location: '',
        date: '',
        time: '',
        category: 'Music',
        banner_url: '',
    });

    const [ticketCategories, setTicketCategories] = useState<TicketCategory[]>([]);

    useEffect(() => {
        const loadEvent = async () => {
            if (!eventId) return;

            const event = await fetchEventById(Number(eventId));
            if (event) {
                setFormData({
                    title: event.title || '',
                    artist: event.artist || '',
                    description: event.description || '',
                    location: event.location || '',
                    date: event.date || '',
                    time: event.time || '',
                    category: event.category || 'Music',
                    banner_url: event.image || '',
                });

                if (event.ticketCategories && event.ticketCategories.length > 0) {
                    setTicketCategories(event.ticketCategories.map((tc: any) => ({
                        name: tc.name,
                        price: tc.price,
                        stock: tc.stock,
                        benefits: tc.benefits || [],
                    })));
                } else {
                    setTicketCategories([{ name: 'Regular', price: 0, stock: 100, benefits: [] }]);
                }
            } else {
                toast({
                    title: 'Event not found',
                    description: 'The event you are trying to edit does not exist.',
                    variant: 'destructive',
                });
                navigate('/eo/dashboard');
            }
            setLoading(false);
        };

        loadEvent();
    }, [eventId, fetchEventById, navigate]);

    const addTicketCategory = () => {
        if (ticketCategories.length >= 5) {
            toast({
                title: 'Maksimal 5 kategori tiket',
                variant: 'destructive',
            });
            return;
        }
        setTicketCategories([
            ...ticketCategories,
            { name: '', price: 0, stock: 0, benefits: [] },
        ]);
    };

    const removeTicketCategory = (index: number) => {
        if (ticketCategories.length === 1) return;
        setTicketCategories(ticketCategories.filter((_, i) => i !== index));
    };

    const updateTicketCategory = (index: number, field: keyof TicketCategory, value: any) => {
        const newCategories = [...ticketCategories];
        newCategories[index] = { ...newCategories[index], [field]: value };
        setTicketCategories(newCategories);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (ticketCategories.some(cat => !cat.name || cat.price < 0 || cat.stock <= 0)) {
            toast({
                title: 'Mohon lengkapi data tiket',
                description: 'Pastikan nama, harga, dan stok tiket valid.',
                variant: 'destructive',
            });
            return;
        }

        const payload = {
            ...formData,
            ticket_categories: ticketCategories,
        };

        const result = await updateEvent(Number(eventId), payload);

        if (result.success) {
            toast({
                title: 'Event berhasil diupdate!',
                description: 'Perubahan event Anda telah disimpan.',
            });
            navigate('/eo/dashboard');
        } else {
            toast({
                title: 'Gagal mengupdate event',
                description: result.error || 'Terjadi kesalahan.',
                variant: 'destructive',
            });
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8 max-w-4xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold">Edit Event</h1>
                <p className="text-muted-foreground">Perbarui detail event konser Anda.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Basic Info */}
                <Card>
                    <CardHeader>
                        <CardTitle>Informasi Dasar</CardTitle>
                        <CardDescription>Detail utama mengenai event Anda.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Judul Event</Label>
                                <Input
                                    id="title"
                                    placeholder="Contoh: Tulus Tur Manusia"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="artist">Nama Artis / Penampil</Label>
                                <Input
                                    id="artist"
                                    placeholder="Contoh: Tulus"
                                    value={formData.artist}
                                    onChange={(e) => setFormData({ ...formData, artist: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2 mb-6">
                            <Label>Banner Image (Portrait)</Label>
                            <ImageUpload
                                label="Upload Banner (Portrait - 800x1024px)"
                                currentImage={formData.banner_url}
                                onUpload={(url) => setFormData({ ...formData, banner_url: url })}
                                bucketName="images"
                                className="max-w-[400px]"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Deskripsi</Label>
                            <Textarea
                                id="description"
                                placeholder="Jelaskan detail event Anda..."
                                className="min-h-[120px]"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
                            <div className="space-y-2">
                                <Label htmlFor="location">Lokasi / Venue</Label>
                                <Input
                                    id="location"
                                    placeholder="Contoh: GBK, Jakarta"
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="date">Tanggal</Label>
                                <Input
                                    id="date"
                                    type="date"
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="time">Waktu</Label>
                                <Input
                                    id="time"
                                    type="time"
                                    value={formData.time}
                                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Ticket Categories */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Kategori Tiket</CardTitle>
                            <CardDescription>Atur jenis tiket, harga, dan stok (Maksimal 5 kategori).</CardDescription>
                        </div>
                        <Button type="button" onClick={addTicketCategory} disabled={ticketCategories.length >= 5}>
                            <Plus className="w-4 h-4 mr-2" />
                            Tambah Kategori
                        </Button>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {ticketCategories.map((ticket, index) => (
                            <div key={index} className="relative p-4 border rounded-lg bg-card hover:border-primary/50 transition-colors">
                                <div className="absolute right-4 top-4">
                                    {ticketCategories.length > 1 && (
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="text-muted-foreground hover:text-red-500"
                                            onClick={() => removeTicketCategory(index)}
                                        >
                                            <Trash className="w-4 h-4" />
                                        </Button>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                    <div className="space-y-2">
                                        <Label>Nama Kategori</Label>
                                        <Input
                                            placeholder="Contoh: VIP Standing"
                                            value={ticket.name}
                                            onChange={(e) => updateTicketCategory(index, 'name', e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Harga (IDR)</Label>
                                        <Input
                                            type="number"
                                            placeholder="0"
                                            min="0"
                                            value={ticket.price}
                                            onChange={(e) => updateTicketCategory(index, 'price', Number(e.target.value))}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Stok Tiket</Label>
                                        <Input
                                            type="number"
                                            placeholder="100"
                                            min="1"
                                            value={ticket.stock}
                                            onChange={(e) => updateTicketCategory(index, 'stock', Number(e.target.value))}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2 md:col-span-3">
                                        <Label>Benefit (Satu benefit per baris)</Label>
                                        <Textarea
                                            placeholder={"Contoh: Meet & Greet\nMerchandise Eksklusif"}
                                            value={ticket.benefits.join('\n')}
                                            onChange={(e) => updateTicketCategory(index, 'benefits', e.target.value.split('\n'))}
                                            className="min-h-[80px]"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <div className="flex justify-end gap-4">
                    <Button type="button" variant="outline" onClick={() => navigate('/eo/dashboard')}>
                        Batal
                    </Button>
                    <Button type="submit" size="lg" disabled={isLoading} className="min-w-[150px]">
                        {isLoading ? 'Menyimpan...' : 'Simpan Perubahan'}
                    </Button>
                </div>
            </form>
        </div>
    );
}
