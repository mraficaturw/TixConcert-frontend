
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, FileText, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { useEOStore } from '@/stores/eoStore';
import { useAuthStore } from '@/stores/authStore';

export default function RegisterEO() {
    const navigate = useNavigate();
    const { registerEO, isLoading } = useEOStore();
    const { user, updateProfile, setToken } = useAuthStore();

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        contact: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const result = await registerEO(formData);

        if (result.success) {
            toast({
                title: 'Berhasil mendaftar jadi EO!',
                description: 'Anda sekarang bisa membuat event.',
            });
            // Update local user role and token
            if (user && result.accessToken) {
                updateProfile({ role: 'EO' });
                setToken(result.accessToken);
            }
            navigate('/eo/dashboard');
        } else {
            toast({
                title: 'Gagal mendaftar',
                description: result.error || 'Terjadi kesalahan.',
                variant: 'destructive',
            });
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center py-12 px-4 bg-background">
            <Card className="w-full max-w-lg border-2 shadow-lg">
                <CardHeader className="text-center">
                    <div className="w-12 h-12 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
                        <Building2 className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="text-2xl font-bold">Daftar sebagai Event Organizer</CardTitle>
                    <CardDescription>
                        Upgrade akun Anda untuk mulai membuat dan menjual tiket event konser.
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Nama EO / Penyelenggara</Label>
                            <div className="relative">
                                <Building2 className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                                <Input
                                    id="name"
                                    placeholder="Contoh: Live Nation Indonesia"
                                    className="pl-10"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="contact">Kontak (HP / WhatsApp)</Label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                                <Input
                                    id="contact"
                                    placeholder="+62 8..."
                                    className="pl-10"
                                    value={formData.contact}
                                    onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Deskripsi EO</Label>
                            <div className="relative">
                                <Textarea
                                    id="description"
                                    placeholder="Deskripsikan tentang organizer Anda..."
                                    className="min-h-[100px]"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? 'Mendaftarkan...' : 'Daftar Sekarang'}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
