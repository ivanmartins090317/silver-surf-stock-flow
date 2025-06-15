
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package } from "lucide-react";
import { Product } from "@/hooks/useProducts";

interface ProductsListProps {
  products: Product[];
}

export function ProductsList({ products }: ProductsListProps) {
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
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <Card key={product.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">{product.name}</CardTitle>
              <Badge variant={product.status === 'ativo' ? 'default' : 'secondary'}>
                {product.status}
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
              <p className="text-sm font-medium">
                Custo estimado: R$ {product.estimated_cost.toFixed(2)}
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
