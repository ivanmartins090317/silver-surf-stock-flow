import { Link, useLocation } from "react-router-dom";
import { LogOut } from "lucide-react";
import { appNavItems } from "@/components/app-nav-items";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface MobileTabBarProps {
  initials: string;
  onSignOut: () => void;
}

export function MobileTabBar({ initials, onSignOut }: MobileTabBarProps) {
  const location = useLocation();

  return (
    <nav
      aria-label="Navegação principal"
      className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center gap-2 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:hidden"
    >
      <ul className="pointer-events-auto flex items-center gap-0.5 rounded-full bg-[hsl(220_14%_8%)] px-1.5 py-1.5 shadow-[0_10px_28px_hsl(220_17%_4%/0.4)] ring-1 ring-white/10">
        {appNavItems.map((item) => {
          const isActive = location.pathname === item.href;

          return (
            <li key={item.href}>
              <Link
                to={item.href}
                aria-label={item.label}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "flex h-11 w-11 items-center justify-center rounded-full text-muted-foreground",
                  "transition-transform duration-100 ease-out motion-reduce:transition-none",
                  "active:scale-[0.96] motion-reduce:active:scale-100",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  isActive && "bg-primary text-primary-foreground",
                )}
              >
                <item.icon className="h-5 w-5" strokeWidth={1.75} />
              </Link>
            </li>
          );
        })}
      </ul>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            aria-label="Conta"
            className="pointer-events-auto flex h-12 w-12 items-center justify-center rounded-full bg-[hsl(220_14%_8%)] shadow-[0_10px_28px_hsl(220_17%_4%/0.4)] ring-1 ring-white/10 transition-transform duration-100 ease-out active:scale-[0.96] motion-reduce:transition-none motion-reduce:active:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Avatar className="h-9 w-9">
              <AvatarFallback className="bg-transparent text-xs font-medium">
                {initials}
              </AvatarFallback>
            </Avatar>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" side="top" className="mb-2">
          <DropdownMenuItem onClick={onSignOut}>
            <LogOut className="mr-2 h-4 w-4" />
            Sair
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </nav>
  );
}
