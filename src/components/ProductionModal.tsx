
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/hooks/useProducts";

interface ProductionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
}

export function ProductionModal({ open, onOpenChange, product }: ProductionModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!product) return;

    setIsProcessing(true);
    
    try {
      // Chamar a função de processamento de produção
      const { data, error } = await supabase.rpc('process_production', {
        p_product_id: product.id,
        p_quantity: quantity
      });

      if (error) throw error;

      const result = data as { success: boolean; error?: string; insufficient_materials?: any[]; message?: string };

      if (!result.success) {
        if (result.insufficient_materials) {
          const materialsList = result.insufficient_materials
            .map(m => `${m.material_name}: necessário ${m.required} ${m.unit}, disponível ${m.available} ${m.unit}`)
            .join('\n');
          
          toast({
            variant: "destructive",
            title: "Materiais insuficientes",
            description: `Não é possível produzir ${quantity} unidade(s):\n${materialsList}`,
          });
        } else {
          toast({
            variant: "destructive",
            title: "Erro na produção",
            description: result.error || "Erro desconhecido",
          });
        }
        return;
      }

      // Atualizar estoque do produto após produção bem-sucedida
      const { error: stockError } = await supabase
        .from('product_stock')
        .upsert({
          product_id: product.id,
          current_stock: (product.current_stock || 0) + quantity
        }, {
          onConflict: 'product_id'
        });

      if (stockError) {
        console.error('Erro ao atualizar estoque do produto:', stockError);
      }

      toast({
        title: "Produção realizada com sucesso!",
        description: `${quantity} unidade(s) de ${product.name} produzida(s). Materiais deduzidos do estoque.`,
      });
      
      // Reset form and close modal
      setQuantity(1);
      setNotes("");
      onOpenChange(false);
      
      // Recarregar a página para atualizar os dados
      window.location.reload();
    } catch (error) {
      console.error('Erro na produção:', error);
      toast({
        variant: "destructive",
        title: "Erro ao processar produção",
        description: "Ocorreu um erro ao tentar processar a produção.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (!product) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Produzir: {product.name}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="quantity">Quantidade a Produzir *</Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              step="1"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Observações</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Observações sobre a produção"
              rows={3}
            />
          </div>

          <div className="bg-yellow-50 p-3 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Atenção:</strong> Esta ação irá deduzir automaticamente os materiais necessários do estoque conforme a receita (BOM) do produto.
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={isProcessing}
            >
              {isProcessing ? "Processando..." : "Produzir"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
