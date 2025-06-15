
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCreateProduct } from "@/hooks/useProducts";
import { useMaterials } from "@/hooks/useMaterials";
import { useToast } from "@/hooks/use-toast";
import { Database } from "@/integrations/supabase/types";
import { supabase } from "@/integrations/supabase/client";
import { Trash2, Plus } from "lucide-react";

type ProductStatus = Database['public']['Enums']['product_status'];
type UnitType = Database['public']['Enums']['unit_type'];

interface ProductMaterial {
  material_id: string;
  quantity: number;
  unit: UnitType;
}

interface CreateProductModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateProductModal({ open, onOpenChange }: CreateProductModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    status: "ativo" as ProductStatus,
    estimated_cost: 0,
  });

  const [productMaterials, setProductMaterials] = useState<ProductMaterial[]>([]);
  const { data: materials = [] } = useMaterials();
  const createProduct = useCreateProduct();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const productData = await createProduct.mutateAsync(formData);
      
      // Inserir os materiais do produto
      if (productMaterials.length > 0) {
        const materialInserts = productMaterials.map(pm => ({
          product_id: productData.id,
          material_id: pm.material_id,
          quantity: pm.quantity,
          unit: pm.unit
        }));

        const { error: materialsError } = await supabase
          .from('product_materials')
          .insert(materialInserts);

        if (materialsError) throw materialsError;
      }

      toast({
        title: "Produto criado com sucesso!",
        description: `${formData.name} foi adicionado aos produtos.`,
      });
      
      // Reset form and close modal
      setFormData({
        name: "",
        description: "",
        category: "",
        status: "ativo" as ProductStatus,
        estimated_cost: 0,
      });
      setProductMaterials([]);
      onOpenChange(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao criar produto",
        description: "Ocorreu um erro ao tentar criar o produto.",
      });
    }
  };

  const addMaterial = () => {
    setProductMaterials([...productMaterials, {
      material_id: "",
      quantity: 0,
      unit: "unidades" as UnitType
    }]);
  };

  const removeMaterial = (index: number) => {
    setProductMaterials(productMaterials.filter((_, i) => i !== index));
  };

  const updateMaterial = (index: number, field: keyof ProductMaterial, value: any) => {
    const updated = [...productMaterials];
    updated[index] = { ...updated[index], [field]: value };
    setProductMaterials(updated);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Novo Produto</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Nome do produto"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Categoria</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                placeholder="Categoria do produto"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Descrição do produto"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value as ProductStatus }))}>
                <SelectTrigger>
                  <SelectValue />
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
                onChange={(e) => setFormData(prev => ({ ...prev, estimated_cost: parseFloat(e.target.value) || 0 }))}
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Materiais Necessários (Receita/BOM)</Label>
              <Button type="button" variant="outline" size="sm" onClick={addMaterial}>
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Material
              </Button>
            </div>

            {productMaterials.map((pm, index) => (
              <div key={index} className="grid grid-cols-12 gap-2 items-end p-3 border rounded-lg">
                <div className="col-span-5">
                  <Label>Material</Label>
                  <Select 
                    value={pm.material_id} 
                    onValueChange={(value) => updateMaterial(index, 'material_id', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o material" />
                    </SelectTrigger>
                    <SelectContent>
                      {materials.map(material => (
                        <SelectItem key={material.id} value={material.id}>
                          {material.name} ({material.current_stock} {material.unit})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="col-span-3">
                  <Label>Quantidade</Label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={pm.quantity}
                    onChange={(e) => updateMaterial(index, 'quantity', parseFloat(e.target.value) || 0)}
                  />
                </div>
                
                <div className="col-span-3">
                  <Label>Unidade</Label>
                  <Select 
                    value={pm.unit} 
                    onValueChange={(value) => updateMaterial(index, 'unit', value as UnitType)}
                  >
                    <SelectTrigger>
                      <SelectValue />
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
                
                <div className="col-span-1">
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => removeMaterial(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
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
              disabled={createProduct.isPending}
            >
              {createProduct.isPending ? "Criando..." : "Criar Produto"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
