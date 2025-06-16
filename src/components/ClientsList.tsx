
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Calendar, Phone, Mail, MapPin } from "lucide-react";
import { Client } from "@/hooks/useClients";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ClientsListProps {
  clients: Client[];
}

export function ClientsList({ clients }: ClientsListProps) {
  console.log('Clients received in ClientsList:', clients);

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
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {clients.map((client) => {
        console.log('Rendering client:', client.name, 'entry number:', client.entry_number);
        
        return (
          <Card key={client.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{client.name}</CardTitle>
                <Badge variant="outline">#{client.entry_number}</Badge>
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
  );
}
