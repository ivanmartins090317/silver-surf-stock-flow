
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useClients } from "@/hooks/useClients";
import { ClientsList } from "@/components/ClientsList";
import { CreateClientModal } from "@/components/CreateClientModal";

const ClientsPage = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { data: clients = [], isLoading, error } = useClients();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Carregando clientes...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-destructive">Erro ao carregar clientes</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gestão de Clientes</h1>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Cadastrar Cliente
        </Button>
      </div>

      <ClientsList clients={clients} />

      <CreateClientModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
      />
    </div>
  );
};

export default ClientsPage;
