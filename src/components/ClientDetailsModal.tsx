
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Phone, Mail, MapPin, FileText, DollarSign, Edit } from "lucide-react";
import { Client } from "@/hooks/useClients";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ClientDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  client: Client | null;
  onEditClient?: (client: Client) => void;
}

export function ClientDetailsModal({ 
  open, 
  onOpenChange, 
  client, 
  onEditClient 
}: ClientDetailsModalProps) {
  if (!client) return null;

  const handleEdit = () => {
    onEditClient?.(client);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <DialogTitle className="text-2xl">{client.name}</DialogTitle>
              <Badge variant="outline">#{client.entry_number}</Badge>
            </div>
            <Button onClick={handleEdit} variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informações Pessoais */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">Informações Pessoais</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Data de Entrada</p>
                  <p className="font-medium">
                    {format(new Date(client.entry_date), "dd/MM/yyyy", { locale: ptBR })}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">CPF</p>
                <p className="font-medium">{client.cpf}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Data de Nascimento</p>
                <p className="font-medium">
                  {format(new Date(client.birth_date), "dd/MM/yyyy", { locale: ptBR })}
                </p>
              </div>
            </div>
          </div>

          {/* Contato */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">Contato</h3>
            
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Telefone</p>
                  <p className="font-medium">{client.phone}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">E-mail</p>
                  <p className="font-medium">{client.email}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Endereço */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">Endereço</h3>
            
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
              <div>
                <p className="font-medium">
                  {client.address}, {client.house_number}
                  {client.apartment && `, ${client.apartment}`}
                </p>
                <p className="text-muted-foreground">
                  {client.city} - {client.state}
                </p>
              </div>
            </div>
          </div>

          {/* Informações do Pedido */}
          {(client.order_specification || client.price) && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">Informações do Pedido</h3>
              
              {client.order_specification && (
                <div className="flex items-start gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground mt-1" />
                  <div>
                    <p className="text-sm text-muted-foreground">Especificação do Pedido</p>
                    <p className="font-medium whitespace-pre-wrap">{client.order_specification}</p>
                  </div>
                </div>
              )}

              {client.order_image_url && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Imagem do Pedido</p>
                  <img 
                    src={client.order_image_url} 
                    alt="Imagem do pedido" 
                    className="max-w-xs rounded-lg border"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              )}

              {client.price && (
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Preço</p>
                      <p className="text-xl font-bold">R$ {client.price.toFixed(2)}</p>
                    </div>
                  </div>
                  
                  {client.payment_method && (
                    <Badge variant={client.payment_method === 'avista' ? 'default' : 'secondary'}>
                      {client.payment_method === 'avista' ? 'À Vista' : 'Parcelado'}
                    </Badge>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Observações */}
          {client.observations && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">Observações</h3>
              <p className="text-muted-foreground whitespace-pre-wrap">{client.observations}</p>
            </div>
          )}

          {/* Datas de Sistema */}
          <div className="space-y-4 pt-4 border-t">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
              <div>
                <p>Criado em:</p>
                <p>{format(new Date(client.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}</p>
              </div>
              <div>
                <p>Última atualização:</p>
                <p>{format(new Date(client.updated_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
