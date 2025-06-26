
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Accessory, useUpdateAccessory } from "@/hooks/useAccessories";

interface EditAccessoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  accessory: Accessory | null;
}

export function EditAccessoryModal({ open, onOpenChange, accessory }: EditAccessoryModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    reference_code: "",
    category: "",
    brand: "",
    model: "",
    description: "",
    initial_quantity: 0,
    current_stock: 0,
    minimum_stock: 0,
    cost_price: "",
    sale_price: "",
    stock_location: "",
    entry_date: "",
    supplier: "",
    supplier_code: "",
    expiry_date: "",
    serial_number: "",
    warranty_info: "",
    image_url: "",
    status: "disponivel",
  });

  const updateAccessory = useUpdateAccessory();

  useEffect(() => {
    if (accessory) {
      setFormData({
        name: accessory.name,
        reference_code: accessory.reference_code,
        category: accessory.category,
        brand: accessory.brand || "",
        model: accessory.model || "",
        description: accessory.description || "",
        initial_quantity: accessory.initial_quantity,
        current_stock: accessory.current_stock,
        minimum_stock: accessory.minimum_stock,
        cost_price: accessory.cost_price?.toString() || "",
        sale_price: accessory.sale_price?.toString() || "",
        stock_location: accessory.stock_location || "",
        entry_date: accessory.entry_date,
        supplier: accessory.supplier || "",
        supplier_code: accessory.supplier_code || "",
        expiry_date: accessory.expiry_date || "",
        serial_number: accessory.serial_number || "",
        warranty_info: accessory.warranty_info || "",
        image_url: accessory.image_url || "",
        status: accessory.status,
      });
    }
  }, [accessory]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!accessory) return;
    
    try {
      await updateAccessory.mutateAsync({
        id: accessory.id,
        ...formData,
        cost_price: formData.cost_price ? parseFloat(formData.cost_price) : undefined,
        sale_price: formData.sale_price ? parseFloat(formData.sale_price) : undefined,
        expiry_date: formData.expiry_date || undefined,
      });
      
      onOpenChange(false);
    } catch (error) {
      console.error("Erro ao atualizar acessório:", error);
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!accessory) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Acessório</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome do Acessório *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="reference_code">Código de Referência *</Label>
              <Input
                id="reference_code"
                value={formData.reference_code}
                onChange={(e) => handleInputChange("reference_code", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Categoria *</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => handleInputChange("category", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="brand">Marca</Label>
              <Input
                id="brand"
                value={formData.brand}
                onChange={(e) => handleInputChange("brand", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="model">Modelo</Label>
              <Input
                id="model"
                value={formData.model}
                onChange={(e) => handleInputChange("model", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="disponivel">Disponível</SelectItem>
                  <SelectItem value="reservado">Reservado</SelectItem>
                  <SelectItem value="manutencao">Em Manutenção</SelectItem>
                  <SelectItem value="indisponivel">Indisponível</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="current_stock">Estoque Atual *</Label>
              <Input
                id="current_stock"
                type="number"
                min="0"
                value={formData.current_stock}
                onChange={(e) => handleInputChange("current_stock", parseInt(e.target.value) || 0)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="minimum_stock">Estoque Mínimo *</Label>
              <Input
                id="minimum_stock"
                type="number"
                min="0"
                value={formData.minimum_stock}
                onChange={(e) => handleInputChange("minimum_stock", parseInt(e.target.value) || 0)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cost_price">Preço de Custo (R$)</Label>
              <Input
                id="cost_price"
                type="number"
                step="0.01"
                min="0"
                value={formData.cost_price}
                onChange={(e) => handleInputChange("cost_price", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sale_price">Preço de Venda (R$)</Label>
              <Input
                id="sale_price"
                type="number"
                step="0.01"
                min="0"
                value={formData.sale_price}
                onChange={(e) => handleInputChange("sale_price", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="stock_location">Localização no Estoque</Label>
              <Input
                id="stock_location"
                value={formData.stock_location}
                onChange={(e) => handleInputChange("stock_location", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="supplier">Fornecedor</Label>
              <Input
                id="supplier"
                value={formData.supplier}
                onChange={(e) => handleInputChange("supplier", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="supplier_code">Código do Fornecedor</Label>
              <Input
                id="supplier_code"
                value={formData.supplier_code}
                onChange={(e) => handleInputChange("supplier_code", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="serial_number">Número de Série</Label>
              <Input
                id="serial_number"
                value={formData.serial_number}
                onChange={(e) => handleInputChange("serial_number", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="warranty_info">Informações de Garantia</Label>
              <Input
                id="warranty_info"
                value={formData.warranty_info}
                onChange={(e) => handleInputChange("warranty_info", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image_url">URL da Imagem</Label>
              <Input
                id="image_url"
                value={formData.image_url}
                onChange={(e) => handleInputChange("image_url", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={updateAccessory.isPending}>
              {updateAccessory.isPending ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
