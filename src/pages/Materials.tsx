
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useMaterials } from "@/hooks/useMaterials";
import { MaterialsList } from "@/components/MaterialsList";
import { CreateMaterialModal } from "@/components/CreateMaterialModal";
import { useState } from "react";
import { LISTING_LOADING_CLASS, LISTING_LOADING_COPY } from "@/lib/app-glass";

const MaterialsPage = () => {
  const { data: materials = [], isLoading } = useMaterials();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  if (isLoading) {
    return (
      <div className={LISTING_LOADING_CLASS}>
        {LISTING_LOADING_COPY.material}
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Materiais</h1>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Novo Material
        </Button>
      </div>
      <MaterialsList materials={materials} />
      
      <CreateMaterialModal 
        open={isCreateModalOpen} 
        onOpenChange={setIsCreateModalOpen} 
      />
    </div>
  );
};

export default MaterialsPage;
