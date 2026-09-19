
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useClients, Client } from "@/hooks/useClients";
import { ClientsList } from "@/components/ClientsList";
import { CreateClientModal } from "@/components/CreateClientModal";
import { EditClientModal } from "@/components/EditClientModal";
import { LISTING_LOADING_CLASS, LISTING_LOADING_COPY } from "@/lib/app-glass";

const ClientsPage = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const { data: clients = [], isLoading, error } = useClients();

  const handleEditClient = (client: Client) => {
    setSelectedClient(client);
    setIsEditModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className={LISTING_LOADING_CLASS}>
        {LISTING_LOADING_COPY.cliente}
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

      <ClientsList clients={clients} onEditClient={handleEditClient} />

      <CreateClientModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
      />

      {selectedClient && (
        <EditClientModal
          open={isEditModalOpen}
          onOpenChange={setIsEditModalOpen}
          client={selectedClient}
        />
      )}
    </div>
  );
};

export default ClientsPage;
