"use client";

import React from "react";
import Sidebar from "@/components/layout/Sidebar";
import { useApp } from "@/context/AppContext";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { currentRole } = useApp();

  const sidebarType =
    currentRole === "FACTORY_MANAGER"
      ? "factory"
      : currentRole === "NGO_PARTNER"
      ? "ngo"
      : "kitchen";

  return (
    <div className="min-h-screen flex" style={{ background: "#F4F6FA" }}>
      <Sidebar type={sidebarType} />
      <main id="main-content" className="flex-1 min-w-0">
        <div className="p-6 lg:p-8 max-w-[1400px] w-full pb-24">
          {children}
        </div>
      </main>
    </div>
  );
}
