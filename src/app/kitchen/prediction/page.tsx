"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { PREDICTION_BREAKDOWN } from "@/lib/mockData";
import {
  BrainCircuit,
  Calendar,
  Sparkles,
  Check,
  RotateCcw,
  Lightbulb,
  AlertCircle,
  TrendingDown,
  Clock,
  Save,
  CheckCircle2,
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function KitchenPredictionPage() {
  const { managerOverride, saveManagerOverride } = useApp();
  const [selectedDate, setSelectedDate] = useState("2026-09-22");
  const [overrideActive, setOverrideActive] = useState(Boolean(managerOverride));
  const [overrideMeals, setOverrideMeals] = useState<number>(
    managerOverride ? managerOverride.meals : 840
  );
  const [overrideReason, setOverrideReason] = useState(
    managerOverride ? managerOverride.reason : "Known attendance change"
  );
  const [feedbackSaved, setFeedbackSaved] = useState(false);

  // Friday pattern mini data
  const fridayPatternData = [
    { friday: "Aug 29", wastePct: 14 },
    { friday: "Sep 05", wastePct: 16 },
    { friday: "Sep 12", wastePct: 15 },
    { friday: "Sep 19", wastePct: 18 },
  ];

  const handleSaveOverride = (e: React.FormEvent) => {
    e.preventDefault();
    saveManagerOverride(overrideMeals, overrideReason);
    setFeedbackSaved(true);
    setTimeout(() => setFeedbackSaved(false), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4" style={{ borderBottom: "1px solid #E8ECF3" }}>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#10B981" }}>
              AI Demand Forecasting Engine
            </span>
            <span style={{ color: "#D1D5DB" }}>•</span>
            <span className="text-xs" style={{ color: "#9CA3AF" }}>IIT Delhi Central Mess</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight" style={{ color: "#111827" }}>
            Daily Demand & Portions Forecaster
          </h1>
        </div>

        {/* Date Selector */}
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm" style={{ background: "#FFFFFF", border: "1px solid #E8ECF3", boxShadow: "0 1px 2px rgba(0,0,0,0.04)" }}>
          <Calendar className="w-4 h-4" style={{ color: "#10B981" }} />
          <span style={{ color: "#9CA3AF" }}>Forecast Date:</span>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="bg-transparent font-semibold focus:outline-none cursor-pointer text-sm"
            style={{ color: "#111827" }}
          />
        </div>
      </div>

      {/* TOP SECTION — CURRENT PREDICTION BIG CARD */}
      <div className="card p-6 sm:p-8 relative overflow-hidden" style={{ borderLeft: "4px solid #10B981" }}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center gap-2">
              <span className="badge badge-indigo flex items-center gap-1.5" style={{ padding: "4px 12px" }}>
                <BrainCircuit className="w-3.5 h-3.5" />
                Deep Learning Demand Model v4.2
              </span>
              <span className="text-xs" style={{ color: "#9CA3AF" }}>Updated 45 mins ago</span>
            </div>

            <div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight" style={{ color: "#111827" }}>
                Tomorrow:{" "}
                <span className="font-mono-data" style={{ color: "#10B981" }}>
                  {managerOverride ? managerOverride.meals : 863} meals
                </span>{" "}
                recommended
              </h2>
              <p className="text-sm mt-1" style={{ color: "#6B7280" }}>
                Estimated overall daily attendance across Breakfast, Lunch, and Dinner.
              </p>
            </div>

            {/* Factors Pills */}
            <div>
              <div className="text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: "#9CA3AF" }}>
                Influencing Context Factors
              </div>
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="px-3 py-1.5 rounded-lg font-medium" style={{ background: "#F9FAFB", border: "1px solid #E5E7EB", color: "#374151" }}>
                  📅 Monday
                </span>
                <span className="px-3 py-1.5 rounded-lg font-medium" style={{ background: "#F9FAFB", border: "1px solid #E5E7EB", color: "#374151" }}>
                  🔄 Post-weekend
                </span>
                <span className="px-3 py-1.5 rounded-lg font-medium" style={{ background: "#F9FAFB", border: "1px solid #E5E7EB", color: "#374151" }}>
                  🏫 No holiday
                </span>
                <span className="px-3 py-1.5 rounded-lg font-bold" style={{ background: "#FFF8EB", border: "1px solid #FDE68A", color: "#92400E" }}>
                  📝 Exam week (+12% attendance)
                </span>
                <span className="px-3 py-1.5 rounded-lg font-medium" style={{ background: "#EFF6FF", border: "1px solid #BFDBFE", color: "#1E40AF" }}>
                  🌧️ Rain forecast (-5% dinner dine-in)
                </span>
              </div>
            </div>
          </div>

          {/* Confidence Gauge */}
          <div className="lg:col-span-4 p-5 rounded-2xl text-center space-y-3" style={{ background: "#F9FAFB", border: "1px solid #E8ECF3" }}>
            <div className="text-xs font-semibold" style={{ color: "#9CA3AF" }}>Model Confidence Score</div>
            <div className="text-4xl font-black font-mono-data" style={{ color: "#111827" }}>87%</div>
            <div className="w-full rounded-full h-2.5 overflow-hidden" style={{ background: "#E5E7EB" }}>
              <div
                className="h-2.5 rounded-full"
                style={{ width: "87%", background: "linear-gradient(90deg, #10B981, #10B981)" }}
              />
            </div>
            <div className="text-[11px] flex items-center justify-between" style={{ color: "#9CA3AF" }}>
              <span>Low Variance Risk</span>
              <span className="font-semibold" style={{ color: "#059669" }}>High Precision</span>
            </div>
          </div>
        </div>
      </div>

      {/* PREDICTION BREAKDOWN TABLE */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="section-title">Meal-by-Meal Prediction Breakdown</h3>
            <p className="section-subtitle">
              Granular AI forecast compared with last week&apos;s baseline and recommended prep target
            </p>
          </div>
          <span className="badge badge-success font-mono-data">
            Total Target: 1,963 meals
          </span>
        </div>

        <table className="data-table">
          <thead>
            <tr>
              <th>Meal Service</th>
              <th>Predicted Diners</th>
              <th>Last Week (Same Day)</th>
              <th>AI Chef Suggestion</th>
              <th style={{ textAlign: "right" }}>Variance</th>
            </tr>
          </thead>
          <tbody>
            {PREDICTION_BREAKDOWN.map((row) => (
              <tr key={row.meal}>
                <td className="font-bold" style={{ color: "#111827" }}>{row.meal}</td>
                <td className="font-mono-data font-semibold" style={{ color: "#111827" }}>
                  {row.predicted}
                </td>
                <td className="font-mono-data" style={{ color: "#9CA3AF" }}>{row.lastWeek}</td>
                <td>
                  <span className="badge badge-success">
                    {row.suggestion}
                  </span>
                </td>
                <td className="font-mono-data text-right" style={{ color: "#059669" }}>
                  {row.predicted > row.lastWeek
                    ? `+${row.predicted - row.lastWeek} meals`
                    : `${row.predicted - row.lastWeek} meals`}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* TWO COLUMN ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* MANAGER OVERRIDE (7 cols) */}
        <div className="lg:col-span-7 card p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="section-title flex items-center gap-2">
                Manager Manual Override
                {managerOverride && (
                  <span className="badge badge-warning">Active Override</span>
                )}
              </h3>
              <p className="section-subtitle">
                Empower human judgment when you have special local knowledge not yet in the data.
              </p>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={overrideActive}
                onChange={(e) => setOverrideActive(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#10B981]" style={{ background: overrideActive ? undefined : "#D1D5DB" }}></div>
            </label>
          </div>

          {overrideActive ? (
            <form onSubmit={handleSaveOverride} className="space-y-4 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: "#6B7280" }}>
                    Adjusted Lunch Meals
                  </label>
                  <input
                    type="number"
                    value={overrideMeals}
                    onChange={(e) => setOverrideMeals(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl font-mono-data text-sm focus:outline-none"
                    style={{ background: "#F9FAFB", border: "1px solid #E5E7EB", color: "#111827" }}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: "#6B7280" }}>
                    Override Justification
                  </label>
                  <select
                    value={overrideReason}
                    onChange={(e) => setOverrideReason(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl text-xs focus:outline-none"
                    style={{ background: "#F9FAFB", border: "1px solid #E5E7EB", color: "#111827" }}
                  >
                    <option value="Known attendance change">Known attendance change</option>
                    <option value="Special event">Special event (Campus Fest / Guest Visit)</option>
                    <option value="Holiday">Holiday / Weekend travel</option>
                    <option value="Other">Other departmental schedule</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <p className="text-[11px] max-w-sm" style={{ color: "#9CA3AF" }}>
                  ℹ️ Your override will be recorded and used to retrain the neural network model weights for next week.
                </p>
                <button
                  type="submit"
                  className="btn-primary"
                >
                  <Save className="w-3.5 h-3.5" />
                  Save Override
                </button>
              </div>

              {feedbackSaved && (
                <div className="alert-banner alert-banner-success">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: "#059669" }} />
                    <span>
                      Override successfully recorded! Model adjusted to {overrideMeals} meals. Kitchen preparation sheets refreshed.
                    </span>
                  </div>
                </div>
              )}
            </form>
          ) : (
            <div className="p-6 rounded-xl text-center space-y-2" style={{ background: "#F9FAFB", border: "1px dashed #E5E7EB" }}>
              <Sparkles className="w-6 h-6 mx-auto opacity-70" style={{ color: "#10B981" }} />
              <div className="text-xs font-semibold" style={{ color: "#111827" }}>
                Autonomous AI Planning Active
              </div>
              <p className="text-[11px] max-w-md mx-auto" style={{ color: "#9CA3AF" }}>
                Toggle the switch above if warden or mess staff have specific knowledge of hostel events, symposiums, or sports meets.
              </p>
            </div>
          )}
        </div>

        {/* AI INSIGHT PANEL (5 cols) */}
        <div className="lg:col-span-5 card p-6" style={{ background: "linear-gradient(135deg, #ECFDF5 0%, #FFFFFF 100%)", borderColor: "#A7F3D0" }}>
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-5 h-5" style={{ color: "#F59E0B" }} />
            <h3 className="text-sm font-bold" style={{ color: "#111827" }}>Pattern Recognition Engine</h3>
          </div>

          <div className="p-4 rounded-xl space-y-2 mb-4" style={{ background: "#FFFFFF", border: "1px solid #E5E7EB" }}>
            <div className="text-xs font-bold flex items-center gap-1.5" style={{ color: "#111827" }}>
              <span className="w-2 h-2 rounded-full" style={{ background: "#F59E0B" }} />
              Pattern detected: Friday Rice Waste Spike
            </div>
            <p className="text-xs leading-relaxed" style={{ color: "#6B7280" }}>
              Every Friday, basmati rice leftover increases by <strong style={{ color: "#D97706" }}>~15% to 18%</strong> because students skip dinner for off-campus outings.
            </p>
            <div className="pt-1 text-xs font-semibold" style={{ color: "#10B981" }}>
              💡 Suggestion: Reduce rice batch preparation by 10% on Fridays.
            </div>
          </div>

          <div className="text-xs font-semibold mb-2" style={{ color: "#9CA3AF" }}>
            Last 4 Fridays Waste Rate (% of prep):
          </div>
          <div className="h-32 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={fridayPatternData}>
                <XAxis dataKey="friday" stroke="#9CA3AF" fontSize={10} tickLine={false} axisLine={{ stroke: "#E5E7EB" }} />
                <YAxis stroke="#9CA3AF" fontSize={10} tickLine={false} unit="%" axisLine={{ stroke: "#E5E7EB" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1B2138",
                    borderColor: "rgba(255,255,255,0.12)",
                    borderRadius: "8px",
                    fontSize: "11px",
                    color: "#F1F5F9",
                  }}
                />
                <Bar dataKey="wastePct" fill="#F59E0B" radius={[4, 4, 0, 0]} name="Rice Waste %" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
