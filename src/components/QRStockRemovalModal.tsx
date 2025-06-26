
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AlertTriangle, Package } from "lucide-react";
import { Accessory, useUpdateAccessory } from "@/hooks/useAccessories";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface QRStockRemovalModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  accessory: Accessory | null;
}

export function QRStockRemovalModal({ open, onOpenChange, accessory }: QRStockRemovalModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const updateAccessory = useUpdateAccessory();
  const { toast } = useToast();

  const handleRemoveFromStock = async () => {
    if (!accessory || quantity <= 0) return;

    if (quantity > accessory.current_stock) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Quantidade solicitada maior que o estoque disponível.",
      });
      return;
    }

    setIsProcessing(true);

    try {
      const newStock = accessory.current_stock - quantity;

      // Atualizar estoque do acessório
      await updateAccessory.mutateAsync({
        id: accessory.id,
        current_stock: newStock,
      });

      // Registrar movimentação de estoque
      await supabase.from('accessory_movements').insert({
        accessory_id: accessory.id,
        movement_type: 'saida',
        quantity: -quantity,
        previous_stock: accessory.current_stock,
        new_stock: newStock,
        notes: notes || `Retirada via QR Code: ${quantity} unidade(s)`,
      });

      toast({
        title: "Estoque atualizado",
        description: `${quantity} unidade(s) retirada(s) do estoque com sucesso.`,
      });

      // Resetar form e fechar modal
      setQuantity(1);
      setNotes("");
      onOpenChange(false);

    } catch (error) {
      console.error('Erro ao processar retirada:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível processar a retirada do estoque.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (!accessory) return null;

  const isLowStock = accessory.current_stock <= accessory.minimum_stock;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Retirar do Estoque
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium">{accessory.name}</h4>
            <p className="text-sm text-gray-600">Código: {accessory.reference_code}</p>
            <p className="text-sm text-gray-600">Estoque atual: {accessory.current_stock} unidades</p>
            {isLowStock && (
              <div className="flex items-center gap-2 text-orange-600 mt-2">
                <AlertTriangle className="h-4 w-4" />
                <span className="text-sm">Estoque baixo!</span>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantity">Quantidade a retirar</Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              max={accessory.current_stock}
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Observações (opcional)</Label>
            <Textarea
              id="notes"
              placeholder="Motivo da retirada, responsável, etc..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isProcessing}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleRemoveFromStock}
            disabled={isProcessing || quantity <= 0 || quantity > accessory.current_stock}
          >
            {isProcessing ? "Processando..." : "Confirmar Retirada"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
