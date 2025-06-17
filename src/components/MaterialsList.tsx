
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Box, AlertTriangle, Edit, Trash2 } from "lucide-react";
import { Material } from "@/hooks/useMaterials";
import { useState } from "react";

interface MaterialsListProps {
  materials: Material[];
}

export function MaterialsList({ materials }: MaterialsListProps) {
  const handleEditClick = (material: Material) => {
    // TODO: Implementar modal de edição
    console.log('Editar material:', material);
  };

  const handleDeleteClick = (material: Material) => {
    // TODO: Implementar confirmação e exclusão
    console.log('Deletar material:', material);
  };

  if (materials.length === 0) {
    return (
      <div className="p-8 border-2 border-dashed border-border rounded-lg text-center">
        <Box className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h2 className="text-xl font-semibold">Nenhum material cadastrado</h2>
        <p className="text-muted-foreground mt-2">
          Adicione as matérias-primas utilizadas na sua produção.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {materials.map((material) => {
        const isLowStock = material.current_stock <= material.minimum_stock;
        const isCritical = material.current_stock <= material.minimum_stock * 0.1;
        
        return (
          <Card key={material.id} className={isCritical ? "border-red-200" : isLowStock ? "border-orange-200" : ""}>
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
                  <span className={`font-medium ${isLowStock ? (isCritical ? "text-red-600" : "text-orange-600") : "text-green-600"}`}>
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
  );
}
