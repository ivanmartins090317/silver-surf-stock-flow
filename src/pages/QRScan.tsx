
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAccessories } from "@/hooks/useAccessories";
import { QRStockRemovalModal } from "@/components/QRStockRemovalModal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, ArrowLeft } from "lucide-react";

const QRScanPage = () => {
  const { accessoryId } = useParams<{ accessoryId: string }>();
  const navigate = useNavigate();
  const { data: accessories = [] } = useAccessories();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const accessory = accessories.find(acc => acc.id === accessoryId);

  useEffect(() => {
    if (accessory) {
      setIsModalOpen(true);
    }
  }, [accessory]);

  const handleModalClose = (open: boolean) => {
    setIsModalOpen(open);
    if (!open) {
      navigate('/accessories');
    }
  };

  if (!accessoryId) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-red-600">QR Code inválido.</p>
            <Button 
              className="mt-4 w-full" 
              onClick={() => navigate('/accessories')}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar para Acessórios
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!accessory) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Acessório não encontrado
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-gray-600 mb-4">
              O acessório com ID {accessoryId} não foi encontrado.
            </p>
            <Button 
              className="w-full" 
              onClick={() => navigate('/accessories')}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar para Acessórios
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            QR Code Escaneado
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-4">
            <div className="p-4 bg-green-50 rounded-lg">
              <h3 className="font-medium text-green-800">{accessory.name}</h3>
              <p className="text-sm text-green-600">Código: {accessory.reference_code}</p>
              <p className="text-sm text-green-600">Estoque: {accessory.current_stock} unidades</p>
            </div>
            
            <p className="text-gray-600">
              O modal de retirada do estoque será aberto automaticamente.
            </p>
            
            <Button 
              variant="outline"
              className="w-full" 
              onClick={() => navigate('/accessories')}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar para Acessórios
            </Button>
          </div>
        </CardContent>
      </Card>

      <QRStockRemovalModal
        open={isModalOpen}
        onOpenChange={handleModalClose}
        accessory={accessory}
      />
    </div>
  );
};

export default QRScanPage;
