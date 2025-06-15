
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

const ProductsPage = () => {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Produtos</h1>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Novo Produto
        </Button>
      </div>
      <div className="p-8 border-2 border-dashed border-border rounded-lg text-center">
        <h2 className="text-xl font-semibold">Nenhum produto cadastrado</h2>
        <p className="text-muted-foreground mt-2">
          Comece cadastrando um novo produto para sua empresa.
        </p>
      </div>
    </div>
  );
};

export default ProductsPage;

