"use client";

import React from "react";
import Sidebar from "@/components/layout/Sidebar";

export default function FactoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex" style={{ background: "#F4F6FA" }}>
      <Sidebar type="factory" />
      <main id="main-content" className="flex-1 min-w-0">
        <div className="p-6 lg:p-8 max-w-[1400px] w-full pb-24">
          {children}
        </div>
      </main>
    </div>
  );
}

