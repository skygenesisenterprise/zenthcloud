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
      <SidebarInset>
        <ManagerHeader />
        <main className="flex-1">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
