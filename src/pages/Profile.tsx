import { useState } from 'react';
import { User, Mail, Phone, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthStore } from '@/stores/authStore';
import { toast } from '@/hooks/use-toast';
import ImageUpload from '@/components/ImageUpload';

export default function Profile() {
  const { user, updateProfile } = useAuthStore();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    avatar: user?.avatar || '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    updateProfile(formData);

    toast({
      title: 'Profile updated!',
      description: 'Your profile has been successfully updated.',
    });

    setLoading(false);
  };

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold mb-2">
            <span className="bg-concert-gradient bg-clip-text text-transparent">Profile</span>{' '}
            Settings
          </h1>
          <p className="text-muted-foreground">Kelola informasi akun Anda</p>
        </div>

        <Card className="border-2 border-border shadow-card animate-fade-in" style={{ animationDelay: '100ms' }}>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Avatar */}
              {/* Avatar */}
              <div className="flex items-start gap-6">
                <div className="w-32">
                  <ImageUpload
                    currentImage={formData.avatar}
                    onUpload={(url) => setFormData({ ...formData, avatar: url })}
                    className="w-32 h-32 rounded-full overflow-hidden"
                    label=""
                  />
                </div>
                <div className="pt-2">
                  <p className="font-medium mb-1">{user?.name}</p>
                  <p className="text-sm text-muted-foreground mb-3">{user?.email}</p>
                  <p className="text-xs text-muted-foreground">
                    Click image to upload new avatar.
                  </p>
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="pl-10"
                      placeholder="+62 xxx xxxx xxxx"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="submit" className="flex-1 shadow-glow" disabled={loading}>
                  {loading ? 'Saving...' : 'Save Changes'}
                  {!loading && <Save className="ml-2 w-4 h-4" />}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    setFormData({
                      name: user?.name || '',
                      email: user?.email || '',
                      phone: user?.phone || '',
                    })
                  }
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* EO Section */}
        <Card className="mt-8 border-2 border-border shadow-card animate-fade-in" style={{ animationDelay: '200ms' }}>
          <CardHeader>
            <CardTitle>Event Organizer</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium mb-1">
                  {user?.role === 'EO' ? 'Anda adalah Event Organizer' : 'Ingin membuat event sendiri?'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {user?.role === 'EO'
                    ? 'Kelola event dan tiket Anda melalui dashboard.'
                    : 'Daftar sebagai Event Organizer untuk mulai menjual tiket konser Anda.'}
                </p>
              </div>
              <Button asChild variant={user?.role === 'EO' ? 'default' : 'outline'}>
                {user?.role === 'EO' ? (
                  <a href="/eo/dashboard">Ke Dashboard EO</a>
                ) : (
                  <a href="/eo/register">Daftar EO</a>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
