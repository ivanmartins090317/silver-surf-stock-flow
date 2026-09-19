import { LayoutDashboard, Package, Box, Users, Shirt } from "lucide-react";

export const appNavItems = [
  {
    href: "/",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/products",
    label: "Produtos",
    icon: Package,
  },
  {
    href: "/materials",
    label: "Materiais",
    icon: Box,
  },
  {
    href: "/accessories",
    label: "Acessórios",
    icon: Shirt,
  },
  {
    href: "/clients",
    label: "Clientes",
    icon: Users,
  },
] as const;
