"use client";

import React, { useState } from "react";
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

export default function NgoDashboardPage() {
  const { acceptedPickups, acceptNgoPickup } = useApp();
  const [filterType, setFilterType] = useState<string>("All");
  const [selectedPickup, setSelectedPickup] = useState<SurplusFeedItem | null>(null);
  const [scheduleSuccess, setScheduleSuccess] = useState<string | null>(null);
  const [pickupsTab, setPickupsTab] = useState<"scheduled" | "history">("scheduled");
  const [mapView, setMapView] = useState<"google" | "traffic" | "routes">("google");


  const pastPickupsHistory = [
    {
      id: "hist-1",
      date: "Yesterday, 3:30 PM",
      institution: "IIT Delhi Mess",
      food: "Rajma & Jeera Rice (75 kg)",
      recipient: "Aasha Shelter (220 meals)",
      receipt: "FSSAI-RELIEF-9041",
    },
    {
      id: "hist-2",
      date: "Sep 20, 2:15 PM",
      institution: "AIIMS Cafeteria",
      food: "Paneer Curry & Rotis (42 kg)",
      recipient: "Nizamuddin Night Shelter (130 meals)",
      receipt: "FSSAI-RELIEF-8992",
    },
    {
      id: "hist-3",
      date: "Sep 19, 4:00 PM",
      institution: "The Oberoi Banquets",
      food: "Assorted Breads & Dal (55 kg)",
      recipient: "Sarai Kale Khan Center (160 meals)",
      receipt: "FSSAI-RELIEF-8951",
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
      case "moderate": return "Moderate Traffic";
      case "heavy": return "Heavy Traffic";
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

  return (
    <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4" style={{ borderBottom: "1px solid #E8ECF3" }}>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5" style={{ color: "#10B981" }}>
                <HeartHandshake className="w-3.5 h-3.5" />
                NGO Food Redistribution Network
              </span>
              <span style={{ color: "#D1D5DB" }}>•</span>
              <span className="text-xs" style={{ color: "#9CA3AF" }}>{INSTITUTIONS.ngo.name}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight" style={{ color: "#111827" }}>
              Surplus Pickup & Traffic Intelligence
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold" style={{ background: "#ECFDF5", border: "1px solid #A7F3D0", color: "#059669" }}>
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#10B981" }} />
              {INSTITUTIONS.ngo.volunteers}
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="stat-card stat-card-green p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[13px] font-medium" style={{ color: "#6B7280" }}>Available Pickups</span>
              <div className="icon-container icon-container-green"><Utensils className="w-5 h-5" /></div>
            </div>
            <div className="text-[28px] font-extrabold font-mono-data" style={{ color: "#111827" }}>{initialFeed.length}</div>
            <div className="text-[12px] font-medium" style={{ color: "#059669" }}>FSSAI verified surplus nearby</div>
          </div>

          <div className="stat-card stat-card-amber p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[13px] font-medium" style={{ color: "#6B7280" }}>Urgent (Under 4 hrs)</span>
              <div className="icon-container icon-container-amber"><Timer className="w-5 h-5" /></div>
            </div>
            <div className="text-[28px] font-extrabold font-mono-data" style={{ color: "#111827" }}>{initialFeed.filter(i => i.hoursLeft <= 4).length}</div>
            <div className="text-[12px] font-medium" style={{ color: "#D97706" }}>Time-sensitive batches</div>
          </div>

          <div className="stat-card stat-card-emerald p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[13px] font-medium" style={{ color: "#6B7280" }}>Traffic: Clear Routes</span>
              <div className="icon-container icon-container-green"><Navigation className="w-5 h-5" /></div>
            </div>
            <div className="text-[28px] font-extrabold font-mono-data" style={{ color: "#111827" }}>{initialFeed.filter(i => i.trafficStatus === "low").length}</div>
            <div className="text-[12px] font-medium" style={{ color: "#059669" }}>Fast delivery possible</div>
          </div>

          <div className="stat-card stat-card-red p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[13px] font-medium" style={{ color: "#6B7280" }}>Delivery Risk</span>
              <div className="icon-container icon-container-red"><AlertTriangle className="w-5 h-5" /></div>
            </div>
            <div className="text-[28px] font-extrabold font-mono-data" style={{ color: "#111827" }}>{initialFeed.filter(i => !canDeliverInTime(i)).length}</div>
            <div className="text-[12px] font-medium" style={{ color: "#DC2626" }}>May not arrive safely in time</div>
          </div>
        </div>

        {scheduleSuccess && (
          <div className="alert-banner alert-banner-success">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: "#059669" }} />
              <span>Pickup confirmed for <strong>{scheduleSuccess}</strong>! Volunteer driver notified. Verification OTP generated.</span>
            </div>
          </div>
        )}

        {/* Main Content: Map + Feed */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* TRAFFIC MAP PANEL (7 cols) */}
          <div className="lg:col-span-7 space-y-5">
            <div className="card p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="section-title flex items-center gap-2">
                    <Navigation className="w-5 h-5" style={{ color: "#10B981" }} />
                    Live Traffic & Route Map
                  </h3>
                  <p className="section-subtitle">Real-time traffic conditions for pickup route planning</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setMapView("google")}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1"
                    style={{
                      background: mapView === "google" ? "#10B981" : "#F9FAFB",
                      color: mapView === "google" ? "#FFFFFF" : "#6B7280",
                      border: mapView === "google" ? "none" : "1px solid #E5E7EB",
                    }}
                  >
                    <Navigation className="w-3 h-3" />
                    Google Maps (Live)
                  </button>
                  <button
                    onClick={() => setMapView("traffic")}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                    style={{
                      background: mapView === "traffic" ? "#10B981" : "#F9FAFB",
                      color: mapView === "traffic" ? "#FFFFFF" : "#6B7280",
                      border: mapView === "traffic" ? "none" : "1px solid #E5E7EB",
                    }}
                  >
                    Traffic View
                  </button>
                  <button
                    onClick={() => setMapView("routes")}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                    style={{
                      background: mapView === "routes" ? "#10B981" : "#F9FAFB",
                      color: mapView === "routes" ? "#FFFFFF" : "#6B7280",
                      border: mapView === "routes" ? "none" : "1px solid #E5E7EB",
                    }}
                  >
                    Route Plan
                  </button>
                </div>
              </div>

              {/* Map Visualization */}
              {mapView === "google" ? (
                <div className="relative rounded-2xl overflow-hidden border border-[#E8ECF3] bg-[#F3F4F6]" style={{ height: "380px" }}>
                  <iframe
                    src={`https://maps.google.com/maps?saddr=28.5459,77.1926&daddr=${selectedPickup ? `${selectedPickup.lat},${selectedPickup.lng}` : "28.5672,77.2100"}&layer=t&output=embed`}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Google Maps Live Directions & Traffic"
                  />
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-[#E8ECF3] shadow-md text-xs font-bold text-[#111827] flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
                    {selectedPickup ? `Route to: ${selectedPickup.institution}` : "Google Maps Live Traffic & Directions"}
                  </div>
                </div>
              ) : (
                <div className="relative rounded-2xl overflow-hidden" style={{ background: "#1B2138", height: "380px" }}>
                  {/* Map Grid Background */}
                  <div className="absolute inset-0 opacity-20" style={{
                    backgroundImage: "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
                    backgroundSize: "40px 40px",
                  }} />

                {/* Road network lines */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 600 380">
                  {/* Major roads */}
                  <line x1="50" y1="190" x2="550" y2="190" stroke="rgba(255,255,255,0.15)" strokeWidth="3" />
                  <line x1="300" y1="30" x2="300" y2="350" stroke="rgba(255,255,255,0.15)" strokeWidth="3" />
                  <line x1="100" y1="80" x2="500" y2="300" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
                  <line x1="100" y1="300" x2="500" y2="80" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
                  {/* Ring road */}
                  <ellipse cx="300" cy="190" rx="200" ry="140" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="2" />

                  {/* Traffic colored route segments */}
                  {/* Route to IIT Delhi - Green (clear) */}
                  <line x1="300" y1="190" x2="150" y2="250" stroke="#10B981" strokeWidth="4" strokeLinecap="round" opacity="0.8" />
                  {/* Route to AIIMS - Amber (moderate) */}
                  <line x1="300" y1="190" x2="220" y2="120" stroke="#F59E0B" strokeWidth="4" strokeLinecap="round" opacity="0.8" />
                  {/* Route to Oberoi - Red (heavy) */}
                  <line x1="300" y1="190" x2="430" y2="100" stroke="#EF4444" strokeWidth="4" strokeLinecap="round" opacity="0.8" />
                  {/* Route to Bikanervala - Red (heavy) */}
                  <line x1="300" y1="190" x2="450" y2="280" stroke="#EF4444" strokeWidth="4" strokeLinecap="round" opacity="0.8" />
                </svg>

                {/* NGO Hub (Center) */}
                <div className="absolute flex flex-col items-center" style={{ left: "calc(50% - 20px)", top: "calc(50% - 20px)" }}>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg" style={{ background: "#10B981", border: "3px solid white" }}>
                    <HeartHandshake className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-[10px] font-bold text-white mt-1 px-2 py-0.5 rounded" style={{ background: "rgba(0,0,0,0.6)" }}>NGO HUB</span>
                </div>

                {/* Pickup Points */}
                {initialFeed.map((item, idx) => {
                  const positions = [
                    { left: "22%", top: "62%" },
                    { left: "34%", top: "28%" },
                    { left: "70%", top: "22%" },
                    { left: "73%", top: "70%" },
                  ];
                  const pos = positions[idx];
                  const isAccepted = acceptedPickups.includes(item.id);
                  return (
                    <div
                      key={item.id}
                      className="absolute flex flex-col items-center cursor-pointer group"
                      style={{ left: pos.left, top: pos.top }}
                      onClick={() => setSelectedPickup(item)}
                    >
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center shadow-lg transition-transform group-hover:scale-125"
                        style={{
                          background: isAccepted ? "#9CA3AF" : getTrafficColor(item.trafficStatus),
                          border: "2px solid white",
                        }}
                      >
                        <Utensils className="w-4 h-4 text-white" />
                      </div>
                      <div className="mt-1 px-2 py-0.5 rounded text-[9px] font-bold text-white" style={{ background: "rgba(0,0,0,0.7)" }}>
                        {item.etaMinutes} min • {item.distanceKm} km
                      </div>
                    </div>
                  );
                })}

                {/* Map Legend */}
                <div className="absolute bottom-3 left-3 px-3 py-2.5 rounded-xl" style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)" }}>
                  <div className="text-[10px] font-bold text-white mb-1.5">Traffic Status</div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-[10px] text-white">
                      <span className="w-3 h-1.5 rounded-full" style={{ background: "#10B981" }} /> Clear — Send food
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-white">
                      <span className="w-3 h-1.5 rounded-full" style={{ background: "#F59E0B" }} /> Moderate — Check timing
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-white">
                      <span className="w-3 h-1.5 rounded-full" style={{ background: "#EF4444" }} /> Heavy — Risk of delay
                    </div>
                  </div>
                </div>

                {/* Live indicator */}
                <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg" style={{ background: "rgba(0,0,0,0.6)" }}>
                  <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#10B981" }} />
                  <span className="text-[10px] font-bold text-white">LIVE TRAFFIC</span>
                </div>
              </div>
            )}

              {/* Traffic Decision Summary */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                {initialFeed.map((item) => {
                  const safe = canDeliverInTime(item);
                  return (
                    <div
                      key={item.id}
                      className="p-3 rounded-xl text-center cursor-pointer transition-all hover:scale-105"
                      style={{ background: getTrafficBg(item.trafficStatus), border: `1px solid ${getTrafficColor(item.trafficStatus)}30` }}
                      onClick={() => setSelectedPickup(item)}
                    >
                      <div className="text-[11px] font-bold truncate" style={{ color: "#111827" }}>
                        {item.institution.split("(")[0].trim().substring(0, 18)}...
                      </div>
                      <div className="flex items-center justify-center gap-1 mt-1">
                        <CircleDot className="w-3 h-3" style={{ color: getTrafficColor(item.trafficStatus) }} />
                        <span className="text-[10px] font-bold" style={{ color: getTrafficColor(item.trafficStatus) }}>
                          {getTrafficLabel(item.trafficStatus)}
                        </span>
                      </div>
                      <div className="text-[10px] font-mono-data mt-1" style={{ color: "#6B7280" }}>
                        ETA: {item.etaMinutes} min
                      </div>
                      <div className="mt-1.5">
                        {safe ? (
                          <span className="badge badge-success" style={{ fontSize: "9px", padding: "1px 6px" }}>
                            <Check className="w-2.5 h-2.5" /> SAFE TO SEND
                          </span>
                        ) : (
                          <span className="badge badge-danger" style={{ fontSize: "9px", padding: "1px 6px" }}>
                            <AlertTriangle className="w-2.5 h-2.5" /> RISKY
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Selected Pickup Detail */}
            {selectedPickup && (
              <div className="card p-5" style={{ borderLeft: `4px solid ${getTrafficColor(selectedPickup.trafficStatus)}` }}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-[15px] font-bold" style={{ color: "#111827" }}>{selectedPickup.institution}</h3>
                      <span className="badge" style={{ background: getTrafficBg(selectedPickup.trafficStatus), color: getTrafficColor(selectedPickup.trafficStatus), fontSize: "10px" }}>
                        {getTrafficLabel(selectedPickup.trafficStatus)}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
                      <div>
                        <div className="text-[10px]" style={{ color: "#9CA3AF" }}>Food</div>
                        <div className="text-[13px] font-semibold">{selectedPickup.foodType}</div>
                      </div>
                      <div>
                        <div className="text-[10px]" style={{ color: "#9CA3AF" }}>Quantity</div>
                        <div className="text-[13px] font-semibold font-mono-data">{selectedPickup.quantityKg} kg</div>
                      </div>
                      <div>
                        <div className="text-[10px]" style={{ color: "#9CA3AF" }}>ETA via Current Traffic</div>
                        <div className="text-[13px] font-bold font-mono-data" style={{ color: getTrafficColor(selectedPickup.trafficStatus) }}>
                          {selectedPickup.etaMinutes} minutes
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px]" style={{ color: "#9CA3AF" }}>Safe Until</div>
                        <div className="text-[13px] font-semibold">{selectedPickup.safeUntil}</div>
                      </div>
                    </div>

                    {/* Decision Box */}
                    <div className="p-3 rounded-xl" style={{ background: canDeliverInTime(selectedPickup) ? "#ECFDF5" : "#FEF2F2", border: `1px solid ${canDeliverInTime(selectedPickup) ? "#A7F3D0" : "#FECACA"}` }}>
                      <div className="flex items-center gap-2 text-[13px] font-bold" style={{ color: canDeliverInTime(selectedPickup) ? "#059669" : "#DC2626" }}>
                        {canDeliverInTime(selectedPickup) ? (
                          <>
                            <CheckCircle2 className="w-4 h-4" />
                            Decision: SAFE TO SEND — Food will arrive well within the safety window.
                          </>
                        ) : (
                          <>
                            <AlertTriangle className="w-4 h-4" />
                            Decision: HIGH RISK — Heavy traffic may cause food to expire during transit. Consider alternatives.
                          </>
                        )}
                      </div>
                      <p className="text-[11px] mt-1" style={{ color: "#6B7280" }}>
                        Travel time ({selectedPickup.etaMinutes} min) + loading buffer (30 min) = {selectedPickup.etaMinutes + 30} min total.
                        Food safe for {Math.round(selectedPickup.hoursLeft * 60)} min.
                        {canDeliverInTime(selectedPickup)
                          ? ` Margin: ${Math.round(selectedPickup.hoursLeft * 60) - selectedPickup.etaMinutes - 30} minutes buffer.`
                          : ` Deficit: ${selectedPickup.etaMinutes + 30 - Math.round(selectedPickup.hoursLeft * 60)} minutes short.`}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&origin=28.5459,77.1926&destination=${selectedPickup.lat},${selectedPickup.lng}&travelmode=driving`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-xl text-[12px] font-bold border border-[#A7F3D0] bg-[#ECFDF5] text-[#059669] hover:bg-[#D1FAE5] flex items-center justify-center gap-1.5 transition-all shadow-sm"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-[#10B981]" />
                      Directions on Google Maps
                    </a>

                    {acceptedPickups.includes(selectedPickup.id) ? (
                      <span className="px-4 py-2.5 rounded-xl text-[12px] font-bold flex items-center gap-1.5" style={{ background: "#ECFDF5", color: "#059669", border: "1px solid #A7F3D0" }}>
                        <CheckCircle2 className="w-4 h-4" /> Scheduled
                      </span>
                    ) : canDeliverInTime(selectedPickup) ? (
                      <button
                        onClick={() => handleAccept(selectedPickup)}
                        className="px-4 py-2.5 rounded-xl text-[12px] font-bold flex items-center justify-center gap-1.5 transition-all hover:scale-105"
                        style={{ background: "#10B981", color: "#FFFFFF", boxShadow: "0 4px 12px rgba(16,185,129,0.3)" }}
                      >
                        <Truck className="w-4 h-4" /> Accept & Dispatch
                      </button>
                    ) : (
                      <button className="px-4 py-2.5 rounded-xl text-[12px] font-bold flex items-center justify-center gap-1.5 cursor-not-allowed opacity-60" style={{ background: "#D1D5DB", color: "#6B7280" }}>
                        <AlertTriangle className="w-4 h-4" /> Too Risky
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: Feed + History */}
          <div className="lg:col-span-5 space-y-5">
            {/* Filters */}
            <div className="flex items-center gap-2 flex-wrap">
              <Filter className="w-4 h-4" style={{ color: "#9CA3AF" }} />
              {["All", "< 5 km", "> 40 kg", "Urgent (< 4 hrs)", "Low Traffic"].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilterType(f)}
                  className="px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all"
                  style={{
                    background: filterType === f ? "#10B981" : "#FFFFFF",
                    color: filterType === f ? "#FFFFFF" : "#6B7280",
                    border: filterType === f ? "none" : "1px solid #E5E7EB",
                  }}
                >
                  {f}
                </button>
              ))}
            </div>

            {/* Surplus Feed Cards */}
            <div className="space-y-3">
              {filteredFeed.map((item) => {
                const isAccepted = acceptedPickups.includes(item.id);
                const safe = canDeliverInTime(item);
                return (
                  <div
                    key={item.id}
                    className="card p-4 cursor-pointer transition-all"
                    style={{
                      opacity: isAccepted ? 0.6 : 1,
                      borderLeft: `3px solid ${getTrafficColor(item.trafficStatus)}`,
                    }}
                    onClick={() => setSelectedPickup(item)}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[13px] font-bold" style={{ color: "#111827" }}>{item.foodType}</span>
                          {item.fssaiVerified && (
                            <ShieldCheck className="w-3.5 h-3.5" style={{ color: "#059669" }} />
                          )}
                        </div>
                        <div className="text-[11px]" style={{ color: "#6B7280" }}>{item.institution}</div>

                        <div className="flex items-center gap-3 mt-2 text-[11px]">
                          <span className="flex items-center gap-1" style={{ color: "#6B7280" }}>
                            <MapPin className="w-3 h-3" /> {item.distanceKm} km
                          </span>
                          <span className="flex items-center gap-1 font-bold" style={{ color: getTrafficColor(item.trafficStatus) }}>
                            <Navigation className="w-3 h-3" /> {item.etaMinutes} min
                          </span>
                          <span className="flex items-center gap-1" style={{ color: item.hoursLeft <= 4 ? "#D97706" : "#6B7280" }}>
                            <Clock className="w-3 h-3" /> {item.hoursLeft}h left
                          </span>
                          <span className="font-mono-data font-bold" style={{ color: "#111827" }}>{item.quantityKg} kg</span>
                        </div>

                        {/* Traffic Decision Badge */}
                        <div className="mt-2">
                          {safe ? (
                            <span className="badge badge-success" style={{ fontSize: "10px" }}>
                              <Check className="w-3 h-3" /> Safe to send — will arrive in time
                            </span>
                          ) : (
                            <span className="badge badge-danger" style={{ fontSize: "10px" }}>
                              <AlertTriangle className="w-3 h-3" /> Risky — traffic may cause delay
                            </span>
                          )}
                        </div>
                      </div>

                      <div>
                        {isAccepted ? (
                          <span className="text-[11px] font-bold px-3 py-1.5 rounded-lg" style={{ background: "#ECFDF5", color: "#059669" }}>
                            <Check className="w-3 h-3 inline" /> Scheduled
                          </span>
                        ) : safe ? (
                          <button
                            onClick={(e) => { e.stopPropagation(); handleAccept(item); }}
                            className="text-[11px] font-bold px-3 py-1.5 rounded-lg transition-all hover:scale-105"
                            style={{ background: "#10B981", color: "#FFFFFF" }}
                          >
                            Accept
                          </button>
                        ) : (
                          <span className="text-[11px] font-bold px-3 py-1.5 rounded-lg" style={{ background: "#FEF2F2", color: "#DC2626" }}>
                            Risky
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Past Pickups History */}
            <div className="card p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex rounded-lg overflow-hidden" style={{ border: "1px solid #E5E7EB" }}>
                  <button
                    onClick={() => setPickupsTab("scheduled")}
                    className="px-3 py-1.5 text-[12px] font-semibold"
                    style={{
                      background: pickupsTab === "scheduled" ? "#10B981" : "#FFFFFF",
                      color: pickupsTab === "scheduled" ? "#FFFFFF" : "#6B7280",
                    }}
                  >
                    Scheduled
                  </button>
                  <button
                    onClick={() => setPickupsTab("history")}
                    className="px-3 py-1.5 text-[12px] font-semibold"
                    style={{
                      background: pickupsTab === "history" ? "#10B981" : "#FFFFFF",
                      color: pickupsTab === "history" ? "#FFFFFF" : "#6B7280",
                    }}
                  >
                    History
                  </button>
                </div>
              </div>

              {pickupsTab === "history" && (
                <div className="space-y-2.5">
                  {pastPickupsHistory.map((h) => (
                    <div key={h.id} className="p-3 rounded-xl" style={{ background: "#F9FAFB", border: "1px solid #F3F4F6" }}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[12px] font-bold" style={{ color: "#111827" }}>{h.food}</span>
                        <span className="text-[10px] font-mono-data" style={{ color: "#9CA3AF" }}>{h.receipt}</span>
                      </div>
                      <div className="text-[11px]" style={{ color: "#6B7280" }}>{h.institution} → {h.recipient}</div>
                      <div className="text-[10px]" style={{ color: "#9CA3AF" }}>{h.date}</div>
                    </div>
                  ))}
                </div>
              )}

              {pickupsTab === "scheduled" && (
                <div className="text-center py-6">
                  {acceptedPickups.length > 0 ? (
                    <div className="space-y-2">
                      {initialFeed.filter(i => acceptedPickups.includes(i.id)).map(item => (
                        <div key={item.id} className="p-3 rounded-xl text-left" style={{ background: "#ECFDF5", border: "1px solid #A7F3D0" }}>
                          <div className="text-[12px] font-bold" style={{ color: "#059669" }}>{item.foodType} — {item.quantityKg} kg</div>
                          <div className="text-[11px]" style={{ color: "#6B7280" }}>{item.institution}</div>
                          <div className="text-[10px] font-mono-data mt-1" style={{ color: "#059669" }}>
                            ETA: {item.etaMinutes} min • Driver dispatched
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Truck className="w-8 h-8 mx-auto" style={{ color: "#D1D5DB" }} />
                      <div className="text-[13px] font-semibold" style={{ color: "#6B7280" }}>No scheduled pickups yet</div>
                      <div className="text-[11px]" style={{ color: "#9CA3AF" }}>Accept a surplus pickup from the feed to get started</div>
                    </div>
                  )}
                </div>
              )}
            </div>
        </div>
      </div>
    </div>
  );
}
