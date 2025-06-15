
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

const MaterialsPage = () => {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Materiais</h1>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Novo Material
        </Button>
      </div>
      <div className="p-8 border-2 border-dashed border-border rounded-lg text-center">
        <h2 className="text-xl font-semibold">Nenhum material cadastrado</h2>
        <p className="text-muted-foreground mt-2">
          Adicione as matérias-primas utilizadas na sua produção.
        </p>
      </div>
    </div>
  );
};

export default MaterialsPage;
