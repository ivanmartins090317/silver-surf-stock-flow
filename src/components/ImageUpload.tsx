
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, X, Image } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ImageUploadProps {
  onImageUpload: (imageUrl: string) => void;
  currentImageUrl?: string;
  label?: string;
}

export function ImageUpload({ onImageUpload, currentImageUrl, label = "Imagem" }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Verificar tipo de arquivo
    if (!file.type.startsWith('image/')) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Por favor, selecione apenas arquivos de imagem.",
      });
      return;
    }

    // Verificar tamanho do arquivo (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "A imagem deve ter no máximo 5MB.",
      });
      return;
    }

    setUploading(true);

    try {
      // Criar preview local
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);

      // Upload para Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `accessories/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('accessories')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      // Obter URL pública
      const { data } = supabase.storage
        .from('accessories')
        .getPublicUrl(filePath);

      onImageUpload(data.publicUrl);
      
      toast({
        title: "Sucesso",
        description: "Imagem enviada com sucesso!",
      });

    } catch (error) {
      console.error('Erro no upload:', error);
      toast({
        variant: "destructive",
        title: "Erro no upload",
        description: "Não foi possível enviar a imagem. Tente novamente.",
      });
      setPreviewUrl(currentImageUrl || null);
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setPreviewUrl(null);
    onImageUpload("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <Input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            disabled={uploading}
            className="cursor-pointer"
          />
        </div>
        {previewUrl && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleRemoveImage}
            disabled={uploading}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      {previewUrl && (
        <div className="mt-2">
          <div className="relative w-32 h-32 border rounded-lg overflow-hidden">
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}
      
      {!previewUrl && (
        <div className="mt-2 flex items-center justify-center w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg">
          <div className="text-center">
            <Image className="mx-auto h-8 w-8 text-gray-400" />
            <p className="mt-2 text-xs text-gray-500">Sem imagem</p>
          </div>
        </div>
      )}
      
      {uploading && (
        <p className="text-sm text-blue-600">Enviando imagem...</p>
      )}
    </div>
  );
}
