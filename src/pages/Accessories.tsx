
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useAccessories } from "@/hooks/useAccessories";
import { AccessoriesList } from "@/components/AccessoriesList";
import { CreateAccessoryModal } from "@/components/CreateAccessoryModal";
import { useState } from "react";

const AccessoriesPage = () => {
  const { data: accessories = [], isLoading } = useAccessories();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Carregando acessórios...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Acessórios</h1>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Novo Acessório
        </Button>
      </div>
      <AccessoriesList accessories={accessories} />
      
      <CreateAccessoryModal 
        open={isCreateModalOpen} 
        onOpenChange={setIsCreateModalOpen} 
      />
    </div>
  );
};

export default AccessoriesPage;
