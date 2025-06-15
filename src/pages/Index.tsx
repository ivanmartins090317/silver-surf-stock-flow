
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Box, AlertTriangle } from "lucide-react";
import { useMaterials } from "@/hooks/useMaterials";
import { useProducts } from "@/hooks/useProducts";
import { useAlerts } from "@/hooks/useAlerts";

const Dashboard = () => {
  const { data: materials = [] } = useMaterials();
  const { data: products = [] } = useProducts();
  const { data: alerts = [] } = useAlerts();

  const lowStockMaterials = materials.filter(
    material => material.current_stock <= material.minimum_stock
  );

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Produtos
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{products.length}</div>
            <p className="text-xs text-muted-foreground">
              Produtos finais cadastrados
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Materiais
            </CardTitle>
            <Box className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{materials.length}</div>
            <p className="text-xs text-muted-foreground">
              Matérias-primas em estoque
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alertas de Estoque</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{alerts.length + lowStockMaterials.length}</div>
            <p className="text-xs text-muted-foreground">
              Materiais com estoque baixo
            </p>
          </CardContent>
        </Card>
      </div>
      
      {(alerts.length > 0 || lowStockMaterials.length > 0) && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4">Alertas Recentes</h2>
          <div className="space-y-3">
            {alerts.slice(0, 5).map((alert) => (
              <Card key={alert.id} className="border-l-4 border-l-orange-500">
                <CardContent className="p-4">
                  <p className="text-sm text-orange-700">{alert.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(alert.created_at).toLocaleString()}
                  </p>
                </CardContent>
              </Card>
            ))}
            {lowStockMaterials.slice(0, 3).map((material) => (
              <Card key={`low-${material.id}`} className="border-l-4 border-l-red-500">
                <CardContent className="p-4">
                  <p className="text-sm text-red-700">
                    Material "{material.name}" com estoque baixo: {material.current_stock} {material.unit} 
                    (mínimo: {material.minimum_stock} {material.unit})
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
