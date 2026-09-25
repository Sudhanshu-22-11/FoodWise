"use client";

import React from "react";
import { AppProvider } from "@/context/AppContext";
import ScrollToTop from "@/components/common/ScrollToTop";

export default function ClientProvider({ children }: { children: React.ReactNode }) {
  return (
    <AppProvider>
      <ScrollToTop />
      {children}
    </AppProvider>
  );
}

