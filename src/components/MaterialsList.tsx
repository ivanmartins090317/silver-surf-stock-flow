
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Box, AlertTriangle, Edit, Trash2 } from "lucide-react";
import { Material, useDeleteMaterial } from "@/hooks/useMaterials";
import { EditMaterialModal } from "@/components/EditMaterialModal";
import { DeleteConfirmationDialog } from "@/components/DeleteConfirmationDialog";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { LISTING_EMPTY_CLASS, LISTING_EMPTY_COPY } from "@/lib/app-glass";

interface MaterialsListProps {
  materials: Material[];
}

export function MaterialsList({ materials }: MaterialsListProps) {
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [materialToDelete, setMaterialToDelete] = useState<Material | null>(null);
  
  const deleteMaterial = useDeleteMaterial();
  const { toast } = useToast();

  const handleEditClick = (material: Material) => {
    setSelectedMaterial(material);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (material: Material) => {
    setMaterialToDelete(material);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!materialToDelete) return;
    
    try {
      await deleteMaterial.mutateAsync(materialToDelete.id);
      toast({
        title: "Material deletado com sucesso!",
        description: `${materialToDelete.name} foi removido.`,
      });
      setIsDeleteDialogOpen(false);
      setMaterialToDelete(null);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao deletar material",
        description: "Ocorreu um erro ao tentar deletar o material.",
      });
    }
  };

  if (materials.length === 0) {
    return (
      <div className={LISTING_EMPTY_CLASS}>
        <Box className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h2 className="text-xl font-semibold">{LISTING_EMPTY_COPY.material}</h2>
        <p className="text-muted-foreground mt-2">
          Adicione as matérias-primas utilizadas na sua produção.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {materials.map((material) => {
          const isLowStock = material.current_stock <= material.minimum_stock;
          const isCritical = material.current_stock <= material.minimum_stock * 0.1;
          
          return (
            <Card key={material.id} className={isCritical ? "border-red-400/50" : isLowStock ? "border-amber-400/50" : ""}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{material.name}</CardTitle>
                  {(isLowStock || isCritical) && (
                    <AlertTriangle className={`h-5 w-5 ${isCritical ? "text-red-500" : "text-orange-500"}`} />
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">{material.description}</p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span>Estoque atual:</span>
                    <span className={`font-medium ${isLowStock ? (isCritical ? "text-red-400" : "text-amber-400") : "text-emerald-400"}`}>
                      {material.current_stock} {material.unit}
                    </span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span>Estoque mínimo:</span>
                    <span>{material.minimum_stock} {material.unit}</span>
                  </div>
                  
                  {material.unit_price && (
                    <div className="flex justify-between text-sm">
                      <span>Preço unitário:</span>
                      <span>R$ {material.unit_price.toFixed(2)}</span>
                    </div>
                  )}
                  
                  {material.supplier && (
                    <div className="mt-2">
                      <Badge variant="outline">{material.supplier}</Badge>
                    </div>
                  )}
                </div>
                
                <div className="flex gap-2 flex-wrap">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleEditClick(material)}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Editar
                  </Button>
                  
                  <Button 
                    size="sm" 
                    variant="destructive"
                    onClick={() => handleDeleteClick(material)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Deletar
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <EditMaterialModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        material={selectedMaterial}
      />

      <DeleteConfirmationDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        title="Deletar Material"
        description={`Tem certeza que deseja deletar o material "${materialToDelete?.name}"? Esta ação não pode ser desfeita.`}
        isLoading={deleteMaterial.isPending}
      />
    </>
  );
}
