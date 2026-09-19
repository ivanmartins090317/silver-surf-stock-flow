import { Package, Box, AlertTriangle, Users, Shirt } from "lucide-react";
import { useMaterials } from "@/hooks/useMaterials";
import { useProducts } from "@/hooks/useProducts";
import { useAlerts } from "@/hooks/useAlerts";
import { useClients, useRecentClients } from "@/hooks/useClients";
import { useAccessories } from "@/hooks/useAccessories";
import { useNavigate } from "react-router-dom";
import { DashboardStatCard } from "@/components/DashboardStatCard";
import { DashboardRecentClients } from "@/components/DashboardRecentClients";
import { DashboardStockAlerts } from "@/components/DashboardStockAlerts";

const Dashboard = () => {
  const { data: materials = [] } = useMaterials();
  const { data: products = [] } = useProducts();
  const { data: accessories = [] } = useAccessories();
  const { data: alerts = [] } = useAlerts();
  const { data: clients = [] } = useClients();
  const { data: recentClients = [] } = useRecentClients();
  const navigate = useNavigate();

  const lowStockMaterials = materials.filter(
    (material) => material.current_stock <= material.minimum_stock,
  );
  const lowStockAccessories = accessories.filter(
    (accessory) => accessory.current_stock <= accessory.minimum_stock,
  );
  const alertCount = alerts.length + lowStockMaterials.length + lowStockAccessories.length;

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold tracking-tight sm:text-3xl">Dashboard</h1>

      <div className="grid min-w-0 grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2 xl:grid-cols-5">
        <DashboardStatCard
          title="Total de Produtos"
          value={products.length}
          description="Produtos finais cadastrados"
          icon={Package}
          onClick={() => navigate("/products")}
        />
        <DashboardStatCard
          title="Total de Materiais"
          value={materials.length}
          description="Matérias-primas em estoque"
          icon={Box}
          onClick={() => navigate("/materials")}
        />
        <DashboardStatCard
          title="Total de Acessórios"
          value={accessories.length}
          description="Acessórios cadastrados"
          icon={Shirt}
          onClick={() => navigate("/accessories")}
        />
        <DashboardStatCard
          title="Total de Clientes"
          value={clients.length}
          description="Clientes cadastrados"
          icon={Users}
          onClick={() => navigate("/clients")}
        />
        <DashboardStatCard
          title="Alertas de Estoque"
          value={alertCount}
          description="Itens com estoque baixo"
          icon={AlertTriangle}
          iconClassName="text-destructive"
          onClick={() => navigate("/materials")}
        />
      </div>

      <div className="mt-6 grid min-w-0 gap-6 sm:mt-8 sm:gap-8 lg:grid-cols-2">
        <DashboardRecentClients clients={recentClients} />
        <DashboardStockAlerts
          alerts={alerts}
          materials={materials}
          accessories={accessories}
        />
      </div>
    </div>
  );
};

export default Dashboard;
