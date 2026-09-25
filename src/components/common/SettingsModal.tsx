"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import {
  X,
  Settings,
  Bell,
  Building,
  BrainCircuit,
  CheckCircle2,
  Save,
  ShieldCheck,
  Smartphone,
  Sliders,
  Sparkles,
  RefreshCw,
  LogOut,
} from "lucide-react";

export default function SettingsModal() {
  const router = useRouter();
  const { isSettingsOpen, setIsSettingsOpen, currentRole } = useApp();
  const [activeTab, setActiveTab] = useState<"profile" | "alerts" | "ai">("profile");

  const handleLogout = () => {
    setIsSettingsOpen(false);
    router.push("/");
  };

  // Form State
  const [orgName, setOrgName] = useState(
    currentRole === "KITCHEN_MANAGER"
      ? "IIT Delhi Central Mess (Aravali)"
      : currentRole === "FACTORY_MANAGER"
      ? "AgroPure Foods Ltd. — Plant 4"
      : "Feeding India Food Relief Hub"
  );
  const [fssaiLicense, setFssaiLicense] = useState("10019011006542");
  const [managerName, setManagerName] = useState(
    currentRole === "KITCHEN_MANAGER"
      ? "Dr. S.R. Sharma"
      : currentRole === "FACTORY_MANAGER"
      ? "Amit Kumar"
      : "Pooja Verma"
  );
  const [phone, setPhone] = useState("+91 98112 45890");
  const [email, setEmail] = useState("ops.management@foodwise.org");

  // Alert State
  const [enableSms, setEnableSms] = useState(true);
  const [enableAudioChime, setEnableAudioChime] = useState(true);
  const [enableDailyDigest, setEnableDailyDigest] = useState(true);
  const [autoDispatchThreshold, setAutoDispatchThreshold] = useState(40);

  // AI State
  const [confidenceCutoff, setConfidenceCutoff] = useState(85);
  const [modelMode, setModelMode] = useState<"conservative" | "balanced" | "aggressive">("balanced");

  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isSettingsOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      setIsSettingsOpen(false);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-[#E8ECF3] overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#E8ECF3] flex items-center justify-between bg-gradient-to-r from-emerald-50/50 via-white to-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/25">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#111827]">System Settings & Preferences</h2>
              <p className="text-xs text-[#6B7280]">Configure facility profiles, alert thresholds, and AI automation</p>
            </div>
          </div>
          <button
            onClick={() => setIsSettingsOpen(false)}
            className="p-2 rounded-xl text-[#9CA3AF] hover:text-[#111827] hover:bg-[#F3F4F6] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#E8ECF3] px-6 bg-[#FAFBFC] gap-2 pt-2">
          <button
            onClick={() => setActiveTab("profile")}
            className={`pb-3 px-3 text-xs font-bold transition-all flex items-center gap-2 border-b-2 ${
              activeTab === "profile"
                ? "border-emerald-500 text-emerald-600"
                : "border-transparent text-[#6B7280] hover:text-[#111827]"
            }`}
          >
            <Building className="w-3.5 h-3.5" />
            Facility Profile
          </button>
          <button
            onClick={() => setActiveTab("alerts")}
            className={`pb-3 px-3 text-xs font-bold transition-all flex items-center gap-2 border-b-2 ${
              activeTab === "alerts"
                ? "border-emerald-500 text-emerald-600"
                : "border-transparent text-[#6B7280] hover:text-[#111827]"
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            Notifications & Alerts
          </button>
          <button
            onClick={() => setActiveTab("ai")}
            className={`pb-3 px-3 text-xs font-bold transition-all flex items-center gap-2 border-b-2 ${
              activeTab === "ai"
                ? "border-emerald-500 text-emerald-600"
                : "border-transparent text-[#6B7280] hover:text-[#111827]"
            }`}
          >
            <BrainCircuit className="w-3.5 h-3.5" />
            AI & Automation
          </button>
        </div>

        {/* Content Body */}
        <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-5 flex-1">
          {activeTab === "profile" && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#374151] mb-1">
                  Registered Institution / Facility Name
                </label>
                <input
                  type="text"
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E5E7EB] text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#374151] mb-1">
                    FSSAI License / Registration No.
                  </label>
                  <input
                    type="text"
                    value={fssaiLicense}
                    onChange={(e) => setFssaiLicense(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#E5E7EB] text-sm text-[#111827] font-mono-data focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#374151] mb-1">
                    Officer / Warden In-Charge
                  </label>
                  <input
                    type="text"
                    value={managerName}
                    onChange={(e) => setManagerName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#E5E7EB] text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#374151] mb-1">
                    Emergency Phone / WhatsApp
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#E5E7EB] text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#374151] mb-1">
                    Notification Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#E5E7EB] text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-emerald-900">Verified FSSAI Compliance Tier</div>
                  <p className="text-[11px] text-emerald-700 mt-0.5">
                    Your institutional facility is verified under the National Food Recovery Network. All surplus donations receive immutable digital chain-of-custody hashes.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "alerts" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-2xl border border-[#E8ECF3] bg-white">
                <div>
                  <div className="text-sm font-bold text-[#111827]">Instant WhatsApp / SMS Dispatch Alerts</div>
                  <p className="text-xs text-[#6B7280]">Receive urgent notifications when surplus is claimed or route dispatched</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={enableSms}
                    onChange={(e) => setEnableSms(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-[#D1D5DB] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl border border-[#E8ECF3] bg-white">
                <div>
                  <div className="text-sm font-bold text-[#111827]">In-Browser Audio Alerts</div>
                  <p className="text-xs text-[#6B7280]">Play gentle notification sound on live NGO claims & IoT anomalies</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={enableAudioChime}
                    onChange={(e) => setEnableAudioChime(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-[#D1D5DB] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl border border-[#E8ECF3] bg-white">
                <div>
                  <div className="text-sm font-bold text-[#111827]">Morning AI Demand Briefing</div>
                  <p className="text-xs text-[#6B7280]">Auto-deliver forecasted meal requirements every morning at 06:00 AM</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={enableDailyDigest}
                    onChange={(e) => setEnableDailyDigest(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-[#D1D5DB] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                </label>
              </div>

              <div className="p-4 rounded-2xl border border-[#E8ECF3] bg-white">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-[#111827]">Surplus Auto-Alert Threshold</span>
                  <span className="text-sm font-extrabold text-emerald-600 font-mono-data">{autoDispatchThreshold} kg</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  step="5"
                  value={autoDispatchThreshold}
                  onChange={(e) => setAutoDispatchThreshold(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
                <p className="text-[11px] text-[#9CA3AF] mt-1">
                  Surplus exceeding this amount automatically triggers matching priority to nearest certified NGOs.
                </p>
              </div>
            </div>
          )}

          {activeTab === "ai" && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl border border-[#E8ECF3] bg-white">
                <label className="block text-xs font-bold text-[#374151] mb-2">
                  Demand Forecasting Model Mode
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {(["conservative", "balanced", "aggressive"] as const).map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setModelMode(mode)}
                      className={`p-3 rounded-xl border text-xs font-bold capitalize transition-all ${
                        modelMode === mode
                          ? "border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm"
                          : "border-[#E5E7EB] text-[#4B5563] hover:bg-[#F9FAFB]"
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
                <p className="text-[11px] text-[#6B7280] mt-2">
                  {modelMode === "conservative" && "Prioritizes zero food shortages by buffering portions slightly (+5%)."}
                  {modelMode === "balanced" && "Optimal trade-off minimizing both food waste and stockouts (Recommended)."}
                  {modelMode === "aggressive" && "Strict zero-waste optimization targeting exact attendance figures."}
                </p>
              </div>

              <div className="p-4 rounded-2xl border border-[#E8ECF3] bg-white">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-[#111827]">Anomaly Confidence Cutoff</span>
                  <span className="text-sm font-extrabold text-emerald-600 font-mono-data">{confidenceCutoff}%</span>
                </div>
                <input
                  type="range"
                  min="60"
                  max="95"
                  step="5"
                  value={confidenceCutoff}
                  onChange={(e) => setConfidenceCutoff(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
                <p className="text-[11px] text-[#9CA3AF] mt-1">
                  Alerts with model confidence above this score require warden or plant manager confirmation.
                </p>
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="pt-4 border-t border-[#E8ECF3] flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
              <button
                type="button"
                onClick={handleLogout}
                className="px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95"
                title="End current session and return to Login page"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log Out</span>
              </button>

              {savedSuccess ? (
                <div className="flex items-center gap-2 text-emerald-600 text-xs font-bold animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4" />
                  Settings saved!
                </div>
              ) : (
                <span className="text-[11px] text-[#9CA3AF] hidden sm:inline">Settings apply across all modules</span>
              )}
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={() => setIsSettingsOpen(false)}
                className="px-4 py-2 rounded-xl border border-[#E5E7EB] text-xs font-bold text-[#6B7280] hover:bg-[#F3F4F6] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold shadow-md shadow-emerald-500/25 flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                Save Changes
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
