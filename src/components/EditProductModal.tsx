
import { useState } from "react";
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
import { Product, useUpdateProduct } from "@/hooks/useProducts";
import { useToast } from "@/hooks/use-toast";

interface EditProductModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product;
}

export function EditProductModal({ open, onOpenChange, product }: EditProductModalProps) {
  const [name, setName] = useState(product.name);
  const [description, setDescription] = useState(product.description || "");
  const [category, setCategory] = useState(product.category || "");
  const [status, setStatus] = useState<"ativo" | "inativo">(product.status as "ativo" | "inativo");
  const [estimatedCost, setEstimatedCost] = useState(product.estimated_cost?.toString() || "");

  const updateProduct = useUpdateProduct();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await updateProduct.mutateAsync({
        id: product.id,
        name,
        description,
        category,
        status,
        estimated_cost: estimatedCost ? parseFloat(estimatedCost) : undefined,
      });
      
      toast({
        title: "Produto atualizado",
        description: "As informações do produto foram atualizadas com sucesso.",
      });
      
      onOpenChange(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao atualizar produto",
        description: "Tente novamente em alguns instantes.",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Produto</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="name">Nome</Label>
            <Input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="category">Categoria</Label>
            <Input
              type="text"
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </div>

          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="status">Status</Label>
            <Select value={status} onValueChange={(value: "ativo" | "inativo") => setStatus(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ativo">Ativo</SelectItem>
                <SelectItem value="inativo">Inativo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="estimated_cost">Custo Estimado (R$)</Label>
            <Input
              type="number"
              id="estimated_cost"
              step="0.01"
              value={estimatedCost}
              onChange={(e) => setEstimatedCost(e.target.value)}
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
            <Button type="submit" disabled={updateProduct.isPending}>
              {updateProduct.isPending ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
