
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package, Settings, Edit, Trash2 } from "lucide-react";
import { Product } from "@/hooks/useProducts";
import { ProductionModal } from "@/components/ProductionModal";
import { useState } from "react";

interface ProductsListProps {
  products: Product[];
}

export function ProductsList({ products }: ProductsListProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isProductionModalOpen, setIsProductionModalOpen] = useState(false);

  const handleProduceClick = (product: Product) => {
    setSelectedProduct(product);
    setIsProductionModalOpen(true);
  };

  const handleEditClick = (product: Product) => {
    // TODO: Implementar modal de edição
    console.log('Editar produto:', product);
  };

  const handleDeleteClick = (product: Product) => {
    // TODO: Implementar confirmação e exclusão
    console.log('Deletar produto:', product);
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
    </>
  );
}
