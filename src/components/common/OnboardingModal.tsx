"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import {
  X,
  Building2,
  Factory,
  Cpu,
  HeartHandshake,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Wifi,
} from "lucide-react";
import confetti from "canvas-confetti";

export default function OnboardingModal() {
  const { isOnboardingOpen, setIsOnboardingOpen, setCurrentRole } = useApp();
  const [step, setStep] = useState(1);
  const [institutionType, setInstitutionType] = useState<"kitchen" | "factory">("kitchen");
  const [orgName, setOrgName] = useState("IIT Delhi Central Mess");
  const [city, setCity] = useState("New Delhi");
  const [fssai, setFssai] = useState("10019011006542");
  const [iotDevices, setIotDevices] = useState([
    { id: "iot-1", name: "Cold Storage Sensor A-01", type: "Temperature & Humidity", connected: true },
    { id: "iot-2", name: "Weighing Scale WS-04", type: "Continuous Mass Telemetry", connected: true },
    { id: "iot-3", name: "Steam Jacket Fryer Sensor", type: "Thermal Gradient", connected: false },
  ]);

  if (!isOnboardingOpen) return null;

  const handleNext = () => {
    if (step < 5) {
      setStep(step + 1);
      if (step === 4) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      }
    } else {
      if (institutionType === "kitchen") {
        setCurrentRole("KITCHEN_MANAGER");
      } else {
        setCurrentRole("FACTORY_MANAGER");
      }
      setIsOnboardingOpen(false);
      setStep(1);
    }
  };

  const toggleDevice = (id: string) => {
    setIotDevices((prev) =>
      prev.map((d) => (d.id === id ? { ...d, connected: !d.connected } : d))
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4">
      <div className="w-full max-w-2xl bg-[#0F1629] border border-white/15 rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#00D4AA]/10 border border-[#00D4AA]/20 flex items-center justify-center text-[#00D4AA]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">FoodWise Onboarding</h2>
              <p className="text-xs text-[#94A3B8]">Step {step} of 5 — Instant Operational Readiness</p>
            </div>
          </div>
          <button
            onClick={() => setIsOnboardingOpen(false)}
            className="p-1.5 rounded-lg text-[#94A3B8] hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-white/5 h-1">
          <div
            className="bg-[#00D4AA] h-1 transition-all duration-300"
            style={{ width: `${(step / 5) * 100}%` }}
          />
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto max-h-[70vh]">
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white">Select Your Organization Category</h3>
              <p className="text-sm text-[#94A3B8]">
                FoodWise customizes models based on whether you prepare fresh food daily or manufacture processed FMCG goods.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div
                  onClick={() => setInstitutionType("kitchen")}
                  className={`p-5 rounded-xl border cursor-pointer transition-all ${
                    institutionType === "kitchen"
                      ? "bg-[#00D4AA]/10 border-[#00D4AA] ring-1 ring-[#00D4AA]"
                      : "bg-white/[0.02] border-white/10 hover:border-white/20"
                  }`}
                >
                  <div className="w-10 h-10 rounded-lg bg-[#00D4AA]/20 text-[#00D4AA] flex items-center justify-center mb-3">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-white mb-1">Institutional Kitchen</h4>
                  <p className="text-xs text-[#94A3B8] leading-relaxed">
                    College mess, hospital cafeteria, corporate pantry, caterers, hotels. Focus on daily dynamic demand and FSSAI surplus transfer.
                  </p>
                </div>

                <div
                  onClick={() => setInstitutionType("factory")}
                  className={`p-5 rounded-xl border cursor-pointer transition-all ${
                    institutionType === "factory"
                      ? "bg-[#10B981]/10 border-[#10B981] ring-1 ring-[#10B981]"
                      : "bg-white/[0.02] border-white/10 hover:border-white/20"
                  }`}
                >
                  <div className="w-10 h-10 rounded-lg bg-[#10B981]/20 text-[#34D399] flex items-center justify-center mb-3">
                    <Factory className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-white mb-1">Food Processing Factory</h4>
                  <p className="text-xs text-[#94A3B8] leading-relaxed">
                    Snack chips, sauce/puree, bakery, juice processing. Focus on raw material spoilage prediction and peeling/slicing line anomaly detection.
                  </p>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white">Facility Details & Regulatory Registry</h3>
              <p className="text-sm text-[#94A3B8]">
                Provide your facility identity and FSSAI licensing for compliance tracking.
              </p>

              <div className="space-y-3 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-[#94A3B8] mb-1">
                    Facility / Kitchen / Plant Name
                  </label>
                  <input
                    type="text"
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm focus:outline-none focus:border-[#00D4AA]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#94A3B8] mb-1">City / Region</label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm focus:outline-none focus:border-[#00D4AA]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#94A3B8] mb-1">FSSAI License #</label>
                    <input
                      type="text"
                      value={fssai}
                      onChange={(e) => setFssai(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm focus:outline-none focus:border-[#00D4AA]"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white">Connect IoT Sensors & Telemetry</h3>
              <p className="text-sm text-[#94A3B8]">
                FoodWise ingests MQTT / HTTP telemetry from cold rooms, ambient loggers, and smart scales.
              </p>

              <div className="space-y-2.5 pt-2">
                {iotDevices.map((device) => (
                  <div
                    key={device.id}
                    className="p-3 rounded-xl border border-white/10 bg-white/[0.02] flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white">
                        <Cpu className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-white">{device.name}</div>
                        <div className="text-xs text-[#94A3B8]">{device.type}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleDevice(device.id)}
                      className={`px-3 py-1 text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors ${
                        device.connected
                          ? "bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30"
                          : "bg-white/5 text-[#94A3B8] border border-white/10 hover:bg-white/10"
                      }`}
                    >
                      <Wifi className="w-3 h-3" />
                      {device.connected ? "Connected" : "Connect"}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white">Redistribution NGO Network</h3>
              <p className="text-sm text-[#94A3B8]">
                Auto-link with verified FSSAI-compliant surplus recovery partners within a 15km radius.
              </p>

              <div className="space-y-2.5 pt-2">
                <div className="p-3 rounded-xl border border-[#00D4AA]/30 bg-[#00D4AA]/5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <HeartHandshake className="w-5 h-5 text-[#00D4AA]" />
                    <div>
                      <div className="text-sm font-semibold text-white">Robin Hood Army — Delhi NCR</div>
                      <div className="text-xs text-[#94A3B8]">3.2 km away • 150 kg capacity • 4.9★</div>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-[#00D4AA] bg-[#00D4AA]/10 px-2 py-1 rounded">Linked ✓</span>
                </div>

                <div className="p-3 rounded-xl border border-[#00D4AA]/30 bg-[#00D4AA]/5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <HeartHandshake className="w-5 h-5 text-[#00D4AA]" />
                    <div>
                      <div className="text-sm font-semibold text-white">Aasha Shelter & Orphanage</div>
                      <div className="text-xs text-[#94A3B8]">4.8 km away • 80 kg capacity • 4.8★</div>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-[#00D4AA] bg-[#00D4AA]/10 px-2 py-1 rounded">Linked ✓</span>
                </div>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-[#00D4AA]/20 text-[#00D4AA] border border-[#00D4AA]/40 flex items-center justify-center mx-auto shadow-lg shadow-[#00D4AA]/20">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <h3 className="text-xl font-bold text-white">Setup Complete & Pipeline Calibrated!</h3>
              <p className="text-sm text-[#94A3B8] max-w-md mx-auto leading-relaxed">
                FoodWise has loaded baseline historical models for <span className="text-white font-semibold">{orgName}</span>. Your predictive dashboard is live.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-white/10 bg-white/[0.02] flex items-center justify-between">
          {step > 1 && step < 5 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-[#94A3B8] hover:text-white flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
          ) : (
            <div />
          )}

          <button
            onClick={handleNext}
            className="px-5 py-2 rounded-xl bg-[#00D4AA] hover:bg-[#00D4AA]/90 text-[#0A0F1E] font-bold text-xs flex items-center gap-2 shadow-lg shadow-[#00D4AA]/20 transition-all hover:scale-[1.02]"
          >
            {step === 5 ? "Launch Dashboard" : "Continue"}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
