
import { Outlet } from "react-router-dom";
import { AppSidebar } from "./AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export function Layout() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <header className="mb-6">
             <SidebarTrigger className="lg:hidden" />
          </header>
          <Outlet />
        </main>
      </div>
    </SidebarProvider>
  );
}
