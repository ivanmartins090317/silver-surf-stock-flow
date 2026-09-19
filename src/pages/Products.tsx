import {Button} from "@/components/ui/button";
import {PlusCircle} from "lucide-react";
import {useProducts} from "@/hooks/useProducts";
import {ProductsList} from "@/components/ProductsList";
import {CreateProductModal} from "@/components/CreateProductModal";
import {useState} from "react";
import {LISTING_LOADING_CLASS, LISTING_LOADING_COPY} from "@/lib/app-glass";

const ProductsPage = () => {
  const {data: products = [], isLoading} = useProducts();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  if (isLoading) {
    return (
      <div className={LISTING_LOADING_CLASS}>
        {LISTING_LOADING_COPY.produto}
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Produtos</h1>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Novo Produto
        </Button>
      </div>
      <ProductsList products={products} />

      <CreateProductModal open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen} />
    </div>
  );
};

export default ProductsPage;
