import type { LucideIcon } from "lucide-react";

interface DashboardStatCardProps {
  title: string;
  value: number;
  description: string;
  icon: LucideIcon;
  onClick: () => void;
  iconClassName?: string;
}

export function DashboardStatCard({
  title,
  value,
  description,
  icon: Icon,
  onClick,
  iconClassName = "text-muted-foreground",
}: DashboardStatCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="glass-kpi min-w-0 w-full p-4 text-left sm:p-5"
    >
      <div className="flex items-start justify-between gap-3">
        <p className="min-w-0 text-sm font-medium tracking-tight text-foreground/90 text-pretty">
          {title}
        </p>
        <Icon className={`h-4 w-4 shrink-0 ${iconClassName}`} />
      </div>
      <p className="mt-3 text-2xl font-semibold tabular-nums tracking-tight sm:text-3xl">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground text-pretty">{description}</p>
    </button>
  );
}
