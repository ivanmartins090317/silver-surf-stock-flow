import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Calendar, Phone, Mail, MapPin, Edit, Trash2, Eye } from "lucide-react";
import { Client, useDeleteClient } from "@/hooks/useClients";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ClientDetailsModal } from "@/components/ClientDetailsModal";

interface ClientsListProps {
  clients: Client[];
  onEditClient?: (client: Client) => void;
}

export function ClientsList({ clients, onEditClient }: ClientsListProps) {
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const deleteClient = useDeleteClient();
  const { toast } = useToast();

  console.log('Clients received in ClientsList:', clients);

  const handleDeleteClient = async (id: string, name: string) => {
    try {
      await deleteClient.mutateAsync(id);
      toast({
        title: "Cliente excluído",
        description: `${name} foi removido do sistema.`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao excluir cliente",
        description: "Tente novamente em alguns instantes.",
      });
    }
  };

  const handleViewDetails = (client: Client) => {
    setSelectedClient(client);
    setIsDetailsModalOpen(true);
  };

  if (clients.length === 0) {
    return (
      <div className="p-8 border-2 border-dashed border-border rounded-lg text-center">
        <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h2 className="text-xl font-semibold">Nenhum cliente cadastrado</h2>
        <p className="text-muted-foreground mt-2">
          Comece cadastrando um novo cliente para sua empresa.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {clients.map((client) => {
          console.log('Rendering client:', client.name, 'entry number:', client.entry_number);
          
          return (
            <Card 
              key={client.id} 
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => handleViewDetails(client)}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{client.name}</CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">#{client.entry_number}</Badge>
                    <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewDetails(client)}
                        title="Ver detalhes"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEditClient?.(client)}
                        title="Editar cliente"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm" title="Excluir cliente">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Excluir Cliente</AlertDialogTitle>
                            <AlertDialogDescription>
                              Tem certeza que deseja excluir {client.name}? Esta ação não pode ser desfeita.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteClient(client.id, client.name)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Excluir
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  {format(new Date(client.entry_date), "dd/MM/yyyy", { locale: ptBR })}
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4" />
                  {client.phone}
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4" />
                  {client.email}
                </div>
                
                <div className="flex items-start gap-2 text-sm">
                  <MapPin className="h-4 w-4 mt-0.5" />
                  <div>
                    {client.address}, {client.house_number}
                    {client.apartment && `, ${client.apartment}`}
                    <br />
                    {client.city} - {client.state}
                  </div>
                </div>

                {client.order_specification && (
                  <div className="pt-2 border-t">
                    <p className="text-sm text-muted-foreground">Pedido:</p>
                    <p className="text-sm">{client.order_specification.substring(0, 100)}...</p>
                  </div>
                )}

                {client.price && (
                  <div className="flex items-center justify-between pt-2 border-t">
                    <span className="text-sm font-medium">
                      R$ {client.price.toFixed(2)}
                    </span>
                    {client.payment_method && (
                      <Badge variant={client.payment_method === 'avista' ? 'default' : 'secondary'}>
                        {client.payment_method === 'avista' ? 'À Vista' : 'Parcelado'}
                      </Badge>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <ClientDetailsModal
        open={isDetailsModalOpen}
        onOpenChange={setIsDetailsModalOpen}
        client={selectedClient}
        onEditClient={onEditClient}
      />
    </>
  );
}
