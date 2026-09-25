"use client";

import React from "react";
import Link from "next/link";
import { ESG_DATA } from "@/lib/mockData";
import CountUp from "@/components/common/CountUp";
import {
  ShieldCheck,
  Trees,
  Droplets,
  Zap,
  Trash2,
  HeartHandshake,
  Users,
  Building,
  FileCheck2,
  Download,
  Share2,
  TrendingUp,
  Globe,
  Sparkles,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export default function SustainabilityImpactPage() {
  return (
    <div className="space-y-8">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#E8ECF3]">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#10B981]/15 text-[#059669] text-xs font-bold uppercase tracking-wider mb-2 border border-[#10B981]/30">
              <Sparkles className="w-3.5 h-3.5" />
              Comprehensive ESG & Carbon Disclosure
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#111827]">
              Impact Report — FoodWise
            </h1>
            <p className="text-xs sm:text-sm text-[#6B7280] mt-1">
              Real-time sustainability metrics, circular valorization, and social impact across 340 connected institutions
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => alert("Downloading ESG Audit Certificate (PDF)...")}
              className="px-4 py-2.5 rounded-xl bg-[#F3F4F6] hover:bg-white/[0.1] text-[#111827] text-xs font-semibold border border-[#E5E7EB] transition-all flex items-center gap-2"
            >
              <Download className="w-3.5 h-3.5 text-[#10B981]" />
              Export ESG Audit (PDF)
            </button>
          </div>
        </div>

        {/* SECTION-SPECIFIC REPORTS QUICK SWITCHER */}
        <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-white border border-[#E8ECF3] shadow-xs">
          <span className="text-xs font-bold text-gray-500 px-3 py-1">View Departmental Audits:</span>
          <Link
            href="/kitchen/reports"
            className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-colors flex items-center gap-1.5"
          >
            🍳 Kitchen Waste Audit
          </Link>
          <Link
            href="/factory/reports"
            className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 transition-colors flex items-center gap-1.5"
          >
            🏭 Factory Mass Balance
          </Link>
          <Link
            href="/ngo/reports"
            className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200 transition-colors flex items-center gap-1.5"
          >
            ❤️ NGO Relief & Integrity
          </Link>
          <span className="ml-auto text-xs font-semibold px-3 py-1 rounded-lg bg-emerald-600 text-white">
            ⭐ Multi-Facility ESG (Current)
          </span>
        </div>

        {/* ESG SCORE CARD (PROMINENT GAUGE) */}
        <div className="card p-6 sm:p-8 border-[#A7F3D0] bg-gradient-to-r from-white/[0.04] via-[#00D4AA]/[0.02] to-[#10B981]/[0.02]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Circular Gauge Representation */}
            <div className="lg:col-span-4 flex flex-col items-center justify-center p-6 rounded-2xl bg-[#F9FAFB] border border-[#E8ECF3] text-center relative">
              <div className="relative w-44 h-44 flex items-center justify-center">
                {/* SVG Progress Ring */}
                <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    fill="transparent"
                    stroke="rgba(255, 255, 255, 0.08)"
                    strokeWidth="10"
                  />
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    fill="transparent"
                    stroke="url(#esgGrad)"
                    strokeWidth="10"
                    strokeDasharray={2 * Math.PI * 50}
                    strokeDashoffset={2 * Math.PI * 50 * (1 - ESG_DATA.overallScore / 100)}
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient id="esgGrad" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#00D4AA" />
                      <stop offset="100%" stopColor="#10B981" />
                    </linearGradient>
                  </defs>
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-extrabold text-[#111827] font-mono-data">
                    {ESG_DATA.overallScore}
                  </span>
                  <span className="text-[11px] uppercase tracking-wider text-[#6B7280] font-bold">
                    out of 100
                  </span>
                </div>
              </div>

              <div className="mt-3">
                <div className="text-sm font-bold text-[#10B981]">Composite ESG Rating: &apos;A+&apos;</div>
                <div className="text-[11px] text-[#6B7280]">SEBI BRSR & GRI Aligned</div>
              </div>
            </div>

            {/* Three Sub-Scores */}
            <div className="lg:col-span-8 space-y-4">
              <div>
                <h2 className="text-xl font-bold text-[#111827]">Institutional ESG Performance Indices</h2>
                <p className="text-xs text-[#6B7280]">
                  Weighted scoring evaluating carbon abatement, hunger alleviation, and FSSAI traceability.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                {/* Environmental */}
                <div className="p-4 rounded-xl bg-[#ECFDF5] border border-[#A7F3D0]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-[#059669]">Environmental (E)</span>
                    <span className="text-lg font-mono-data font-bold text-[#111827]">
                      {ESG_DATA.environmentalScore}/100
                    </span>
                  </div>
                  <div className="w-full bg-[#F3F4F6] h-2 rounded-full overflow-hidden mb-2">
                    <div
                      className="bg-emerald-400 h-full rounded-full"
                      style={{ width: `${ESG_DATA.environmentalScore}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-[#6B7280]">
                    Scope 1 & 3 carbon cuts, landfill diversion, and water conservation.
                  </p>
                </div>

                {/* Social */}
                <div className="p-4 rounded-xl bg-[#ECFDF5] border border-[#A7F3D0]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-[#10B981]">Social (S)</span>
                    <span className="text-lg font-mono-data font-bold text-[#111827]">
                      {ESG_DATA.socialScore}/100
                    </span>
                  </div>
                  <div className="w-full bg-[#F3F4F6] h-2 rounded-full overflow-hidden mb-2">
                    <div
                      className="bg-[#34D399] h-full rounded-full"
                      style={{ width: `${ESG_DATA.socialScore}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-[#6B7280]">
                    Hot meal redistribution, NGO volunteer hours, and community health.
                  </p>
                </div>

                {/* Governance */}
                <div className="p-4 rounded-xl bg-[#FFF8EB] border border-[#FDE68A]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-amber-400">Governance (G)</span>
                    <span className="text-lg font-mono-data font-bold text-[#111827]">
                      {ESG_DATA.governanceScore}/100
                    </span>
                  </div>
                  <div className="w-full bg-[#F3F4F6] h-2 rounded-full overflow-hidden mb-2">
                    <div
                      className="bg-amber-400 h-full rounded-full"
                      style={{ width: `${ESG_DATA.governanceScore}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-[#6B7280]">
                    FSSAI regulatory audits, tamper-proof logs, and data completeness.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 1: ENVIRONMENTAL METRICS */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-[#111827] flex items-center gap-2">
                <Trees className="w-5 h-5 text-[#059669]" />
                Environmental Impact Ledger
              </h2>
              <p className="text-xs text-[#6B7280]">
                Standardized methodology utilizing EPA WARM emission factors (2.5 kg CO₂e / kg food waste)
              </p>
            </div>
            <span className="text-xs text-[#059669] bg-[#ECFDF5] px-3 py-1 rounded-lg border border-emerald-500/20 font-mono-data">
              EPA Methodology
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="card p-5 border-[#E8ECF3]">
              <div className="text-xs text-[#6B7280] font-medium mb-1">CO₂ Prevented</div>
              <div className="text-2xl font-black text-[#059669] font-mono-data mb-1">
                <CountUp end={2847} suffix=" Tons" />
              </div>
              <div className="text-[11px] text-[#6B7280] leading-tight">
                Equivalent to removing 618 passenger vehicles from roads for a year
              </div>
            </div>

            <div className="card p-5 border-[#E8ECF3]">
              <div className="text-xs text-[#6B7280] font-medium mb-1">Water Conserved</div>
              <div className="text-2xl font-black text-[#38BDF8] font-mono-data mb-1">
                {ESG_DATA.environmental.waterSavedLiters}
              </div>
              <div className="text-[11px] text-[#6B7280] leading-tight">
                Virtual water footprint embedded in agricultural crops saved
              </div>
            </div>

            <div className="card p-5 border-[#E8ECF3]">
              <div className="text-xs text-[#6B7280] font-medium mb-1">Energy Optimized</div>
              <div className="text-2xl font-black text-[#10B981] font-mono-data mb-1">
                {ESG_DATA.environmental.energyOptimizedKwh}
              </div>
              <div className="text-[11px] text-[#6B7280] leading-tight">
                Processing plant boiler & refrigeration peak efficiency savings
              </div>
            </div>

            <div className="card p-5 border-[#E8ECF3]">
              <div className="text-xs text-[#6B7280] font-medium mb-1">Diverted from Landfill</div>
              <div className="text-2xl font-black text-amber-400 font-mono-data mb-1">
                {ESG_DATA.environmental.wasteDivertedTons} Tons
              </div>
              <div className="text-[11px] text-[#6B7280] leading-tight">
                Organic fraction routed to biogas digesters and composting
              </div>
            </div>
          </div>

          {/* Area Chart: Monthly CO2 Prevention Trend (12 Months) */}
          <div className="card p-6 border-[#E8ECF3]">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-[#111827]">Monthly CO₂ Prevention Trend (Last 12 Months)</h3>
                <p className="text-xs text-[#6B7280]">Metric tons of CO₂ equivalent prevented across institutional partners</p>
              </div>
              <span className="text-xs text-[#059669] font-semibold font-mono-data">
                ↑ 98% Growth in Avoided Emissions
              </span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={ESG_DATA.monthlyCo2Trend}>
                  <defs>
                    <linearGradient id="co2Grad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                  <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} unit=" T" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1B2138",
                      borderColor: "rgba(255,255,255,0.12)",
                      borderRadius: "12px",
                      color: "#F1F5F9",
                      fontSize: "12px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="co2Tons"
                    stroke="#10B981"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#co2Grad)"
                    name="CO₂ Prevented (Tons)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* SECTION 2: SOCIAL METRICS */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-[#111827] flex items-center gap-2">
                <HeartHandshake className="w-5 h-5 text-rose-400" />
                Social Responsibility & Nutrition Delivery
              </h2>
              <p className="text-xs text-[#6B7280]">
                Empowering vulnerable communities with dignified, safe nutrition redistribution
              </p>
            </div>
            <span className="text-xs text-rose-400 bg-rose-500/10 px-3 py-1 rounded-lg border border-rose-500/20 font-mono-data">
              SDG-2: Zero Hunger
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="card p-5 border-[#E8ECF3]">
              <div className="text-xs text-[#6B7280] font-medium mb-1">Meals Redistributed</div>
              <div className="text-2xl font-black text-rose-400 font-mono-data mb-1">
                <CountUp end={ESG_DATA.social.mealsRedistributed} />
              </div>
              <div className="text-[11px] text-[#6B7280]">Wholesome cooked dishes served</div>
            </div>

            <div className="card p-5 border-[#E8ECF3]">
              <div className="text-xs text-[#6B7280] font-medium mb-1">People Benefited</div>
              <div className="text-2xl font-black text-[#111827] font-mono-data mb-1">
                {ESG_DATA.social.peopleBenefited}
              </div>
              <div className="text-[11px] text-[#6B7280]">Shelters, night relief, & orphanages</div>
            </div>

            <div className="card p-5 border-[#E8ECF3]">
              <div className="text-xs text-[#6B7280] font-medium mb-1">Active NGO Partners</div>
              <div className="text-2xl font-black text-[#10B981] font-mono-data mb-1">
                {ESG_DATA.social.activeNgoPartners}
              </div>
              <div className="text-[11px] text-[#6B7280]">Verified volunteer networks</div>
            </div>

            <div className="card p-5 border-[#E8ECF3]">
              <div className="text-xs text-[#6B7280] font-medium mb-1">Communities Reached</div>
              <div className="text-2xl font-black text-[#10B981] font-mono-data mb-1">
                18 Districts
              </div>
              <div className="text-[11px] text-[#6B7280]">Delhi-NCR, Maharashtra & UP</div>
            </div>
          </div>

          {/* Bar Chart: Monthly Meals Trend */}
          <div className="card p-6 border-[#E8ECF3]">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-[#111827]">Monthly Nourished Meals Delivered</h3>
                <p className="text-xs text-[#6B7280]">Consistent upward trajectory in community food security</p>
              </div>
              <span className="text-xs text-rose-400 font-semibold font-mono-data">
                5,532 Meals Last Month
              </span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ESG_DATA.monthlyCo2Trend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                  <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1B2138",
                      borderColor: "rgba(255,255,255,0.12)",
                      borderRadius: "12px",
                      color: "#F1F5F9",
                      fontSize: "12px",
                    }}
                  />
                  <Bar
                    dataKey="meals"
                    name="Cooked Meals Redistributed"
                    fill="#EC4899"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* SECTION 3: GOVERNANCE & FSSAI COMPLIANCE */}
        <div className="card p-6 border-[#E8ECF3]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-[#111827] flex items-center gap-2">
                <FileCheck2 className="w-5 h-5 text-amber-400" />
                Governance & Food Safety Assurance
              </h2>
              <p className="text-xs text-[#6B7280]">
                Auditable digital ledger complying with FSSAI Food Recovery and SEBI BRSR guidelines
              </p>
            </div>
            <span className="text-xs font-mono-data text-[#059669] font-bold">
              100% Verifiable
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="p-4 rounded-xl bg-[#FAFBFC] border border-[#F3F4F6]">
              <div className="text-xs text-[#6B7280] mb-1">FSSAI Compliance</div>
              <div className="text-2xl font-bold text-[#059669] font-mono-data">
                {ESG_DATA.governance.fssaiCompliancePct}%
              </div>
              <div className="text-[10px] text-[#6B7280] mt-1">Zero safety violations</div>
            </div>

            <div className="p-4 rounded-xl bg-[#FAFBFC] border border-[#F3F4F6]">
              <div className="text-xs text-[#6B7280] mb-1">Immutable Audit Logs</div>
              <div className="text-2xl font-bold text-[#111827] font-mono-data">
                {ESG_DATA.governance.auditLogsRecorded}
              </div>
              <div className="text-[10px] text-[#6B7280] mt-1">Cryptographic hashes</div>
            </div>

            <div className="p-4 rounded-xl bg-[#FAFBFC] border border-[#F3F4F6]">
              <div className="text-xs text-[#6B7280] mb-1">Data Completeness</div>
              <div className="text-2xl font-bold text-[#10B981] font-mono-data">
                {ESG_DATA.governance.dataCompletenessPct}%
              </div>
              <div className="text-[10px] text-[#6B7280] mt-1">Telemetry uptime</div>
            </div>

            <div className="p-4 rounded-xl bg-[#FAFBFC] border border-[#F3F4F6]">
              <div className="text-xs text-[#6B7280] mb-1">Traceability Coverage</div>
              <div className="text-2xl font-bold text-[#10B981] font-mono-data">
                {ESG_DATA.governance.traceabilityCoveragePct}%
              </div>
              <div className="text-[10px] text-[#6B7280] mt-1">Farm to consumer batching</div>
            </div>
          </div>
        </div>
    </div>
  );
}
