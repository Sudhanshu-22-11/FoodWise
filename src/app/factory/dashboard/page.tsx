"use client";

import React from "react";
import Link from "next/link";
import { downloadFactoryAuditPdf } from "@/lib/pdfGenerator";
import { useApp } from "@/context/AppContext";
import {
  INSTITUTIONS,
  FACTORY_STORAGE_UNITS,
} from "@/lib/mockData";
import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  ArrowUpRight,
  Boxes,
  ThermometerSnowflake,
  Activity,
  RefreshCw,
  TrendingDown,
  Layers,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  ChevronDown,
  FileText,
  Flame,
  Package,
  Zap,
} from "lucide-react";

export default function FactoryDashboardPage() {
  const { isBatchPrioritized, prioritizeBatch } = useApp();

  return (
    <div className="space-y-6">
      {/* ═══ TOP HEADER ═══ */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[26px] font-bold tracking-tight" style={{ color: "#111827" }}>
            Dashboard
          </h1>
          <p className="text-sm" style={{ color: "#6B7280" }}>
            Welcome back. Manufacturing line telemetry overview.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium cursor-pointer"
            style={{
              background: "#FFFFFF",
              border: "1px solid #E8ECF3",
              color: "#374151",
              boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
            }}
          >
            <Calendar className="w-4 h-4" style={{ color: "#6B7280" }} />
            Today
            <ChevronDown className="w-3.5 h-3.5" style={{ color: "#9CA3AF" }} />
          </div>

          <Link
            href="/factory/spoilage"
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-bold transition-all"
            style={{
              background: "#FEF2F2",
              border: "1px solid #FECACA",
              color: "#DC2626",
            }}
          >
            <span
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ background: "#EF4444" }}
            />
            Spoilage Engine
          </Link>

          <button
            onClick={() => downloadFactoryAuditPdf({ title: "Plant Mass Balance & Spoilage Audit" })}
            className="btn-primary cursor-pointer active:scale-95 transition-all"
          >
            <FileText className="w-4 h-4" />
            Export Report (PDF)
          </button>
        </div>
      </div>

      {/* ═══ CRITICAL ALERT BANNER ═══ */}
      <div
        className="p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        style={{
          background: "#FEF2F2",
          border: "1px solid #FECACA",
        }}
      >
        <div className="flex items-start gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: "#FEE2E2", color: "#DC2626" }}
          >
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span
                className="text-[11px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded font-mono-data"
                style={{ background: "#DC2626", color: "#FFFFFF" }}
              >
                CRITICAL INVENTORY ALERT
              </span>
              <span className="text-[12px] font-mono-data" style={{ color: "#991B1B" }}>
                Batch TOM-2024-0234
              </span>
            </div>
            <p className="text-[13px] font-medium" style={{ color: "#991B1B" }}>
              Tomatoes (3,200 kg) in Cold Storage B — Spoilage predicted in{" "}
              <strong className="font-mono-data">31 hours</strong> due to temperature drift (13.1°C). Process priority:{" "}
              <span className="underline font-bold">HIGH</span>.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          {isBatchPrioritized ? (
            <span
              className="px-4 py-2.5 rounded-xl text-[13px] font-bold flex items-center gap-1.5 whitespace-nowrap"
              style={{
                background: "#ECFDF5",
                color: "#059669",
                border: "1px solid #A7F3D0",
              }}
            >
              <CheckCircle2 className="w-4 h-4" />
              Prioritized in Line 2
            </span>
          ) : (
            <button
              onClick={prioritizeBatch}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl font-bold text-[13px] transition-all flex items-center justify-center gap-2 whitespace-nowrap hover:scale-105"
              style={{
                background: "#DC2626",
                color: "#FFFFFF",
                boxShadow: "0 4px 12px rgba(220,38,38,0.3)",
              }}
            >
              <span>Prioritize in Production</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}

          <Link
            href="/factory/spoilage"
            className="btn-secondary whitespace-nowrap"
          >
            Details →
          </Link>
        </div>
      </div>

      {/* ═══ KPI STAT CARDS (4 CARDS) ═══ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Raw Material */}
        <div id="raw-materials" className="stat-card stat-card-indigo p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[13px] font-medium" style={{ color: "#6B7280" }}>
              Raw Material
            </span>
            <div className="icon-container icon-container-indigo">
              <Boxes className="w-5 h-5" />
            </div>
          </div>
          <div className="text-[28px] font-extrabold font-mono-data mb-1" style={{ color: "#111827" }}>
            34.5K <span className="text-[16px] font-bold" style={{ color: "#6B7280" }}>kg</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="trend-up">
              <ArrowUpRight className="w-3.5 h-3.5" />
              Across 4 cold zones
            </span>
          </div>
        </div>

        {/* Card 2: At-Risk Batches */}
        <div className="stat-card stat-card-red p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[13px] font-medium" style={{ color: "#6B7280" }}>
              At-Risk Batches
            </span>
            <div className="icon-container icon-container-red">
              <Flame className="w-5 h-5" />
            </div>
          </div>
          <div className="text-[28px] font-extrabold font-mono-data mb-1" style={{ color: "#111827" }}>
            3
          </div>
          <div className="flex items-center gap-3 text-[11px] font-medium">
            <span style={{ color: "#DC2626" }}>● 1 High</span>
            <span style={{ color: "#D97706" }}>● 2 Medium</span>
            <span style={{ color: "#059669" }}>● 12 Safe</span>
          </div>
        </div>

        {/* Card 3: Processing Efficiency */}
        <div className="stat-card stat-card-amber p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[13px] font-medium" style={{ color: "#6B7280" }}>
              Efficiency
            </span>
            <div className="icon-container icon-container-amber">
              <Activity className="w-5 h-5" />
            </div>
          </div>
          <div className="text-[28px] font-extrabold font-mono-data mb-1" style={{ color: "#111827" }}>
            84.2<span className="text-[16px] font-bold" style={{ color: "#6B7280" }}>%</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="trend-down">
              <TrendingDown className="w-3.5 h-3.5" />
              -2.1% from target
            </span>
          </div>
        </div>

        {/* Card 4: Waste Valorized */}
        <div id="byproduct-recovery" className="stat-card stat-card-green p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[13px] font-medium" style={{ color: "#6B7280" }}>
              Waste Valorized
            </span>
            <div className="icon-container icon-container-green">
              <RefreshCw className="w-5 h-5" />
            </div>
          </div>
          <div className="text-[28px] font-extrabold font-mono-data mb-1" style={{ color: "#111827" }}>
            1,840 <span className="text-[16px] font-bold" style={{ color: "#6B7280" }}>kg</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="trend-up">
              <ArrowUpRight className="w-3.5 h-3.5" />
              +18.5% vs last period
            </span>
          </div>
        </div>
      </div>

      {/* ═══ MATERIAL FLOW + STORAGE UNITS ═══ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Material Flow (7 cols) */}
        <div id="material-flow" className="lg:col-span-7 card p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="section-title flex items-center gap-2">
                <Layers className="w-5 h-5" style={{ color: "#10B981" }} />
                Material Flow Tracker
              </h3>
              <p className="section-subtitle">
                Stage-wise mass balance: raw intake through packaging
              </p>
            </div>
            <span className="badge badge-indigo font-mono-data">
              10,000 kg Batch
            </span>
          </div>

          <div className="space-y-3 text-[13px]">
            {/* Stage 1 */}
            <div
              className="p-3.5 rounded-xl"
              style={{ background: "#F9FAFB", border: "1px solid #F3F4F6" }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold flex items-center gap-2" style={{ color: "#111827" }}>
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#10B981" }} />
                  Stage 1: Raw Material Intake (Potatoes)
                </span>
                <span className="font-mono-data font-bold" style={{ color: "#111827" }}>
                  10,000 kg (100%)
                </span>
              </div>
              <div
                className="w-full h-2 rounded-full overflow-hidden"
                style={{ background: "#E5E7EB" }}
              >
                <div
                  className="h-full rounded-full"
                  style={{ width: "100%", background: "#10B981" }}
                />
              </div>
            </div>

            {/* Minor loss */}
            <div
              className="pl-5 ml-4 py-1 flex items-center justify-between text-[12px]"
              style={{ borderLeft: "2px solid #E5E7EB", color: "#9CA3AF" }}
            >
              <span>↳ Washing & De-stoning Loss (Mud/Grit)</span>
              <span className="font-mono-data font-semibold" style={{ color: "#374151" }}>
                200 kg (2.0%) — Normal
              </span>
            </div>

            {/* Stage 2: Peeling ⚠️ */}
            <div
              className="p-3.5 rounded-xl"
              style={{ background: "#FFF8EB", border: "1px solid #FDE68A" }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold flex items-center gap-2" style={{ color: "#92400E" }}>
                  <AlertTriangle className="w-4 h-4" style={{ color: "#D97706" }} />
                  Stage 2: Peeling Drum PM-03 Loss ⚠️
                </span>
                <span className="font-mono-data font-bold" style={{ color: "#D97706" }}>
                  1,500 kg (15.0%) — EXCESS
                </span>
              </div>
              <div
                className="w-full h-2 rounded-full overflow-hidden"
                style={{ background: "#FDE68A" }}
              >
                <div
                  className="h-full rounded-full"
                  style={{ width: "85%", background: "#F59E0B" }}
                />
              </div>
              <div className="flex items-center justify-between text-[11px] mt-2" style={{ color: "#92400E" }}>
                <span>Normal benchmark: 8-10% (800-1,000 kg). +500kg avoidable peel waste!</span>
                <Link
                  href="/factory/machines"
                  className="underline font-bold"
                  style={{ color: "#D97706" }}
                >
                  View Machine Telemetry →
                </Link>
              </div>
            </div>

            {/* Minor loss */}
            <div
              className="pl-5 ml-4 py-1 flex items-center justify-between text-[12px]"
              style={{ borderLeft: "2px solid #E5E7EB", color: "#9CA3AF" }}
            >
              <span>↳ Slicing Sliver Loss (SL-02)</span>
              <span className="font-mono-data font-semibold" style={{ color: "#374151" }}>
                200 kg (2.4%) — Optimal
              </span>
            </div>

            {/* Stage 3: Frying */}
            <div
              className="p-3.5 rounded-xl"
              style={{ background: "#F9FAFB", border: "1px solid #F3F4F6" }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold" style={{ color: "#111827" }}>
                  Stage 3: Continuous Multi-Zone Frying
                </span>
                <span className="font-mono-data font-semibold" style={{ color: "#374151" }}>
                  6,000 kg moisture evaporation
                </span>
              </div>
              <div
                className="w-full h-2 rounded-full overflow-hidden"
                style={{ background: "#E5E7EB" }}
              >
                <div
                  className="h-full rounded-full"
                  style={{ width: "25%", background: "#10B981" }}
                />
              </div>
            </div>

            {/* Stage 4: Rejection ⚠️ */}
            <div
              className="p-3.5 rounded-xl"
              style={{ background: "#FEF2F2", border: "1px solid #FECACA" }}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold flex items-center gap-2" style={{ color: "#991B1B" }}>
                  <AlertCircle className="w-4 h-4" style={{ color: "#DC2626" }} />
                  Stage 4: Optical Sorting Rejection ⚠️
                </span>
                <span className="font-mono-data font-bold" style={{ color: "#DC2626" }}>
                  180 kg (8.5%)
                </span>
              </div>
              <div className="text-[11px]" style={{ color: "#991B1B" }}>
                Diverted directly to Biogas Digester Unit 1 for energy generation.
              </div>
            </div>

            {/* Final Output */}
            <div
              className="p-4 rounded-xl flex items-center justify-between"
              style={{
                background: "#ECFDF5",
                border: "1px solid #A7F3D0",
              }}
            >
              <div>
                <div className="font-bold text-[15px]" style={{ color: "#111827" }}>
                  Final Packaged Output
                </div>
                <div className="text-[12px]" style={{ color: "#059669" }}>
                  Ready for distribution dispatch
                </div>
              </div>
              <div className="text-right">
                <div className="font-mono-data text-[18px] font-bold" style={{ color: "#059669" }}>
                  1,920 kg
                </div>
                <div className="text-[11px]" style={{ color: "#9CA3AF" }}>
                  Target: 2,200 kg (gap: 280kg)
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Storage Units (5 cols) */}
        <div id="storage-units" className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="section-title flex items-center gap-2">
                <ThermometerSnowflake className="w-5 h-5" style={{ color: "#3B82F6" }} />
                Cold Storage Monitors
              </h3>
              <p className="section-subtitle">Live microclimate sensors</p>
            </div>
            <span className="badge badge-success font-mono-data">4 Units Online</span>
          </div>

          <div className="space-y-3">
            {FACTORY_STORAGE_UNITS.map((unit) => {
              const isWarning = unit.status === "ATTENTION_NEEDED";
              return (
                <div
                  key={unit.id}
                  className="p-4 rounded-2xl transition-all"
                  style={{
                    background: isWarning ? "#FFF8EB" : "#FFFFFF",
                    border: isWarning ? "1px solid #FDE68A" : "1px solid #E8ECF3",
                    boxShadow: isWarning
                      ? "0 2px 8px rgba(245,158,11,0.1)"
                      : "0 1px 3px rgba(0,0,0,0.04)",
                  }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl">{unit.icon}</span>
                      <div>
                        <h4 className="font-bold text-[14px]" style={{ color: "#111827" }}>
                          {unit.name}
                        </h4>
                        <div className="text-[11px]" style={{ color: "#9CA3AF" }}>
                          {unit.crop}
                        </div>
                      </div>
                    </div>

                    <span
                      className="text-[10px] font-bold px-2.5 py-1 rounded-full uppercase font-mono-data"
                      style={{
                        background: isWarning ? "#FDE68A" : "#D1FAE5",
                        color: isWarning ? "#92400E" : "#059669",
                      }}
                    >
                      {isWarning ? "ATTENTION" : "GOOD"}
                    </span>
                  </div>

                  <div
                    className="grid grid-cols-3 gap-2 p-3 rounded-xl text-[12px] text-center mb-3"
                    style={{ background: isWarning ? "#FEF3C7" : "#F9FAFB", border: "1px solid " + (isWarning ? "#FDE68A" : "#F3F4F6") }}
                  >
                    <div>
                      <div className="text-[10px]" style={{ color: "#9CA3AF" }}>Stock</div>
                      <div className="font-mono-data font-bold" style={{ color: "#111827" }}>
                        {unit.stockKg.toLocaleString()} kg
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px]" style={{ color: "#9CA3AF" }}>Temp</div>
                      <div
                        className="font-mono-data font-bold"
                        style={{ color: isWarning ? "#D97706" : "#059669" }}
                      >
                        {unit.tempCelsius}°C {isWarning ? "⚠️" : "✅"}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px]" style={{ color: "#9CA3AF" }}>Shelf Life</div>
                      <div
                        className="font-mono-data font-bold"
                        style={{
                          color: unit.shelfLifeDays <= 5 ? "#D97706" : "#374151",
                        }}
                      >
                        {unit.shelfLifeDays} days
                      </div>
                    </div>
                  </div>

                  {isWarning && (
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[11px] font-semibold" style={{ color: "#92400E" }}>
                        Target temp 7-10°C exceeded
                      </span>
                      <Link
                        href="/factory/spoilage"
                        className="px-3 py-1.5 rounded-lg text-[12px] font-bold transition-colors"
                        style={{
                          background: "#F59E0B",
                          color: "#FFFFFF",
                        }}
                      >
                        View Spoilage Risk
                      </Link>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
