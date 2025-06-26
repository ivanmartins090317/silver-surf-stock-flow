
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Box, AlertTriangle, Users, Shirt } from "lucide-react";
import { useMaterials } from "@/hooks/useMaterials";
import { useProducts } from "@/hooks/useProducts";
import { useAlerts } from "@/hooks/useAlerts";
import { useRecentClients } from "@/hooks/useClients";
import { useAccessories } from "@/hooks/useAccessories";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const Dashboard = () => {
  const { data: materials = [] } = useMaterials();
  const { data: products = [] } = useProducts();
  const { data: accessories = [] } = useAccessories();
  const { data: alerts = [] } = useAlerts();
  const { data: recentClients = [] } = useRecentClients();
  const navigate = useNavigate();

  const lowStockMaterials = materials.filter(
    material => material.current_stock <= material.minimum_stock
  );

  const lowStockAccessories = accessories.filter(
    accessory => accessory.current_stock <= accessory.minimum_stock
  );

  const handleClientClick = (clientId: string) => {
    navigate(`/clients?highlight=${clientId}`);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card 
          className="cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => navigate('/products')}
        >
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
        
        <Card 
          className="cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => navigate('/materials')}
        >
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

        <Card 
          className="cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => navigate('/accessories')}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Acessórios
            </CardTitle>
            <Shirt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{accessories.length}</div>
            <p className="text-xs text-muted-foreground">
              Acessórios cadastrados
            </p>
          </CardContent>
        </Card>
        
        <Card 
          className="cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => navigate('/clients')}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Clientes
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recentClients.length}</div>
            <p className="text-xs text-muted-foreground">
              Clientes cadastrados
            </p>
          </CardContent>
        </Card>
        
        <Card 
          className="cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => navigate('/materials')}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alertas de Estoque</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{alerts.length + lowStockMaterials.length + lowStockAccessories.length}</div>
            <p className="text-xs text-muted-foreground">
              Items com estoque baixo
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 mt-6">
        {/* Clientes Recentes */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Clientes Recentes</h2>
          <div className="space-y-3">
            {recentClients.slice(0, 5).map((client) => (
              <Card 
                key={client.id} 
                className="border-l-4 border-l-blue-500 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleClientClick(client.id)}
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{client.name}</p>
                      <p className="text-sm text-muted-foreground">#{client.entry_number}</p>
                      <p className="text-sm text-muted-foreground">{client.phone}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(client.created_at), "dd/MM/yyyy", { locale: ptBR })}
                      </p>
                      {client.price && (
                        <p className="text-sm font-medium text-green-600">
                          R$ {client.price.toFixed(2)}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {recentClients.length === 0 && (
              <Card className="border-dashed">
                <CardContent className="p-4 text-center text-muted-foreground">
                  Nenhum cliente cadastrado ainda
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Alertas */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Alertas Recentes</h2>
          <div className="space-y-3">
            {alerts.slice(0, 3).map((alert) => (
              <Card 
                key={alert.id} 
                className="border-l-4 border-l-orange-500 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => navigate('/materials')}
              >
                <CardContent className="p-4">
                  <p className="text-sm text-orange-700">{alert.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(alert.created_at).toLocaleString()}
                  </p>
                </CardContent>
              </Card>
            ))}
            {lowStockMaterials.slice(0, 2).map((material) => (
              <Card 
                key={`low-${material.id}`} 
                className="border-l-4 border-l-red-500 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => navigate('/materials')}
              >
                <CardContent className="p-4">
                  <p className="text-sm text-red-700">
                    Material "{material.name}" com estoque baixo: {material.current_stock} {material.unit} 
                    (mínimo: {material.minimum_stock} {material.unit})
                  </p>
                </CardContent>
              </Card>
            ))}
            {lowStockAccessories.slice(0, 2).map((accessory) => (
              <Card 
                key={`low-acc-${accessory.id}`} 
                className="border-l-4 border-l-red-500 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => navigate('/accessories')}
              >
                <CardContent className="p-4">
                  <p className="text-sm text-red-700">
                    Acessório "{accessory.name}" com estoque baixo: {accessory.current_stock} unidades 
                    (mínimo: {accessory.minimum_stock} unidades)
                  </p>
                </CardContent>
              </Card>
            ))}
            {alerts.length === 0 && lowStockMaterials.length === 0 && lowStockAccessories.length === 0 && (
              <Card className="border-dashed">
                <CardContent className="p-4 text-center text-muted-foreground">
                  Nenhum alerta no momento
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
