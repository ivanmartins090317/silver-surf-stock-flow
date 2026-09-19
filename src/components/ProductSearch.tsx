
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Package, Settings } from "lucide-react";
import { useProducts, Product } from "@/hooks/useProducts";
import { ProductionModal } from "@/components/ProductionModal";

interface ProductSearchProps {
  onProductSelect: (product: Product) => void;
}

export function ProductSearch({ onProductSelect }: ProductSearchProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isProductionModalOpen, setIsProductionModalOpen] = useState(false);
  const { data: products = [] } = useProducts();

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (product.category && product.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleProductSelect = (product: Product) => {
    onProductSelect(product);
    setSearchTerm(product.name);
    setShowResults(false);
  };

  const handleProduceClick = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedProduct(product);
    setIsProductionModalOpen(true);
  };

  return (
    <>
      <div className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar produto..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setShowResults(e.target.value.length > 0);
            }}
            onFocus={() => setShowResults(searchTerm.length > 0)}
            className="pl-10"
          />
        </div>

        {showResults && filteredProducts.length > 0 && (
          <Card className="absolute z-10 mt-1 max-h-60 w-full overflow-y-auto rounded-md">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="cursor-pointer border-b p-3 last:border-b-0 hover:bg-muted"
                onClick={() => handleProductSelect(product)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-medium">{product.name}</h4>
                    {product.description && (
                      <p className="text-sm text-muted-foreground">{product.description}</p>
                    )}
                    <div className="flex items-center gap-2 mt-1">
                      {product.category && (
                        <Badge variant="outline" className="text-xs">
                          {product.category}
                        </Badge>
                      )}
                      <Badge variant={product.status === 'ativo' ? 'default' : 'secondary'} className="text-xs">
                        Estoque: {product.current_stock || 0}
                      </Badge>
                    </div>
                    {product.estimated_cost && (
                      <p className="text-sm font-medium text-green-600 mt-1">
                        R$ {product.estimated_cost.toFixed(2)}
                      </p>
                    )}
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => handleProduceClick(product, e)}
                    disabled={product.status !== 'ativo'}
                    className="ml-2"
                  >
                    <Settings className="h-3 w-3 mr-1" />
                    Produzir
                  </Button>
                </div>
              </div>
            ))}
          </Card>
        )}

        {showResults && filteredProducts.length === 0 && searchTerm.length > 0 && (
          <Card className="absolute z-10 mt-1 w-full rounded-md">
            <div className="flex items-center gap-2 p-3 text-muted-foreground">
              <Package className="h-4 w-4" />
              <span className="text-sm">Nenhum produto encontrado</span>
            </div>
          </Card>
        )}
      </div>

      <ProductionModal
        open={isProductionModalOpen}
        onOpenChange={setIsProductionModalOpen}
        product={selectedProduct}
      />
    </>
  );
}
