
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, AlertTriangle } from "lucide-react";
import { Accessory, useDeleteAccessory } from "@/hooks/useAccessories";
import { DeleteConfirmationDialog } from "@/components/DeleteConfirmationDialog";
import { EditAccessoryModal } from "@/components/EditAccessoryModal";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface AccessoriesListProps {
  accessories: Accessory[];
}

export function AccessoriesList({ accessories }: AccessoriesListProps) {
  const [editingAccessory, setEditingAccessory] = useState<Accessory | null>(null);
  const [deletingAccessory, setDeletingAccessory] = useState<Accessory | null>(null);
  const deleteAccessory = useDeleteAccessory();

  const handleDelete = async () => {
    if (deletingAccessory) {
      await deleteAccessory.mutateAsync(deletingAccessory.id);
      setDeletingAccessory(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      disponivel: { label: "Disponível", variant: "default" as const },
      reservado: { label: "Reservado", variant: "secondary" as const },
      manutencao: { label: "Em Manutenção", variant: "destructive" as const },
      indisponivel: { label: "Indisponível", variant: "outline" as const },
    };
    
    const statusInfo = statusMap[status as keyof typeof statusMap] || { label: status, variant: "outline" as const };
    return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>;
  };

  const isLowStock = (accessory: Accessory) => {
    return accessory.current_stock <= accessory.minimum_stock;
  };

  if (accessories.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Nenhum acessório cadastrado ainda.</p>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Código</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Marca</TableHead>
              <TableHead>Estoque</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Localização</TableHead>
              <TableHead>Entrada</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {accessories.map((accessory) => (
              <TableRow key={accessory.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    {accessory.name}
                    {isLowStock(accessory) && (
                      <AlertTriangle className="h-4 w-4 text-orange-500" />
                    )}
                  </div>
                </TableCell>
                <TableCell>{accessory.reference_code}</TableCell>
                <TableCell>{accessory.category}</TableCell>
                <TableCell>{accessory.brand || "-"}</TableCell>
                <TableCell>
                  <div className="text-sm">
                    <div>Atual: {accessory.current_stock}</div>
                    <div className="text-muted-foreground">Min: {accessory.minimum_stock}</div>
                  </div>
                </TableCell>
                <TableCell>{getStatusBadge(accessory.status)}</TableCell>
                <TableCell>{accessory.stock_location || "-"}</TableCell>
                <TableCell>
                  {format(new Date(accessory.entry_date), "dd/MM/yyyy", { locale: ptBR })}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingAccessory(accessory)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setDeletingAccessory(accessory)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <EditAccessoryModal
        open={!!editingAccessory}
        onOpenChange={(open) => !open && setEditingAccessory(null)}
        accessory={editingAccessory}
      />

      <DeleteConfirmationDialog
        open={!!deletingAccessory}
        onOpenChange={(open) => !open && setDeletingAccessory(null)}
        onConfirm={handleDelete}
        title="Deletar Acessório"
        description={`Tem certeza que deseja deletar o acessório "${deletingAccessory?.name}"? Esta ação não pode ser desfeita.`}
        isLoading={deleteAccessory.isPending}
      />
    </>
  );
}
