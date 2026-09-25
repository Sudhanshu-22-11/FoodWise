"use client";

import React, { useState } from "react";
import Link from "next/link";
import { FACTORY_STORAGE_UNITS } from "@/lib/mockData";
import {
  ThermometerSnowflake,
  AlertTriangle,
  CheckCircle2,
  Droplets,
  Activity,
  Wind,
  ShieldAlert,
  Flame,
  Clock,
  RefreshCw,
  Sliders,
  Sparkles,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const HOURLY_TEMP_TREND = [
  { time: "00:00", unitA: 6.1, unitB: 9.8, unitC: 18.2 },
  { time: "04:00", unitA: 6.0, unitB: 10.4, unitC: 18.0 },
  { time: "08:00", unitA: 6.2, unitB: 11.6, unitC: 18.3 },
  { time: "12:00", unitA: 6.5, unitB: 13.1, unitC: 18.5 },
  { time: "16:00", unitA: 6.3, unitB: 12.9, unitC: 18.4 },
  { time: "20:00", unitA: 6.2, unitB: 13.1, unitC: 18.4 },
];

export default function StorageMonitorPage() {
  const [selectedUnit, setSelectedUnit] = useState<string>("unit-b");
  const [chillTriggered, setChillTriggered] = useState(false);

  const activeUnit = FACTORY_STORAGE_UNITS.find((u) => u.id === selectedUnit) || FACTORY_STORAGE_UNITS[1];

  const handleTriggerBlastChill = () => {
    setChillTriggered(true);
    setTimeout(() => setChillTriggered(false), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#E8ECF3]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
              Cold Chain Preservation & HVAC Telemetry
            </span>
            <span className="text-[#D1D5DB]">•</span>
            <span className="text-xs text-[#9CA3AF]">IoT Microclimate Node</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#111827]">
            Cold Storage Climate Monitor
          </h1>
          <p className="text-xs sm:text-sm text-[#6B7280] mt-0.5">
            24/7 continuous temperature, humidity, ethylene ppm telemetry across all plant cold rooms
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/factory/spoilage"
            className="px-4 py-2.5 rounded-xl bg-rose-50 text-rose-700 text-xs font-bold border border-rose-200 hover:bg-rose-100 transition-colors flex items-center gap-1.5"
          >
            <Flame className="w-3.5 h-3.5 text-rose-600" />
            Predictive Spoilage Engine →
          </Link>
        </div>
      </div>

      {/* Critical Alert Bar if Unit B has Drift */}
      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-amber-900">
              Storage Unit B Temperature Excursion Detected (+3.1°C Drift)
            </div>
            <p className="text-[11px] text-amber-700 mt-0.5">
              Tomatoes (Roma VF) currently at 13.1°C (Safe limit: 10.0°C). Accelerated microbial soft-rot predicted in 31 hours.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {chillTriggered ? (
            <span className="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Compressor Overdrive Activated
            </span>
          ) : (
            <button
              onClick={handleTriggerBlastChill}
              className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-colors whitespace-nowrap shadow-sm"
            >
              Trigger Blast Chill (7°C)
            </button>
          )}
        </div>
      </div>

      {/* 4 Storage Units Interactive Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {FACTORY_STORAGE_UNITS.map((unit) => {
          const isSelected = selectedUnit === unit.id;
          const isWarning = unit.status === "ATTENTION_NEEDED";

          return (
            <div
              key={unit.id}
              onClick={() => setSelectedUnit(unit.id)}
              className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                isSelected
                  ? "border-emerald-500 bg-emerald-50/20 shadow-md ring-2 ring-emerald-500/20"
                  : isWarning
                  ? "border-amber-200 bg-amber-50/30 hover:border-amber-300"
                  : "border-[#E8ECF3] bg-white hover:border-emerald-200"
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-3xl">{unit.icon}</span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded font-mono-data ${
                    isWarning
                      ? "bg-amber-100 text-amber-800"
                      : "bg-emerald-100 text-emerald-800"
                  }`}
                >
                  {isWarning ? "EXCURSION" : "OPTIMAL"}
                </span>
              </div>

              <h4 className="text-sm font-bold text-[#111827]">{unit.name}</h4>
              <p className="text-xs text-[#6B7280]">{unit.crop}</p>

              <div className="mt-4 pt-3 border-t border-[#F3F4F6] grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[10px] text-[#9CA3AF] uppercase block font-semibold">Temperature</span>
                  <span
                    className={`text-lg font-black font-mono-data ${
                      isWarning ? "text-amber-600" : "text-[#111827]"
                    }`}
                  >
                    {unit.tempCelsius}°C
                  </span>
                  <span className="text-[10px] text-[#9CA3AF] block">{unit.targetTemp}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#9CA3AF] uppercase block font-semibold">Humidity</span>
                  <span className="text-lg font-black font-mono-data text-[#111827]">
                    {unit.humidityPct}%
                  </span>
                  <span className="text-[10px] text-[#9CA3AF] block">{unit.targetHumidity}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Unit Deep Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 24-Hour Temp Graph (8 cols) */}
        <div className="lg:col-span-8 card p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="section-title">24-Hour Thermal Gradient & Stability</h3>
              <p className="section-subtitle">Real-time IoT thermistor logging across Storage Units A, B, and C</p>
            </div>
            <span className="text-xs font-mono-data text-emerald-600 font-bold bg-emerald-50 px-2.5 py-1 rounded-lg">
              Telemetry Freq: 60s
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={HOURLY_TEMP_TREND}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                <XAxis dataKey="time" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} unit="°C" domain={[4, 20]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1B2138",
                    borderColor: "rgba(255,255,255,0.12)",
                    borderRadius: "12px",
                    color: "#F1F5F9",
                    fontSize: "12px",
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="unitA"
                  name="Unit A (Potatoes 6°C)"
                  stroke="#10B981"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
                <Line
                  type="monotone"
                  dataKey="unitB"
                  name="Unit B (Tomatoes - DRIFT 13.1°C)"
                  stroke="#F59E0B"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="unitC"
                  name="Unit C (Onions 18°C)"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Selected Unit HVAC Status (4 cols) */}
        <div className="lg:col-span-4 card p-6 space-y-4">
          <div>
            <h3 className="section-title flex items-center gap-2">
              <Wind className="w-4 h-4 text-emerald-600" />
              {activeUnit.name} Telemetry
            </h3>
            <p className="section-subtitle">Chiller compressor & sensor node status</p>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-[#FAFBFC] border border-[#E8ECF3] flex items-center justify-between">
              <span className="text-[#6B7280]">Chiller Compressor Status</span>
              <span className="font-bold text-emerald-600 font-mono-data">RUNNING (100% Load)</span>
            </div>

            <div className="p-3 rounded-xl bg-[#FAFBFC] border border-[#E8ECF3] flex items-center justify-between">
              <span className="text-[#6B7280]">Ethylene Gas Level</span>
              <span className="font-bold font-mono-data text-amber-600">0.42 ppm (Elevated)</span>
            </div>

            <div className="p-3 rounded-xl bg-[#FAFBFC] border border-[#E8ECF3] flex items-center justify-between">
              <span className="text-[#6B7280]">Air Circulation Velocity</span>
              <span className="font-bold font-mono-data text-[#111827]">1.8 m/s</span>
            </div>

            <div className="p-3 rounded-xl bg-[#FAFBFC] border border-[#E8ECF3] flex items-center justify-between">
              <span className="text-[#6B7280]">Next Defrost Cycle</span>
              <span className="font-bold font-mono-data text-[#111827]">In 2 hours 15 mins</span>
            </div>

            <div className="p-3 rounded-xl bg-[#FAFBFC] border border-[#E8ECF3] flex items-center justify-between">
              <span className="text-[#6B7280]">Door Openings (Today)</span>
              <span className="font-bold font-mono-data text-[#111827]">14 cycles (Normal)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
