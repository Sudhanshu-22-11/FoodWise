"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useApp, getDonorTier } from "@/context/AppContext";
import {
  INSTITUTIONS,
  DEMAND_VS_ACTUAL_14DAYS,
  WEEKLY_WASTE_BY_CATEGORY,
  TODAY_MEAL_PLAN,
  KITCHEN_ALERTS,
  MATCHED_NGOS,
} from "@/lib/mockData";
import {
  TrendingUp,
  TrendingDown,
  Sparkles,
  AlertTriangle,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Award,
  Trophy,
  Trees,
  CheckCircle2,
  Calendar,
  Utensils,
  Lightbulb,
  Check,
  FileText,
  ChevronDown,
  Bell,
  ArrowUpRight,
  Target,
  Leaf,
  Package,
  Zap,
  HeartHandshake,
  Star,
  Navigation,
  MapPin,
  CircleDot,
  Truck,
  ExternalLink,
  Clock,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import NgoDirectionModal, { NgoDirectionData } from "@/components/common/NgoDirectionModal";

// Waste distribution data for donut chart
const WASTE_DISTRIBUTION = [
  { name: "Rice / Grains", value: 38, color: "#10B981" },
  { name: "Curry / Dal", value: 27, color: "#F59E0B" },
  { name: "Vegetables", value: 22, color: "#10B981" },
  { name: "Bread / Roti", value: 13, color: "#F97316" },
];

// NGO location coordinates for Google Maps
const NGO_COORDS: Record<string, { lat: number; lng: number; traffic: "low" | "moderate" | "heavy" }> = {
  "ngo-1": { lat: 28.5398, lng: 77.1994, traffic: "low" },
  "ngo-2": { lat: 28.5589, lng: 77.2028, traffic: "moderate" },
  "ngo-3": { lat: 28.5672, lng: 77.1989, traffic: "heavy" },
};

export default function KitchenDashboardPage() {
  const { setIsNotificationOpen, managerOverride, isOverrideActive, saveManagerOverride, unreadCount, rankedHotels, donorFeedback, getHotelRank } = useApp();
  const [selectedShift, setSelectedShift] = useState<"Morning" | "Afternoon" | "Evening">("Afternoon");
  const [appliedSuggestion, setAppliedSuggestion] = useState<string | null>(null);
  const [selectedNgoDirection, setSelectedNgoDirection] = useState<NgoDirectionData | null>(null);
  const [timePeriod, setTimePeriod] = useState<"Today" | "This Week" | "This Month">("This Week");
  const [isPeriodDropdownOpen, setIsPeriodDropdownOpen] = useState(false);

  // Kitchen's own data — IIT Delhi Central Mess is h-2
  const kitchenHotelId = "h-2";
  const kitchenHotel = rankedHotels.find((h) => h.id === kitchenHotelId);
  const kitchenRank = getHotelRank(kitchenHotelId);
  const kitchenTier = kitchenHotel ? getDonorTier(kitchenHotel.totalPoints) : "Bronze";
  const kitchenFeedback = donorFeedback.filter((f) => f.hotelId === kitchenHotelId);

  const TIER_COLORS: Record<string, { color: string; bg: string; border: string; gradient: string }> = {
    Platinum: { color: "#818CF8", bg: "#EEF2FF", border: "#C7D2FE", gradient: "linear-gradient(135deg, #818CF8, #6366F1)" },
    Gold: { color: "#F59E0B", bg: "#FFFBEB", border: "#FDE68A", gradient: "linear-gradient(135deg, #F59E0B, #D97706)" },
    Silver: { color: "#9CA3AF", bg: "#F9FAFB", border: "#E5E7EB", gradient: "linear-gradient(135deg, #9CA3AF, #6B7280)" },
    Bronze: { color: "#D97706", bg: "#FFF8EB", border: "#FDE68A", gradient: "linear-gradient(135deg, #D97706, #B45309)" },
  };

  return (
    <div className="space-y-6">
      {/* ═══ TOP HEADER BAR ═══ */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[26px] font-bold tracking-tight" style={{ color: "#111827" }}>
            Dashboard
          </h1>
          <p className="text-sm" style={{ color: "#6B7280" }}>
            Welcome back, Dr. Sharma. Overview for {timePeriod.toLowerCase()}.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Time Period Selector */}
          <div className="relative">
            <button
              onClick={() => setIsPeriodDropdownOpen(!isPeriodDropdownOpen)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium cursor-pointer transition-all hover:bg-gray-50"
              style={{
                background: "#FFFFFF",
                border: "1px solid #E8ECF3",
                color: "#374151",
                boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
              }}
            >
              <Calendar className="w-4 h-4 text-emerald-600" />
              <span>{timePeriod}</span>
              <ChevronDown className={`w-3.5 h-3.5 text-[#9CA3AF] transition-transform ${isPeriodDropdownOpen ? "rotate-180" : ""}`} />
            </button>

            {isPeriodDropdownOpen && (
              <div
                className="absolute right-0 mt-1.5 w-36 bg-white rounded-xl shadow-xl border border-[#E8ECF3] py-1 z-30 animate-in fade-in slide-in-from-top-1 duration-150"
              >
                {(["Today", "This Week", "This Month"] as const).map((period) => (
                  <button
                    key={period}
                    onClick={() => {
                      setTimePeriod(period);
                      setIsPeriodDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-2 text-xs font-semibold flex items-center justify-between hover:bg-emerald-50 hover:text-emerald-700 transition-colors ${
                      timePeriod === period ? "text-emerald-600 bg-emerald-50/50 font-bold" : "text-[#4B5563]"
                    }`}
                  >
                    <span>{period}</span>
                    {timePeriod === period && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Export Report */}
          <button
            onClick={() => alert(`Exporting ${timePeriod} Kitchen Waste & Production Audit Report (PDF)...`)}
            className="btn-primary"
          >
            <FileText className="w-4 h-4" />
            Export Report
          </button>
        </div>
      </div>

      {/* ═══ KPI STAT CARDS ROW (4 CARDS) ═══ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Prediction */}
        <div className="stat-card stat-card-indigo p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[13px] font-medium" style={{ color: "#6B7280" }}>
              {timePeriod === "Today" ? "Today's Prediction" : timePeriod === "This Week" ? "Weekly Target" : "Monthly Target"}
            </span>
            <div className="icon-container icon-container-indigo">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>
          <div className="text-[28px] font-extrabold font-mono-data mb-1" style={{ color: "#111827" }}>
            {timePeriod === "Today"
              ? (isOverrideActive && managerOverride ? managerOverride.meals.toLocaleString() : "847")
              : timePeriod === "This Week"
              ? "5,820"
              : "24,650"}
          </div>
          <div className="flex items-center gap-1.5">
            <span className="trend-up">
              <ArrowUpRight className="w-3.5 h-3.5" />
              +8.1% vs last period
            </span>
          </div>
        </div>

        {/* Card 2: Waste Prevented */}
        <div className="stat-card stat-card-emerald p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[13px] font-medium" style={{ color: "#6B7280" }}>
              Waste Prevented
            </span>
            <div className="icon-container icon-container-green">
              <TrendingDown className="w-5 h-5" />
            </div>
          </div>
          <div className="text-[28px] font-extrabold font-mono-data mb-1" style={{ color: "#111827" }}>
            {timePeriod === "Today" ? "73" : timePeriod === "This Week" ? "511" : "2,190"}{" "}
            <span className="text-[18px] font-bold" style={{ color: "#6B7280" }}>kg</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="trend-up">
              <ArrowUpRight className="w-3.5 h-3.5" />
              +14.2% vs last period
            </span>
          </div>
        </div>

        {/* Card 3: Surplus Available */}
        <div className="stat-card stat-card-amber p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[13px] font-medium" style={{ color: "#6B7280" }}>
              {timePeriod === "Today" ? "Active Surplus" : "Total Surplus Routed"}
            </span>
            <div className="icon-container icon-container-amber">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div className="text-[28px] font-extrabold font-mono-data mb-1" style={{ color: "#111827" }}>
            {timePeriod === "Today" ? "12" : timePeriod === "This Week" ? "84" : "365"}{" "}
            <span className="text-[18px] font-bold" style={{ color: "#6B7280" }}>kg</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="trend-up">
              <ArrowUpRight className="w-3.5 h-3.5" />
              +3.2% vs last period
            </span>
          </div>
        </div>

        {/* Card 4: CO₂ Impact */}
        <div className="stat-card stat-card-green p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[13px] font-medium" style={{ color: "#6B7280" }}>
              CO₂ Prevented
            </span>
            <div className="icon-container" style={{ background: "#ECFDF5", color: "#059669" }}>
              <Leaf className="w-5 h-5" />
            </div>
          </div>
          <div className="text-[28px] font-extrabold font-mono-data mb-1" style={{ color: "#111827" }}>
            {timePeriod === "Today" ? "0.47" : timePeriod === "This Week" ? "3.29" : "14.1"}{" "}
            <span className="text-[18px] font-bold" style={{ color: "#6B7280" }}>tons</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="trend-up">
              <ArrowUpRight className="w-3.5 h-3.5" />
              +22.7% vs last period
            </span>
          </div>
        </div>
      </div>

      {/* ═══ ALERT BANNERS ═══ */}
      <div className="space-y-3">
        {/* Warning Alert */}
        <div className="alert-banner alert-banner-warning">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-4 h-4 shrink-0" style={{ color: "#D97706" }} />
            <span>
              <strong>AI Prediction Updated:</strong> Tomorrow&apos;s lunch target revised to{" "}
              <span className="font-bold underline">847 meals</span> (was 920). 73 meal prep buffer trimmed based on exam schedule.
            </span>
          </div>
          <Link
            href="/kitchen/prediction"
            className="px-3 py-1.5 rounded-lg text-[12px] font-bold whitespace-nowrap transition-colors"
            style={{ background: "#FDE68A", color: "#92400E" }}
          >
            Review Prediction →
          </Link>
        </div>

        {/* Danger Alert */}
        <div className="alert-banner alert-banner-danger">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0" style={{ color: "#DC2626" }} />
            <span>
              <strong>Surplus Action Required:</strong> 2 surplus batches (Steamed Rice 62kg, Mixed Veg 18kg) need verification or distribution within 3 hours.
            </span>
          </div>
          <Link
            href="/kitchen/surplus"
            className="px-3 py-1.5 rounded-lg text-[12px] font-bold whitespace-nowrap transition-colors"
            style={{ background: "#FECACA", color: "#991B1B" }}
          >
            Action Surplus →
          </Link>
        </div>
      </div>

      {/* ═══ AI INSIGHT CARDS (2 col) ═══ */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5" style={{ color: "#F59E0B" }} />
            <h2 className="section-title">AI Operational Insights</h2>
          </div>
          <span className="text-[12px] font-medium font-mono-data" style={{ color: "#9CA3AF" }}>
            2 High-Impact Recommendations
          </span>
        </div>

        {appliedSuggestion && (
          <div className="alert-banner alert-banner-success">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 shrink-0" style={{ color: "#059669" }} />
              <span>{appliedSuggestion}</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Insight 1: Friday Rice Waste */}
          <div className="card p-5" style={{ borderLeft: "3px solid #F59E0B" }}>
            <div className="flex items-start justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full" style={{ background: "#F59E0B" }} />
                <h3 className="text-[13px] font-bold" style={{ color: "#111827" }}>
                  💡 Friday rice waste is 15% higher than other days
                </h3>
              </div>
              <span className="badge badge-warning">Recurrent Pattern</span>
            </div>
            <p className="text-[12px] leading-relaxed mb-3" style={{ color: "#6B7280" }}>
              Students regularly dine out on Friday evenings. AI recommends scaling down basmati rice batch preparation by 10% on Fridays to save ₹1,420 weekly.
            </p>

            {/* Mini bar chart */}
            <div
              className="flex items-center gap-3 p-3 rounded-xl mb-3"
              style={{ background: "#F9FAFB", border: "1px solid #F3F4F6" }}
            >
              <div className="text-[10px] font-medium whitespace-nowrap" style={{ color: "#9CA3AF" }}>
                Fri Delta:
              </div>
              <div className="flex items-end gap-1.5 h-6 flex-1">
                {[12, 14, 11, 15, 28, 10, 9].map((val, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-t"
                    style={{
                      height: `${(val / 28) * 100}%`,
                      background: i === 4 ? "#F59E0B" : "#E5E7EB",
                    }}
                    title={`Day ${i + 1}: ${val}kg`}
                  />
                ))}
              </div>
              <span className="text-[10px] font-mono-data font-bold" style={{ color: "#D97706" }}>
                +15% spike
              </span>
            </div>

            <div
              className="flex items-center justify-between pt-3"
              style={{ borderTop: "1px solid #F3F4F6" }}
            >
              <span className="text-[12px]" style={{ color: "#9CA3AF" }}>
                Est. Monthly Savings: ₹5,680
              </span>
              <button
                onClick={() => {
                  saveManagerOverride(780, "Auto-applied Friday 10% rice preparation trim");
                  setAppliedSuggestion(
                    "Friday rice trim applied! Next Friday's rice prep batch reduced by 10% (target: 780 meals)."
                  );
                  setTimeout(() => setAppliedSuggestion(null), 5000);
                }}
                className="btn-primary"
                style={{ padding: "6px 14px", fontSize: "12px" }}
              >
                Apply Suggestion
              </button>
            </div>
          </div>

          {/* Insight 2: Exam Week */}
          <div className="card p-5" style={{ borderLeft: "3px solid #10B981" }}>
            <div className="flex items-start justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full" style={{ background: "#10B981" }} />
                <h3 className="text-[13px] font-bold" style={{ color: "#111827" }}>
                  💡 Attendance drops 23% during exam week late dinners
                </h3>
              </div>
              <span className="badge badge-indigo">Academic Calendar</span>
            </div>
            <p className="text-[12px] leading-relaxed mb-3" style={{ color: "#6B7280" }}>
              Students study late in library blocks and skip full plated dinners in favor of quick snacks. Pre-bake 80 portion buffers into morning breakfast instead.
            </p>

            {/* Mini bar chart */}
            <div
              className="flex items-center gap-3 p-3 rounded-xl mb-3"
              style={{ background: "#F9FAFB", border: "1px solid #F3F4F6" }}
            >
              <div className="text-[10px] font-medium whitespace-nowrap" style={{ color: "#9CA3AF" }}>
                Dine-in:
              </div>
              <div className="flex items-end gap-1.5 h-6 flex-1">
                {[95, 92, 94, 71, 68, 70, 91].map((val, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-t"
                    style={{
                      height: `${val}%`,
                      background: i >= 3 && i <= 5 ? "#10B981" : "#E5E7EB",
                    }}
                    title={`Day ${i + 1}: ${val}%`}
                  />
                ))}
              </div>
              <span className="text-[10px] font-mono-data font-bold" style={{ color: "#10B981" }}>
                -23% late dinner
              </span>
            </div>

            <div
              className="flex items-center justify-between pt-3"
              style={{ borderTop: "1px solid #F3F4F6" }}
            >
              <span className="text-[12px]" style={{ color: "#9CA3AF" }}>
                Est. Food Rescued: 45 kg
              </span>
              <button
                onClick={() => {
                  saveManagerOverride(650, "Adjusted for library study shift during exam week");
                  setAppliedSuggestion(
                    "Exam week late dining buffer applied! Dinner batch target trimmed to 650 meals."
                  );
                  setTimeout(() => setAppliedSuggestion(null), 5000);
                }}
                className="btn-primary"
                style={{ padding: "6px 14px", fontSize: "12px" }}
              >
                Apply Suggestion
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ MAIN CONTENT GRID (Chart Left + Donut + Table Right) ═══ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT: Line Chart (7 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Prediction Accuracy Chart */}
          <div id="prediction-chart" className="card p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-5">
              <div>
                <h3 className="section-title flex items-center gap-2">
                  Prediction vs Actual
                  <span
                    className="badge badge-success"
                    style={{ fontSize: "11px" }}
                  >
                    91.3% accurate
                  </span>
                </h3>
                <p className="section-subtitle">
                  Full 14-day performance comparison
                </p>
              </div>
              <div className="flex items-center gap-4 text-[12px]">
                <span className="flex items-center gap-1.5" style={{ color: "#3B82F6" }}>
                  <span
                    className="w-3 h-1 rounded-full"
                    style={{ background: "#3B82F6" }}
                  />
                  AI Predicted
                </span>
                <span className="flex items-center gap-1.5" style={{ color: "#10B981" }}>
                  <span
                    className="w-3 h-1 rounded-full"
                    style={{ background: "#10B981" }}
                  />
                  Actual Consumed
                </span>
              </div>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={DEMAND_VS_ACTUAL_14DAYS}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                  <XAxis
                    dataKey="day"
                    stroke="#9CA3AF"
                    fontSize={11}
                    tickLine={false}
                    axisLine={{ stroke: "#E5E7EB" }}
                  />
                  <YAxis
                    stroke="#9CA3AF"
                    fontSize={11}
                    tickLine={false}
                    axisLine={{ stroke: "#E5E7EB" }}
                    domain={["dataMin - 50", "dataMax + 50"]}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1B2138",
                      borderColor: "rgba(255,255,255,0.12)",
                      borderRadius: "12px",
                      color: "#F1F5F9",
                      fontSize: "12px",
                      boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="predicted"
                    stroke="#3B82F6"
                    strokeWidth={2.5}
                    dot={{ r: 3, fill: "#3B82F6" }}
                    activeDot={{ r: 6 }}
                    name="Predicted Meals"
                  />
                  <Line
                    type="monotone"
                    dataKey="actual"
                    stroke="#10B981"
                    strokeWidth={2.5}
                    dot={{ r: 3, fill: "#10B981" }}
                    activeDot={{ r: 6 }}
                    name="Actual Meals"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div
              className="mt-4 pt-3 flex items-center justify-between text-[12px]"
              style={{ borderTop: "1px solid #F3F4F6", color: "#9CA3AF" }}
            >
              <span>💡 Model incorporates exam timetables, weekend migration, and weather telemetry.</span>
              <Link
                href="/kitchen/prediction"
                className="font-semibold"
                style={{ color: "#10B981" }}
              >
                Explore Factors →
              </Link>
            </div>
          </div>

          {/* Waste by Category Bar Chart */}
          <div id="waste-chart" className="card p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="section-title">Daily Waste by Category</h3>
                <p className="section-subtitle">
                  Stacked breakdown (kg) across 7 days. Notice Friday rice spike.
                </p>
              </div>
              <span className="badge badge-warning">Rice is #1 waste stream</span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={WEEKLY_WASTE_BY_CATEGORY}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                  <XAxis
                    dataKey="day"
                    stroke="#9CA3AF"
                    fontSize={11}
                    tickLine={false}
                    axisLine={{ stroke: "#E5E7EB" }}
                  />
                  <YAxis
                    stroke="#9CA3AF"
                    fontSize={11}
                    tickLine={false}
                    axisLine={{ stroke: "#E5E7EB" }}
                  />
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
                  <Bar dataKey="rice" name="Basmati Rice" fill="#10B981" stackId="a" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="curry" name="Curry / Dal" fill="#F59E0B" stackId="a" />
                  <Bar dataKey="bread" name="Roti / Bread" fill="#F97316" stackId="a" />
                  <Bar dataKey="veg" name="Vegetables" fill="#10B981" stackId="a" />
                  <Bar dataKey="other" name="Other" fill="#D1D5DB" stackId="a" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Waste Distribution Donut */}
          <div className="card p-5">
            <div className="mb-3">
              <h3 className="text-[16px] font-bold" style={{ color: "#111827" }}>
                Waste Sources
              </h3>
              <p className="text-[12px]" style={{ color: "#9CA3AF" }}>
                By food category
              </p>
            </div>

            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={WASTE_DISTRIBUTION}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="none"
                  >
                    {WASTE_DISTRIBUTION.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1B2138",
                      borderColor: "rgba(255,255,255,0.12)",
                      borderRadius: "12px",
                      color: "#F1F5F9",
                      fontSize: "12px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Legend */}
            <div className="space-y-2 mt-2">
              {WASTE_DISTRIBUTION.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-[13px]">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ background: item.color }}
                    />
                    <span style={{ color: "#374151" }}>{item.name}</span>
                  </div>
                  <span className="font-bold font-mono-data" style={{ color: "#111827" }}>
                    {item.value}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Today's Meal Plan */}
          <div id="meal-plan" className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-[16px] font-bold" style={{ color: "#111827" }}>
                  Today&apos;s Meal Plan
                </h3>
                <p className="text-[12px]" style={{ color: "#9CA3AF" }}>
                  Target vs Prepared portions
                </p>
              </div>
              <Link
                href="/kitchen/prediction"
                className="text-[12px] font-semibold"
                style={{ color: "#10B981" }}
              >
                Plan Tomorrow →
              </Link>
            </div>

            <div className="overflow-x-auto -mx-1 sm:mx-0">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#E8ECF3] text-[11px] uppercase tracking-wider text-[#6B7280]">
                    <th className="py-2.5 px-3 font-bold w-1/3">Meal</th>
                    <th className="py-2.5 px-2 font-bold text-center">Pred</th>
                    <th className="py-2.5 px-2 font-bold text-center">Prep</th>
                    <th className="py-2.5 px-2 font-bold text-center">Rem</th>
                    <th className="py-2.5 px-3 font-bold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F3F4F6]">
                  {TODAY_MEAL_PLAN.map((row) => (
                    <tr
                      key={row.meal}
                      className="hover:bg-[#F9FAFB] transition-colors"
                      style={{
                        background: row.highlight ? "#FFF8EB" : undefined,
                      }}
                    >
                      <td className="py-3 px-3 font-semibold text-[#111827]">
                        <div className="flex items-center gap-2">
                          <Utensils className="w-3.5 h-3.5 text-[#9CA3AF] shrink-0" />
                          <span className="truncate">{row.meal}</span>
                        </div>
                      </td>
                      <td className="py-3 px-2 font-mono-data text-center text-[#374151] font-medium">
                        {row.predicted}
                      </td>
                      <td className="py-3 px-2 font-mono-data text-center text-[#374151] font-medium">
                        {row.prepared > 0 ? row.prepared : "—"}
                      </td>
                      <td className="py-3 px-2 font-mono-data text-center">
                        {row.remaining > 0 ? (
                          <span
                            className="font-bold font-mono-data"
                            style={{ color: row.highlight ? "#D97706" : "#059669" }}
                          >
                            {row.remaining} kg
                          </span>
                        ) : (
                          <span className="text-[#9CA3AF]">—</span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <Link
                          href="/kitchen/prediction"
                          className="inline-block px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors bg-[#ECFDF5] hover:bg-[#D1FAE5] text-[#059669]"
                        >
                          Adjust
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Active Alerts */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[16px] font-bold flex items-center gap-2" style={{ color: "#111827" }}>
                Active Alerts
                <span
                  className="w-2 h-2 rounded-full animate-pulse"
                  style={{ background: "#EF4444" }}
                />
              </h3>
              <button
                onClick={() => setIsNotificationOpen(true)}
                className="text-[12px] font-semibold"
                style={{ color: "#10B981" }}
              >
                View all
              </button>
            </div>

            <div className="space-y-2.5">
              {KITCHEN_ALERTS.map((alert) => (
                <div
                  key={alert.id}
                  className="p-3 rounded-xl transition-all"
                  style={{
                    background: "#FAFBFC",
                    border: "1px solid #F3F4F6",
                  }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5">
                        {alert.severity === "urgent" && (
                          <span className="w-2 h-2 rounded-full" style={{ background: "#EF4444" }} />
                        )}
                        {alert.severity === "warning" && (
                          <span className="w-2 h-2 rounded-full" style={{ background: "#F59E0B" }} />
                        )}
                        {alert.severity === "info" && (
                          <span className="w-2 h-2 rounded-full" style={{ background: "#10B981" }} />
                        )}
                        <span className="text-[12px] font-semibold" style={{ color: "#111827" }}>
                          {alert.title}
                        </span>
                      </div>
                      <p className="text-[11px] leading-tight" style={{ color: "#6B7280" }}>
                        {alert.message}
                      </p>
                    </div>
                    <Link
                      href={alert.actionUrl}
                      className="px-2.5 py-1 rounded-lg text-[10px] font-bold whitespace-nowrap transition-colors"
                      style={{
                        background: "#ECFDF5",
                        color: "#10B981",
                        border: "1px solid #A7F3D0",
                      }}
                    >
                      {alert.actionLabel}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Gamification */}
          <div
            id="gamification"
            className="card p-5"
            style={{
              background: "linear-gradient(135deg, #ECFDF5 0%, #ECFDF5 100%)",
              border: "1px solid #A7F3D0",
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5" style={{ color: "#F59E0B" }} />
                <h3 className="text-[16px] font-bold" style={{ color: "#111827" }}>
                  Green League
                </h3>
              </div>
              <span className="font-bold font-mono-data" style={{ color: "#10B981" }}>
                847 Pts
              </span>
            </div>

            <div
              className="p-3 rounded-xl mb-3 flex items-center justify-between"
              style={{ background: "#FFFFFF", border: "1px solid #E5E7EB" }}
            >
              <div>
                <div className="text-[11px]" style={{ color: "#9CA3AF" }}>
                  Inter-Hostel Standing
                </div>
                <div className="text-[15px] font-bold" style={{ color: "#111827" }}>
                  Rank <span style={{ color: "#10B981" }}>#3</span> of 47 Messes
                </div>
              </div>
              <div
                className="text-right text-[11px] font-semibold"
                style={{ color: "#059669" }}
              >
                Top 5% Eco Efficiency
              </div>
            </div>

            <div className="flex flex-wrap gap-2 text-[10px]">
              <span className="badge badge-success" style={{ padding: "4px 8px" }}>
                <CheckCircle2 className="w-3 h-3" />
                Zero Waste Week
              </span>
              <span className="badge badge-indigo" style={{ padding: "4px 8px" }}>
                <Award className="w-3 h-3" />
                100 Meals Redistributed
              </span>
              <span className="badge badge-success" style={{ padding: "4px 8px" }}>
                <Trees className="w-3 h-3" />
                CO₂ Champion
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ NGO REDISTRIBUTION PARTNERS — CLICK FOR GOOGLE MAPS DIRECTIONS ═══ */}
      <div className="card p-6 border-[#A7F3D0]">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <HeartHandshake className="w-5 h-5 text-rose-400" />
              <h2 className="text-[18px] font-bold text-[#111827]">
                Verified NGO Partners — Click for Live Route & Traffic
              </h2>
            </div>
            <p className="text-xs text-[#6B7280]">
              Click any NGO to instantly see Google Maps directions, live traffic conditions, and exact delivery time for food redistribution.
            </p>
          </div>
          <Link
            href="/kitchen/surplus"
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0] hover:bg-[#D1FAE5] transition-all flex items-center gap-1.5 whitespace-nowrap"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Full Surplus & FSSAI Verification →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {MATCHED_NGOS.map((ngo) => {
            const coords = NGO_COORDS[ngo.id] || { lat: 28.5589, lng: 77.2028, traffic: "moderate" as const };
            const trafficColor =
              coords.traffic === "low" ? "#10B981" :
              coords.traffic === "moderate" ? "#F59E0B" : "#EF4444";
            const trafficBg =
              coords.traffic === "low" ? "#ECFDF5" :
              coords.traffic === "moderate" ? "#FFFBEB" : "#FEF2F2";
            const trafficBorder =
              coords.traffic === "low" ? "#A7F3D0" :
              coords.traffic === "moderate" ? "#FDE68A" : "#FECACA";
            const trafficLabel =
              coords.traffic === "low" ? "Clear Roads" :
              coords.traffic === "moderate" ? "Moderate Traffic" : "Heavy Traffic";

            return (
              <div
                key={ngo.id}
                onClick={() =>
                  setSelectedNgoDirection({
                    ...ngo,
                    lat: coords.lat,
                    lng: coords.lng,
                    trafficStatus: coords.traffic,
                  })
                }
                className="p-5 rounded-2xl border-2 border-[#E8ECF3] hover:border-[#10B981] bg-white hover:bg-emerald-50/30 cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02] group relative overflow-hidden"
              >
                {/* Traffic ribbon */}
                <div
                  className="absolute top-0 right-0 px-3 py-1 rounded-bl-xl text-[10px] font-bold text-white flex items-center gap-1"
                  style={{ background: trafficColor }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-white/70 animate-pulse" />
                  {trafficLabel}
                </div>

                {/* Name & Verified */}
                <div className="flex items-center gap-2 mb-3 pr-24">
                  <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center shrink-0">
                    <HeartHandshake className="w-5 h-5 text-rose-400" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-[14px] font-bold text-[#111827] group-hover:text-[#10B981] transition-colors truncate">
                      {ngo.name}
                    </h4>
                    <div className="flex items-center gap-1.5">
                      {ngo.verified && (
                        <span className="text-[10px] font-bold text-[#10B981] flex items-center gap-0.5">
                          <CheckCircle2 className="w-3 h-3" /> FSSAI Verified
                        </span>
                      )}
                      <span className="text-[10px] text-[#6B7280]">• {ngo.location}</span>
                    </div>
                  </div>
                </div>

                {/* Metrics Row */}
                <div className="grid grid-cols-3 gap-2 mb-3">
                  <div className="p-2 rounded-lg bg-[#F9FAFB] border border-[#F3F4F6] text-center">
                    <div className="text-[10px] text-[#9CA3AF]">Distance</div>
                    <div className="text-[15px] font-extrabold text-[#111827] font-mono-data">{ngo.distanceKm} <span className="text-[10px] font-normal text-[#6B7280]">km</span></div>
                  </div>
                  <div
                    className="p-2 rounded-lg border text-center"
                    style={{ background: trafficBg, borderColor: trafficBorder }}
                  >
                    <div className="text-[10px] text-[#9CA3AF]">Delivery Time</div>
                    <div className="text-[15px] font-extrabold font-mono-data" style={{ color: trafficColor }}>
                      {ngo.etaMinutes} <span className="text-[10px] font-normal">min</span>
                    </div>
                  </div>
                  <div className="p-2 rounded-lg bg-[#F9FAFB] border border-[#F3F4F6] text-center">
                    <div className="text-[10px] text-[#9CA3AF]">Capacity</div>
                    <div className="text-[15px] font-extrabold text-[#111827] font-mono-data">{ngo.capacityKg} <span className="text-[10px] font-normal text-[#6B7280]">kg</span></div>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-xs text-amber-500">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span className="font-bold">{ngo.rating}</span>
                    <span className="text-[#9CA3AF] text-[11px]">rating</span>
                  </div>
                  <span className="text-[11px] font-bold text-[#10B981] flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Navigation className="w-3.5 h-3.5" />
                    View Directions →
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Helper text */}
        <div className="mt-4 pt-3 border-t border-[#F3F4F6] flex items-center justify-between text-xs text-[#6B7280]">
          <span className="flex items-center gap-1.5">
            <Navigation className="w-3.5 h-3.5 text-[#10B981]" />
            Click any NGO card above — Google Maps directions & live traffic opens instantly.
          </span>
          <Link href="/kitchen/routes" className="text-[#10B981] font-semibold hover:underline flex items-center gap-1">
            Route Optimizer Map →
          </Link>
        </div>
      </div>

      {/* NGO DIRECTION MODAL — Google Maps with traffic & delivery time */}
      <NgoDirectionModal
        isOpen={!!selectedNgoDirection}
        onClose={() => setSelectedNgoDirection(null)}
        ngo={selectedNgoDirection}
      />

      {/* ═══ DONOR REPUTATION & NGO POINTS SECTION ═══ */}
      <div className="card p-6" style={{ border: "1px solid #FDE68A", background: "linear-gradient(135deg, #FFFEFB 0%, #FFFDF7 100%)" }}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Trophy className="w-5 h-5" style={{ color: "#F59E0B" }} />
              <h2 className="text-[18px] font-bold" style={{ color: "#111827" }}>
                Donor Reputation & NGO Points
              </h2>
            </div>
            <p className="text-xs" style={{ color: "#6B7280" }}>
              Your reputation score from NGO feedback — points update live when NGOs rate your donations
            </p>
          </div>
          <Link
            href="/ngo/feedback"
            className="px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap hover:scale-105"
            style={{ background: "#FFFBEB", color: "#D97706", border: "1px solid #FDE68A" }}
          >
            <Star className="w-3.5 h-3.5" />
            View Full Leaderboard →
          </Link>
        </div>

        {/* Your Stats Row */}
        {kitchenHotel && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-5">
            {/* Rank Card */}
            <div className="p-4 rounded-2xl text-center" style={{ background: TIER_COLORS[kitchenTier].gradient, boxShadow: `0 6px 20px ${TIER_COLORS[kitchenTier].color}35` }}>
              <div className="text-[10px] font-semibold text-white/80 uppercase tracking-wider mb-1">Your Rank</div>
              <div className="text-4xl font-extrabold text-white font-mono-data">#{kitchenRank}</div>
              <div className="text-[11px] font-bold text-white/90 mt-1">of {rankedHotels.length} donors</div>
            </div>

            {/* Points Card */}
            <div className="p-4 rounded-2xl text-center" style={{ background: "#FFFFFF", border: `2px solid ${TIER_COLORS[kitchenTier].border}` }}>
              <div className="text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color: "#9CA3AF" }}>Total Points</div>
              <div className="text-3xl font-extrabold font-mono-data" style={{ color: TIER_COLORS[kitchenTier].color }}>
                {kitchenHotel.totalPoints.toLocaleString()}
              </div>
              <div className="text-[11px] font-bold mt-1" style={{ color: TIER_COLORS[kitchenTier].color }}>
                {kitchenTier} Tier
              </div>
            </div>

            {/* Avg Rating */}
            <div className="p-4 rounded-2xl text-center" style={{ background: "#FFFFFF", border: "2px solid #FDE68A" }}>
              <div className="text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color: "#9CA3AF" }}>Avg Rating</div>
              <div className="flex items-center justify-center gap-1 mb-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-4 h-4" style={{ color: s <= Math.round(kitchenHotel.avgRating) ? "#F59E0B" : "#E5E7EB", fill: s <= Math.round(kitchenHotel.avgRating) ? "#F59E0B" : "none" }} />
                ))}
              </div>
              <div className="text-2xl font-extrabold font-mono-data" style={{ color: "#F59E0B" }}>{kitchenHotel.avgRating}</div>
              <div className="text-[10px]" style={{ color: "#9CA3AF" }}>({kitchenHotel.totalRatings} reviews)</div>
            </div>

            {/* Streak */}
            <div className="p-4 rounded-2xl text-center" style={{ background: "#FFFFFF", border: "2px solid #A7F3D0" }}>
              <div className="text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color: "#9CA3AF" }}>Donation Streak</div>
              <div className="text-3xl font-extrabold font-mono-data" style={{ color: "#059669" }}>{kitchenHotel.streak}</div>
              <div className="text-[11px] font-bold mt-1" style={{ color: "#059669" }}>consecutive days</div>
            </div>
          </div>
        )}

        {/* Mini Leaderboard + Recent Feedback side by side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Mini Leaderboard */}
          <div className="p-4 rounded-2xl" style={{ background: "#FFFFFF", border: "1px solid #E8ECF3" }}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[14px] font-bold flex items-center gap-2" style={{ color: "#111827" }}>
                <Trophy className="w-4 h-4" style={{ color: "#F59E0B" }} />
                Donor Leaderboard
              </h3>
              <span className="text-[10px] font-mono-data" style={{ color: "#9CA3AF" }}>Live Rankings</span>
            </div>
            <div className="space-y-2">
              {rankedHotels.slice(0, 6).map((hotel, idx) => {
                const tier = getDonorTier(hotel.totalPoints);
                const isYou = hotel.id === kitchenHotelId;
                return (
                  <div
                    key={hotel.id}
                    className="flex items-center gap-3 p-2.5 rounded-xl transition-all"
                    style={{
                      background: isYou ? `${TIER_COLORS[tier].color}10` : idx < 3 ? "#FAFBFC" : "transparent",
                      border: isYou ? `2px solid ${TIER_COLORS[tier].color}` : "1px solid transparent",
                    }}
                  >
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-[12px] font-extrabold shrink-0"
                      style={{
                        background: idx < 3 ? TIER_COLORS[tier].gradient : "#F3F4F6",
                        color: idx < 3 ? "#FFFFFF" : "#6B7280",
                      }}
                    >
                      {idx + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[12px] font-bold truncate" style={{ color: "#111827" }}>
                        {hotel.name} {isYou && <span className="text-[10px] font-bold" style={{ color: TIER_COLORS[tier].color }}>(You)</span>}
                      </div>
                      <div className="flex items-center gap-2 text-[10px]" style={{ color: "#9CA3AF" }}>
                        <span className="font-bold" style={{ color: TIER_COLORS[tier].color }}>{tier}</span>
                        <span>•</span>
                        <span>⭐ {hotel.avgRating}</span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-[13px] font-extrabold font-mono-data" style={{ color: TIER_COLORS[tier].color }}>
                        {hotel.totalPoints.toLocaleString()}
                      </div>
                      <div className="text-[9px]" style={{ color: "#9CA3AF" }}>pts</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Feedback */}
          <div className="p-4 rounded-2xl" style={{ background: "#FFFFFF", border: "1px solid #E8ECF3" }}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[14px] font-bold flex items-center gap-2" style={{ color: "#111827" }}>
                <Star className="w-4 h-4" style={{ color: "#F59E0B" }} />
                Recent Feedback Received
              </h3>
              <span className="text-[10px] font-mono-data" style={{ color: "#9CA3AF" }}>From NGO partners</span>
            </div>
            {kitchenFeedback.length > 0 ? (
              <div className="space-y-2.5">
                {kitchenFeedback.slice(0, 4).map((fb) => (
                  <div key={fb.id} className="p-3 rounded-xl" style={{ background: "#FAFBFC", border: "1px solid #F3F4F6" }}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star key={s} className="w-3 h-3" style={{ color: s <= Math.round(fb.overallRating) ? "#F59E0B" : "#E5E7EB", fill: s <= Math.round(fb.overallRating) ? "#F59E0B" : "none" }} />
                        ))}
                        <span className="text-[11px] font-bold ml-1" style={{ color: "#F59E0B" }}>{fb.overallRating}</span>
                      </div>
                      <span className="text-[12px] font-extrabold font-mono-data" style={{ color: "#059669" }}>+{fb.pointsAwarded} pts</span>
                    </div>
                    <p className="text-[11px] mb-1" style={{ color: "#6B7280" }}>{fb.comment}</p>
                    <div className="flex items-center gap-2 text-[10px]" style={{ color: "#9CA3AF" }}>
                      <span>🍽️ {fb.foodQuality}/5</span>
                      <span>📦 {fb.packaging}/5</span>
                      <span>⏰ {fb.timeliness}/5</span>
                      <span>📊 {fb.quantity}/5</span>
                      <span className="ml-auto">{fb.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <Star className="w-8 h-8 mx-auto mb-2" style={{ color: "#E5E7EB" }} />
                <div className="text-[13px] font-semibold" style={{ color: "#6B7280" }}>No feedback yet</div>
                <div className="text-[11px]" style={{ color: "#9CA3AF" }}>NGO partners will rate your food donations</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

