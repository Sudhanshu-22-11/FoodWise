"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useLang } from "@/context/LanguageContext";
import {
  RefreshCw,
  Zap,
  Leaf,
  DollarSign,
  TrendingUp,
  Sparkles,
  Flame,
  CheckCircle2,
  Factory,
  BarChart3,
  ArrowRight,
  ShieldCheck,
  Truck,
  Building2,
  FileText,
  QrCode,
  Clock,
  Layers,
  Check,
  X,
  AlertCircle,
  Award,
  ChevronRight,
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

const BYPRODUCT_STREAMS = [
  {
    id: "STREAM-01",
    name: "Biogas Anaerobic Digester (Unit 1 & 2)",
    inputFeedstock: "Potato peels, sludge & sorting scrap",
    dailyFeedKg: 1200,
    outputType: "Methane Biogas (Electricity & Boiler Steam)",
    dailyYield: "480 kWh",
    monthlyRevenue: "₹86,400 (Grid Offset)",
    co2AbatedTons: 1.4,
    status: "OPTIMAL",
  },
  {
    id: "STREAM-02",
    name: "Cattle Feed Pelletizing Line",
    inputFeedstock: "Dewatered potato pulp & fibrous peel solids",
    dailyFeedKg: 450,
    outputType: "High-Protein Animal Nutrition Pellets",
    dailyYield: "210 kg Pellets",
    monthlyRevenue: "₹63,000 (Local Dairy Coops)",
    co2AbatedTons: 0.6,
    status: "ACTIVE",
  },
  {
    id: "STREAM-03",
    name: "Industrial Starch Recovery Flume",
    inputFeedstock: "Slicing bath washwater leachate",
    dailyFeedKg: 190,
    outputType: "Technical Grade Starch Powder (Dry)",
    dailyYield: "85 kg Starch",
    monthlyRevenue: "₹38,250 (Corrugated Box Industry)",
    co2AbatedTons: 0.3,
    status: "ACTIVE",
  },
];

const MONTHLY_VALORIZATION = [
  { month: "May", biogasKg: 32000, feedPelletsKg: 12000, starchKg: 5200 },
  { month: "Jun", biogasKg: 34500, feedPelletsKg: 13100, starchKg: 5800 },
  { month: "Jul", biogasKg: 36000, feedPelletsKg: 13500, starchKg: 6100 },
  { month: "Aug", biogasKg: 38200, feedPelletsKg: 14200, starchKg: 6400 },
  { month: "Sep", biogasKg: 40500, feedPelletsKg: 15100, starchKg: 6800 },
];

interface WasteBatch {
  id: string;
  name: string;
  category: "ANIMAL_FEED" | "BIO_CNG";
  feedstockType: string;
  availableKg: number;
  sourceLine: string;
  metric1Label: string;
  metric1Value: string;
  metric2Label: string;
  metric2Value: string;
  qualityTag: string;
  urgency: string;
}

interface OfftakePartner {
  id: string;
  name: string;
  category: "ANIMAL_FEED" | "BIO_CNG";
  type: string;
  regId: string;
  distanceKm: number;
  dailyCapacityKg: number;
  ratePerKg: string;
  rating: number;
  verified: boolean;
  vehicleAssigned: string;
}

const FEEDSTOCK_BATCHES: WasteBatch[] = [
  {
    id: "BATCH-AH-01",
    name: "Potato Peels & Clean Processing Pulp",
    category: "ANIMAL_FEED",
    feedstockType: "Flaked Peel Solids",
    availableKg: 850,
    sourceLine: "Line 1 — Peeling Drum Flume",
    metric1Label: "Crude Protein",
    metric1Value: "11.4%",
    metric2Label: "Moisture Content",
    metric2Value: "71%",
    qualityTag: "FSSAI Grade-IV Fodder",
    urgency: "Dispatch within 8h",
  },
  {
    id: "BATCH-AH-02",
    name: "Carrot, Pea & Vegetable Off-cuts",
    category: "ANIMAL_FEED",
    feedstockType: "Optical Sorter Reject",
    availableKg: 520,
    sourceLine: "Line 2 — Optical Sort Flume",
    metric1Label: "Crude Fiber",
    metric1Value: "14.2%",
    metric2Label: "Moisture Content",
    metric2Value: "68%",
    qualityTag: "Non-Toxic / Pesticide-Free",
    urgency: "Dispatch within 12h",
  },
  {
    id: "BATCH-AH-03",
    name: "Tomato Pomace & Seed Solids",
    category: "ANIMAL_FEED",
    feedstockType: "Extracted Pulp Cake",
    availableKg: 420,
    sourceLine: "Line 3 — Hot Break Extractor",
    metric1Label: "Lysine Protein",
    metric1Value: "17.8%",
    metric2Label: "Moisture Content",
    metric2Value: "58%",
    qualityTag: "Ruminant Cattle Nutritive",
    urgency: "Dispatch within 6h",
  },
  {
    id: "BATCH-CBG-01",
    name: "High-Moisture Effluent Slurry & Sludge",
    category: "BIO_CNG",
    feedstockType: "Anaerobic Digester Feedstock",
    availableKg: 1450,
    sourceLine: "Effluent Treatment Decanter",
    metric1Label: "Est. Methane Yield",
    metric1Value: "82 m³/MT",
    metric2Label: "Moisture Content",
    metric2Value: "86%",
    qualityTag: "SATAT Bio-Methanation Class A",
    urgency: "Ready for Tanker Intake",
  },
  {
    id: "BATCH-CBG-02",
    name: "Overripe Excursion Vegetable Discards",
    category: "BIO_CNG",
    feedstockType: "Degraded Organic Solids",
    availableKg: 980,
    sourceLine: "Cold Store Excursion Lot",
    metric1Label: "Est. Methane Yield",
    metric1Value: "71 m³/MT",
    metric2Label: "Moisture Content",
    metric2Value: "84%",
    qualityTag: "MNRE GOBARdhan Feedstock",
    urgency: "Ready for Tanker Intake",
  },
];

const OFFTAKE_PARTNERS: OfftakePartner[] = [
  {
    id: "PART-AH-1",
    name: "Shri Krishna Gaushala & Dairy Trust",
    category: "ANIMAL_FEED",
    type: "Registered Cow Shelter & Milk Coop",
    regId: "DL-AH-4910",
    distanceKm: 8.5,
    dailyCapacityKg: 2000,
    ratePerKg: "₹2.20 / kg",
    rating: 4.9,
    verified: true,
    vehicleAssigned: "E-Truck (DL-1T-4921)",
  },
  {
    id: "PART-AH-2",
    name: "Mother Dairy Fodder & Feed Federation",
    category: "ANIMAL_FEED",
    type: "Apex Dairy Procurement Union",
    regId: "FOD-ND-8821",
    distanceKm: 16.0,
    dailyCapacityKg: 8000,
    ratePerKg: "₹2.65 / kg",
    rating: 5.0,
    verified: true,
    vehicleAssigned: "10T Lorry (DL-01-FD-3310)",
  },
  {
    id: "PART-AH-3",
    name: "Kisan Pashu Aahaar Pelletizing Mill",
    category: "ANIMAL_FEED",
    type: "Industrial Feed Processing Hub",
    regId: "UP-AH-3012",
    distanceKm: 22.4,
    dailyCapacityKg: 12000,
    ratePerKg: "₹2.90 / kg",
    rating: 4.8,
    verified: true,
    vehicleAssigned: "Heavy Carrier (UP-14-AH-7720)",
  },
  {
    id: "PART-CBG-1",
    name: "GAIL / Indraprastha SATAT CBG Bio-Energy Plant",
    category: "BIO_CNG",
    type: "National SATAT Compressed Biogas Plant",
    regId: "SATAT-DL-088",
    distanceKm: 13.8,
    dailyCapacityKg: 25000,
    ratePerKg: "₹1.80 / kg (Govt Subsidy)",
    rating: 5.0,
    verified: true,
    vehicleAssigned: "Insulated Slurry Tanker (DL-02-TK-9014)",
  },
  {
    id: "PART-CBG-2",
    name: "MCD Okhla Waste-to-Energy & Bio-Methanation Unit",
    category: "BIO_CNG",
    type: "Municipal Bio-CNG & Clean Power Station",
    regId: "MCD-WTE-194",
    distanceKm: 11.2,
    dailyCapacityKg: 40000,
    ratePerKg: "Zero Tipping Fee + Credit",
    rating: 4.9,
    verified: true,
    vehicleAssigned: "Municipal Heavy Tipper (DL-10-MC-5502)",
  },
  {
    id: "PART-CBG-3",
    name: "IOCL Bio-Methanation Renewable Hub",
    category: "BIO_CNG",
    type: "PSU Green Clean Fuel Facility",
    regId: "IOCL-CBG-201",
    distanceKm: 21.5,
    dailyCapacityKg: 35000,
    ratePerKg: "₹1.95 / kg",
    rating: 4.8,
    verified: true,
    vehicleAssigned: "Vacuum Bio-Tanker (DL-01-IO-8819)",
  },
];

export default function ByproductRecoveryPage() {
  const { t } = useLang();

  const [activeOfftakeTab, setActiveOfftakeTab] = useState<"ANIMAL_FEED" | "BIO_CNG">("ANIMAL_FEED");
  const [selectedBatch, setSelectedBatch] = useState<WasteBatch | null>(null);
  const [selectedPartnerId, setSelectedPartnerId] = useState<string>("");
  const [dispatchQty, setDispatchQty] = useState<number>(500);
  const [pickupSlot, setPickupSlot] = useState<string>("Within 4 Hours (Immediate Express)");
  const [dispatchedManifest, setDispatchedManifest] = useState<any | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const filteredBatches = FEEDSTOCK_BATCHES.filter((b) => b.category === activeOfftakeTab);
  const filteredPartners = OFFTAKE_PARTNERS.filter((p) => p.category === activeOfftakeTab);

  const handleOpenDispatch = (batch: WasteBatch) => {
    setSelectedBatch(batch);
    setDispatchQty(batch.availableKg);
    const defaultPartner = filteredPartners[0]?.id || "";
    setSelectedPartnerId(defaultPartner);
  };

  const handleConfirmDispatch = () => {
    if (!selectedBatch) return;

    const partner = OFFTAKE_PARTNERS.find((p) => p.id === selectedPartnerId) || filteredPartners[0];
    const manifestId = `FW-MANIFEST-${Math.floor(100000 + Math.random() * 900000)}`;
    const tippingSaved = Math.round(dispatchQty * 2.5);
    const co2ePrevented = ((dispatchQty * 1.1) / 1000).toFixed(2);

    const manifestData = {
      id: manifestId,
      batchName: selectedBatch.name,
      category: selectedBatch.category,
      qtyKg: dispatchQty,
      partnerName: partner?.name || "Verified Beneficiary",
      partnerReg: partner?.regId || "REG-DL-2026",
      vehicle: partner?.vehicleAssigned || "Dedicated E-Carrier",
      pickupWindow: pickupSlot,
      tippingSaved,
      co2ePrevented,
      issuedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setDispatchedManifest(manifestData);
    setSelectedBatch(null);
    setToastMessage(t("factory.byproduct.dispatched_alert"));

    setTimeout(() => {
      setToastMessage(null);
    }, 6000);
  };

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-3 bg-[#111827] text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-emerald-500/40 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <Check className="w-5 h-5" />
          </div>
          <div className="text-xs">
            <p className="font-bold text-emerald-400">{t("factory.byproduct.dispatch_success")}</p>
            <p className="text-gray-300 mt-0.5">{toastMessage}</p>
          </div>
          <button
            onClick={() => setToastMessage(null)}
            className="text-gray-400 hover:text-white p-1 ml-2 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#E8ECF3]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
              {t("factory.byproduct.subtitle_label")}
            </span>
            <span className="text-[#D1D5DB]">•</span>
            <span className="text-xs text-[#9CA3AF]">{t("factory.byproduct.zero_landfill")}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#111827]">
            {t("factory.byproduct.title")}
          </h1>
          <p className="text-xs sm:text-sm text-[#6B7280] mt-0.5">
            {t("factory.byproduct.description")}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/factory/reports"
            className="px-4 py-2.5 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200 hover:bg-emerald-100 transition-colors flex items-center gap-1.5"
          >
            <BarChart3 className="w-3.5 h-3.5 text-emerald-600" />
            {t("factory.byproduct.view_reports")}
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card stat-card-green p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#6B7280]">{t("factory.byproduct.kpi_waste_diverted")}</span>
            <div className="icon-container icon-container-green">
              <RefreshCw className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black font-mono-data text-[#111827]">
            1,840 <span className="text-sm font-bold text-[#6B7280]">{t("common.kg")}</span>
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">
            {t("factory.byproduct.landfill_diversion_rate")}
          </div>
        </div>

        <div className="stat-card stat-card-amber p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#6B7280]">{t("factory.byproduct.kpi_energy_generated")}</span>
            <div className="icon-container icon-container-amber">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black font-mono-data text-amber-600">
            480 <span className="text-sm font-bold text-[#6B7280]">{t("factory.byproduct.kwh_per_day")}</span>
          </div>
          <div className="text-[11px] text-[#6B7280] mt-1">
            {t("factory.byproduct.powers_lighting")}
          </div>
        </div>

        <div className="stat-card stat-card-emerald p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#6B7280]">{t("factory.byproduct.kpi_circular_revenue")}</span>
            <div className="icon-container" style={{ background: "#ECFDF5", color: "#059669" }}>
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black font-mono-data text-[#059669]">
            ₹1,87,650
          </div>
          <div className="text-[11px] text-[#6B7280] mt-1">
            {t("factory.byproduct.biogas_pellet_starch")}
          </div>
        </div>

        <div className="stat-card stat-card-indigo p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#6B7280]">{t("factory.byproduct.kpi_carbon_offset")}</span>
            <div className="icon-container icon-container-indigo">
              <Leaf className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black font-mono-data text-[#111827]">
            69.0 <span className="text-sm font-bold text-[#6B7280]">{t("factory.byproduct.tons_co2e")}</span>
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">
            {t("factory.byproduct.equivalent_cars")}
          </div>
        </div>
      </div>

      {/* NEW: B2B & B2G Circular Offtake & Logistics Dispatch Hub */}
      <div className="card p-6 bg-gradient-to-b from-white via-white to-emerald-50/20 border border-[#E8ECF3] shadow-sm">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-gray-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-md">
                B2B & B2G Offtake Network
              </span>
            </div>
            <h3 className="section-title text-xl font-extrabold text-[#111827] mt-1 flex items-center gap-2">
              <Truck className="w-5 h-5 text-emerald-600" />
              {t("factory.byproduct.offtake_hub_title")}
            </h3>
            <p className="section-subtitle text-xs text-[#6B7280] mt-0.5">
              {t("factory.byproduct.offtake_hub_desc")}
            </p>
          </div>

          {/* Offtake Tabs Switcher */}
          <div className="flex items-center bg-[#F3F4F6] p-1 rounded-2xl border border-gray-200 self-start md:self-auto">
            <button
              onClick={() => setActiveOfftakeTab("ANIMAL_FEED")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeOfftakeTab === "ANIMAL_FEED"
                  ? "bg-white text-emerald-800 shadow-sm border border-emerald-100"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <span className="text-base">🐄</span>
              <span>{t("factory.byproduct.tab_animal")}</span>
            </button>
            <button
              onClick={() => setActiveOfftakeTab("BIO_CNG")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeOfftakeTab === "BIO_CNG"
                  ? "bg-white text-emerald-800 shadow-sm border border-emerald-100"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <span className="text-base">⚡</span>
              <span>{t("factory.byproduct.tab_biocng")}</span>
            </button>
          </div>
        </div>

        {/* Offtake Grid: Available Batches & Verified Partners */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6 items-start">
          {/* Left Column (7 cols): Available Organic Waste Batches */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-emerald-600" />
                {t("factory.byproduct.available_feedstock")} ({filteredBatches.length})
              </h4>
              <span className="text-[11px] text-gray-500 font-medium">
                {t("factory.byproduct.daily_dispatch_summary")}:{" "}
                <strong className="text-gray-800 font-mono-data">
                  {filteredBatches.reduce((acc, curr) => acc + curr.availableKg, 0)} {t("common.kg")}
                </strong>
              </span>
            </div>

            <div className="space-y-3">
              {filteredBatches.map((batch) => (
                <div
                  key={batch.id}
                  className="p-4 rounded-2xl border border-gray-200/80 bg-white hover:border-emerald-300 hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-mono-data font-bold px-2 py-0.5 rounded bg-gray-100 text-gray-700">
                        {batch.id}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {batch.qualityTag}
                      </span>
                      <span className="text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded font-semibold flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {batch.urgency}
                      </span>
                    </div>

                    <h5 className="font-bold text-sm text-[#111827] truncate">{batch.name}</h5>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <Factory className="w-3 h-3 text-gray-400" />
                      {batch.sourceLine}
                    </p>

                    <div className="flex items-center gap-4 text-xs pt-1 text-gray-600">
                      <div>
                        <span className="text-gray-400">{batch.metric1Label}:</span>{" "}
                        <strong className="text-gray-800 font-mono-data">{batch.metric1Value}</strong>
                      </div>
                      <div className="text-gray-300">•</div>
                      <div>
                        <span className="text-gray-400">{batch.metric2Label}:</span>{" "}
                        <strong className="text-gray-800 font-mono-data">{batch.metric2Value}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                    <div className="text-right">
                      <span className="text-[10px] text-gray-400 block uppercase font-bold tracking-wider">
                        {t("factory.byproduct.available_qty")}
                      </span>
                      <span className="text-lg font-black text-[#111827] font-mono-data">
                        {batch.availableKg}{" "}
                        <span className="text-xs font-semibold text-gray-500">{t("common.kg")}</span>
                      </span>
                    </div>

                    <button
                      onClick={() => handleOpenDispatch(batch)}
                      className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-colors flex items-center gap-1.5"
                    >
                      <Truck className="w-3.5 h-3.5" />
                      {t("factory.byproduct.dispatch_btn")}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column (5 cols): Verified Offtake Partners */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-emerald-600" />
                {t("factory.byproduct.dispatch_partner_title")}
              </h4>
              <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                100% Certified
              </span>
            </div>

            <div className="space-y-3">
              {filteredPartners.map((partner) => (
                <div
                  key={partner.id}
                  className="p-4 rounded-2xl border border-gray-200/80 bg-white hover:border-indigo-300 transition-all space-y-2.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h5 className="font-bold text-xs sm:text-sm text-[#111827]">{partner.name}</h5>
                        {partner.verified && (
                          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                        )}
                      </div>
                      <p className="text-[11px] text-gray-500 mt-0.5">{partner.type}</p>
                    </div>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-mono-data shrink-0">
                      ★ {partner.rating}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[10px] text-gray-400 block uppercase font-medium">
                        {t("factory.byproduct.govt_reg")}
                      </span>
                      <span className="font-bold font-mono-data text-gray-700">{partner.regId}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-400 block uppercase font-medium">
                        {t("factory.byproduct.distance")}
                      </span>
                      <span className="font-bold font-mono-data text-gray-700">{partner.distanceKm} km</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-gray-400 block uppercase font-medium">
                        {t("factory.byproduct.rate_offered")}
                      </span>
                      <span className="font-bold text-emerald-600">{partner.ratePerKg}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-gray-500 pt-1">
                    <span className="flex items-center gap-1">
                      <Truck className="w-3.5 h-3.5 text-gray-400" />
                      {partner.vehicleAssigned}
                    </span>
                    <button
                      onClick={() => {
                        const batch = filteredBatches[0];
                        if (batch) {
                          setSelectedBatch(batch);
                          setDispatchQty(batch.availableKg);
                          setSelectedPartnerId(partner.id);
                        }
                      }}
                      className="text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-0.5"
                    >
                      {t("factory.byproduct.schedule_pickup")} →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SATAT / GOBARdhan & Environmental Governance Banner */}
        <div className="mt-6 p-4 rounded-2xl bg-gradient-to-r from-emerald-900 to-[#111827] text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h5 className="font-bold text-sm text-emerald-300">
                {t("factory.byproduct.compliance_banner")}
              </h5>
              <p className="text-xs text-gray-300 mt-0.5 max-w-2xl leading-relaxed">
                {t("factory.byproduct.compliance_desc")}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold shrink-0">
            <div className="text-center bg-white/10 px-3.5 py-1.5 rounded-xl border border-white/10">
              <span className="text-[10px] text-emerald-400 uppercase block font-bold">
                {t("factory.byproduct.landfill_tax_saved")}
              </span>
              <span className="text-sm font-black font-mono-data text-white">₹34,500</span>
            </div>
            <div className="text-center bg-white/10 px-3.5 py-1.5 rounded-xl border border-white/10">
              <span className="text-[10px] text-emerald-400 uppercase block font-bold">
                {t("factory.byproduct.co2e_prevented")}
              </span>
              <span className="text-sm font-black font-mono-data text-white">18.4 MT CO₂e</span>
            </div>
          </div>
        </div>
      </div>

      {/* Circular Valorization Streams Cards */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="section-title flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-emerald-600" />
              {t("factory.byproduct.streams_title")}
            </h3>
            <p className="section-subtitle">{t("factory.byproduct.streams_subtitle")}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {BYPRODUCT_STREAMS.map((st) => (
            <div
              key={st.id}
              className="p-5 rounded-2xl border border-[#E8ECF3] bg-gradient-to-b from-white to-[#FAFBFC] hover:shadow-md transition-shadow space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold font-mono-data text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    {st.id}
                  </span>
                  <h4 className="font-bold text-sm text-[#111827] mt-1">{st.name}</h4>
                </div>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse mt-1" />
              </div>

              <div className="text-xs text-[#6B7280]">
                <strong>{t("factory.byproduct.feedstock")}:</strong> {st.inputFeedstock}
              </div>

              <div className="p-3 rounded-xl bg-white border border-[#E5E7EB] space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[#6B7280]">{t("factory.byproduct.daily_intake")}</span>
                  <span className="font-bold font-mono-data text-[#111827]">{st.dailyFeedKg} {t("common.kg")}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#6B7280]">{t("factory.byproduct.output_yield")}</span>
                  <span className="font-bold font-mono-data text-emerald-600">{st.dailyYield}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#6B7280]">{t("factory.byproduct.monthly_value")}</span>
                  <span className="font-bold font-mono-data text-[#111827]">{st.monthlyRevenue}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Monthly Chart */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="section-title">{t("factory.byproduct.monthly_chart_title")}</h3>
            <p className="section-subtitle">{t("factory.byproduct.monthly_chart_subtitle")}</p>
          </div>
          <span className="text-xs font-bold text-emerald-600 font-mono-data">{t("factory.byproduct.yield_growth")}</span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={MONTHLY_VALORIZATION}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
              <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} unit=" kg" />
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
              <Bar dataKey="biogasKg" name={t("factory.byproduct.legend_biogas")} fill="#10B981" stackId="a" />
              <Bar dataKey="feedPelletsKg" name={t("factory.byproduct.legend_feed")} fill="#F59E0B" stackId="a" />
              <Bar dataKey="starchKg" name={t("factory.byproduct.legend_starch")} fill="#3B82F6" stackId="a" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* MODAL 1: Schedule Dispatch Form */}
      {selectedBatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 space-y-5 animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-3 border-b border-gray-100">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  {selectedBatch.category === "ANIMAL_FEED"
                    ? t("factory.byproduct.tab_animal")
                    : t("factory.byproduct.tab_biocng")}
                </span>
                <h4 className="font-extrabold text-lg text-gray-900 mt-1">
                  {t("factory.byproduct.manifest_title")}
                </h4>
              </div>
              <button
                onClick={() => setSelectedBatch(null)}
                className="text-gray-400 hover:text-gray-600 p-1.5 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Selected Batch Summary */}
            <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100 space-y-1 text-xs">
              <div className="font-bold text-gray-900 text-sm">{selectedBatch.name}</div>
              <div className="text-gray-500">{selectedBatch.sourceLine}</div>
              <div className="flex items-center gap-3 pt-1 text-gray-600 font-medium">
                <span>
                  {selectedBatch.metric1Label}: <strong>{selectedBatch.metric1Value}</strong>
                </span>
                <span>•</span>
                <span>
                  {selectedBatch.metric2Label}: <strong>{selectedBatch.metric2Value}</strong>
                </span>
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-4 text-xs">
              {/* Dispatch Quantity */}
              <div>
                <div className="flex justify-between items-center mb-1 font-semibold text-gray-700">
                  <span>{t("factory.byproduct.quantity_kg")}</span>
                  <span className="font-bold text-emerald-600 font-mono-data text-sm">
                    {dispatchQty} / {selectedBatch.availableKg} kg
                  </span>
                </div>
                <input
                  type="range"
                  min={50}
                  max={selectedBatch.availableKg}
                  step={50}
                  value={dispatchQty}
                  onChange={(e) => setDispatchQty(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
              </div>

              {/* Offtake Partner Selection */}
              <div>
                <label className="block font-semibold text-gray-700 mb-1.5">
                  {t("factory.byproduct.partner")}
                </label>
                <select
                  value={selectedPartnerId}
                  onChange={(e) => setSelectedPartnerId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                >
                  {filteredPartners.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.distanceKm} km) — {p.ratePerKg}
                    </option>
                  ))}
                </select>
              </div>

              {/* Pickup Slot Selection */}
              <div>
                <label className="block font-semibold text-gray-700 mb-1.5">
                  {t("factory.byproduct.pickup_slot")}
                </label>
                <select
                  value={pickupSlot}
                  onChange={(e) => setPickupSlot(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                >
                  <option value="Immediate Express (within 4 hours)">
                    Immediate Express (within 4 hours) — High Freshness
                  </option>
                  <option value="Today Evening Shift (05:00 PM - 07:00 PM)">
                    Today Evening Shift (05:00 PM - 07:00 PM)
                  </option>
                  <option value="Tomorrow Morning Shift (06:00 AM - 08:00 AM)">
                    Tomorrow Morning Shift (06:00 AM - 08:00 AM)
                  </option>
                </select>
              </div>

              {/* Live ESG Impact Preview */}
              <div className="p-3 rounded-2xl bg-emerald-50/60 border border-emerald-100 flex items-center justify-between text-center">
                <div>
                  <span className="text-[10px] text-gray-500 block uppercase font-bold">
                    {t("factory.byproduct.landfill_tax_saved")}
                  </span>
                  <span className="font-extrabold text-emerald-800 font-mono-data">
                    ₹{Math.round(dispatchQty * 2.5)}
                  </span>
                </div>
                <div className="text-gray-300">|</div>
                <div>
                  <span className="text-[10px] text-gray-500 block uppercase font-bold">
                    {t("factory.byproduct.co2e_prevented")}
                  </span>
                  <span className="font-extrabold text-emerald-800 font-mono-data">
                    {((dispatchQty * 1.1) / 1000).toFixed(2)} MT CO₂e
                  </span>
                </div>
                <div className="text-gray-300">|</div>
                <div>
                  <span className="text-[10px] text-gray-500 block uppercase font-bold">
                    Offtake Revenue
                  </span>
                  <span className="font-extrabold text-emerald-800 font-mono-data">
                    ₹{Math.round(dispatchQty * (selectedBatch.category === "ANIMAL_FEED" ? 2.4 : 1.85))}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setSelectedBatch(null)}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-semibold text-xs hover:bg-gray-50 transition-colors"
              >
                {t("factory.byproduct.close")}
              </button>
              <button
                type="button"
                onClick={handleConfirmDispatch}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                {t("factory.byproduct.confirm_dispatch")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Issued Digital Gatepass / Manifest */}
      {dispatchedManifest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-100 space-y-4 animate-in zoom-in-95 duration-200">
            {/* Gatepass Card Header */}
            <div className="text-center pb-3 border-b border-gray-100">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-2">
                <QrCode className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                {t("factory.byproduct.gatepass_issued")}
              </span>
              <h4 className="font-black text-xl text-gray-900 mt-2 font-mono-data">
                {dispatchedManifest.id}
              </h4>
              <p className="text-[11px] text-gray-500 mt-0.5">
                Central Pollution Control Board (CPCB) Verified Manifest
              </p>
            </div>

            {/* Manifest Details */}
            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Beneficiary Partner:</span>
                <span className="font-bold text-gray-900 text-right">{dispatchedManifest.partnerName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Registration ID:</span>
                <span className="font-bold font-mono-data text-gray-700">{dispatchedManifest.partnerReg}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Feedstock Waste:</span>
                <span className="font-bold text-emerald-700">{dispatchedManifest.batchName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Dispatched Quantity:</span>
                <span className="font-black font-mono-data text-gray-900 text-sm">
                  {dispatchedManifest.qtyKg} kg
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">{t("factory.byproduct.assigned_truck")}:</span>
                <span className="font-bold text-gray-800">{dispatchedManifest.vehicle}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">{t("factory.byproduct.pickup_slot")}:</span>
                <span className="font-bold text-indigo-700">{dispatchedManifest.pickupWindow}</span>
              </div>
              <div className="pt-2 border-t border-gray-200 flex justify-between items-center text-emerald-700 font-bold">
                <span>Total Methane Prevented:</span>
                <span className="font-mono-data">{dispatchedManifest.co2ePrevented} MT CO₂e</span>
              </div>
            </div>

            {/* Close Gatepass Button */}
            <button
              onClick={() => setDispatchedManifest(null)}
              className="w-full py-2.5 rounded-xl bg-gray-900 hover:bg-black text-white font-bold text-xs transition-colors"
            >
              {t("factory.byproduct.close")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
