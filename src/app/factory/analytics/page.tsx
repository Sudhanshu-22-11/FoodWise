"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Layers,
  AlertTriangle,
  Activity,
  CheckCircle2,
  TrendingDown,
  TrendingUp,
  Cpu,
  RefreshCw,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const STAGE_MASS_BALANCE = [
  {
    stage: "1. Raw Intake (Potatoes)",
    massKg: 10000,
    pct: 100,
    lossKg: 200,
    lossPct: 2.0,
    lossType: "Mud / Grit Washing Loss",
    status: "NORMAL",
  },
  {
    stage: "2. Peeling Drum PM-03 ⚠️",
    massKg: 8300,
    pct: 83.0,
    lossKg: 1500,
    lossPct: 15.0,
    lossType: "Abrasive Peel & Flesh Loss (Excess)",
    status: "EXCESS",
  },
  {
    stage: "3. Rotary Slicing (SL-02)",
    massKg: 8100,
    pct: 81.0,
    lossKg: 200,
    lossPct: 2.4,
    lossType: "Sliver Starch Leaching",
    status: "NORMAL",
  },
  {
    stage: "4. Multi-Zone Frying",
    massKg: 2100,
    pct: 21.0,
    lossKg: 6000,
    lossPct: 74.0,
    lossType: "Moisture Evaporation (Expected)",
    status: "NORMAL",
  },
  {
    stage: "5. Optical Sorting Rejection ⚠️",
    massKg: 1920,
    pct: 19.2,
    lossKg: 180,
    lossPct: 8.5,
    lossType: "Color / Bruise Discards to Biogas",
    status: "ATTENTION",
  },
];

const SHIFT_EFFICIENCY = [
  { shift: "Morning (06:00 - 14:00)", throughputKg: 7850, lossPct: 16.2, oee: 86.4 },
  { shift: "Afternoon (14:00 - 22:00)", throughputKg: 8200, lossPct: 18.5, oee: 82.1 },
  { shift: "Night (22:00 - 06:00)", throughputKg: 6900, lossPct: 15.1, oee: 89.2 },
];

