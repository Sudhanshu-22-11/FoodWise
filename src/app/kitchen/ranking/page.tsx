"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useApp, getDonorTier, DonorHotel, DonorTier } from "@/context/AppContext";
import {
  Trophy,
  Medal,
  Crown,
  Star,
  Flame,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
  Sparkles,
  Building2,
  MapPin,
  Award,
  Search,
  Share2,
  Download,
  Info,
  Calendar,
  Utensils,
  Gem,
  ArrowRight,
  ThumbsUp,
  Heart,
  ChevronRight,
} from "lucide-react";

const TIER_CONFIG: Record<
  DonorTier,
  {
    color: string;
    bg: string;
    border: string;
    icon: React.ComponentType<{ className?: string }>;
    gradient: string;
    minPoints: number;
    nextTier?: DonorTier;
    nextMin?: number;
  }
> = {
  Platinum: {
    color: "#6366F1",
    bg: "#EEF2FF",
    border: "#C7D2FE",
    icon: Crown,
    gradient: "linear-gradient(135deg, #6366F1 0%, #4338CA 100%)",
    minPoints: 5000,
  },
  Gold: {
    color: "#D97706",
    bg: "#FFFBEB",
    border: "#FDE68A",
    icon: Trophy,
    gradient: "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)",
    minPoints: 2000,
    nextTier: "Platinum",
    nextMin: 5000,
  },
  Silver: {
    color: "#4B5563",
    bg: "#F3F4F6",
    border: "#D1D5DB",
    icon: Medal,
    gradient: "linear-gradient(135deg, #9CA3AF 0%, #4B5563 100%)",
    minPoints: 500,
    nextTier: "Gold",
    nextMin: 2000,
  },
  Bronze: {
    color: "#B45309",
    bg: "#FFF8EB",
    border: "#FDE68A",
    icon: Gem,
    gradient: "linear-gradient(135deg, #D97706 0%, #92400E 100%)",
    minPoints: 0,
    nextTier: "Silver",
    nextMin: 500,
  },
};

const BADGE_STYLES: Record<string, { emoji: string; color: string; bg: string }> = {
  "Consistent Donor": { emoji: "🔄", color: "#065F46", bg: "#ECFDF5" },
  "Top Quality": { emoji: "⭐", color: "#92400E", bg: "#FEF3C7" },
  "Rapid Response": { emoji: "⚡", color: "#1E40AF", bg: "#EFF6FF" },
  "Bulk Contributor": { emoji: "📦", color: "#6B21A8", bg: "#F3E8FF" },
  "Weekend Hero": { emoji: "🦸", color: "#991B1B", bg: "#FEE2E2" },
  "Festival Support": { emoji: "🎪", color: "#9D174D", bg: "#FCE7F3" },
  "Cold Chain Certified": { emoji: "❄️", color: "#155E75", bg: "#ECFEFF" },
  "Zero Waste Champion": { emoji: "♻️", color: "#065F46", bg: "#D1FAE5" },
};

