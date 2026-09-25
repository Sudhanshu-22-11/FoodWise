"use client";

import React, { useState } from "react";
import { downloadNgoImpactCertificatePdf } from "@/lib/pdfGenerator";
import {
  HeartHandshake,
  Users,
  Route,
  ShieldCheck,
  Award,
  Download,
  Calendar,
  Sparkles,
  ArrowUpRight,
  CheckCircle2,
  FileSpreadsheet,
  Clock,
  Building,
  Star,
  MapPin,
  TrendingUp,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { useApp } from "@/context/AppContext";

export default function NgoReportsPage() {
  const { rankedHotels } = useApp();
  const [timeRange, setTimeRange] = useState<"This Month" | "Last Quarter" | "Year to Date">("This Month");
  const [selectedHub, setSelectedHub] = useState<string>("ALL");
  const [downloading, setDownloading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Distribution by shelter community
  const shelterDistributionData = [
    { hub: "Okhla Slums", meals: 8450, children: 3200, elders: 1400 },
    { hub: "Nizamuddin Shelter", meals: 6800, children: 1900, elders: 2200 },
    { hub: "Yamuna Pushta", meals: 7400, children: 2800, elders: 1600 },
    { hub: "Sarai Kale Khan", meals: 5800, children: 1700, elders: 1500 },
  ];

  // Nutritional breakdown
  const nutritionData = [
    { name: "Wholesome Rice & Roti (Carbs)", value: 42, color: "#10B981" },
    { name: "Lentils, Dal & Paneer (Protein)", value: 31, color: "#6366F1" },
    { name: "Cooked Vegetables & Salads", value: 18, color: "#F59E0B" },
    { name: "Dairy, Curd & Bakery", value: 9, color: "#EC4899" },
  ];

  // Daily distribution timeline
  const dailyDistributionTrend = [
    { day: "Mon", meals: 950, avgDeliveryMin: 32 },
    { day: "Tue", meals: 1100, avgDeliveryMin: 28 },
    { day: "Wed", meals: 890, avgDeliveryMin: 35 },
    { day: "Thu", meals: 1250, avgDeliveryMin: 30 },
    { day: "Fri", meals: 1420, avgDeliveryMin: 38 },
    { day: "Sat", meals: 1680, avgDeliveryMin: 41 },
    { day: "Sun", meals: 1510, avgDeliveryMin: 34 },
  ];

  const handleExport = (type: string) => {
    setDownloading(true);
    if (type.includes("Certificate") || type.includes("PDF")) {
      downloadNgoImpactCertificatePdf({
        ngoName: "Robin Hood Army & Feeding India Coalition",
        certificateType: type,
        mealsServed: 24800,
        co2SavedKg: 12400,
      });
    } else {
      const csvContent = "data:text/csv;charset=utf-8," + 
        "Day,MealsDistributed,AvgDeliveryMin\n" +
        dailyDistributionTrend.map(d => `${d.day},${d.meals},${d.avgDeliveryMin}`).join("\n");
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "FoodWise_NGO_Distribution_Report.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    setTimeout(() => {
      setDownloading(false);
      setToastMessage(`${type} downloaded successfully!`);
      setTimeout(() => setToastMessage(null), 4000);
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-2 bg-[#10B981] text-white px-4 py-3 rounded-xl shadow-xl text-sm font-semibold animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-5 h-5" />
          {toastMessage}
        </div>
      )}

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#E8ECF3]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-amber-600 uppercase tracking-wider bg-amber-50 px-2.5 py-0.5 rounded-md border border-amber-100">
              Community Food Security & Relief
            </span>
            <span className="text-gray-300">•</span>
            <span className="text-xs text-gray-500 font-medium">
              Robin Hood Army — South Delhi Chapter (NGO-DL-04)
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight">
            Hunger Relief & Community Distribution Impact
          </h1>
          <p className="text-xs sm:text-sm text-[#6B7280] mt-1">
            Verified recipient demographics, cold-chain turnaround latency, and donor hotel hygiene audit scorecards.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center bg-white border border-[#E5E7EB] rounded-xl p-1 shadow-sm text-xs font-semibold text-[#374151]">
            {(["This Month", "Last Quarter", "Year to Date"] as const).map((period) => (
              <button
                key={period}
                onClick={() => setTimeRange(period)}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  timeRange === period
                    ? "bg-[#10B981] text-white shadow-xs"
                    : "hover:bg-gray-100 text-[#6B7280]"
                }`}
              >
                {period}
              </button>
            ))}
          </div>

          <button
            onClick={() => handleExport("80G CSR Social Impact Certificate (PDF)")}
            disabled={downloading}
            className="px-3.5 py-2 rounded-xl bg-white hover:bg-gray-50 text-[#111827] text-xs font-semibold border border-[#E5E7EB] shadow-sm transition-all flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-[#10B981]" />
            {downloading ? "Exporting..." : "80G Certificate"}
          </button>

          <button
            onClick={() => handleExport("District Food Security Audit (CSV)")}
            className="px-3.5 py-2 rounded-xl bg-[#10B981] hover:bg-[#059669] text-white text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            Export CSV
          </button>
        </div>
      </div>

      {/* 4 NGO IMPACT KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Meals Distributed */}
        <div className="stat-card stat-card-amber p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[13px] font-medium text-[#6B7280]">
              Total Meals Distributed
            </span>
            <div className="icon-container icon-container-amber">
              <HeartHandshake className="w-5 h-5" />
            </div>
          </div>
          <div className="text-[28px] font-extrabold font-mono-data text-[#111827] mb-1">
            28,450
          </div>
          <div className="flex items-center gap-1.5 text-xs">
            <span className="trend-up flex items-center gap-0.5 text-emerald-600 font-semibold">
              <ArrowUpRight className="w-3.5 h-3.5" />
              +24.8% vs last month
            </span>
            <span className="text-gray-400">• 4 Shelter Hubs</span>
          </div>
        </div>

        {/* Card 2: Beneficiaries Reached */}
        <div className="stat-card stat-card-indigo p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[13px] font-medium text-[#6B7280]">
              Active Beneficiaries
            </span>
            <div className="icon-container icon-container-indigo">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-[28px] font-extrabold font-mono-data text-[#111827] mb-1">
            9,600 <span className="text-base font-normal text-gray-500">people</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-indigo-700 font-semibold">
              38% Children • 26% Elderly
            </span>
          </div>
        </div>

        {/* Card 3: Logistics Turnaround */}
        <div className="stat-card stat-card-emerald p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[13px] font-medium text-[#6B7280]">
              Avg Delivery Turnaround
            </span>
            <div className="icon-container icon-container-emerald">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="text-[28px] font-extrabold font-mono-data text-[#111827] mb-1">
            33.8 <span className="text-base font-normal text-gray-500">mins</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-emerald-700 font-semibold">
              Safe Window: 2.8 hrs buffer
            </span>
            <span className="text-gray-400">• Zero spoil</span>
          </div>
        </div>

        {/* Card 4: Social Relief Value */}
        <div className="stat-card stat-card-cyan p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[13px] font-medium text-[#6B7280]">
              Equivalent Meal Value
            </span>
            <div className="icon-container icon-container-cyan">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="text-[28px] font-extrabold font-mono-data text-[#111827] mb-1">
            ₹14,22,500
          </div>
          <div className="flex items-center gap-1.5 text-xs">
            <span className="trend-up flex items-center gap-0.5 text-emerald-600 font-semibold">
              <TrendingUp className="w-3.5 h-3.5" />
              Direct social impact
            </span>
          </div>
        </div>
      </div>

      {/* CHARTS: COMMUNITY DISTRIBUTION & NUTRITION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Hub Wise Distribution (8 cols) */}
        <div className="lg:col-span-8 card p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <h3 className="section-title">Distribution by Community Shelter</h3>
              <p className="section-subtitle">
                Total hot meals served across verified relief locations in South & Central Delhi
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 font-medium text-gray-700">
                <span className="w-3 h-3 rounded-sm bg-[#10B981]" /> Total Meals
              </span>
              <span className="flex items-center gap-1.5 font-medium text-gray-700">
                <span className="w-3 h-3 rounded-sm bg-[#6366F1]" /> Children
              </span>
            </div>
          </div>

          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={shelterDistributionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                <XAxis dataKey="hub" stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1F2937",
                    borderRadius: "12px",
                    border: "none",
                    color: "#FFFFFF",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="meals" name="Total Meals" fill="#10B981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="children" name="Children Reached" fill="#6366F1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>100% verified Aadhaar / NGO ration registry distribution protocol.</span>
            </div>
            <span className="font-semibold text-emerald-700">Peak Volume: Okhla Slums (8,450 meals)</span>
          </div>
        </div>

        {/* Nutrition Distribution (4 cols) */}
        <div className="lg:col-span-4 card p-6 flex flex-col justify-between">
          <div>
            <h3 className="section-title">Nutritional Composition</h3>
            <p className="section-subtitle">Balanced macro-nutrient breakdown</p>

            <div className="h-[180px] w-full mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={nutritionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {nutritionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-2 mt-2">
              {nutritionData.map((nut) => (
                <div key={nut.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: nut.color }} />
                    <span className="text-gray-700 font-medium">{nut.name}</span>
                  </div>
                  <span className="font-mono-data font-bold text-gray-900">{nut.value}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-900 flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              <strong>Nutrition Standard:</strong> Meals meet National Food Security Act (NFSA) daily caloric benchmark of 650 kcal per adult.
            </span>
          </div>
        </div>
      </div>

      {/* DONOR HOTEL & MESS INTEGRITY SCORECARD TABLE */}
      <div className="card p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="section-title">Donor Integrity & Food Quality Audit</h3>
            <p className="section-subtitle">
              Transparency scorecard for connected hotels, cafeterias, and institutional kitchens
            </p>
          </div>
          <span className="badge badge-success font-mono-data">
            {rankedHotels.length} Verified Food Donors
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="data-table w-full">
            <thead>
              <tr>
                <th>Donor Institution</th>
                <th>Location</th>
                <th>Donation Trips</th>
                <th>Quality Rating</th>
                <th>Points & Tier</th>
                <th>FSSAI Verified</th>
                <th>Last Food Contribution</th>
              </tr>
            </thead>
            <tbody>
              {rankedHotels.map((hotel) => (
                <tr key={hotel.id}>
                  <td>
                    <div className="font-bold text-gray-900 flex items-center gap-1.5">
                      <Building className="w-3.5 h-3.5 text-gray-400" />
                      {hotel.name}
                    </div>
                  </td>
                  <td className="text-xs text-gray-500">{hotel.location}</td>
                  <td className="font-mono-data font-semibold text-gray-900">{hotel.totalDonations} pickups</td>
                  <td>
                    <div className="flex items-center gap-1 text-xs font-bold text-amber-600">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      {hotel.avgRating.toFixed(1)} / 5.0
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-indigo font-mono-data">
                      {hotel.totalPoints} pts
                    </span>
                  </td>
                  <td>
                    {hotel.fssaiVerified ? (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        Verified
                      </span>
                    ) : (
                      <span className="text-xs text-gray-400">Pending</span>
                    )}
                  </td>
                  <td className="text-xs text-gray-500">{hotel.lastDonation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-gray-500">
          <div>
            Donations monitored under the <strong>Indian Food Safety and Standards (Recovery & Distribution of Surplus Food) Regulations, 2019</strong>.
          </div>
          <button
            onClick={() => handleExport("Donor ESG Impact Certificate (PDF)")}
            className="text-emerald-700 hover:text-emerald-800 font-semibold underline underline-offset-2"
          >
            Download Donor Appreciation Certificates (PDF)
          </button>
        </div>
      </div>
    </div>
  );
}