export default function ProcessingAnalyticsPage() {
  const [selectedShift, setSelectedShift] = useState("Afternoon (14:00 - 22:00)");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#E8ECF3]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
              Manufacturing Line Yield & Mass Balance
            </span>
            <span className="text-[#D1D5DB]">•</span>
            <span className="text-xs text-[#9CA3AF]">Line 2 Telemetry</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#111827]">
            Processing Line Analytics
          </h1>
          <p className="text-xs sm:text-sm text-[#6B7280] mt-0.5">
            Stage-wise mass conservation, avoidable scrap detection, and overall line performance (OEE)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/factory/machines"
            className="px-4 py-2.5 rounded-xl bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200 hover:bg-amber-100 transition-colors flex items-center gap-1.5"
          >
            <Cpu className="w-3.5 h-3.5 text-amber-600" />
            Inspect Machine Telemetry →
          </Link>
        </div>
      </div>

      {/* Critical Anomaly Callout Banner */}
      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-amber-900">
              High Peel Loss Detected at Stage 2 (Peeling Drum PM-03)
            </div>
            <p className="text-[11px] text-amber-700 mt-0.5">
              Peeling loss is 15.0% (1,500 kg) vs benchmark of 8-10% (800-1,000 kg). +500 kg avoidable potato pulp waste due to blade misalignment.
            </p>
          </div>
        </div>

        <Link
          href="/factory/machines"
          className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-colors whitespace-nowrap shadow-sm flex items-center gap-1.5"
        >
          View Blade Vibration Anomaly
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card stat-card-amber p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#6B7280]">Overall Line Efficiency (OEE)</span>
            <div className="icon-container icon-container-amber">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black font-mono-data text-[#111827]">
            84.2%
          </div>
          <div className="text-[11px] text-amber-600 font-semibold mt-1">
            ↓ 2.1% from target (Target: 86.3%)
          </div>
        </div>

        <div className="stat-card stat-card-red p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#6B7280]">Avoidable Yield Loss</span>
            <div className="icon-container icon-container-red">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black font-mono-data text-rose-600">
            680 <span className="text-sm font-bold text-[#6B7280]">kg / batch</span>
          </div>
          <div className="text-[11px] text-rose-600 mt-1">
            Peel drum abrasion + sorting scrap
          </div>
        </div>

        <div className="stat-card stat-card-green p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#6B7280]">Finished Product Yield</span>
            <div className="icon-container icon-container-green">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black font-mono-data text-emerald-600">
            1,920 <span className="text-sm font-bold text-[#6B7280]">kg</span>
          </div>
          <div className="text-[11px] text-[#6B7280] mt-1">
            Ready for retail packaging
          </div>
        </div>

        <div className="stat-card stat-card-indigo p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#6B7280]">Scrap Diverted to Biogas</span>
            <div className="icon-container icon-container-indigo">
              <RefreshCw className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black font-mono-data text-[#111827]">
            1,840 <span className="text-sm font-bold text-[#6B7280]">kg</span>
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">
            100% circular valorization
          </div>
        </div>
      </div>

      {/* Stage-wise Mass Balance Detailed Ledger */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="section-title flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-600" />
              Stage-by-Stage Mass Balance Flow (10,000 kg Batch)
            </h3>
            <p className="section-subtitle">Real-time load cell telemetry tracking mass at each station of Potato Processing Line 2</p>
          </div>
          <span className="badge badge-indigo font-mono-data">Batch #POT-091</span>
        </div>

        <div className="space-y-4">
          {STAGE_MASS_BALANCE.map((st, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-2xl border transition-all ${
                st.status === "EXCESS"
                  ? "bg-amber-50/40 border-amber-200"
                  : st.status === "ATTENTION"
                  ? "bg-rose-50/30 border-rose-200"
                  : "bg-[#FAFBFC] border-[#E8ECF3]"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span className="font-bold text-sm text-[#111827]">{st.stage}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-[#4B5563]">Mass: {st.massKg.toLocaleString()} kg</span>
                  <span className="text-xs font-extrabold font-mono-data text-emerald-600">({st.pct}%)</span>
                </div>
              </div>

              <div className="w-full bg-[#E5E7EB] h-2.5 rounded-full overflow-hidden mb-2">
                <div
                  className={`h-full rounded-full ${
                    st.status === "EXCESS"
                      ? "bg-amber-500"
                      : st.status === "ATTENTION"
                      ? "bg-rose-500"
                      : "bg-emerald-500"
                  }`}
                  style={{ width: `${st.pct}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-[#6B7280]">{st.lossType}</span>
                <span className={`font-mono-data font-bold ${
                  st.status === "EXCESS" ? "text-amber-700" : "text-[#4B5563]"
                }`}>
                  Loss: {st.lossKg.toLocaleString()} kg ({st.lossPct}%)
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Shift Comparison Table */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="section-title">Shift-wise Performance Comparison</h3>
            <p className="section-subtitle">Evaluating yield loss and equipment uptime across manufacturing shifts</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#E8ECF3] text-[11px] uppercase tracking-wider text-[#6B7280]">
                <th className="py-2.5 px-3 font-bold">Shift Schedule</th>
                <th className="py-2.5 px-3 font-bold">Processed Volume</th>
                <th className="py-2.5 px-3 font-bold">Overall Yield Loss %</th>
                <th className="py-2.5 px-3 font-bold">Line OEE Rating</th>
                <th className="py-2.5 px-3 font-bold text-right">Operational Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F3F4F6]">
              {SHIFT_EFFICIENCY.map((sh, idx) => (
                <tr key={idx} className="hover:bg-[#F9FAFB] transition-colors">
                  <td className="py-3 px-3 font-semibold text-[#111827]">{sh.shift}</td>
                  <td className="py-3 px-3 font-mono-data font-bold text-[#111827]">{sh.throughputKg.toLocaleString()} kg</td>
                  <td className="py-3 px-3 font-mono-data font-bold text-amber-600">{sh.lossPct}%</td>
                  <td className="py-3 px-3 font-mono-data font-bold text-emerald-600">{sh.oee}%</td>
                  <td className="py-3 px-3 text-right">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Optimal Telemetry
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
