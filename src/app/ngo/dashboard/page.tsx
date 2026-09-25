"use client";

import React, { useState, Suspense, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { INSTITUTIONS } from "@/lib/mockData";
import {
  HeartHandshake,
  Clock,
  MapPin,
  CheckCircle2,
  Calendar,
  Filter,
  Check,
  Truck,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Utensils,
  Navigation,
  AlertTriangle,
  CircleDot,
  Timer,
  Route,
  Zap,
  ExternalLink,
  PackageCheck,
  Layers,
  Search,
  Download,
  Key,
} from "lucide-react";
import confetti from "canvas-confetti";

interface SurplusFeedItem {
  id: string;
  institution: string;
  foodType: string;
  diet: "Vegetarian" | "Egg" | "Jain";
  quantityKg: number;
  location: string;
  distanceKm: number;
  safeUntil: string;
  hoursLeft: number;
  fssaiVerified: boolean;
  lat: number;
  lng: number;
  trafficStatus: "low" | "moderate" | "heavy";
  etaMinutes: number;
}

function NgoDashboardContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const activeTabFromUrl = searchParams.get("tab") || "overview";

  const { acceptedPickups, acceptNgoPickup } = useApp();
  const [filterType, setFilterType] = useState<string>("All");
  const [selectedPickup, setSelectedPickup] = useState<SurplusFeedItem | null>(null);
  const [scheduleSuccess, setScheduleSuccess] = useState<string | null>(null);
  const [mapMode, setMapMode] = useState<"google" | "corridor">("google");
  const [historySearch, setHistorySearch] = useState("");

  const pastPickupsHistory = [
    {
      id: "hist-1",
      date: "Yesterday, 3:30 PM",
      institution: "IIT Delhi Mess",
      food: "Rajma & Jeera Rice (75 kg)",
      recipient: "Aasha Shelter (220 meals)",
      receipt: "FSSAI-RELIEF-9041",
      driver: "Ramesh Kumar (Van DL-1L-4492)",
      status: "Delivered & Verified",
    },
    {
      id: "hist-2",
      date: "Sep 20, 2:15 PM",
      institution: "AIIMS Cafeteria",
      food: "Paneer Curry & Rotis (42 kg)",
      recipient: "Nizamuddin Night Shelter (130 meals)",
      receipt: "FSSAI-RELIEF-8992",
      driver: "Satish Pal (E-Rickshaw DL-4E-9021)",
      status: "Delivered & Verified",
    },
    {
      id: "hist-3",
      date: "Sep 19, 4:00 PM",
      institution: "The Oberoi Banquets",
      food: "Assorted Breads & Dal (55 kg)",
      recipient: "Sarai Kale Khan Center (160 meals)",
      receipt: "FSSAI-RELIEF-8951",
      driver: "Vikram Singh (Van DL-2C-1108)",
      status: "Delivered & Verified",
    },
  ];

  const initialFeed: SurplusFeedItem[] = [
    {
      id: "feed-1",
      institution: "IIT Delhi Central Mess (Aravali)",
      foodType: "Dal Makhani & Steamed Rice",
      diet: "Vegetarian",
      quantityKg: 60,
      location: "Hauz Khas, New Delhi",
      distanceKm: 3.2,
      safeUntil: "5:00 PM Today",
      hoursLeft: 3.5,
      fssaiVerified: true,
      lat: 28.5459,
      lng: 77.1926,
      trafficStatus: "low",
      etaMinutes: 12,
    },
    {
      id: "feed-2",
      institution: "AIIMS Hospital Staff Cafeteria",
      foodType: "Mixed Veg Sabzi & 140 Phulkas",
      diet: "Vegetarian",
      quantityKg: 35,
      location: "Ansari Nagar, New Delhi",
      distanceKm: 4.8,
      safeUntil: "6:15 PM Today",
      hoursLeft: 4.8,
      fssaiVerified: true,
      lat: 28.5672,
      lng: 77.2100,
      trafficStatus: "moderate",
      etaMinutes: 22,
    },
    {
      id: "feed-3",
      institution: "The Oberoi Pantry & Banquet",
      foodType: "Paneer Lababdar & Jeera Rice",
      diet: "Vegetarian",
      quantityKg: 28,
      location: "Dr. Zakir Hussain Marg, New Delhi",
      distanceKm: 6.1,
      safeUntil: "7:00 PM Today",
      hoursLeft: 5.5,
      fssaiVerified: true,
      lat: 28.6024,
      lng: 77.2399,
      trafficStatus: "heavy",
      etaMinutes: 38,
    },
    {
      id: "feed-4",
      institution: "Bikanervala Central Kitchen",
      foodType: "Chana Masala & Puri",
      diet: "Vegetarian",
      quantityKg: 50,
      location: "Okhla Phase III, New Delhi",
      distanceKm: 7.4,
      safeUntil: "4:30 PM Today",
      hoursLeft: 3.0,
      fssaiVerified: true,
      lat: 28.5305,
      lng: 77.2707,
      trafficStatus: "heavy",
      etaMinutes: 45,
    },
  ];

  const handleAccept = (item: SurplusFeedItem) => {
    acceptNgoPickup(item.id);
    setScheduleSuccess(item.foodType);
    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.7 },
    });
    setTimeout(() => setScheduleSuccess(null), 5000);
  };

  const filteredFeed = initialFeed.filter((item) => {
    if (filterType === "All") return true;
    if (filterType === "< 5 km") return item.distanceKm < 5;
    if (filterType === "> 40 kg") return item.quantityKg >= 40;
    if (filterType === "Urgent (< 4 hrs)") return item.hoursLeft <= 4;
    if (filterType === "Low Traffic") return item.trafficStatus === "low";
    return true;
  });

  const getTrafficColor = (status: string) => {
    switch (status) {
      case "low": return "#10B981";
      case "moderate": return "#F59E0B";
      case "heavy": return "#EF4444";
      default: return "#9CA3AF";
    }
  };

  const getTrafficLabel = (status: string) => {
    switch (status) {
      case "low": return "Clear Roads";
      case "moderate": return "Moderate Congestion";
      case "heavy": return "Heavy Delays";
      default: return "Unknown";
    }
  };

  const getTrafficBg = (status: string) => {
    switch (status) {
      case "low": return "#ECFDF5";
      case "moderate": return "#FFF8EB";
      case "heavy": return "#FEF2F2";
      default: return "#F9FAFB";
    }
  };

  const canDeliverInTime = (item: SurplusFeedItem) => {
    const safeMinutes = item.hoursLeft * 60;
    const bufferMinutes = 30; // 30 min buffer for loading/unloading
    return item.etaMinutes + bufferMinutes < safeMinutes;
  };

  const setTab = (newTab: string) => {
    if (newTab === "overview") {
      router.push("/ngo/dashboard");
    } else {
      router.push(`/ngo/dashboard?tab=${newTab}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* ═══ TOP HEADER ═══ */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#E8ECF3]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
              <HeartHandshake className="w-3.5 h-3.5" />
              NGO Food Relief Network
            </span>
            <span className="text-gray-300">•</span>
            <span className="text-xs text-gray-500 font-semibold">{INSTITUTIONS.ngo.name}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900">
            {activeTabFromUrl === "claims"
              ? "Live Food Claims & Donor Matches"
              : activeTabFromUrl === "routing"
              ? "Traffic & Safe Route Command Center"
              : activeTabFromUrl === "scheduled"
              ? "Scheduled Pickups & Active Dispatches"
              : activeTabFromUrl === "history"
              ? "Completed Delivery History & Receipts"
              : "NGO Surplus Logistics & Traffic Intelligence"}
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Real-time surplus claims, traffic congestion margins, vehicle dispatch OTPs, and relief verification.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold bg-emerald-50 border border-emerald-200 text-emerald-700">
            <span className="w-2 h-2 rounded-full animate-pulse bg-emerald-500" />
            <span>{INSTITUTIONS.ngo.volunteers}</span>
          </div>
        </div>
      </div>

      {/* ═══ SECTION NAVIGATION TABS ═══ */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-gray-200 text-xs font-bold">
        {[
          { id: "overview", label: "Overview", icon: Layers },
          { id: "claims", label: `Live Claims (${initialFeed.length})`, icon: PackageCheck, badge: "Live" },
          { id: "routing", label: "Traffic & Safe Routing", icon: Route },
          { id: "scheduled", label: `Scheduled Pickups (${acceptedPickups.length + 1})`, icon: Truck },
          { id: "history", label: `Pickup History (${pastPickupsHistory.length})`, icon: Clock },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTabFromUrl === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setTab(tab.id)}
              className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                isActive
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/25"
                  : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.badge && !isActive && (
                <span className="px-1.5 py-0.2 rounded-full text-[9px] font-black bg-rose-500 text-white">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {scheduleSuccess && (
        <div className="alert-banner alert-banner-success">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-800">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>
              Pickup successfully dispatched for <strong>{scheduleSuccess}</strong>! Driver notified with verification OTP.
            </span>
          </div>
        </div>
      )}

      {/* ═══ TAB 1: OVERVIEW ═══ */}
      {activeTabFromUrl === "overview" && (
        <div className="space-y-6">
          {/* KPI Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="stat-card stat-card-green p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[13px] font-medium text-gray-500">Available Surplus</span>
                <div className="icon-container icon-container-green"><Utensils className="w-5 h-5" /></div>
              </div>
              <div className="text-[28px] font-extrabold font-mono-data text-gray-900">{initialFeed.length} Batches</div>
              <div className="text-[12px] font-medium text-emerald-600">173 kg verified nutritious food</div>
            </div>

            <div className="stat-card stat-card-amber p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[13px] font-medium text-gray-500">Urgent (&lt; 4 hrs)</span>
                <div className="icon-container icon-container-amber"><Timer className="w-5 h-5" /></div>
              </div>
              <div className="text-[28px] font-extrabold font-mono-data text-gray-900">
                {initialFeed.filter((i) => i.hoursLeft <= 4).length} Batches
              </div>
              <div className="text-[12px] font-medium text-amber-600">Requires rapid dispatch</div>
            </div>

            <div className="stat-card stat-card-emerald p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[13px] font-medium text-gray-500">Clear Traffic Routes</span>
                <div className="icon-container icon-container-green"><Navigation className="w-5 h-5" /></div>
              </div>
              <div className="text-[28px] font-extrabold font-mono-data text-gray-900">
                {initialFeed.filter((i) => i.trafficStatus === "low").length} Routes
              </div>
              <div className="text-[12px] font-medium text-emerald-600">Fast safe transit guaranteed</div>
            </div>

            <div className="stat-card stat-card-red p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[13px] font-medium text-gray-500">Traffic Risk Flag</span>
                <div className="icon-container icon-container-red"><AlertTriangle className="w-5 h-5" /></div>
              </div>
              <div className="text-[28px] font-extrabold font-mono-data text-gray-900">
                {initialFeed.filter((i) => !canDeliverInTime(i)).length} High-Risk
              </div>
              <div className="text-[12px] font-medium text-rose-600">Heavy congestion alert</div>
            </div>
          </div>

          {/* Quick Split: Map + Feed */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7">
              <div className="card p-5 bg-white border border-gray-200 rounded-2xl">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-sm text-gray-900 flex items-center gap-2">
                      <Navigation className="w-4 h-4 text-emerald-600" />
                      Live Traffic & Routing Map
                    </h3>
                    <p className="text-xs text-gray-500">Real-time corridor conditions for pickup routes</p>
                  </div>
                  {/* Merged 2-mode selector (No duplicate views!) */}
                  <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl">
                    <button
                      onClick={() => setMapMode("google")}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                        mapMode === "google" ? "bg-white text-emerald-700 shadow-xs" : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      Google Maps (Live)
                    </button>
                    <button
                      onClick={() => setMapMode("corridor")}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                        mapMode === "corridor" ? "bg-white text-emerald-700 shadow-xs" : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      Interactive Route Network
                    </button>
                  </div>
                </div>

                {mapMode === "google" ? (
                  <div className="relative rounded-2xl overflow-hidden border border-gray-200 bg-gray-100 h-80">
                    <iframe
                      src={`https://maps.google.com/maps?saddr=28.5459,77.1926&daddr=${
                        selectedPickup ? `${selectedPickup.lat},${selectedPickup.lng}` : "28.5672,77.2100"
                      }&layer=t&output=embed`}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Google Maps Live Directions & Traffic"
                    />
                    <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-xl border border-gray-200 text-xs font-bold text-gray-900 shadow-sm flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      {selectedPickup ? `Route to: ${selectedPickup.institution}` : "Google Maps Traffic Active"}
                    </div>
                  </div>
                ) : (
                  <div className="relative rounded-2xl overflow-hidden bg-slate-900 h-80 p-4">
                    <div
                      className="absolute inset-0 opacity-20"
                      style={{
                        backgroundImage:
                          "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
                        backgroundSize: "30px 30px",
                      }}
                    />
                    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 600 320">
                      <line x1="50" y1="160" x2="550" y2="160" stroke="rgba(255,255,255,0.15)" strokeWidth="3" />
                      <line x1="300" y1="20" x2="300" y2="300" stroke="rgba(255,255,255,0.15)" strokeWidth="3" />
                      <ellipse cx="300" cy="160" rx="180" ry="110" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="2" />
                      <line x1="300" y1="160" x2="160" y2="220" stroke="#10B981" strokeWidth="4" strokeLinecap="round" />
                      <line x1="300" y1="160" x2="230" y2="90" stroke="#F59E0B" strokeWidth="4" strokeLinecap="round" />
                      <line x1="300" y1="160" x2="440" y2="80" stroke="#EF4444" strokeWidth="4" strokeLinecap="round" />
                      <line x1="300" y1="160" x2="460" y2="240" stroke="#EF4444" strokeWidth="4" strokeLinecap="round" />
                    </svg>

                    <div className="absolute left-[47%] top-[45%] flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center shadow-lg">
                        <HeartHandshake className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-[9px] font-black text-white bg-black/70 px-1.5 py-0.5 rounded mt-0.5">NGO HUB</span>
                    </div>

                    <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-sm p-2 rounded-xl text-[10px] text-white space-y-1">
                      <div className="flex items-center gap-1.5"><span className="w-2.5 h-1.5 rounded-full bg-emerald-400" /> Hauz Khas: 12 min (Clear)</div>
                      <div className="flex items-center gap-1.5"><span className="w-2.5 h-1.5 rounded-full bg-amber-400" /> AIIMS: 22 min (Moderate)</div>
                      <div className="flex items-center gap-1.5"><span className="w-2.5 h-1.5 rounded-full bg-rose-500" /> Oberoi / Okhla: 38-45 min (Heavy)</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Claims Feed (Right 5 cols) */}
            <div className="lg:col-span-5 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-gray-900">Urgent Food Available for Pickup</h3>
                <button onClick={() => setTab("claims")} className="text-xs font-bold text-emerald-600 hover:underline">
                  View All ({initialFeed.length}) →
                </button>
              </div>

              <div className="space-y-2.5">
                {initialFeed.slice(0, 3).map((item) => {
                  const safe = canDeliverInTime(item);
                  const isAccepted = acceptedPickups.includes(item.id);
                  return (
                    <div
                      key={item.id}
                      className="p-3.5 rounded-2xl bg-white border border-gray-200 hover:border-emerald-300 transition-all shadow-xs flex items-center justify-between gap-3"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-gray-900 truncate">{item.institution}</span>
                          <span className="text-[10px] font-black px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700">
                            {item.quantityKg} kg
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-500 truncate mt-0.5">{item.foodType}</p>
                        <div className="flex items-center gap-2 text-[10px] text-gray-400 mt-1">
                          <span style={{ color: getTrafficColor(item.trafficStatus) }}>
                            ● {item.etaMinutes}m ETA ({getTrafficLabel(item.trafficStatus)})
                          </span>
                          <span>•</span>
                          <span>Safe until: {item.safeUntil}</span>
                        </div>
                      </div>

                      <div className="shrink-0">
                        {isAccepted ? (
                          <span className="text-[11px] font-bold text-emerald-700 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200">
                            Dispatched
                          </span>
                        ) : safe ? (
                          <button
                            onClick={() => handleAccept(item)}
                            className="text-xs font-bold px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs cursor-pointer active:scale-95"
                          >
                            Claim
                          </button>
                        ) : (
                          <span className="text-[10px] font-bold text-rose-600 px-2 py-1 rounded bg-rose-50 border border-rose-200">
                            Traffic Risk
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══ TAB 2: DEDICATED LIVE FOOD CLAIMS ═══ */}
      {activeTabFromUrl === "claims" && (
        <div className="space-y-5">
          {/* Filters Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-white border border-gray-200 rounded-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <Filter className="w-4 h-4 text-gray-400" />
              {["All", "< 5 km", "> 40 kg", "Urgent (< 4 hrs)", "Low Traffic"].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilterType(f)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    filterType === f
                      ? "bg-emerald-600 text-white shadow-xs"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
            <div className="text-xs font-semibold text-gray-500">
              Showing {filteredFeed.length} verified donor surplus items
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredFeed.map((item) => {
              const isAccepted = acceptedPickups.includes(item.id);
              const safe = canDeliverInTime(item);

              return (
                <div
                  key={item.id}
                  className="card p-5 bg-white border border-gray-200 hover:border-emerald-300 transition-all rounded-2xl shadow-sm space-y-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-extrabold text-sm text-gray-900">{item.institution}</h3>
                        <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                          {item.diet}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                        <MapPin className="w-3.5 h-3.5 text-gray-400" />
                        {item.location} ({item.distanceKm} km away)
                      </p>
                    </div>

                    <span className="text-right">
                      <span className="text-xl font-black font-mono-data text-emerald-700 block">
                        {item.quantityKg} kg
                      </span>
                      <span className="text-[10px] text-gray-400">~{Math.round(item.quantityKg * 3.2)} Meals</span>
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 text-xs">
                    <span className="text-gray-400 block text-[11px] mb-0.5">Prepared Food Description:</span>
                    <strong className="text-gray-900 font-semibold">{item.foodType}</strong>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center text-[11px]">
                    <div className="p-2 rounded-lg bg-gray-50 border border-gray-100">
                      <span className="text-gray-400 block text-[10px]">Safe Until</span>
                      <span className="font-bold text-gray-800">{item.safeUntil}</span>
                    </div>
                    <div className="p-2 rounded-lg bg-gray-50 border border-gray-100">
                      <span className="text-gray-400 block text-[10px]">Traffic ETA</span>
                      <span className="font-bold font-mono-data" style={{ color: getTrafficColor(item.trafficStatus) }}>
                        {item.etaMinutes} mins
                      </span>
                    </div>
                    <div className="p-2 rounded-lg bg-gray-50 border border-gray-100">
                      <span className="text-gray-400 block text-[10px]">Transit Margin</span>
                      <span className={`font-bold ${safe ? "text-emerald-600" : "text-rose-600"}`}>
                        {safe ? "Safe Window" : "High Risk"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&origin=28.5459,77.1926&destination=${item.lat},${item.lng}&travelmode=driving`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-emerald-600 hover:underline flex items-center gap-1"
                    >
                      <ExternalLink className="w-3.5 h-3.5" /> Google Directions
                    </a>

                    {isAccepted ? (
                      <span className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4" /> Claimed & Scheduled
                      </span>
                    ) : safe ? (
                      <button
                        onClick={() => handleAccept(item)}
                        className="px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/30 flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all"
                      >
                        <Truck className="w-4 h-4" /> Claim Batch & Dispatch
                      </button>
                    ) : (
                      <button
                        disabled
                        className="px-4 py-2 rounded-xl text-xs font-bold bg-gray-200 text-gray-500 cursor-not-allowed"
                      >
                        High Congestion Risk
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ═══ TAB 3: DEDICATED TRAFFIC & SAFE ROUTING (MERGED MAP!) ═══ */}
      {activeTabFromUrl === "routing" && (
        <div className="space-y-5">
          <div className="card p-6 bg-white border border-gray-200 rounded-2xl shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-extrabold text-base text-gray-900 flex items-center gap-2">
                  <Route className="w-5 h-5 text-emerald-600" />
                  Live Corridor Traffic & Safety Margin Analyzer
                </h3>
                <p className="text-xs text-gray-500">
                  Combines Google Maps Live Traffic with FoodWise Shelf-Life Buffer Algorithm (30 min loading + transit time).
                </p>
              </div>

              {/* Mode switch */}
              <div className="flex items-center gap-1 bg-gray-100 p-1.5 rounded-xl">
                <button
                  onClick={() => setMapMode("google")}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    mapMode === "google" ? "bg-white text-emerald-700 shadow-sm" : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Google Maps Live Satellite
                </button>
                <button
                  onClick={() => setMapMode("corridor")}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    mapMode === "corridor" ? "bg-white text-emerald-700 shadow-sm" : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Interactive Corridor Network
                </button>
              </div>
            </div>

            {/* Map Area */}
            {mapMode === "google" ? (
              <div className="relative rounded-2xl overflow-hidden border border-gray-300 bg-gray-100 h-96">
                <iframe
                  src="https://maps.google.com/maps?saddr=28.5459,77.1926&daddr=28.5672,77.2100&layer=t&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Google Maps Live Routing"
                />
              </div>
            ) : (
              <div className="relative rounded-2xl overflow-hidden bg-slate-900 h-96 p-4">
                <div
                  className="absolute inset-0 opacity-20"
                  style={{
                    backgroundImage:
                      "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
                    backgroundSize: "30px 30px",
                  }}
                />
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 600 360">
                  <line x1="50" y1="180" x2="550" y2="180" stroke="rgba(255,255,255,0.2)" strokeWidth="3" />
                  <line x1="300" y1="30" x2="300" y2="330" stroke="rgba(255,255,255,0.2)" strokeWidth="3" />
                  <ellipse cx="300" cy="180" rx="200" ry="120" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
                  <line x1="300" y1="180" x2="160" y2="240" stroke="#10B981" strokeWidth="5" strokeLinecap="round" />
                  <line x1="300" y1="180" x2="230" y2="100" stroke="#F59E0B" strokeWidth="5" strokeLinecap="round" />
                  <line x1="300" y1="180" x2="440" y2="90" stroke="#EF4444" strokeWidth="5" strokeLinecap="round" />
                  <line x1="300" y1="180" x2="470" y2="260" stroke="#EF4444" strokeWidth="5" strokeLinecap="round" />
                </svg>

                <div className="absolute left-[47%] top-[45%] flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center shadow-xl">
                    <HeartHandshake className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-[10px] font-black text-white bg-black/70 px-2 py-0.5 rounded mt-1">NGO HUB</span>
                </div>

                <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur-md p-3 rounded-2xl text-xs text-white space-y-1.5 border border-white/10">
                  <div className="font-bold text-emerald-400 mb-1">Live Congestion Feed</div>
                  <div className="flex items-center gap-2"><span className="w-3 h-2 rounded-full bg-emerald-400" /> Hauz Khas: 12 min (Margin: +150 min buffer)</div>
                  <div className="flex items-center gap-2"><span className="w-3 h-2 rounded-full bg-amber-400" /> AIIMS Flyover: 22 min (Margin: +230 min buffer)</div>
                  <div className="flex items-center gap-2"><span className="w-3 h-2 rounded-full bg-rose-500" /> Mathura Road / Okhla: 45 min (Deficit risk)</div>
                </div>
              </div>
            )}

            {/* Corridor Safety Breakdown Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
              {initialFeed.map((item) => {
                const safe = canDeliverInTime(item);
                return (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-xl border border-gray-200 bg-gray-50/70 space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-gray-900 truncate">{item.institution.split(" ")[0]}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded" style={{ background: getTrafficBg(item.trafficStatus), color: getTrafficColor(item.trafficStatus) }}>
                        {item.etaMinutes}m ETA
                      </span>
                    </div>
                    <div className="text-[11px] text-gray-500">
                      {safe ? (
                        <span className="text-emerald-700 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Safe to dispatch
                        </span>
                      ) : (
                        <span className="text-rose-700 font-bold flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5" /> Delay risk
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ═══ TAB 4: DEDICATED SCHEDULED PICKUPS ═══ */}
      {activeTabFromUrl === "scheduled" && (
        <div className="space-y-4">
          <div className="card p-5 bg-white border border-gray-200 rounded-2xl">
            <h3 className="font-bold text-sm text-gray-900 mb-1">
              Active Pickups in Transit
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              Authorized volunteer drivers, destination relief homes, and handover verification OTP codes.
            </p>

            <div className="space-y-3">
              {[
                {
                  id: "sched-1",
                  institution: "IIT Delhi Central Mess (Aravali)",
                  food: "Dal Makhani & Steamed Rice (60 kg)",
                  destination: "Aasha Shelter Home, Malviya Nagar",
                  driver: "Ramesh Kumar (Van DL-1L-4492)",
                  phone: "+91 98112 34567",
                  otp: "8942",
                  eta: "Arriving at Kitchen in 8 mins",
                  status: "En Route to Kitchen",
                },
                {
                  id: "sched-2",
                  institution: "AIIMS Cafeteria Unit 2",
                  food: "Fresh Mixed Sabzi & 140 Rotis (35 kg)",
                  destination: "Nizamuddin Rain Basera Center",
                  driver: "Satish Pal (E-Loader DL-4E-9021)",
                  phone: "+91 98770 12345",
                  otp: "4119",
                  eta: "Loaded & In Transit to Shelter",
                  status: "Delivering to Shelter",
                },
              ].map((pickup) => (
                <div
                  key={pickup.id}
                  className="p-5 rounded-2xl border border-gray-200 bg-gray-50/60 hover:bg-white transition-all space-y-3"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-2 border-b border-gray-200">
                    <div>
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-100/70 px-2.5 py-0.5 rounded-full">
                        ● {pickup.status}
                      </span>
                      <h4 className="font-extrabold text-sm text-gray-900 mt-1">{pickup.institution}</h4>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono-data bg-gray-900 text-white px-3 py-1 rounded-xl flex items-center gap-1.5">
                        <Key className="w-3.5 h-3.5 text-amber-400" />
                        Verification OTP: <strong>{pickup.otp}</strong>
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <span className="text-gray-400 block text-[10px]">Food Batch</span>
                      <span className="font-semibold text-gray-800">{pickup.food}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block text-[10px]">Destination Shelter</span>
                      <span className="font-semibold text-gray-800">{pickup.destination}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block text-[10px]">Driver & Contact</span>
                      <span className="font-semibold text-gray-800">{pickup.driver} • {pickup.phone}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ═══ TAB 5: DEDICATED PICKUP HISTORY & RECEIPTS ═══ */}
      {activeTabFromUrl === "history" && (
        <div className="space-y-4">
          <div className="card p-5 bg-white border border-gray-200 rounded-2xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="font-bold text-sm text-gray-900">
                  Completed Surplus Food Distributions
                </h3>
                <p className="text-xs text-gray-500">Official digital delivery logs, shelter acknowledgments, and relief audit receipts</p>
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search receipt, mess, shelter..."
                  value={historySearch}
                  onChange={(e) => setHistorySearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>
            </div>

            <div className="space-y-3">
              {pastPickupsHistory
                .filter(
                  (h) =>
                    h.institution.toLowerCase().includes(historySearch.toLowerCase()) ||
                    h.recipient.toLowerCase().includes(historySearch.toLowerCase()) ||
                    h.receipt.toLowerCase().includes(historySearch.toLowerCase())
                )
                .map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-gray-900">{item.institution}</span>
                        <span className="text-[10px] font-mono-data font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          {item.receipt}
                        </span>
                      </div>
                      <div className="text-xs text-gray-600 mt-0.5">{item.food} ➔ {item.recipient}</div>
                      <div className="text-[11px] text-gray-400 mt-1">
                        Delivered on {item.date} by {item.driver}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Verified Delivered
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function NgoDashboardPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-gray-500">Loading NGO Command Desk...</div>}>
      <NgoDashboardContent />
    </Suspense>
  );
}
