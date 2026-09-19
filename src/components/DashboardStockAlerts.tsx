import { AlertTriangle, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import type { Alert } from "@/hooks/useAlerts";
import type { Accessory } from "@/hooks/useAccessories";
import type { Material } from "@/hooks/useMaterials";

interface DashboardStockAlertsProps {
  alerts: Alert[];
  materials: Material[];
  accessories: Accessory[];
}

interface StockAlertItem {
  id: string;
  tone: "critical" | "warning";
  title: string;
  description: string;
  href: string;
}

function buildStockAlerts(
  alerts: Alert[],
  materials: Material[],
  accessories: Accessory[],
): StockAlertItem[] {
  const lowMaterials = materials
    .filter((material) => material.current_stock <= material.minimum_stock)
    .map((material) => {
      const isCritical = material.current_stock < material.minimum_stock;
      return {
        id: `material-${material.id}`,
        tone: isCritical ? "critical" : "warning",
        title: isCritical
          ? `Alerta Crítico de Estoque: ${material.name}`
          : `Alerta de Estoque: ${material.name}`,
        description: isCritical
          ? `Crítico de estoque: ${material.name} (mínimo: ${material.minimum_stock} ${material.unit})`
          : `${material.name}: ${material.current_stock} ${material.unit} / ${material.minimum_stock} ${material.unit}`,
        href: "/materials",
      } satisfies StockAlertItem;
    });

  const lowAccessories = accessories
    .filter((accessory) => accessory.current_stock <= accessory.minimum_stock)
    .map((accessory) => {
      const isCritical = accessory.current_stock < accessory.minimum_stock;
      return {
        id: `accessory-${accessory.id}`,
        tone: isCritical ? "critical" : "warning",
        title: isCritical
          ? `Alerta Crítico de Estoque: ${accessory.name}`
          : `Alerta de Estoque: ${accessory.name}`,
        description: isCritical
          ? `Crítico de estoque: ${accessory.name} (mínimo: ${accessory.minimum_stock} unidades)`
          : `${accessory.name}: ${accessory.current_stock} unidades / ${accessory.minimum_stock} unidades`,
        href: "/accessories",
      } satisfies StockAlertItem;
    });

  const unreadAlerts = alerts.slice(0, 3).map((alert) => ({
    id: `alert-${alert.id}`,
    tone: "warning" as const,
    title: "Alerta de Estoque",
    description: alert.message,
    href: "/materials",
  }));

  return [...lowMaterials, ...lowAccessories, ...unreadAlerts]
    .sort((left, right) => Number(right.tone === "critical") - Number(left.tone === "critical"))
    .slice(0, 5);
}

export function DashboardStockAlerts({
  alerts,
  materials,
  accessories,
}: DashboardStockAlertsProps) {
  const navigate = useNavigate();
  const items = buildStockAlerts(alerts, materials, accessories);

  return (
    <section className="min-w-0">
      <h2 className="mb-3 text-lg font-semibold tracking-tight sm:mb-4 sm:text-xl">
        Alertas de Estoque
      </h2>
      <div className="space-y-3">
        {items.length === 0 && (
          <div className="glass-panel px-4 py-8 text-center text-sm text-muted-foreground sm:px-5">
            Nenhum alerta no momento
          </div>
        )}
        {items.map((item) => {
          const isCritical = item.tone === "critical";
          const Icon = isCritical ? XCircle : AlertTriangle;
          const toneClass = isCritical ? "text-red-400" : "text-[hsl(var(--warning))]";

          return (
            <article
              key={item.id}
              className="glass-panel cursor-pointer p-4"
              onClick={() => navigate(item.href)}
            >
              <div className="flex min-w-0 gap-3">
                <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${toneClass}`} />
                <div className="min-w-0 flex-1">
                  <h3 className="break-words font-medium leading-snug tracking-tight text-pretty">
                    {item.title}
                  </h3>
                  <p className={`mt-1 break-words text-sm leading-relaxed text-pretty ${toneClass}`}>
                    {item.description}
                  </p>
                  {isCritical && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="mt-3 w-full sm:w-auto"
                    >
                      Ver estoque
                    </Button>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
