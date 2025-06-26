
import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { Button } from "@/components/ui/button";
import { Download, QrCode } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface QRCodeGeneratorProps {
  accessoryId: string;
  accessoryName: string;
  size?: number;
}

export function QRCodeGenerator({ accessoryId, accessoryName, size = 150 }: QRCodeGeneratorProps) {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const { toast } = useToast();

  useEffect(() => {
    const generateQRCode = async () => {
      try {
        // URL que será codificada no QR Code - aponta para a aplicação com o ID do acessório
        const url = `${window.location.origin}/qr-scan/${accessoryId}`;
        
        const qrUrl = await QRCode.toDataURL(url, {
          width: size,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          }
        });
        
        setQrCodeUrl(qrUrl);
      } catch (error) {
        console.error('Erro ao gerar QR Code:', error);
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Não foi possível gerar o QR Code.",
        });
      }
    };

    generateQRCode();
  }, [accessoryId, size, toast]);

  const handleDownload = () => {
    if (!qrCodeUrl) return;

    const link = document.createElement('a');
    link.download = `qr-code-${accessoryName.replace(/\s+/g, '-').toLowerCase()}.png`;
    link.href = qrCodeUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Download realizado",
      description: "QR Code baixado com sucesso!",
    });
  };

  if (!qrCodeUrl) {
    return (
      <div className="flex items-center justify-center w-32 h-32 border rounded-lg">
        <QrCode className="h-8 w-8 text-gray-400" />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center space-y-2">
      <img 
        src={qrCodeUrl} 
        alt={`QR Code para ${accessoryName}`}
        className="border rounded-lg"
        style={{ width: size, height: size }}
      />
      <Button
        variant="outline"
        size="sm"
        onClick={handleDownload}
        className="w-full"
      >
        <Download className="h-4 w-4 mr-2" />
        Baixar QR Code
      </Button>
    </div>
  );
}
