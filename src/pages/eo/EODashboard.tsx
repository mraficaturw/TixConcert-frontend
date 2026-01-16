
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Calendar, MapPin, Ticket, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useEOStore } from '@/stores/eoStore';
import { toast } from '@/hooks/use-toast';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export default function EODashboard() {
    const { myEvents, fetchMyEvents, deleteEvent, isLoading } = useEOStore();
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [eventToDelete, setEventToDelete] = useState<{ id: number; title: string } | null>(null);

    useEffect(() => {
        fetchMyEvents();
    }, [fetchMyEvents]);

    const handleDeleteClick = (eventId: number, eventTitle: string) => {
        setEventToDelete({ id: eventId, title: eventTitle });
        setDeleteDialogOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!eventToDelete) return;

        const result = await deleteEvent(eventToDelete.id);
        if (result.success) {
            toast({
                title: 'Event Deleted',
                description: `${eventToDelete.title} has been deleted successfully.`,
            });
        } else {
            toast({
                title: 'Delete Failed',
                description: result.error || 'Failed to delete event',
                variant: 'destructive',
            });
        }
        setDeleteDialogOpen(false);
        setEventToDelete(null);
    };

    return (
        <div className="container mx-auto py-8 space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">EO Dashboard</h1>
                    <p className="text-muted-foreground">Kelola event dan tiket Anda di sini</p>
                </div>
                <Button asChild size="lg">
                    <Link to="/eo/create-event">
                        <Plus className="w-5 h-5 mr-2" />
                        Buat Event Baru
                    </Link>
                </Button>
            </div>

            {isLoading ? (
                <div className="text-center py-12">Loading events...</div>
            ) : myEvents.length === 0 ? (
                <div className="text-center py-24 border-2 border-dashed rounded-lg bg-muted/20">
                    <Ticket className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">Belum ada event</h3>
                    <p className="text-muted-foreground mb-6">Mulai perjalanan Anda dengan membuat event konser pertama Anda</p>
                    <Button asChild>
                        <Link to="/eo/create-event">Buat Event Sekarang</Link>
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {myEvents.map((event: any) => (
                        <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-all">
                            <div className="aspect-video relative bg-muted">
                                <img
                                    src={event.image || 'https://via.placeholder.com/400x200'}
                                    alt={event.title}
                                    className="object-cover w-full h-full"
                                />
                                <div className="absolute top-2 right-2 px-2 py-1 bg-black/70 text-white text-xs rounded">
                                    {event.category}
                                </div>
                            </div>
                            <CardHeader>
                                <CardTitle className="line-clamp-1 text-lg">{event.title}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2 text-sm text-muted-foreground">
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    <span>{event.date} • {event.time}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4" />
                                    <span className="line-clamp-1">{event.location}</span>
                                </div>
                            </CardContent>
                            <CardFooter className="border-t pt-4 flex gap-2">
                                <Button variant="outline" className="flex-1" asChild>
                                    <Link to={`/events/${event.id}`}>Lihat</Link>
                                </Button>
                                <Button variant="outline" size="icon" asChild>
                                    <Link to={`/eo/edit-event/${event.id}`}>
                                        <Pencil className="w-4 h-4" />
                                    </Link>
                                </Button>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                    onClick={() => handleDeleteClick(event.id, event.title)}
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Hapus Event?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Apakah Anda yakin ingin menghapus <strong>"{eventToDelete?.title}"</strong>?
                            Tindakan ini tidak dapat dibatalkan dan semua tiket yang terkait juga akan dihapus.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleConfirmDelete}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            Hapus
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}

