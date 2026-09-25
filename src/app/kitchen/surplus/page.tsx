"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { MATCHED_NGOS } from "@/lib/mockData";
import {
  PackageCheck,
  ShieldCheck,
  AlertTriangle,
  Clock,
  HeartHandshake,
  CheckCircle2,
  XCircle,
  ThermometerSnowflake,
  Star,
  ArrowRight,
  Truck,
  Check,
  Navigation,
  MapPin,
} from "lucide-react";
import Link from "next/link";
import NgoDirectionModal, { NgoDirectionData } from "@/components/common/NgoDirectionModal";

export default function KitchenSurplusPage() {
  const { surplusList, requestNgoPickup } = useApp();
  const [selectedItem, setSelectedItem] = useState(surplusList[0]);
  const [requestSuccess, setRequestSuccess] = useState<string | null>(null);
  const [selectedNgoDirection, setSelectedNgoDirection] = useState<NgoDirectionData | null>(null);

  const getNgoDirectionData = (ngo: (typeof MATCHED_NGOS)[0]): NgoDirectionData => {
    const coordsMap: Record<
      string,
      { lat: number; lng: number; traffic: "low" | "moderate" | "heavy" }
    > = {
      "ngo-1": { lat: 28.5398, lng: 77.1994, traffic: "low" },
      "ngo-2": { lat: 28.5589, lng: 77.2028, traffic: "moderate" },
      "ngo-3": { lat: 28.5672, lng: 77.1989, traffic: "heavy" },
    };
    const meta = coordsMap[ngo.id] || { lat: 28.5589, lng: 77.2028, traffic: "moderate" };
    return {
      ...ngo,
      lat: meta.lat,
      lng: meta.lng,
      trafficStatus: meta.traffic,
      foodItem: selectedItem.item,
      quantityKg: selectedItem.quantityKg,
    };
  };

  const handleRequestPickup = (ngoName: string) => {
    requestNgoPickup(selectedItem.id, ngoName);
    setRequestSuccess(ngoName);
    setTimeout(() => setRequestSuccess(null), 5000);
  };


  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-[#E8ECF3]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-[#10B981] uppercase tracking-wider">
              Surplus Valorization & Redistribution
            </span>
            <span className="text-white/30">•</span>
            <span className="text-xs text-[#6B7280]">FSSAI Rule-Engine Verification</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#111827]">
            Surplus Inventory & NGO Matching
          </h1>
        </div>

        <Link
          href="/kitchen/routes"
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#F9FAFB] hover:bg-[#F3F4F6] text-[#111827] text-xs font-semibold border border-[#E8ECF3] transition-colors"
        >
          <Truck className="w-3.5 h-3.5 text-[#10B981]" />
          View Active Dispatch Routes →
        </Link>
      </div>

      {/* ACTIVE SURPLUS TABLE */}
      <div className="card p-6 border-[#E8ECF3]">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-[#111827]">Active Kitchen Surplus Batches</h2>
            <p className="text-xs text-[#6B7280]">
              Live batch holding monitoring with countdown to safe redistribution thresholds
            </p>
          </div>
          <span className="text-xs text-[#6B7280]">
            Click any row to inspect FSSAI Safety Checklist
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-[#E8ECF3] text-[#6B7280]">
                <th className="pb-3 font-semibold">Item Name</th>
                <th className="pb-3 font-semibold">Quantity</th>
                <th className="pb-3 font-semibold">Prepared At</th>
                <th className="pb-3 font-semibold">Safe Until</th>
                <th className="pb-3 font-semibold">Safety Status</th>
                <th className="pb-3 font-semibold text-right">Redistribution Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F3F4F6]">
              {surplusList.map((item) => {
                const isSelected = selectedItem.id === item.id;
                return (
                  <tr
                    key={item.id}
                    onClick={() => setSelectedItem(item)}
                    className={`cursor-pointer transition-all ${
                      isSelected
                        ? "bg-[#ECFDF5] border-l-4 border-l-[#00D4AA]"
                        : "hover:bg-[#FAFBFC]"
                    }`}
                  >
                    <td className="py-3.5 font-bold text-[#111827] text-sm flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                      {item.item}
                      {item.matchedNgo && (
                        <span className="text-[10px] bg-emerald-500/20 text-[#059669] px-1.5 py-0.5 rounded font-mono-data">
                          Matched: {item.matchedNgo}
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 font-mono-data text-[#111827] font-semibold">
                      {item.quantityKg} kg
                    </td>
                    <td className="py-3.5 text-[#6B7280]">{item.preparedAt}</td>
                    <td className="py-3.5 font-mono-data text-[#111827]">{item.safeUntil}</td>
                    <td className="py-3.5">
                      {item.status === "SAFE" && (
                        <span className="px-2.5 py-1 rounded-md bg-[#10B981]/15 text-[#059669] font-bold border border-[#10B981]/25 flex items-center gap-1 w-fit">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Safe
                        </span>
                      )}
                      {item.status === "EXPIRING_SOON" && (
                        <span className="px-2.5 py-1 rounded-md bg-amber-500/15 text-[#D97706] font-bold border border-amber-500/25 flex items-center gap-1 w-fit animate-pulse">
                          <AlertTriangle className="w-3.5 h-3.5" /> 4 hrs left
                        </span>
                      )}
                      {item.status === "CANNOT_REDISTRIBUTE" && (
                        <span className="px-2.5 py-1 rounded-md bg-red-500/15 text-red-400 font-bold border border-red-500/25 flex items-center gap-1 w-fit">
                          <XCircle className="w-3.5 h-3.5" /> 1.5 hrs left
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 text-right">
                      {item.eligible ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedItem(item);
                          }}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                            item.status === "EXPIRING_SOON"
                              ? "bg-amber-500 hover:bg-amber-400 text-white shadow-sm shadow-amber-500/30"
                              : "bg-[#10B981] hover:bg-[#059669] text-white"
                          }`}
                        >
                          {item.status === "EXPIRING_SOON" ? "URGENT - Match Now" : "Find Recipients"}
                        </button>
                      ) : (
                        <span className="px-2.5 py-1 rounded-md bg-[#F9FAFB] text-[#6B7280] text-xs font-semibold">
                          Cannot Redistribute
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* TWO COLUMNS: SAFETY CHECKLIST & NGO MATCHING */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* SAFETY VERIFICATION PANEL (5 cols) */}
        <div className="lg:col-span-5 card p-6 border-[#E8ECF3] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#10B981]" />
                <h3 className="text-sm font-bold text-[#111827]">
                  FSSAI Rule-Engine Verification
                </h3>
              </div>
              <span className="text-[10px] font-mono-data text-[#6B7280] bg-[#F9FAFB] px-2 py-0.5 rounded">
                Strict Deterministic Rules
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#F9FAFB] border border-[#E8ECF3] mb-4">
              <div className="text-xs text-[#6B7280]">Selected Batch:</div>
              <div className="text-base font-bold text-[#111827] flex items-center justify-between">
                <span>{selectedItem.item}</span>
                <span className="text-[#10B981] font-mono-data">{selectedItem.quantityKg} kg</span>
              </div>
            </div>

            {/* Verification Checklist */}
            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#059669] shrink-0 mt-0.5" />
                <div>
                  <div className="text-[#111827] font-semibold">Preparation Time Recorded</div>
                  <div className="text-[11px] text-[#6B7280]">
                    Logged at {selectedItem.preparedAt} by Mess Supervisor
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                {selectedItem.tempCelsius <= 8.0 ? (
                  <CheckCircle2 className="w-4 h-4 text-[#059669] shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                )}
                <div>
                  <div className="text-[#111827] font-semibold">
                    Storage Temperature: {selectedItem.tempCelsius}°C
                  </div>
                  <div className="text-[11px] text-[#6B7280]">
                    {selectedItem.tempCelsius <= 8.0
                      ? "Within safe cold-chain holding range (<8°C)"
                      : "Temperature exceeded safe threshold (Spoilage hazard)"}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                {selectedItem.coveredHygienic ? (
                  <CheckCircle2 className="w-4 h-4 text-[#059669] shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                )}
                <div>
                  <div className="text-[#111827] font-semibold">Handling Conditions</div>
                  <div className="text-[11px] text-[#6B7280]">
                    {selectedItem.coveredHygienic
                      ? "Covered food-grade containers, sanitized utensils"
                      : "Containers left open past permitted inspection limit"}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-[#38BDF8] shrink-0 mt-0.5" />
                <div>
                  <div className="text-[#111827] font-semibold">
                    Time Remaining: {selectedItem.hoursRemaining} hours
                  </div>
                  <div className="text-[11px] text-[#6B7280]">
                    Safe distribution cutoff is {selectedItem.safeUntil}
                  </div>
                </div>
              </div>
            </div>

            {/* Note alert */}
            <div className="mt-4 p-3 rounded-xl bg-[#FFF8EB] border border-amber-500/20 text-[#92400E] text-[11px]">
              ⚠️ <strong>Cold Chain Transit Window:</strong> Must reach recipient within 2 hours for safe consumption window per FSSAI relief guideline.
            </div>
          </div>

          {/* Result Card */}
          <div className="mt-6 pt-4 border-t border-[#E8ECF3]">
            {selectedItem.eligible ? (
              <div className="p-3.5 rounded-xl bg-[#ECFDF5] border border-[#A7F3D0] text-[#10B981] font-bold text-xs flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                  ELIGIBLE FOR REDISTRIBUTION
                </span>
                <span className="text-[10px] bg-[#10B981] text-white px-2 py-0.5 rounded font-mono-data">
                  VERIFIED
                </span>
              </div>
            ) : (
              <div className="p-3.5 rounded-xl bg-red-500/15 border border-[#FECACA] text-[#DC2626] font-bold text-xs flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-red-400" />
                  INELIGIBLE (HOLD TIMEOUT)
                </span>
                <span className="text-[10px] bg-red-500 text-[#111827] px-2 py-0.5 rounded">
                  COMPOST DIVERT
                </span>
              </div>
            )}
          </div>
        </div>

        {/* NGO MATCHING SECTION (7 cols) */}
        <div id="ngo-matching" className="lg:col-span-7 card p-6 border-[#E8ECF3]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-[#111827] flex items-center gap-2">
                <HeartHandshake className="w-5 h-5 text-rose-400" />
                Matched Verified NGO Partners
              </h3>
              <p className="text-xs text-[#6B7280]">
                Matched by proximity, vehicle availability, and dietary capacity for{" "}
                <strong className="text-[#111827]">{selectedItem.item}</strong>
              </p>
            </div>
            <span className="text-xs text-[#059669] bg-[#10B981]/10 px-2.5 py-1 rounded-lg border border-[#10B981]/20 font-semibold">
              3 Nearby Active
            </span>
          </div>

          {requestSuccess && (
            <div className="p-3.5 mb-4 rounded-xl bg-[#ECFDF5] border border-[#A7F3D0] text-[#059669] text-xs flex items-center justify-between animate-in fade-in">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#059669]" />
                Pickup request accepted by <strong>{requestSuccess}</strong>! Driver dispatched.
              </span>
              <Link
                href="/kitchen/routes"
                className="underline font-bold text-[#111827] hover:text-[#10B981]"
              >
                Track Van →
              </Link>
            </div>
          )}

          <div className="space-y-3">
            {MATCHED_NGOS.map((ngo) => {
              const directionData = getNgoDirectionData(ngo);
              const trafficBadgeColor =
                directionData.trafficStatus === "low"
                  ? "text-emerald-700 bg-emerald-50 border-emerald-200"
                  : directionData.trafficStatus === "moderate"
                  ? "text-amber-700 bg-amber-50 border-amber-200"
                  : "text-rose-700 bg-rose-50 border-rose-200";

              return (
                <div
                  key={ngo.id}
                  className="p-4 rounded-xl bg-[#FAFBFC] border border-[#E8ECF3] hover:border-[#10B981] hover:bg-emerald-50/20 hover:shadow-md transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 cursor-pointer group"
                  onClick={() => setSelectedNgoDirection(directionData)}
                  title="Click to view Google Maps directions and live traffic"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-bold text-[#111827] text-sm group-hover:text-[#10B981] transition-colors">
                        {ngo.name}
                      </h4>
                      {ngo.verified && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#ECFDF5] text-[#10B981] border border-[#A7F3D0] flex items-center gap-1">
                          <Check className="w-2.5 h-2.5" /> Verified
                        </span>
                      )}
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold border capitalize flex items-center gap-1 ${trafficBadgeColor}`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current" />
                        {directionData.trafficStatus} traffic
                      </span>
                    </div>

                    <div className="text-xs text-[#6B7280] flex items-center gap-3 flex-wrap">
                      <span>📍 {ngo.distanceKm} km</span>
                      <span>•</span>
                      <span>📦 Accepts up to {ngo.capacityKg} kg</span>
                      <span>•</span>
                      <span className="font-bold text-[#111827]">
                        ⏱️ {ngo.etaMinutes} mins delivery time
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-amber-500">
                      <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span className="font-bold">{ngo.rating}</span>
                      </div>
                      <span className="text-[#6B7280] text-[11px]">({ngo.location})</span>
                    </div>
                  </div>

                  <div
                    className="flex items-center gap-2 w-full sm:w-auto"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* View Route & Traffic button */}
                    <button
                      type="button"
                      onClick={() => setSelectedNgoDirection(directionData)}
                      className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl bg-white hover:bg-emerald-50 text-[#059669] border border-[#A7F3D0] font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all hover:scale-105"
                      title="View directions on Google Maps"
                    >
                      <Navigation className="w-3.5 h-3.5 text-[#10B981]" />
                      Route & Traffic ({ngo.etaMinutes}m)
                    </button>

                    <button
                      type="button"
                      disabled={!selectedItem.eligible}
                      onClick={() => handleRequestPickup(ngo.name)}
                      className={`flex-1 sm:flex-none px-4 py-2 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg transition-all ${
                        selectedItem.eligible
                          ? "bg-[#10B981] hover:bg-[#059669] text-white shadow-[#10B981]/20 hover:scale-105"
                          : "bg-[#F9FAFB] text-[#6B7280] cursor-not-allowed border border-[#F3F4F6]"
                      }`}
                    >
                      <Truck className="w-3.5 h-3.5" />
                      Request Pickup
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 pt-3 border-t border-[#F3F4F6] flex items-center justify-between text-xs text-[#6B7280]">
            <span>Click any NGO to view live Google Maps directions, traffic delay, and delivery time.</span>
            <Link href="/kitchen/routes" className="text-[#10B981] hover:underline font-semibold flex items-center gap-1">
              Route Optimizer Map →
            </Link>
          </div>
        </div>
      </div>

      {/* NGO GOOGLE MAPS DIRECTION & TRAFFIC MODAL */}
      <NgoDirectionModal
        isOpen={!!selectedNgoDirection}
        onClose={() => setSelectedNgoDirection(null)}
        ngo={selectedNgoDirection}
        onConfirmPickup={handleRequestPickup}
      />
    </div>
  );
}
