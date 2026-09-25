"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { SPOILAGE_BATCHES } from "@/lib/mockData";
import {
  Flame,
  AlertCircle,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  TrendingDown,
  Info,
  Calendar,
  Layers,
  Thermometer,
  FileText,
  RotateCcw,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Legend,
} from "recharts";

export default function FactorySpoilagePage() {
  const { isBatchPrioritized, prioritizeBatch } = useApp();
  const [selectedBatch, setSelectedBatch] = useState(SPOILAGE_BATCHES[0]);
  const [showFullReport, setShowFullReport] = useState(false);

  // Combined chart dataset for 72 hours
  const chartData = [
    { hour: "0h (Now)", tomQuality: 78, potQuality: 89, oniQuality: 96, threshold: 45 },
    { hour: "6h", tomQuality: 72, potQuality: 87, oniQuality: 95, threshold: 45 },
    { hour: "12h", tomQuality: 64, potQuality: 85, oniQuality: 93, threshold: 45 },
    { hour: "18h", tomQuality: 57, potQuality: 83, oniQuality: 92, threshold: 45 },
    { hour: "24h (Tomorrow)", tomQuality: 50, potQuality: 81, oniQuality: 90, threshold: 45 },
    { hour: "31h (Cutoff)", tomQuality: 44, potQuality: 78, oniQuality: 89, threshold: 45 }, // crosses threshold
    { hour: "48h", tomQuality: 28, potQuality: 73, oniQuality: 87, threshold: 45 },
    { hour: "72h", tomQuality: 10, potQuality: 62, oniQuality: 85, threshold: 45 },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-[#E8ECF3]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-red-400 uppercase tracking-wider flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5" />
              AI Predictive Spoilage Prevention Engine
            </span>
            <span className="text-white/30">•</span>
            <span className="text-xs text-[#6B7280]">Haldiram&apos;s Unit 3, Nagpur</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#111827] flex items-center gap-2.5">
            Perishable Raw Material Risk & Degradation Curves
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[#FEE2E2] text-[#DC2626] border border-[#FECACA]">
              STAR FEATURE
            </span>
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-[#6B7280]">Model: Thermal Kinetic Influx v3</span>
        </div>
      </div>

      {/* TOP SECTION — RISK OVERVIEW (3 COLUMNS) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Column 1: High Risk */}
        <div className="p-4 rounded-2xl bg-[#FEF2F2] border border-[#FECACA] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FEE2E2] text-red-400 flex items-center justify-center font-bold">
              🔴
            </div>
            <div>
              <div className="text-xs font-bold text-red-400 uppercase tracking-wider">
                HIGH RISK
              </div>
              <div className="text-xl font-bold text-[#111827] font-mono-data">1 Batch</div>
              <div className="text-[11px] text-[#6B7280]">Tomatoes (3,200 kg)</div>
            </div>
          </div>
          <span className="text-xs font-mono-data text-red-400 font-bold bg-[#FEE2E2] px-2 py-1 rounded">
            &lt; 36 hrs
          </span>
        </div>

        {/* Column 2: Medium Risk */}
        <div className="p-4 rounded-2xl bg-[#FFF8EB] border border-[#FDE68A] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
              🟡
            </div>
            <div>
              <div className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                MEDIUM RISK
              </div>
              <div className="text-xl font-bold text-[#111827] font-mono-data">2 Batches</div>
              <div className="text-[11px] text-[#6B7280]">Potatoes (6,400 kg)</div>
            </div>
          </div>
          <span className="text-xs font-mono-data text-amber-400 font-bold bg-amber-500/20 px-2 py-1 rounded">
            48-96 hrs
          </span>
        </div>

        {/* Column 3: Low Risk */}
        <div className="p-4 rounded-2xl bg-[#ECFDF5] border border-[#A7F3D0] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-[#059669] flex items-center justify-center font-bold">
              🟢
            </div>
            <div>
              <div className="text-xs font-bold text-[#059669] uppercase tracking-wider">
                LOW RISK
              </div>
              <div className="text-xl font-bold text-[#111827] font-mono-data">12 Batches</div>
              <div className="text-[11px] text-[#6B7280]">Onions, Spices, Flour</div>
            </div>
          </div>
          <span className="text-xs font-mono-data text-[#059669] font-bold bg-emerald-500/20 px-2 py-1 rounded">
            &gt; 7 days
          </span>
        </div>
      </div>

      {/* TWO COLUMN ROW: HIGH RISK CARD (LEFT) & DEGRADATION CURVE CHART (RIGHT) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* HIGH RISK STAR CARD (5 cols) */}
        <div className="lg:col-span-5 glow-danger rounded-2xl bg-[#FFFFFF]/95 backdrop-blur-xl p-6 border border-red-500/50 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#FEF2F2] rounded-full blur-2xl pointer-events-none" />

          <div>
            {/* Header badge */}
            <div className="flex items-center justify-between mb-4">
              <span className="px-3 py-1 rounded-full bg-[#FEE2E2] text-red-400 font-bold text-xs uppercase font-mono-data border border-[#FECACA] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-400 animate-ping" />
                🔴 HIGH RISK BATCH
              </span>
              <span className="text-xs font-mono-data text-[#6B7280]">Priority Queue #1</span>
            </div>

            {/* Batch Info */}
            <div className="mb-4">
              <div className="text-xs text-[#6B7280] font-mono-data font-semibold">Batch Identifier:</div>
              <div className="text-xl font-black text-[#111827] font-mono-data">TOM-2024-0234</div>
              <div className="text-xs text-gray-700 font-semibold mt-1 flex items-center gap-3">
                <span>🍅 Processing Tomatoes</span>
                <span className="text-gray-400">•</span>
                <span className="font-mono-data font-bold text-[#DC2626]">3,200 kg</span>
              </div>
              <div className="text-[11px] text-[#6B7280] mt-0.5">
                Location: Cold Storage Unit B • Age: 6 days (Limit: 7 days)
              </div>
            </div>

            {/* Spoilage Prediction Metrics */}
            <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] mb-4 space-y-2.5 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-800">
                  Estimated Time to Spoilage:
                </span>
                <span className="text-lg font-black text-rose-600 font-mono-data">
                  31 hours
                </span>
              </div>

              <div>
                <div className="flex items-center justify-between text-[11px] text-gray-600 font-semibold mb-1">
                  <span>Confidence Score</span>
                  <span className="font-mono-data font-bold text-gray-900">82%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div className="bg-rose-500 h-2 rounded-full" style={{ width: "82%" }} />
                </div>
              </div>
            </div>

            {/* Contributing Factors */}
            <div className="space-y-2 mb-5">
              <div className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                Contributing Sensor Factors:
              </div>
              <ul className="space-y-1.5 text-xs">
                <li className="flex items-start gap-2 text-amber-800 font-medium">
                  <span className="shrink-0">⚠️</span>
                  <span>Temperature exceeded 10°C threshold 3x today (peak 13.1°C)</span>
                </li>
                <li className="flex items-start gap-2 text-amber-800 font-medium">
                  <span className="shrink-0">⚠️</span>
                  <span>Humidity dipped to 87% (below 92% baseline)</span>
                </li>
                <li className="flex items-start gap-2 text-amber-800 font-medium">
                  <span className="shrink-0">⚠️</span>
                  <span>Batch age approaching physiological respiration limit</span>
                </li>
                <li className="flex items-start gap-2 text-gray-700 font-medium">
                  <span className="shrink-0">ℹ️</span>
                  <span>Historical match: Batch TOM-2024-0198 spoiled in 28 hrs</span>
                </li>
              </ul>
            </div>

            {/* AI Recommendation Box (High Contrast Crystal Clear) */}
            <div className="p-4 rounded-xl bg-emerald-50 border-2 border-emerald-300 mb-5 shadow-xs">
              <div className="text-xs font-extrabold text-[#065F46] flex items-center gap-1.5 mb-1.5">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                AI Operational Recommendation:
              </div>
              <p className="text-xs text-[#064E3B] font-medium leading-relaxed">
                &quot;Prioritize this batch for processing today. Estimated{" "}
                <strong className="text-emerald-950 font-black bg-emerald-200/70 px-1.5 py-0.5 rounded border border-emerald-300">
                  2,800 kg can be salvaged
                </strong>{" "}
                if processed within the next 8 hours on Ketchup Line 2.&quot;
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-2 border-t border-[#E8ECF3]">
            {isBatchPrioritized ? (
              <div className="w-full py-3 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-900 font-bold text-xs flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Rerouted to Ketchup Line 2 (In Queue)
              </div>
            ) : (
              <button
                onClick={prioritizeBatch}
                className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs shadow-md shadow-rose-500/25 transition-all flex items-center justify-center gap-2 hover:scale-[1.01]"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Prioritize in Production
              </button>
            )}

            <button
              onClick={() => setShowFullReport(true)}
              className="w-full py-2.5 rounded-xl bg-[#F9FAFB] hover:bg-[#F3F4F6] text-[#111827] font-semibold text-xs border border-[#E8ECF3] transition-colors flex items-center justify-center gap-2"
            >
              <FileText className="w-3.5 h-3.5 text-[#6B7280]" />
              View Full Sensor Log Report
            </button>
          </div>
        </div>

        {/* SPOILAGE PREDICTION TIMELINE CHART (7 cols) */}
        <div className="lg:col-span-7 card p-6 border-[#E8ECF3] flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4">
              <div>
                <h3 className="text-base font-bold text-[#111827]">
                  Spoilage Prediction Timeline & Degradation Curves
                </h3>
                <p className="text-xs text-[#6B7280]">
                  Predicted quality score decay over the next 72 hours across at-risk batches
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="px-2.5 py-1 rounded bg-red-500/15 text-[#DC2626] border border-red-500/25 font-semibold">
                  Threshold: Quality &lt; 45
                </span>
              </div>
            </div>

            {/* Action window badge */}
            <div className="p-2.5 mb-4 rounded-xl bg-[#FAFBFC] border border-[#F3F4F6] flex items-center justify-between text-xs">
              <span className="text-[#6B7280]">
                🚨 Shaded Action Window: <strong className="text-[#111827]">Next 8 Hours</strong> yields 87.5% recovery rate.
              </span>
              <span className="font-mono-data text-[#10B981] font-bold">2,800 kg Salvageable</span>
            </div>

            {/* 72h Line Chart */}
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                  <XAxis dataKey="hour" stroke="#94A3B8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94A3B8" fontSize={11} domain={[0, 100]} tickLine={false} unit="" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1B2138",
                      borderColor: "rgba(255,255,255,0.12)",
                      borderRadius: "12px",
                      color: "#F1F5F9",
                      fontSize: "12px",
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }} />
                  {/* Unsafe Threshold Line */}
                  <ReferenceLine
                    y={45}
                    label={{
                      value: "Unsafe Spoilage Threshold (45)",
                      fill: "#EF4444",
                      fontSize: 10,
                      position: "insideBottomRight",
                    }}
                    stroke="#EF4444"
                    strokeDasharray="4 4"
                    strokeWidth={1.5}
                  />
                  {/* High Risk Batch TOM-2024-0234 */}
                  <Line
                    type="monotone"
                    dataKey="tomQuality"
                    name="Batch TOM-0234 (Tomatoes)"
                    stroke="#EF4444"
                    strokeWidth={3}
                    dot={{ r: 4, fill: "#EF4444" }}
                    activeDot={{ r: 7 }}
                  />
                  {/* Medium Risk Batch POT-2024-1182 */}
                  <Line
                    type="monotone"
                    dataKey="potQuality"
                    name="Batch POT-1182 (Potatoes)"
                    stroke="#F59E0B"
                    strokeWidth={2}
                    dot={{ r: 3, fill: "#F59E0B" }}
                  />
                  {/* Low Risk Batch ONI-2024-0941 */}
                  <Line
                    type="monotone"
                    dataKey="oniQuality"
                    name="Batch ONI-0941 (Onions)"
                    stroke="#10B981"
                    strokeWidth={2}
                    dot={{ r: 3, fill: "#10B981" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart footer details */}
          <div className="mt-4 pt-4 border-t border-[#E8ECF3] grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-[#6B7280]">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
              <span>Tomatoes cross critical line at Hour 31</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <span>Potatoes cross critical line at Hour 94</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <span>Onions stable for 168+ hours</span>
            </div>
          </div>
        </div>
      </div>

      {/* FULL REPORT MODAL */}
      {showFullReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="w-full max-w-2xl bg-[#FFFFFF] border border-[#D0D6E2] rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8ECF3]">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-red-400" />
                <h3 className="font-bold text-[#111827] text-base">
                  Diagnostic Telemetry: Batch TOM-2024-0234
                </h3>
              </div>
              <button
                onClick={() => setShowFullReport(false)}
                className="text-xs px-2 py-1 rounded bg-[#F9FAFB] text-[#6B7280] hover:text-[#111827]"
              >
                Close ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-[#6B7280]">
              <div className="p-3 rounded-xl bg-[#FAFBFC] border border-[#F3F4F6]">
                <div className="font-bold text-[#111827] mb-1">Thermal Kinetic Log</div>
                <p>
                  Sensor Node CS-B4 detected three independent thermal excursions above 10°C at 04:15, 08:30, and 12:45 today. Respiration rate calculated at 42 mg CO₂/kg·hr (2.8x normal basal dormancy).
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#FAFBFC] border border-[#F3F4F6]">
                <div className="font-bold text-[#111827] mb-1">Pectin Degradation Estimate</div>
                <p>
                  Firmness index projected to dip below 3.5 N (minimal threshold for commercial diced paste) in 31 hours. Processing into puree/ketchup within 8 hours retains 94% solids specification.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-950">
                <div className="font-extrabold text-[#065F46] mb-1">Economic & CO₂ Valuation</div>
                <p className="text-[#064E3B] font-medium">
                  Salvaging 2,800 kg preserves <strong className="text-emerald-950 font-black bg-emerald-200/70 px-1.5 py-0.5 rounded border border-emerald-300">₹1,12,000</strong> raw procurement outlay and avoids 7.0 tons CO₂e landfill methane generation.
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-[#E8ECF3] flex justify-end">
              <button
                onClick={() => setShowFullReport(false)}
                className="px-4 py-2 rounded-xl bg-[#F3F4F6] hover:bg-white/15 text-[#111827] font-semibold text-xs"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
