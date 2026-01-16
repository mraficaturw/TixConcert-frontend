import { useState } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

interface ImageUploadProps {
    onUpload: (url: string) => void;
    currentImage?: string;
    label?: string;
    className?: string;
    bucketName?: string; // default: 'images'
}

export default function ImageUpload({
    onUpload,
    currentImage,
    label = 'Upload Image',
    className = '',
    bucketName = 'images',
}: ImageUploadProps) {
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState<string | null>(currentImage || null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setUploading(true);
            const file = e.target.files?.[0];
            if (!file) return;

            // Validate file size (max 2MB)
            if (file.size > 2 * 1024 * 1024) {
                throw new Error('File size must be less than 2MB');
            }

            // Create preview
            const objectUrl = URL.createObjectURL(file);
            setPreview(objectUrl);

            // Upload to Supabase
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from(bucketName)
                .upload(filePath, file);

            if (uploadError) {
                throw uploadError;
            }

            // Get Public URL
            const { data } = supabase.storage.from(bucketName).getPublicUrl(filePath);

            onUpload(data.publicUrl);
            toast({ title: 'Image uploaded successfully' });

        } catch (error: any) {
            setPreview(currentImage || null); // Revert preview on error
            toast({
                title: 'Upload failed',
                description: error.message,
                variant: 'destructive',
            });
        } finally {
            setUploading(false);
        }
    };

    const removeImage = () => {
        setPreview(null);
        onUpload('');
    }

    return (
        <div className={`space-y-4 ${className}`}>
            {label && <label className="block text-sm font-medium mb-2">{label}</label>}

            {!preview ? (
                <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-muted hover:bg-muted/50 transition-colors border-muted-foreground/25 hover:border-primary/50">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            {uploading ? (
                                <Loader2 className="w-10 h-10 mb-3 text-muted-foreground animate-spin" />
                            ) : (
                                <Upload className="w-10 h-10 mb-3 text-muted-foreground" />
                            )}
                            <p className="mb-2 text-sm text-muted-foreground">
                                <span className="font-semibold">Click to upload</span> or drag and drop
                            </p>
                            <p className="text-xs text-muted-foreground">
                                SVG, PNG, JPG or GIF (MAX. 800x1024px, 2MB)
                            </p>
                        </div>
                        <Input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={handleFileChange}
                            disabled={uploading}
                        />
                    </label>
                </div>
            ) : (
                <div className="relative w-full rounded-lg overflow-hidden border border-border group z-0">
                    {uploading && (
                        <div className="absolute inset-0 bg-background/50 flex items-center justify-center z-10">
                            <Loader2 className="w-10 h-10 text-primary animate-spin" />
                        </div>
                    )}
                    <img
                        src={preview}
                        alt="Preview"
                        className="w-full h-auto max-h-[600px] object-contain bg-black/5"
                    />
                    <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={removeImage}
                        disabled={uploading}
                    >
                        <X className="w-4 h-4" />
                    </Button>
                </div>
            )}
        </div>
    );
}
