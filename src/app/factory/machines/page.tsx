"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { MACHINE_HEALTH } from "@/lib/mockData";
import {
  Cpu,
  AlertTriangle,
  CheckCircle2,
  Wrench,
  Activity,
  FileText,
  UserCheck,
  TrendingDown,
  Info,
  Clock,
  Sparkles,
} from "lucide-react";

export default function FactoryMachinesPage() {
  const { isTechnicianAssigned, assignTechnician } = useApp();
  const [selectedMachineLog, setSelectedMachineLog] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-[#E8ECF3]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-[#10B981] uppercase tracking-wider flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5" />
              Machinery Telemetry & Predictive Anomaly Flagging
            </span>
            <span className="text-white/30">•</span>
            <span className="text-xs text-[#6B7280]">Potato Chips & Puree Line A</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#111827]">
            Industrial Equipment Health & Yield Loss Flags
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-[#6B7280] font-mono-data bg-[#F9FAFB] px-3 py-1.5 rounded-xl border border-[#E8ECF3]">
            6 Edge Sensor Nodes Active
          </span>
        </div>
      </div>

      {/* Philosophy Callout Alert */}
      <div className="p-3.5 rounded-xl bg-[#FAFBFC] border border-[#E8ECF3] text-xs text-[#6B7280] flex items-center gap-2.5">
        <Info className="w-4 h-4 text-[#10B981] shrink-0" />
        <span>
          <strong>Operational Philosophy:</strong> AI algorithms detect micro-deviations in mechanical yield (e.g. skin thickness, aperture clarity) to flag inspections before equipment fails and thousands of kilos of raw produce are lost.
        </span>
      </div>

      {/* MACHINE CARDS GRID (2x3) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MACHINE_HEALTH.map((machine) => {
          const isCheckRequired = machine.status === "CHECK_REQUIRED";
          const isWarning = machine.status === "WARNING";

          return (
            <div
              key={machine.id}
              className={`rounded-2xl p-6 transition-all flex flex-col justify-between ${
                isCheckRequired
                  ? "bg-amber-500/[0.07] border-2 border-amber-500/50 shadow-xl shadow-amber-500/10 glow-warning"
                  : isWarning
                  ? "bg-amber-500/[0.03] border border-[#FDE68A]"
                  : "card border-[#E8ECF3] hover:border-[#D0D6E2]"
              }`}
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <span className="font-mono-data text-xs text-[#6B7280] font-semibold">
                      {machine.machineId}
                    </span>
                    <h3 className="font-bold text-[#111827] text-base leading-tight">
                      {machine.name}
                    </h3>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase font-mono-data ${
                      isCheckRequired
                        ? "bg-amber-500 text-white font-extrabold animate-pulse"
                        : isWarning
                        ? "bg-amber-100 text-amber-800 border border-amber-300 font-bold"
                        : "bg-emerald-50 text-[#065F46] border border-emerald-300 font-extrabold"
                    }`}
                  >
                    {isCheckRequired
                      ? "⚠️ CHECK REQUIRED"
                      : isWarning
                      ? "WARNING"
                      : "OPTIMAL"}
                  </span>
                </div>

                {/* Efficiency metrics with circular preview */}
                <div className="p-3 rounded-xl bg-[#F9FAFB] border border-[#F3F4F6] mb-4 flex items-center justify-between">
                  <div>
                    <div className="text-[11px] text-[#6B7280] font-medium">Yield Efficiency</div>
                    <div
                      className={`text-2xl font-black font-mono-data ${
                        isCheckRequired ? "text-amber-600" : "text-[#111827]"
                      }`}
                    >
                      {machine.efficiencyPct}%
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-[11px] text-[#6B7280] font-medium">Normal Range</div>
                    <div className="text-xs font-mono-data font-bold text-gray-800">
                      {machine.normalRange}
                    </div>
                  </div>
                </div>

                {/* ANOMALY CALLOUT (SPECIFIC TO PM-03 & SR-05) */}
                {machine.anomalyDetected && (
                  <div className="space-y-2.5 p-3.5 rounded-xl bg-amber-50/80 border-2 border-amber-300 text-xs text-amber-950 mb-4 shadow-xs">
                    <div className="font-extrabold text-amber-900 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      ANOMALY DETECTED:
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] py-1 border-y border-amber-200 font-mono-data">
                      <div>
                        <span className="text-amber-800 font-medium">Current:</span>
                        <div className="font-extrabold text-rose-700">{machine.currentValue}</div>
                      </div>
                      <div>
                        <span className="text-amber-800 font-medium">Benchmark:</span>
                        <div className="font-bold text-gray-900">{machine.expectedValue}</div>
                      </div>
                    </div>

                    <div className="text-[11px] space-y-1">
                      <div className="text-amber-900 font-medium">
                        <strong className="font-bold text-amber-950">Extra Loss Rate:</strong> {machine.lossRatePerHour}
                      </div>
                      <div className="text-rose-700 font-extrabold">
                        Estimated Waste: ~{machine.estimatedExtraWasteKgPerHour} kg/hour
                      </div>
                    </div>

                    {machine.possibleCause && (
                      <div className="text-[11px] text-amber-900 pt-1">
                        <strong>Possible cause:</strong> {machine.possibleCause}
                      </div>
                    )}

                    {machine.note && (
                      <div className="p-2 rounded-lg bg-amber-100/90 border border-amber-300 text-[11px] text-amber-950 font-medium italic">
                        ⚠️ {machine.note}
                      </div>
                    )}
                  </div>
                )}

                {/* Sparkline trend for optimal machines */}
                {!machine.anomalyDetected && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-[11px] text-[#6B7280] mb-1.5">
                      <span className="font-medium">Shift Stability Trend</span>
                      <span className="text-[#047857] font-bold">100% In Spec</span>
                    </div>
                    <div className="flex items-end gap-1 h-8 bg-emerald-50/70 p-1.5 rounded-lg border border-emerald-100">
                      {machine.trend.map((val, i) => (
                        <div
                          key={i}
                          className="flex-1 bg-emerald-500 rounded-t"
                          style={{ height: `${(val / 100) * 100}%` }}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-[#E8ECF3] flex items-center gap-2">
                {isCheckRequired ? (
                  <>
                    {isTechnicianAssigned ? (
                      <div className="flex-1 py-2 px-3 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center justify-center gap-1.5">
                        <UserCheck className="w-3.5 h-3.5 text-emerald-700" />
                        Technician Dispatched
                      </div>
                    ) : (
                      <button
                        onClick={assignTechnician}
                        className="flex-1 py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/20 transition-all hover:scale-105"
                      >
                        <Wrench className="w-3.5 h-3.5" />
                        Assign Technician
                      </button>
                    )}
                    <button
                      onClick={() => setSelectedMachineLog(machine.machineId)}
                      className="p-2 rounded-xl bg-[#F9FAFB] hover:bg-[#F3F4F6] text-[#6B7280] hover:text-[#111827] border border-[#E8ECF3] text-xs"
                      title="View Log"
                    >
                      <FileText className="w-4 h-4" />
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setSelectedMachineLog(machine.machineId)}
                    className="w-full py-2 rounded-xl bg-[#FAFBFC] hover:bg-[#F3F4F6] text-[#6B7280] hover:text-[#111827] font-medium text-xs border border-[#F3F4F6] transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Activity className="w-3.5 h-3.5" />
                    Telemetry Diagnostics
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* DIAGNOSTIC LOG MODAL */}
      {selectedMachineLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="w-full max-w-xl bg-[#FFFFFF] border border-[#D0D6E2] rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8ECF3]">
              <div className="flex items-center gap-2">
                <Cpu className="w-5 h-5 text-[#10B981]" />
                <h3 className="font-bold text-[#111827] text-base">
                  Diagnostic Telemetry Log — Unit {selectedMachineLog}
                </h3>
              </div>
              <button
                onClick={() => setSelectedMachineLog(null)}
                className="text-xs px-2 py-1 rounded bg-[#F9FAFB] text-[#6B7280] hover:text-[#111827]"
              >
                Close ✕
              </button>
            </div>

            <div className="space-y-2 text-xs font-mono-data text-[#6B7280] bg-black/50 p-4 rounded-xl border border-[#F3F4F6] max-h-60 overflow-y-auto">
              <div>[14:22:04] SENSOR_PING: Optical gauge caliper connected. Freq: 50Hz</div>
              <div>[14:24:12] TELEMETRY_STREAM: Current rotor RPM: 1,420 (Spec: 1,400-1,450)</div>
              {selectedMachineLog === "PM-03" && (
                <>
                  <div className="text-amber-400">
                    [14:25:31] ANOMALY_WARN: Peel depth delta +1.2mm detected on quadrant 2.
                  </div>
                  <div className="text-amber-400">
                    [14:26:02] LOSS_RATE: Calculated waste delta: 180 kg/hr over baseline.
                  </div>
                  <div className="text-[#059669]">
                    [14:27:00] PREVENTATIVE_FLAG: Flagged for preventative blade realignment.
                  </div>
                </>
              )}
              <div>[14:28:15] FSSAI_AUDIT_STAMP: Ingested to secure local operational ledger.</div>
            </div>

            <div className="pt-3 border-t border-[#E8ECF3] flex justify-end">
              <button
                onClick={() => setSelectedMachineLog(null)}
                className="px-4 py-2 rounded-xl bg-[#F3F4F6] hover:bg-white/15 text-[#111827] font-semibold text-xs"
              >
                Close Log
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
