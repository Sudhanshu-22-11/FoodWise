"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
  LayoutDashboard,
  BrainCircuit,
  Trash2,
  PackageCheck,
  HeartHandshake,
  Route,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Factory,
  Utensils,
  Layers,
  Flame,
  Cpu,
  RefreshCw,
  Boxes,
  ThermometerSnowflake,
  ShieldCheck,
  ShieldAlert,
  Star,
  Bell,
  Sparkles,
  Truck,
  Clock,
  Trophy,
  LucideIcon,
} from "lucide-react";
import { INSTITUTIONS } from "@/lib/mockData";
import { useApp } from "@/context/AppContext";

interface SidebarProps {
  type: "kitchen" | "factory" | "ngo";
}

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
  highlight?: boolean;
}

function SidebarContent({ type }: SidebarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [collapsed, setCollapsed] = useState(false);
  const { unreadCount, setIsNotificationOpen, setIsSettingsOpen } = useApp();

  const institution =
    type === "kitchen"
      ? INSTITUTIONS.kitchen
      : type === "factory"
      ? INSTITUTIONS.factory
      : INSTITUTIONS.ngo;

  const kitchenNav: NavItem[] = [
    { label: "Overview", href: "/kitchen/dashboard", icon: LayoutDashboard },
    { label: "Demand Prediction", href: "/kitchen/prediction", icon: BrainCircuit, badge: "AI" },
    { label: "Waste Tracking", href: "/kitchen/waste", icon: Trash2 },
    { label: "Surplus & NGO Matching", href: "/kitchen/surplus", icon: HeartHandshake, badge: "Action" },
    { label: "Route Optimization", href: "/kitchen/routes", icon: Route },
    { label: "Reports", href: "/kitchen/reports", icon: BarChart3 },
    { label: "Donor Rankings", href: "/kitchen/ranking", icon: Trophy, badge: "Live" },
  ];

  const factoryNav: NavItem[] = [
    { label: "Overview", href: "/factory/dashboard", icon: LayoutDashboard },
    { label: "Raw Material Intake", href: "/factory/intake", icon: Boxes },
    { label: "Storage Monitor", href: "/factory/storage", icon: ThermometerSnowflake },
    {
      label: "Predictive Spoilage",
      href: "/factory/spoilage",
      icon: Flame,
      highlight: true,
      badge: "Urgent",
    },
    { label: "Processing Analytics", href: "/factory/analytics", icon: Layers },
    { label: "Machine Health", href: "/factory/machines", icon: Cpu, badge: "Anomaly" },
    { label: "Byproduct Recovery", href: "/factory/byproduct", icon: RefreshCw },
    { label: "Reports", href: "/factory/reports", icon: BarChart3 },
  ];

  const ngoNav: NavItem[] = [
    { label: "Overview", href: "/ngo/dashboard", icon: LayoutDashboard },
    { label: "Live Food Claims", href: "/ngo/dashboard?tab=claims", icon: PackageCheck, badge: "Live" },
    { label: "Traffic & Safe Routing", href: "/ngo/dashboard?tab=routing", icon: Route },
    { label: "Scheduled Pickups", href: "/ngo/dashboard?tab=scheduled", icon: Truck },
    { label: "Pickup History", href: "/ngo/dashboard?tab=history", icon: Clock },
    { label: "Report Issue", href: "/ngo/complaints", icon: ShieldAlert, badge: "Admin Desk", highlight: true },
    { label: "Feedback & Donor Rankings", href: "/ngo/feedback", icon: Star, badge: "Rankings" },
    { label: "Impact & Reports", href: "/ngo/reports", icon: BarChart3 },
  ];

  const navItems =
    type === "kitchen" ? kitchenNav : type === "factory" ? factoryNav : ngoNav;
  const accentColor = "#10B981";

  const getInstitutionCategory = () => {
    if (type === "kitchen") return "Institutional Mess";
    if (type === "factory") return "Processing Plant";
    return "Food Relief NGO";
  };

  const getUserProfile = () => {
    if (type === "kitchen") {
      return { initials: "SR", name: "Dr. S.R. Sharma", role: "Mess Warden" };
    }
    if (type === "factory") {
      return { initials: "AK", name: "Amit Kumar", role: "Plant Manager" };
    }
    return { initials: "PV", name: "Pooja Verma", role: "NGO Logistics Lead" };
  };

  const profile = getUserProfile();

  return (
    <aside
      className={`sticky top-0 h-screen shrink-0 z-20 flex flex-col transition-all duration-300 ${
        collapsed ? "w-[72px]" : "w-[260px]"
      } border-r border-[#10B981]/20`}
      style={{
        background: "linear-gradient(180deg, #072B1E 0%, #052117 60%, #031710 100%)",
      }}
    >
      {/* Brand / Logo Area */}
      <div
        className="flex items-center gap-3 px-4 h-16 border-b"
        style={{ borderColor: "rgba(16, 185, 129, 0.18)" }}
      >
        <Link href="/" className="flex items-center gap-3 group">
          <div
            className="w-9 h-9 rounded-xl overflow-hidden shrink-0 shadow-md border border-emerald-500/20 bg-white p-0.5 group-hover:scale-105 transition-transform flex items-center justify-center"
          >
            <img src="/logo.png" alt="FoodWise Logo" className="w-full h-full object-contain" />
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <div className="text-[15px] font-extrabold text-white tracking-tight whitespace-nowrap">
                FoodWise
              </div>
              <div
                className="text-[10px] font-medium whitespace-nowrap"
                style={{ color: "#A7F3D0" }}
              >
                Smart Food Waste Platform
              </div>
            </div>
          )}
        </Link>
      </div>

      {/* Switcher: Kitchen vs Factory vs NGO */}
      {!collapsed ? (
        <div className="px-3 pt-3 pb-1">
          <div
            className="p-1 rounded-xl flex items-center gap-1 border"
            style={{
              background: "rgba(0, 0, 0, 0.28)",
              borderColor: "rgba(16, 185, 129, 0.2)",
            }}
          >
            <Link
              href="/kitchen/dashboard"
              className={`flex-1 py-1.5 px-1.5 rounded-lg text-[10.5px] font-semibold flex items-center justify-center gap-1 transition-all ${
                type === "kitchen"
                  ? "bg-[#10B981] text-white shadow-md shadow-emerald-950/60"
                  : "hover:text-white"
              }`}
              style={{
                color: type === "kitchen" ? "#FFFFFF" : "#A7F3D0",
              }}
              title="Kitchen Dashboard"
            >
              <Utensils className="w-3.5 h-3.5" />
              <span>Kitchen</span>
            </Link>

            <Link
              href="/factory/dashboard"
              className={`flex-1 py-1.5 px-1.5 rounded-lg text-[10.5px] font-semibold flex items-center justify-center gap-1 transition-all ${
                type === "factory"
                  ? "bg-[#10B981] text-white shadow-md shadow-emerald-950/60"
                  : "hover:text-white"
              }`}
              style={{
                color: type === "factory" ? "#FFFFFF" : "#A7F3D0",
              }}
              title="Factory Dashboard"
            >
              <Factory className="w-3.5 h-3.5" />
              <span>Factory</span>
            </Link>

            <Link
              href="/ngo/dashboard"
              className={`flex-1 py-1.5 px-1.5 rounded-lg text-[10.5px] font-semibold flex items-center justify-center gap-1 transition-all ${
                type === "ngo"
                  ? "bg-[#10B981] text-white shadow-md shadow-emerald-950/60"
                  : "hover:text-white"
              }`}
              style={{
                color: type === "ngo" ? "#FFFFFF" : "#A7F3D0",
              }}
              title="NGO Dashboard"
            >
              <HeartHandshake className="w-3.5 h-3.5" />
              <span>NGO</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-1.5 pt-3 pb-1">
          <Link
            href="/kitchen/dashboard"
            title="Kitchen Dashboard"
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
              type === "kitchen"
                ? "bg-[#10B981] text-white shadow-md"
                : "text-emerald-300 hover:bg-emerald-500/20"
            }`}
          >
            <Utensils className="w-4 h-4" />
          </Link>
          <Link
            href="/factory/dashboard"
            title="Factory Dashboard"
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
              type === "factory"
                ? "bg-[#10B981] text-white shadow-md"
                : "text-emerald-300 hover:bg-emerald-500/20"
            }`}
          >
            <Factory className="w-4 h-4" />
          </Link>
          <Link
            href="/ngo/dashboard"
            title="NGO Dashboard"
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
              type === "ngo"
                ? "bg-[#10B981] text-white shadow-md"
                : "text-emerald-300 hover:bg-emerald-500/20"
            }`}
          >
            <HeartHandshake className="w-4 h-4" />
          </Link>
        </div>
      )}

      {/* Institution Identity */}
      <div
        className="px-4 py-3 border-b"
        style={{ borderColor: "rgba(16, 185, 129, 0.15)" }}
      >
        {!collapsed ? (
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ background: accentColor }}
              />
              <span
                className="text-[10px] uppercase font-bold tracking-wider"
                style={{ color: "#34D399" }}
              >
                {getInstitutionCategory()}
              </span>
            </div>
            <h2 className="text-[13px] font-bold text-white leading-tight line-clamp-1">
              {institution.name}
            </h2>
            <div
              className="flex items-center gap-1.5 mt-1.5 text-[10px]"
              style={{ color: "#A7F3D0" }}
            >
              <ShieldCheck className="w-3 h-3" style={{ color: "#10B981" }} />
              <span>FSSAI Verified</span>
              <span style={{ color: "rgba(255,255,255,0.2)" }}>•</span>
              <span
                className="font-mono-data"
                style={{ color: "rgba(167, 243, 208, 0.7)" }}
              >
                {institution.code}
              </span>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{
                background: "rgba(16, 185, 129, 0.2)",
                color: accentColor,
              }}
            >
              {type === "kitchen" ? (
                <Utensils className="w-4.5 h-4.5" />
              ) : type === "factory" ? (
                <Factory className="w-4.5 h-4.5" />
              ) : (
                <HeartHandshake className="w-4.5 h-4.5" />
              )}
            </div>
          </div>
        )}
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto sidebar-scroll">
        {!collapsed && (
          <div
            className="text-[10px] font-bold uppercase tracking-widest mb-2 px-3"
            style={{ color: "#6EE7B7" }}
          >
            Navigation
          </div>
        )}
        {navItems.map((item) => {
          const tab = searchParams?.get("tab");
          let isActive = false;
          if (item.href.includes("?tab=")) {
            const itemTab = item.href.split("?tab=")[1];
            isActive = pathname === "/ngo/dashboard" && tab === itemTab;
          } else if (item.href === "/ngo/dashboard") {
            isActive = pathname === "/ngo/dashboard" && !tab;
          } else {
            isActive = pathname === item.href;
          }
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`group flex items-center gap-3 rounded-xl text-[13px] font-medium transition-all relative ${
                collapsed ? "px-0 py-2.5 justify-center" : "px-3 py-2.5"
              }`}
              style={{
                background: isActive
                  ? "linear-gradient(90deg, rgba(16, 185, 129, 0.28) 0%, rgba(16, 185, 129, 0.1) 100%)"
                  : item.highlight
                  ? "rgba(239, 68, 68, 0.15)"
                  : "transparent",
                color: isActive
                  ? "#FFFFFF"
                  : item.highlight
                  ? "#FCA5A5"
                  : "#D1FAE5",
                borderLeft: isActive ? "3px solid #10B981" : "3px solid transparent",
                boxShadow: isActive ? "inset 0 0 12px rgba(16, 185, 129, 0.15)" : "none",
              }}
              title={collapsed ? item.label : undefined}
              onMouseEnter={(e) => {
                if (!isActive && !item.highlight) {
                  (e.currentTarget as HTMLElement).style.background =
                    "rgba(16, 185, 129, 0.18)";
                  (e.currentTarget as HTMLElement).style.color = "#FFFFFF";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive && !item.highlight) {
                  (e.currentTarget as HTMLElement).style.background = "transparent";
                  (e.currentTarget as HTMLElement).style.color = "#D1FAE5";
                }
              }}
            >
              <Icon
                className="w-[18px] h-[18px] shrink-0 transition-transform group-hover:scale-110"
                style={{
                  color: isActive
                    ? "#34D399"
                    : item.highlight
                    ? "#FCA5A5"
                    : "#6EE7B7",
                }}
              />
              {!collapsed && (
                <div className="flex-1 flex items-center justify-between truncate">
                  <span className="truncate">{item.label}</span>
                  {item.badge && (
                    <span
                      className="text-[10px] font-bold px-1.5 py-0.5 rounded-md font-mono-data"
                      style={{
                        background: item.highlight
                          ? "rgba(239,68,68,0.25)"
                          : "rgba(16,185,129,0.25)",
                        color: item.highlight ? "#FCA5A5" : "#A7F3D0",
                        border: item.highlight
                          ? "1px solid rgba(239,68,68,0.4)"
                          : "1px solid rgba(16,185,129,0.3)",
                      }}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Section - Notifications + Settings */}
      <div
        className="px-3 py-2 border-t space-y-0.5"
        style={{ borderColor: "rgba(16, 185, 129, 0.15)" }}
      >
        <button
          onClick={() => setIsNotificationOpen(true)}
          className={`w-full flex items-center gap-3 rounded-xl text-[13px] font-medium transition-all cursor-pointer ${
            collapsed ? "px-0 py-2.5 justify-center" : "px-3 py-2.5"
          }`}
          style={{ color: "#A7F3D0" }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background =
              "rgba(16, 185, 129, 0.18)";
            (e.currentTarget as HTMLElement).style.color = "#FFFFFF";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = "transparent";
            (e.currentTarget as HTMLElement).style.color = "#A7F3D0";
          }}
          title={collapsed ? "Notifications" : undefined}
        >
          <div className="relative">
            <Bell className="w-[18px] h-[18px] text-emerald-400" />
            {unreadCount > 0 && collapsed && (
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-rose-500" />
            )}
          </div>
          {!collapsed && (
            <div className="flex-1 flex items-center justify-between">
              <span>Notifications</span>
              {unreadCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-rose-500 text-white">
                  {unreadCount}
                </span>
              )}
            </div>
          )}
        </button>
        <button
          onClick={() => setIsSettingsOpen(true)}
          className={`w-full flex items-center gap-3 rounded-xl text-[13px] font-medium transition-all cursor-pointer ${
            collapsed ? "px-0 py-2.5 justify-center" : "px-3 py-2.5"
          }`}
          style={{ color: "#A7F3D0" }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background =
              "rgba(16, 185, 129, 0.18)";
            (e.currentTarget as HTMLElement).style.color = "#FFFFFF";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = "transparent";
            (e.currentTarget as HTMLElement).style.color = "#A7F3D0";
          }}
          title={collapsed ? "Settings" : undefined}
        >
          <Settings className="w-[18px] h-[18px] text-emerald-400" />
          {!collapsed && <span>Settings</span>}
        </button>
      </div>

      {/* User Profile + Collapse Toggle */}
      <div
        className="px-3 py-3 border-t"
        style={{
          borderColor: "rgba(16, 185, 129, 0.18)",
          background: "rgba(0, 0, 0, 0.25)",
        }}
      >
        {!collapsed ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center text-[12px] font-bold text-white shadow-md shadow-emerald-950/50"
                style={{
                  background: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
                }}
              >
                {profile.initials}
              </div>
              <div>
                <div className="text-[13px] font-semibold text-white leading-tight">
                  {profile.name}
                </div>
                <div className="text-[10px]" style={{ color: "#A7F3D0" }}>
                  {profile.role}
                </div>
              </div>
            </div>
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-1.5 rounded-lg transition-colors"
              style={{ color: "#A7F3D0" }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background =
                  "rgba(16, 185, 129, 0.2)";
                (e.currentTarget as HTMLElement).style.color = "#FFFFFF";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = "transparent";
                (e.currentTarget as HTMLElement).style.color = "#A7F3D0";
              }}
              title="Collapse sidebar"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-[12px] font-bold text-white shadow-md shadow-emerald-950/50"
              style={{
                background: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
              }}
            >
              {profile.initials}
            </div>
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-1.5 rounded-lg transition-colors"
              style={{ color: "#A7F3D0" }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background =
                  "rgba(16, 185, 129, 0.2)";
                (e.currentTarget as HTMLElement).style.color = "#FFFFFF";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = "transparent";
                (e.currentTarget as HTMLElement).style.color = "#A7F3D0";
              }}
              title="Expand sidebar"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}

export default function Sidebar(props: SidebarProps) {
  return (
    <Suspense fallback={<aside className="sticky top-0 h-screen shrink-0 z-20 w-[260px] bg-[#072B1E]" />}>
      <SidebarContent {...props} />
    </Suspense>
  );
}
