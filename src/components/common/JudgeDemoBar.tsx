"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import {
  Sparkles,
  Utensils,
  Factory,
  HeartHandshake,
  BarChart3,
  Bell,
  ChevronUp,
  ChevronDown,
  Layers,
  Wand2,
  Terminal,
} from "lucide-react";

export default function JudgeDemoBar() {
  const pathname = usePathname();
  const router = useRouter();
  const {
    currentRole,
    setCurrentRole,
    unreadCount,
    setIsNotificationOpen,
    setIsOnboardingOpen,
    setIsApiInspectorOpen,
  } = useApp();
  const [isExpanded, setIsExpanded] = useState(true);

  const quickLinks = [
    { label: "Landing", href: "/", icon: Sparkles },
    { label: "Kitchen Dash", href: "/kitchen/dashboard", icon: Utensils },
    { label: "AI Forecast", href: "/kitchen/prediction", icon: Wand2 },
    { label: "Surplus & FSSAI", href: "/kitchen/surplus", icon: Layers },
    { label: "Route Optimizer", href: "/kitchen/routes", icon: Layers },
    { label: "Factory Dash", href: "/factory/dashboard", icon: Factory },
    { label: "Predictive Spoilage ⭐", href: "/factory/spoilage", icon: Sparkles },
    { label: "Machine Anomaly", href: "/factory/machines", icon: Layers },
    { label: "ESG / Impact", href: "/dashboard/impact", icon: BarChart3 },
    { label: "NGO Portal", href: "/ngo/dashboard", icon: HeartHandshake },
  ];

  const handleRoleChange = (role: typeof currentRole, targetUrl: string) => {
    setCurrentRole(role);
    router.push(targetUrl);
  };

  return (
    <aside aria-label="Judge Demo Bar" className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 max-w-6xl w-[96%] px-2 pointer-events-none">
      <div className="pointer-events-auto bg-[#FFFFFF]/90 backdrop-blur-2xl border border-[#E5E7EB] rounded-2xl shadow-2xl p-2.5 transition-all duration-300">
        <div className="flex items-center justify-between gap-3 px-2 pb-2 border-b border-[#E8ECF3] text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-pulse" />
            <span className="font-bold text-[#111827] tracking-wide flex items-center gap-1.5">
              SIH 2026 JUDGE CONTROL BAR
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded-md bg-[#ECFDF5] text-[#10B981] border border-[#10B981]/30 font-mono-data hidden sm:inline-block">
              FoodWise
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Quick Role Switchers */}
            <div className="hidden md:flex items-center bg-black/40 rounded-lg p-0.5 border border-[#E8ECF3] text-[11px]">
              <button
                onClick={() => handleRoleChange("KITCHEN_MANAGER", "/kitchen/dashboard")}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  currentRole === "KITCHEN_MANAGER"
                    ? "bg-[#10B981] text-white font-bold shadow-sm"
                    : "text-[#6B7280] hover:text-[#111827]"
                }`}
              >
                🍳 Kitchen View
              </button>
              <button
                onClick={() => handleRoleChange("FACTORY_MANAGER", "/factory/dashboard")}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  currentRole === "FACTORY_MANAGER"
                    ? "bg-[#10B981] text-[#111827] font-bold shadow-sm"
                    : "text-[#6B7280] hover:text-[#111827]"
                }`}
              >
                🏭 Factory View
              </button>
              <button
                onClick={() => handleRoleChange("NGO_PARTNER", "/ngo/dashboard")}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  currentRole === "NGO_PARTNER"
                    ? "bg-rose-500 text-[#111827] font-bold shadow-sm"
                    : "text-[#6B7280] hover:text-[#111827]"
                }`}
              >
                🤝 NGO View
              </button>
            </div>

            {/* Onboarding Wizard Trigger */}
            <button
              onClick={() => setIsOnboardingOpen(true)}
              className="px-2.5 py-1 text-[11px] rounded-lg bg-[#F3F4F6] hover:bg-white/15 text-[#111827] font-medium border border-[#E8ECF3] flex items-center gap-1 transition-colors"
            >
              <Wand2 className="w-3 h-3 text-[#10B981]" />
              Setup Wizard
            </button>

            {/* AI API Inspector Trigger */}
            <button
              onClick={() => setIsApiInspectorOpen(true)}
              className="px-2.5 py-1 text-[11px] rounded-lg bg-[#ECFDF5] hover:bg-[#10B981]/30 text-[#10B981] font-bold border border-[#00D4AA]/30 flex items-center gap-1 transition-colors shadow-sm"
              title="Test live REST AI microservices"
            >
              <Terminal className="w-3 h-3" />
              <span>Test AI APIs</span>
            </button>

            {/* Notification Bell */}
            <button
              onClick={() => setIsNotificationOpen(true)}
              className="relative p-1.5 rounded-lg bg-[#F3F4F6] hover:bg-white/15 text-[#111827] border border-[#E8ECF3] transition-colors"
              title="Open Alert Center"
            >
              <Bell className="w-3.5 h-3.5 text-amber-400" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-[10px] font-bold text-[#111827] flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Collapse toggle */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 rounded-lg text-[#6B7280] hover:text-[#111827] hover:bg-[#F9FAFB] transition-colors"
            >
              {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Links row */}
        {isExpanded && (
          <div className="flex items-center gap-1.5 pt-2 overflow-x-auto scrollbar-none text-xs">
            {quickLinks.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-1.5 rounded-lg whitespace-nowrap flex items-center gap-1.5 font-medium transition-all text-xs ${
                    isActive
                      ? "bg-[#10B981] text-white font-bold shadow-md shadow-[#10B981]/20 scale-105"
                      : "text-[#6B7280] hover:text-[#111827] hover:bg-[#F9FAFB]"
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? "text-white" : "text-white/60"}`} />
                  {item.label}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </aside>
  );
}
