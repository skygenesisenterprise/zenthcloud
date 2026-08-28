import * as React from "react";
import type { Metadata } from "next";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { ManagerSidebar } from "@/components/manager/sidebar";
import { ManagerHeader } from "@/components/manager/header";

export const metadata: Metadata = {
  title: {
    template: "%s | Espace client",
    default: "Espace client",
  },
  robots: { index: false, follow: false },
};

export default function ManagerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <ManagerSidebar />
      <SidebarInset className="h-svh overflow-hidden md:h-[calc(100svh-1rem)]">
        <ManagerHeader />
        <main className="min-h-0 flex-1 overflow-y-auto bg-background">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