export default function KitchenRankingPage() {
  const { rankedHotels, donorFeedback, getHotelRank } = useApp();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTier, setSelectedTier] = useState<string>("ALL");
  const [onlyMyKitchen, setOnlyMyKitchen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Kitchen's own profile - IIT Delhi Central Mess is h-2
  const kitchenHotelId = "h-2";
  const myKitchen = rankedHotels.find((h) => h.id === kitchenHotelId);
  const myRank = getHotelRank ? getHotelRank(kitchenHotelId) : rankedHotels.findIndex((h) => h.id === kitchenHotelId) + 1;
  const myTier = myKitchen ? getDonorTier(myKitchen.totalPoints) : "Silver";
  const myTierInfo = TIER_CONFIG[myTier];

  // Feedback received specifically by this kitchen
  const myKitchenFeedback = useMemo(() => {
    return donorFeedback.filter(
      (f) => f.hotelId === kitchenHotelId || f.hotelName.toLowerCase().includes("iit delhi")
    );
  }, [donorFeedback, kitchenHotelId]);

  // Points progress calculation
  const nextTierPoints = myTierInfo.nextMin || 5000;
  const currentPoints = myKitchen?.totalPoints || 0;
  const pointsToNext = Math.max(0, nextTierPoints - currentPoints);
  const progressPercent = Math.min(
    100,
    Math.round(
      ((currentPoints - myTierInfo.minPoints) / (nextTierPoints - myTierInfo.minPoints)) * 100
    )
  );

  // Filtered leaderboard
  const filteredHotels = useMemo(() => {
    return rankedHotels.filter((hotel) => {
      const matchesSearch =
        hotel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        hotel.location.toLowerCase().includes(searchQuery.toLowerCase());
      const tier = getDonorTier(hotel.totalPoints);
      const matchesTier = selectedTier === "ALL" || tier === selectedTier;
      const matchesMyKitchen = !onlyMyKitchen || hotel.id === kitchenHotelId;
      return matchesSearch && matchesTier && matchesMyKitchen;
    });
  }, [rankedHotels, searchQuery, selectedTier, onlyMyKitchen, kitchenHotelId]);

  // Top 3 Podium
  const top3 = rankedHotels.slice(0, 3);

  const handleShare = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(
        `🏆 Our Kitchen ranks #${myRank} on the FoodWise Donor Leaderboard with ${currentPoints.toLocaleString()} points (${myTier} Tier)!`
      );
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  return (
    <div className="space-y-6">
      {/* ═══ TOP BREADCRUMB & HEADER ═══ */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold mb-1" style={{ color: "#059669" }}>
            <Link href="/kitchen/dashboard" className="hover:underline flex items-center gap-1">
              Kitchen
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-gray-600 font-bold">Donor Rankings</span>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl lg:text-3xl font-extrabold" style={{ color: "#111827" }}>
              Donor Rankings & Recognition
            </h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Live City Standings
            </span>
          </div>
          <p className="text-sm mt-1" style={{ color: "#6B7280" }}>
            Real-time reputation tiering, peer benchmarks, and verified NGO feedback scores for institutional donors.
          </p>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <button
            onClick={handleShare}
            className="flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm border border-gray-200 bg-white text-gray-800 hover:bg-gray-50 active:scale-95"
          >
            {copiedLink ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-700">Rank Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4 text-gray-500" />
                <span>Share Standing</span>
              </>
            )}
          </button>
          <button
            onClick={() => window.print()}
            className="flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm bg-emerald-600 hover:bg-emerald-700 text-white active:scale-95"
          >
            <Download className="w-4 h-4" />
            <span>Download Certificate</span>
          </button>
        </div>
      </div>

      {/* ═══ HERO SPOTLIGHT: YOUR KITCHEN REPUTATION CARD ═══ */}
      {myKitchen && (
        <div
          className="relative overflow-hidden rounded-3xl p-6 lg:p-8 border shadow-lg"
          style={{
            background: "linear-gradient(135deg, #064E3B 0%, #065F46 50%, #047857 100%)",
            borderColor: "#10B981",
          }}
        >
          {/* Subtle background ornamentation */}
          <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-emerald-400/10 blur-2xl pointer-events-none" />
          <div className="absolute -left-16 -bottom-16 w-64 h-64 rounded-full bg-emerald-300/10 blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-3 max-w-xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-white/20 text-white backdrop-blur-sm border border-white/30">
                  Your Institution
                </span>
                <span
                  className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-sm"
                  style={{ background: myTierInfo.bg, color: myTierInfo.color, border: `1px solid ${myTierInfo.border}` }}
                >
                  <myTierInfo.icon className="w-3.5 h-3.5" />
                  {myTier} Tier Donor
                </span>
                {myKitchen.fssaiVerified && (
                  <span className="px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 bg-emerald-950/60 text-emerald-200 border border-emerald-400/30">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    FSSAI Verified
                  </span>
                )}
              </div>

              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  {myKitchen.name}
                </h2>
                <p className="text-emerald-100/90 text-xs sm:text-sm flex items-center gap-1.5 mt-1 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-emerald-300" />
                  {myKitchen.location} • Ranked #{myRank} across all {rankedHotels.length} certified regional donors
                </p>
              </div>

              {/* Tier Progress Bar */}
              {myTierInfo.nextTier && (
                <div className="bg-emerald-950/40 p-3.5 rounded-2xl border border-emerald-400/20 backdrop-blur-sm space-y-2">
                  <div className="flex items-center justify-between text-xs text-emerald-100 font-semibold">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                      Target: Reach {myTierInfo.nextTier} Tier ({nextTierPoints.toLocaleString()} pts)
                    </span>
                    <span className="text-amber-300 font-bold font-mono-data">
                      {pointsToNext.toLocaleString()} pts remaining
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-emerald-950/80 rounded-full overflow-hidden border border-emerald-400/20">
                    <div
                      className="h-full rounded-full transition-all duration-1000 bg-gradient-to-r from-amber-400 to-emerald-300"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[11px] text-emerald-200/80">
                    <span>{currentPoints.toLocaleString()} pts</span>
                    <span>{progressPercent}% towards next milestone</span>
                    <span>{nextTierPoints.toLocaleString()} pts</span>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Metrics Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-3 w-full lg:w-auto">
              <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-center">
                <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-200 mb-0.5">
                  Current Rank
                </div>
                <div className="text-3xl sm:text-4xl font-black text-white font-mono-data">
                  #{myRank}
                </div>
                <div className="text-[10px] text-emerald-200/80 mt-0.5">City Standing</div>
              </div>

              <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-center">
                <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-200 mb-0.5">
                  Total Points
                </div>
                <div className="text-3xl sm:text-4xl font-black text-amber-300 font-mono-data">
                  {currentPoints.toLocaleString()}
                </div>
                <div className="text-[10px] text-emerald-200/80 mt-0.5">Reputation pts</div>
              </div>

              <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-center">
                <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-200 mb-0.5">
                  Donation Streak
                </div>
                <div className="text-3xl sm:text-4xl font-black text-emerald-300 font-mono-data flex items-center justify-center gap-1">
                  <Flame className="w-6 h-6 text-amber-400 fill-amber-400" />
                  {myKitchen.streak}
                </div>
                <div className="text-[10px] text-emerald-200/80 mt-0.5">consecutive days</div>
              </div>

              <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-center">
                <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-200 mb-0.5">
                  NGO Rating
                </div>
                <div className="text-3xl sm:text-4xl font-black text-white font-mono-data flex items-center justify-center gap-1">
                  <Star className="w-5 h-5 text-amber-300 fill-amber-300" />
                  {myKitchen.avgRating}
                </div>
                <div className="text-[10px] text-emerald-200/80 mt-0.5">({myKitchen.totalRatings} ratings)</div>
              </div>
            </div>
          </div>

          {/* Badges Earned Ribbon */}
          <div className="mt-6 pt-5 border-t border-emerald-400/20 flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-emerald-200 mr-2 flex items-center gap-1">
              <Award className="w-4 h-4 text-amber-300" />
              Verified Badges Earned:
            </span>
            {myKitchen.specialBadges.map((badge) => {
              const style = BADGE_STYLES[badge] || { emoji: "🎖️", color: "#065F46", bg: "#ECFDF5" };
              return (
                <span
                  key={badge}
                  className="px-2.5 py-1 rounded-xl text-xs font-extrabold flex items-center gap-1.5 shadow-sm"
                  style={{ background: style.bg, color: style.color }}
                >
                  <span>{style.emoji}</span>
                  <span>{badge}</span>
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* ═══ TOP 3 PODIUM SHOWCASE ═══ */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold flex items-center gap-2" style={{ color: "#111827" }}>
            <Trophy className="w-5 h-5 text-amber-500" />
            Top Recognized Food Donors Podium
          </h2>
          <span className="text-xs text-gray-500">Updated in real-time</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {top3.map((hotel, idx) => {
            const tier = getDonorTier(hotel.totalPoints);
            const isYou = hotel.id === kitchenHotelId;
            const rankConfig = [
              {
                title: "1st Place • Gold Champion",
                crownColor: "#F59E0B",
                gradient: "linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)",
                badgeBorder: "#F59E0B",
                ribbon: "🥇 Gold Winner",
              },
              {
                title: "2nd Place • Silver Runner-up",
                crownColor: "#9CA3AF",
                gradient: "linear-gradient(135deg, #F3F4F6 0%, #E5E7EB 100%)",
                badgeBorder: "#9CA3AF",
                ribbon: "🥈 Silver Leader",
              },
              {
                title: "3rd Place • Bronze Contender",
                crownColor: "#D97706",
                gradient: "linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 100%)",
                badgeBorder: "#D97706",
                ribbon: "🥉 Bronze Leader",
              },
            ][idx];

            return (
              <div
                key={hotel.id}
                className="relative rounded-2xl p-5 border transition-all hover:shadow-md"
                style={{
                  background: isYou ? "#F0FDF4" : "#FFFFFF",
                  borderColor: isYou ? "#10B981" : rankConfig.badgeBorder,
                  borderWidth: isYou ? "2px" : "1px",
                }}
              >
                {isYou && (
                  <div className="absolute -top-3 right-4 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-600 text-white shadow-sm">
                    Your Kitchen
                  </div>
                )}

                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-lg text-gray-700 bg-gray-100">
                    {rankConfig.ribbon}
                  </span>
                  <span
                    className="text-xs font-black px-2.5 py-0.5 rounded-full"
                    style={{
                      background: TIER_CONFIG[tier].bg,
                      color: TIER_CONFIG[tier].color,
                      border: `1px solid ${TIER_CONFIG[tier].border}`,
                    }}
                  >
                    {tier}
                  </span>
                </div>

                <div className="flex items-start gap-3 mb-3">
                  <div
                    className="w-11 h-11 rounded-2xl flex items-center justify-center font-black text-lg shadow-sm shrink-0"
                    style={{ background: rankConfig.gradient, color: rankConfig.crownColor }}
                  >
                    {idx + 1}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-extrabold text-sm truncate" style={{ color: "#111827" }}>
                      {hotel.name}
                    </h3>
                    <p className="text-[11px] text-gray-500 truncate flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-gray-400" />
                      {hotel.location}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-gray-50/80 border border-gray-100 text-center">
                  <div>
                    <div className="text-[10px] text-gray-400 uppercase font-semibold">Points</div>
                    <div className="text-sm font-black font-mono-data text-gray-900">
                      {hotel.totalPoints.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-gray-400 uppercase font-semibold">Rating</div>
                    <div className="text-sm font-black font-mono-data text-amber-600 flex items-center justify-center gap-0.5">
                      ⭐ {hotel.avgRating}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-gray-400 uppercase font-semibold">Streak</div>
                    <div className="text-sm font-black font-mono-data text-emerald-600">
                      {hotel.streak}d
                    </div>
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap gap-1">
                  {hotel.specialBadges.slice(0, 2).map((b) => (
                    <span
                      key={b}
                      className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white border border-gray-200 text-gray-700"
                    >
                      {BADGE_STYLES[b]?.emoji || "🎖️"} {b}
                    </span>
                  ))}
                  {hotel.specialBadges.length > 2 && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-gray-100 text-gray-500">
                      +{hotel.specialBadges.length - 2}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ═══ LEADERBOARD TABLE + FILTERS ═══ */}
      <div className="card p-6" style={{ background: "#FFFFFF", border: "1px solid #E5E7EB" }}>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-5">
          <div>
            <h2 className="text-lg font-bold" style={{ color: "#111827" }}>
              All Institutional Donors Leaderboard
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Showing {filteredHotels.length} of {rankedHotels.length} institutions in this evaluation cycle
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search hotel, mess, campus..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-gray-50/50"
              />
            </div>

            {/* Toggle My Kitchen */}
            <button
              onClick={() => setOnlyMyKitchen((prev) => !prev)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
                onlyMyKitchen
                  ? "bg-emerald-600 text-white border-emerald-600"
                  : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
              }`}
            >
              📍 My Kitchen Only
            </button>
          </div>
        </div>

        {/* Tier Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 mb-5 pb-3 border-b border-gray-100">
          {["ALL", "Platinum", "Gold", "Silver", "Bronze"].map((tier) => {
            const count =
              tier === "ALL"
                ? rankedHotels.length
                : rankedHotels.filter((h) => getDonorTier(h.totalPoints) === tier).length;
            const isSelected = selectedTier === tier;
            return (
              <button
                key={tier}
                onClick={() => setSelectedTier(tier)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? "bg-gray-900 text-white shadow-sm"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <span>{tier === "ALL" ? "All Tiers" : tier}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isSelected ? "bg-white/20 text-white" : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Table */}
        <div className="overflow-x-auto -mx-6 px-6">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 text-[11px] font-bold uppercase tracking-wider text-gray-500 bg-gray-50/60">
                <th className="py-3 px-3">Rank</th>
                <th className="py-3 px-3">Donor Institution</th>
                <th className="py-3 px-3">Tier</th>
                <th className="py-3 px-3">Reputation Points</th>
                <th className="py-3 px-3">NGO Rating</th>
                <th className="py-3 px-3">Streak</th>
                <th className="py-3 px-3">Total Donations</th>
                <th className="py-3 px-3">Key Badges</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs">
              {filteredHotels.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-gray-400">
                    No donor institutions found matching your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredHotels.map((hotel) => {
                  const rank = rankedHotels.findIndex((h) => h.id === hotel.id) + 1;
                  const tier = getDonorTier(hotel.totalPoints);
                  const isYou = hotel.id === kitchenHotelId;
                  const tierData = TIER_CONFIG[tier];

                  return (
                    <tr
                      key={hotel.id}
                      className={`transition-colors ${
                        isYou
                          ? "bg-emerald-50/70 font-semibold"
                          : "hover:bg-gray-50/80"
                      }`}
                    >
                      {/* Rank */}
                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs ${
                              rank === 1
                                ? "bg-amber-400 text-amber-950 font-black"
                                : rank === 2
                                ? "bg-gray-300 text-gray-900"
                                : rank === 3
                                ? "bg-amber-700 text-white"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {rank}
                          </span>
                        </div>
                      </td>

                      {/* Institution Name & Location */}
                      <td className="py-3.5 px-3">
                        <div>
                          <div className="font-bold flex items-center gap-2 text-gray-900">
                            {hotel.name}
                            {isYou && (
                              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-600 text-white">
                                You
                              </span>
                            )}
                            {hotel.fssaiVerified && (
                              <span title="FSSAI Verified">
                                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-gray-400 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3" />
                            {hotel.location}
                          </div>
                        </div>
                      </td>

                      {/* Tier Badge */}
                      <td className="py-3.5 px-3">
                        <span
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black"
                          style={{
                            background: tierData.bg,
                            color: tierData.color,
                            border: `1px solid ${tierData.border}`,
                          }}
                        >
                          <tierData.icon className="w-3 h-3" />
                          {tier}
                        </span>
                      </td>

                      {/* Points */}
                      <td className="py-3.5 px-3">
                        <span className="font-black font-mono-data text-sm text-gray-900">
                          {hotel.totalPoints.toLocaleString()}
                        </span>
                        <span className="text-[10px] text-gray-400 ml-1">pts</span>
                      </td>

                      {/* Rating */}
                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-amber-600 font-mono-data">
                            ⭐ {hotel.avgRating}
                          </span>
                          <span className="text-[10px] text-gray-400">
                            ({hotel.totalRatings})
                          </span>
                        </div>
                      </td>

                      {/* Streak */}
                      <td className="py-3.5 px-3">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-bold text-emerald-700 bg-emerald-100/70">
                          <Flame className="w-3 h-3 text-amber-500 fill-amber-500" />
                          {hotel.streak} days
                        </span>
                      </td>

                      {/* Donations count */}
                      <td className="py-3.5 px-3">
                        <div className="text-gray-800 font-medium">
                          {hotel.totalDonations} dispatches
                        </div>
                        <div className="text-[10px] text-gray-400">
                          Last: {hotel.lastDonation}
                        </div>
                      </td>

                      {/* Badges */}
                      <td className="py-3.5 px-3">
                        <div className="flex flex-wrap gap-1 max-w-[200px]">
                          {hotel.specialBadges.map((badge) => (
                            <span
                              key={badge}
                              className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-gray-100 text-gray-700 whitespace-nowrap"
                            >
                              {BADGE_STYLES[badge]?.emoji || "🎖️"} {badge}
                            </span>
                          ))}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ═══ REPUTATION METRICS & NGO FEEDBACK SECTION ═══ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: How Scoring & Perks Work */}
        <div className="space-y-4">
          <div className="card p-5" style={{ background: "#FFFFFF", border: "1px solid #E5E7EB" }}>
            <h3 className="text-sm font-bold flex items-center gap-2 mb-3" style={{ color: "#111827" }}>
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              How Points & Reputation Work
            </h3>
            <div className="space-y-2.5 text-xs text-gray-600">
              <div className="p-2.5 rounded-xl bg-gray-50 flex items-center justify-between border border-gray-100">
                <span>5★ Overall NGO Review</span>
                <span className="font-extrabold text-emerald-700 font-mono-data">+85 pts</span>
              </div>
              <div className="p-2.5 rounded-xl bg-gray-50 flex items-center justify-between border border-gray-100">
                <span>4★ Overall NGO Review</span>
                <span className="font-extrabold text-amber-700 font-mono-data">+70 pts</span>
              </div>
              <div className="p-2.5 rounded-xl bg-gray-50 flex items-center justify-between border border-gray-100">
                <span>7-Day Continuous Donation Streak</span>
                <span className="font-extrabold text-indigo-700 font-mono-data">+50 pts</span>
              </div>
              <div className="p-2.5 rounded-xl bg-gray-50 flex items-center justify-between border border-gray-100">
                <span>Fast Handover (&lt;30 mins)</span>
                <span className="font-extrabold text-emerald-700 font-mono-data">+25 pts</span>
              </div>
              <div className="p-2.5 rounded-xl bg-gray-50 flex items-center justify-between border border-gray-100">
                <span>Zero Complaint Verification</span>
                <span className="font-extrabold text-emerald-700 font-mono-data">+40 pts</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100">
              <h4 className="text-xs font-bold text-gray-900 mb-2">Tier Unlocks & Perks</h4>
              <ul className="text-[11px] text-gray-600 space-y-1.5 list-disc pl-4">
                <li><strong className="text-indigo-900">Platinum:</strong> Instant Priority AI Dispatch & State Sustainability Nomination.</li>
                <li><strong className="text-amber-900">Gold:</strong> Green Kitchen Certification & Expedited NGO Matching.</li>
                <li><strong className="text-gray-900">Silver:</strong> Automated Smart Routing & Weekly Waste Analytics.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Right 2 cols: Recent NGO Feedback For Your Kitchen */}
        <div className="lg:col-span-2 space-y-4">
          <div className="card p-5" style={{ background: "#FFFFFF", border: "1px solid #E5E7EB" }}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold flex items-center gap-2" style={{ color: "#111827" }}>
                  <ThumbsUp className="w-4 h-4 text-emerald-600" />
                  Recent NGO Feedback For Your Kitchen
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Verified reviews submitted by recipient NGO dispatch teams
                </p>
              </div>
              <span className="text-xs font-extrabold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                {myKitchenFeedback.length} Verified Reviews
              </span>
            </div>

            {myKitchenFeedback.length === 0 ? (
              <div className="p-6 text-center text-gray-400 bg-gray-50 rounded-2xl border border-gray-100 text-xs">
                No NGO feedback received yet. Submit surplus batches to receive live ratings and points!
              </div>
            ) : (
              <div className="space-y-3">
                {myKitchenFeedback.map((fb) => (
                  <div
                    key={fb.id}
                    className="p-4 rounded-2xl border border-gray-100 bg-gray-50/60 hover:bg-gray-50 transition-all space-y-2.5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="font-bold text-xs text-gray-900 flex items-center gap-2">
                          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                          <span>Recipient NGO Feedback</span>
                          <span className="text-[10px] font-normal text-gray-400">
                            • {fb.date}
                          </span>
                        </div>
                        <p className="text-xs text-gray-700 mt-1 italic">
                          &ldquo;{fb.comment}&rdquo;
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-black bg-emerald-100 text-emerald-800 font-mono-data">
                          +{fb.pointsAwarded} pts
                        </span>
                        <div className="text-[11px] font-bold text-amber-600 mt-1">
                          ⭐ {fb.overallRating.toFixed(1)} / 5.0
                        </div>
                      </div>
                    </div>

                    {/* Metric pills */}
                    <div className="grid grid-cols-4 gap-2 pt-2 border-t border-gray-200/60 text-center text-[10px]">
                      <div className="p-1.5 rounded-lg bg-white border border-gray-100">
                        <span className="text-gray-400 block font-medium">Quality</span>
                        <span className="font-bold text-gray-900">{fb.foodQuality}★</span>
                      </div>
                      <div className="p-1.5 rounded-lg bg-white border border-gray-100">
                        <span className="text-gray-400 block font-medium">Packaging</span>
                        <span className="font-bold text-gray-900">{fb.packaging}★</span>
                      </div>
                      <div className="p-1.5 rounded-lg bg-white border border-gray-100">
                        <span className="text-gray-400 block font-medium">Timeliness</span>
                        <span className="font-bold text-gray-900">{fb.timeliness}★</span>
                      </div>
                      <div className="p-1.5 rounded-lg bg-white border border-gray-100">
                        <span className="text-gray-400 block font-medium">Quantity</span>
                        <span className="font-bold text-gray-900">{fb.quantity}★</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
