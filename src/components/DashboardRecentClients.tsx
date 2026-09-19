import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { Client } from "@/hooks/useClients";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface DashboardRecentClientsProps {
  clients: Client[];
}

function formatOrderDate(client: Client) {
  const rawDate = client.entry_date || client.created_at;
  return format(new Date(rawDate), "dd/MM/yyyy", { locale: ptBR });
}

function formatPrice(price?: number) {
  if (price == null) return "-";
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(price);
}

function EmptyClients() {
  return (
    <p className="px-4 py-8 text-center text-sm text-muted-foreground">
      Nenhum cliente cadastrado ainda
    </p>
  );
}

export function DashboardRecentClients({ clients }: DashboardRecentClientsProps) {
  const navigate = useNavigate();
  const recentClients = clients.slice(0, 5);

  return (
    <section className="min-w-0">
      <h2 className="mb-3 text-lg font-semibold tracking-tight sm:mb-4 sm:text-xl">
        Clientes Recentes
      </h2>

      <div className="glass-panel md:hidden">
        {recentClients.length === 0 && <EmptyClients />}
        <ul className="divide-y divide-white/10">
          {recentClients.map((client) => (
            <li key={client.id}>
              <button
                type="button"
                className="flex w-full min-w-0 flex-col gap-1 px-4 py-3 text-left"
                onClick={() => navigate(`/clients?highlight=${client.id}`)}
              >
                <span className="break-words font-medium leading-snug">{client.name}</span>
                <span className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-sm text-muted-foreground">
                  <span className="tabular-nums">
                    #{client.entry_number} · {formatOrderDate(client)}
                  </span>
                  <span className="font-medium tabular-nums text-foreground">
                    {formatPrice(client.price)}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="glass-panel hidden overflow-x-auto md:block">
        <Table>
          <TableHeader>
            <TableRow className="border-white/10 hover:bg-transparent">
              <TableHead>Nome do Cliente</TableHead>
              <TableHead>ID</TableHead>
              <TableHead>Data do Pedido</TableHead>
              <TableHead className="text-right">Valor Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentClients.length === 0 && (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={4} className="py-8 text-center text-muted-foreground">
                  Nenhum cliente cadastrado ainda
                </TableCell>
              </TableRow>
            )}
            {recentClients.map((client) => (
              <TableRow
                key={client.id}
                className="cursor-pointer border-white/10"
                onClick={() => navigate(`/clients?highlight=${client.id}`)}
              >
                <TableCell className="max-w-xs font-medium break-words">{client.name}</TableCell>
                <TableCell className="tabular-nums text-muted-foreground">
                  #{client.entry_number}
                </TableCell>
                <TableCell className="whitespace-nowrap tabular-nums text-muted-foreground">
                  {formatOrderDate(client)}
                </TableCell>
                <TableCell className="text-right font-medium whitespace-nowrap tabular-nums">
                  {formatPrice(client.price)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}
