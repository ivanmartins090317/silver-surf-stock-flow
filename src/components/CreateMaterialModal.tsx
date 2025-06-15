
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCreateMaterial } from "@/hooks/useMaterials";
import { useToast } from "@/hooks/use-toast";
import { Database } from "@/integrations/supabase/types";

type UnitType = Database['public']['Enums']['unit_type'];

interface CreateMaterialModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateMaterialModal({ open, onOpenChange }: CreateMaterialModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    unit: "unidades" as UnitType,
    current_stock: 0,
    minimum_stock: 0,
    unit_price: 0,
    supplier: "",
  });

  const createMaterial = useCreateMaterial();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await createMaterial.mutateAsync(formData);
      toast({
        title: "Material criado com sucesso!",
        description: `${formData.name} foi adicionado aos materiais.`,
      });
      
      // Reset form and close modal
      setFormData({
        name: "",
        description: "",
        unit: "unidades" as UnitType,
        current_stock: 0,
        minimum_stock: 0,
        unit_price: 0,
        supplier: "",
      });
      onOpenChange(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao criar material",
        description: "Ocorreu um erro ao tentar criar o material.",
      });
    }
  };

  const handleInputChange = (field: string, value: string | number | UnitType) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Novo Material</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Nome do material"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="unit">Unidade *</Label>
              <Select value={formData.unit} onValueChange={(value) => handleInputChange("unit", value as UnitType)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a unidade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unidades">Unidades</SelectItem>
                  <SelectItem value="quilogramas">Quilogramas</SelectItem>
                  <SelectItem value="gramas">Gramas</SelectItem>
                  <SelectItem value="litros">Litros</SelectItem>
                  <SelectItem value="metros">Metros</SelectItem>
                  <SelectItem value="centimetros">Centímetros</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Descrição do material"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="current_stock">Estoque Atual *</Label>
              <Input
                id="current_stock"
                type="number"
                min="0"
                step="0.01"
                value={formData.current_stock}
                onChange={(e) => handleInputChange("current_stock", parseFloat(e.target.value) || 0)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="minimum_stock">Estoque Mínimo *</Label>
              <Input
                id="minimum_stock"
                type="number"
                min="0"
                step="0.01"
                value={formData.minimum_stock}
                onChange={(e) => handleInputChange("minimum_stock", parseFloat(e.target.value) || 0)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="unit_price">Preço Unitário</Label>
              <Input
                id="unit_price"
                type="number"
                min="0"
                step="0.01"
                value={formData.unit_price}
                onChange={(e) => handleInputChange("unit_price", parseFloat(e.target.value) || 0)}
                placeholder="0.00"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="supplier">Fornecedor</Label>
              <Input
                id="supplier"
                value={formData.supplier}
                onChange={(e) => handleInputChange("supplier", e.target.value)}
                placeholder="Nome do fornecedor"
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
              disabled={createMaterial.isPending}
            >
              {createMaterial.isPending ? "Criando..." : "Criar Material"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
