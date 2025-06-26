import {useState} from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {Button} from "@/components/ui/button";
import {Badge} from "@/components/ui/badge";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Edit, Trash2, AlertTriangle, QrCode, Grid, List} from "lucide-react";
import {Accessory, useDeleteAccessory} from "@/hooks/useAccessories";
import {DeleteConfirmationDialog} from "@/components/DeleteConfirmationDialog";
import {EditAccessoryModal} from "@/components/EditAccessoryModal";
import {QRCodeGenerator} from "@/components/QRCodeGenerator";
import {format} from "date-fns";
import {ptBR} from "date-fns/locale";

interface AccessoriesListProps {
  accessories: Accessory[];
}

export function AccessoriesList({accessories}: AccessoriesListProps) {
  const [editingAccessory, setEditingAccessory] = useState<Accessory | null>(null);
  const [deletingAccessory, setDeletingAccessory] = useState<Accessory | null>(null);
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");
  const deleteAccessory = useDeleteAccessory();

  const handleDelete = async () => {
    if (deletingAccessory) {
      await deleteAccessory.mutateAsync(deletingAccessory.id);
      setDeletingAccessory(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      disponivel: {label: "Disponível", variant: "default" as const},
      reservado: {label: "Reservado", variant: "secondary" as const},
      manutencao: {label: "Em Manutenção", variant: "destructive" as const},
      indisponivel: {label: "Indisponível", variant: "outline" as const}
    };

    const statusInfo = statusMap[status as keyof typeof statusMap] || {
      label: status,
      variant: "outline" as const
    };
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

  const renderTableView = () => (
    <div className="rounded-md border w-full overflow-x-auto">
      <Table className="min-w-full">
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
                  <div className="text-muted-foreground">
                    Min: {accessory.minimum_stock}
                  </div>
                </div>
              </TableCell>
              <TableCell>{getStatusBadge(accessory.status)}</TableCell>
              <TableCell>{accessory.stock_location || "-"}</TableCell>
              <TableCell>
                {format(new Date(accessory.entry_date), "dd/MM/yyyy", {locale: ptBR})}
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
  );

  const renderCardsView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {accessories.map((accessory) => (
        <Card key={accessory.id} className="flex flex-col">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between text-lg">
              <span className="flex items-center gap-2">
                {accessory.name}
                {isLowStock(accessory) && (
                  <AlertTriangle className="h-4 w-4 text-orange-500" />
                )}
              </span>
              {getStatusBadge(accessory.status)}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-medium text-gray-600">Código:</p>
                <p>{accessory.reference_code}</p>
              </div>
              <div>
                <p className="font-medium text-gray-600">Categoria:</p>
                <p>{accessory.category}</p>
              </div>
              <div>
                <p className="font-medium text-gray-600">Marca:</p>
                <p>{accessory.brand || "-"}</p>
              </div>
              <div>
                <p className="font-medium text-gray-600">Estoque:</p>
                <p>
                  {accessory.current_stock} / Min: {accessory.minimum_stock}
                </p>
              </div>
            </div>

            {accessory.image_url && (
              <div className="flex justify-center">
                <img
                  src={accessory.image_url}
                  alt={accessory.name}
                  className="w-24 h-24 object-cover rounded-lg border"
                />
              </div>
            )}

            <div className="flex justify-center">
              <QRCodeGenerator
                accessoryId={accessory.id}
                accessoryName={accessory.name}
                size={120}
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditingAccessory(accessory)}
                className="flex-1"
              >
                <Edit className="h-4 w-4 mr-1" />
                Editar
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDeletingAccessory(accessory)}
                className="flex-1"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Excluir
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <>
      <div className="flex justify-end mb-4">
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === "table" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("table")}
          >
            <List className="h-4 w-4 mr-1" />
            Tabela
          </Button>
          <Button
            variant={viewMode === "cards" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("cards")}
          >
            <Grid className="h-4 w-4 mr-1" />
            Cards
          </Button>
        </div>
      </div>

      {viewMode === "table" ? renderTableView() : renderCardsView()}

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
