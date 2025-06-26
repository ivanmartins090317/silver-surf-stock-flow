import {Outlet} from "react-router-dom";
import {AppSidebar} from "./AppSidebar";
import {SidebarProvider, SidebarTrigger} from "@/components/ui/sidebar";
import {Button} from "@/components/ui/button";
import {LogOut} from "lucide-react";
import {useAuth} from "@/hooks/useAuth";
import {useToast} from "@/hooks/use-toast";

export function Layout() {
  const {signOut, user} = useAuth();
  const {toast} = useToast();

  console.log("Layout - user:", user);

  const handleSignOut = async () => {
    const {error} = await signOut();
    if (error) {
      toast({
        variant: "destructive",
        title: "Erro ao sair",
        description: error.message
      });
    } else {
      toast({
        title: "Logout realizado com sucesso!"
      });
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <main className="w-[90%] flex-1 p-4 sm:p-6 lg:p-8 lg:w-[75%]">
          <header className="mb-6 flex items-center justify-between">
            <SidebarTrigger className="lg:hidden" />
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                Bem-vindo, {user?.email}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSignOut}
                className="flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Sair
              </Button>
            </div>
          </header>
          <Outlet />
        </main>
      </div>
    </SidebarProvider>
  );
}
