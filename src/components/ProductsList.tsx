
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package, Settings, Edit, Trash2 } from "lucide-react";
import { Product, useDeleteProduct } from "@/hooks/useProducts";
import { ProductionModal } from "@/components/ProductionModal";
import { EditProductModal } from "@/components/EditProductModal";
import { DeleteConfirmationDialog } from "@/components/DeleteConfirmationDialog";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface ProductsListProps {
  products: Product[];
}

export function ProductsList({ products }: ProductsListProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isProductionModalOpen, setIsProductionModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  
  const deleteProduct = useDeleteProduct();
  const { toast } = useToast();

  const handleProduceClick = (product: Product) => {
    setSelectedProduct(product);
    setIsProductionModalOpen(true);
  };

  const handleEditClick = (product: Product) => {
    setSelectedProduct(product);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (product: Product) => {
    setProductToDelete(product);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;
    
    try {
      await deleteProduct.mutateAsync(productToDelete.id);
      toast({
        title: "Produto deletado com sucesso!",
        description: `${productToDelete.name} foi removido.`,
      });
      setIsDeleteDialogOpen(false);
      setProductToDelete(null);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao deletar produto",
        description: "Ocorreu um erro ao tentar deletar o produto.",
      });
    }
  };

  console.log('Products received in ProductsList:', products);

  if (products.length === 0) {
    return (
      <div className="p-8 border-2 border-dashed border-border rounded-lg text-center">
        <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h2 className="text-xl font-semibold">Nenhum produto cadastrado</h2>
        <p className="text-muted-foreground mt-2">
          Comece cadastrando um novo produto para sua empresa.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => {
          console.log('Rendering product:', product.name, 'with stock:', product.current_stock);
          
          return (
            <Card key={product.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{product.name}</CardTitle>
                  <Badge variant={product.status === 'ativo' ? 'default' : 'secondary'}>
                    {product.status} ({product.current_stock || 0})
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2">{product.description}</p>
                {product.category && (
                  <Badge variant="outline" className="mb-2">
                    {product.category}
                  </Badge>
                )}
                {product.estimated_cost && (
                  <p className="text-sm font-medium mb-3">
                    Custo estimado: R$ {product.estimated_cost.toFixed(2)}
                  </p>
                )}
                
                <div className="flex gap-2 flex-wrap">
                  <Button 
                    size="sm" 
                    onClick={() => handleProduceClick(product)}
                    disabled={product.status !== 'ativo'}
                  >
                    <Settings className="h-4 w-4 mr-1" />
                    Produzir
                  </Button>
                  
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleEditClick(product)}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Editar
                  </Button>
                  
                  <Button 
                    size="sm" 
                    variant="destructive"
                    onClick={() => handleDeleteClick(product)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Deletar
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <ProductionModal
        open={isProductionModalOpen}
        onOpenChange={setIsProductionModalOpen}
        product={selectedProduct}
      />

      <EditProductModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        product={selectedProduct}
      />

      <DeleteConfirmationDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        title="Deletar Produto"
        description={`Tem certeza que deseja deletar o produto "${productToDelete?.name}"? Esta ação não pode ser desfeita e também removerá o estoque associado.`}
        isLoading={deleteProduct.isPending}
      />
    </>
  );
}
