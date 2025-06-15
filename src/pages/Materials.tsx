
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useMaterials } from "@/hooks/useMaterials";
import { MaterialsList } from "@/components/MaterialsList";

const MaterialsPage = () => {
  const { data: materials = [], isLoading } = useMaterials();

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
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Novo Material
        </Button>
      </div>
      <MaterialsList materials={materials} />
    </div>
  );
};

export default MaterialsPage;
