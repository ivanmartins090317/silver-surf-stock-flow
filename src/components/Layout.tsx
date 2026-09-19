import { Outlet } from "react-router-dom";
import type { User } from "@supabase/supabase-js";
import { AppSidebar } from "./AppSidebar";
import { MobileTabBar } from "./MobileTabBar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

function getProfile(user: User | null) {
  const email = user?.email ?? "";
  const metadataName =
    typeof user?.user_metadata?.full_name === "string" ? user.user_metadata.full_name.trim() : "";
  const name = metadataName && metadataName !== email ? metadataName : email.split("@")[0] || "Usuário";
  const parts = (name.includes(" ") ? name : email.split("@")[0] || name)
    .split(/[\s._-]+/)
    .filter(Boolean);
  const initials =
    parts.length >= 2
      ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
      : (name.slice(0, 2) || "U").toUpperCase();

  return { name, email, initials };
}

export function Layout() {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const profile = getProfile(user);

  async function handleSignOut() {
    const { error } = await signOut();
    if (error) {
      toast({
        variant: "destructive",
        title: "Erro ao sair",
        description: error.message,
      });
      return;
    }

    toast({
      title: "Logout realizado com sucesso!",
    });
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <main className="min-w-0 w-full flex-1 p-4 pb-24 sm:p-6 md:pb-6 lg:p-8">
          <header className="mb-6 flex items-center gap-3">
            <SidebarTrigger className="hidden shrink-0 md:inline-flex" />
            <div className="ml-auto flex min-w-0 items-center gap-3">
              <div className="min-w-0 text-right">
                <p className="truncate text-sm font-medium leading-tight">{profile.name}</p>
                {profile.email && (
                  <p className="truncate text-xs text-muted-foreground">{profile.email}</p>
                )}
              </div>
              <Avatar className="hidden h-9 w-9 shrink-0 md:flex">
                <AvatarFallback className="bg-secondary text-xs font-medium">
                  {profile.initials}
                </AvatarFallback>
              </Avatar>
            </div>
          </header>
          <Outlet />
        </main>
        <MobileTabBar initials={profile.initials} onSignOut={handleSignOut} />
      </div>
    </SidebarProvider>
  );
}
