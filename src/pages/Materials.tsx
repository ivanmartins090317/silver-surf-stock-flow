
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useMaterials } from "@/hooks/useMaterials";
import { MaterialsList } from "@/components/MaterialsList";
import { CreateMaterialModal } from "@/components/CreateMaterialModal";
import { useState } from "react";

const MaterialsPage = () => {
  const { data: materials = [], isLoading } = useMaterials();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Carregando materiais...</div>
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
