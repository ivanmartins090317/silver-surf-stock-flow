
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Product, useUpdateProduct } from "@/hooks/useProducts";
import { useToast } from "@/hooks/use-toast";

interface EditProductModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
}

export function EditProductModal({ open, onOpenChange, product }: EditProductModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    status: "ativo",
    estimated_cost: 0,
  });

  const updateProduct = useUpdateProduct();
  const { toast } = useToast();

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description || "",
        category: product.category || "",
        status: product.status,
        estimated_cost: product.estimated_cost || 0,
      });
    }
  }, [product]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!product) return;
    
    try {
      await updateProduct.mutateAsync({
        id: product.id,
        ...formData
      });
      
      toast({
        title: "Produto atualizado com sucesso!",
        description: `${formData.name} foi atualizado.`,
      });
      
      onOpenChange(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao atualizar produto",
        description: "Ocorreu um erro ao tentar atualizar o produto.",
      });
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Editar Produto</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Nome do produto"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Categoria</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => handleInputChange("category", e.target.value)}
                placeholder="Categoria do produto"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Descrição do produto"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status *</Label>
              <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ativo">Ativo</SelectItem>
                  <SelectItem value="inativo">Inativo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="estimated_cost">Custo Estimado</Label>
              <Input
                id="estimated_cost"
                type="number"
                min="0"
                step="0.01"
                value={formData.estimated_cost}
                onChange={(e) => handleInputChange("estimated_cost", parseFloat(e.target.value) || 0)}
                placeholder="0.00"
              />
            </div>
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
              disabled={updateProduct.isPending}
            >
              {updateProduct.isPending ? "Atualizando..." : "Atualizar Produto"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
