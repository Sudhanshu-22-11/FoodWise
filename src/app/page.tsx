"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { InstitutionRole } from "@/lib/types";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  BrainCircuit,
  TrendingDown,
  Layers,
  HeartHandshake,
} from "lucide-react";

export default function LandingPage() {
  const router = useRouter();
  const { setCurrentRole } = useApp();

  const [selectedRole, setSelectedRole] = useState<InstitutionRole>("KITCHEN_MANAGER");
  const [email, setEmail] = useState("warden.mess@iitd.ac.in");
  const [password, setPassword] = useState("••••••••••••");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const roles = [
    {
      id: "KITCHEN_MANAGER" as InstitutionRole,
      label: "As Kitchen / Mess",
      badge: "IIT Delhi Warden",
      defaultEmail: "warden.mess@iitd.ac.in",
      destination: "/kitchen/dashboard",
      quote:
        "Seamless surplus forecasting & recovery experience! FoodWise makes forecasting student meals and coordinating with local shelter homes effortless. We prevented 1,840 kg of edible food waste this month alone.",
      author: "Dr. S.R. Sharma",
      title: "Mess Warden, IIT Delhi Central Mess",
      avatarBg: "#10B981",
      avatarInitials: "SR",
    },
    {
      id: "FACTORY_MANAGER" as InstitutionRole,
      label: "As Factory Plant",
      badge: "Haldirams Unit 3",
      defaultEmail: "ops.head@haldirams.com",
      destination: "/factory/dashboard",
      quote:
        "Industrial IoT precision at its finest. Cold-storage ethylene and machine telemetry alerts salvaged 3 high-risk spinach batches before spoilage, boosting line recovery yield by 18.5%.",
      author: "Rajesh K. Singhania",
      title: "VP Production, Punjab Agro Facility",
      avatarBg: "#F59E0B",
      avatarInitials: "RS",
    },
    {
      id: "NGO_PARTNER" as InstitutionRole,
      label: "As Relief NGO",
      badge: "Robin Hood Army",
      defaultEmail: "relief@robinhoodarmy.com",
      destination: "/ngo/dashboard",
      quote:
        "Instant relief dispatch with verified FSSAI handoff! Real-time traffic congestion buffers ensure hot nutritious meals reach homeless shelters in Hauz Khas and Malviya Nagar in under 22 minutes.",
      author: "Aasha Verma",
      title: "Zonal Director, Food Relief Network",
      avatarBg: "#3B82F6",
      avatarInitials: "AV",
    },
  ];

  const currentRoleConfig = roles.find((r) => r.id === selectedRole) || roles[0];

  const handleRoleChange = (roleId: InstitutionRole) => {
    setSelectedRole(roleId);
    const target = roles.find((r) => r.id === roleId);
    if (target) {
      setEmail(target.defaultEmail);
    }
  };

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setCurrentRole(selectedRole);

    setTimeout(() => {
      router.push(currentRoleConfig.destination);
    }, 450);
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-3 sm:p-6 lg:p-10 relative overflow-hidden"
      style={{
        background: "radial-gradient(ellipse at center, #18422A 0%, #0F2A1C 60%, #091D13 100%)",
      }}
    >
      {/* Subtle organic decorative glow */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Centered Floating Card */}
      <div className="w-full max-w-[1040px] bg-[#FBF9F4] rounded-[32px] shadow-2xl overflow-hidden border border-emerald-800/30 relative z-10 grid grid-cols-1 lg:grid-cols-12 animate-in fade-in zoom-in-95 duration-200">
        {/* LEFT COLUMN: Sign In Form (7 cols) */}
        <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-between bg-[#FBF9F4]">
          {/* Top Logo & Brand */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl overflow-hidden bg-white p-0.5 border border-emerald-200 shadow-xs flex items-center justify-center">
                <img src="/logo.png" alt="FoodWise Logo" className="w-full h-full object-contain" />
              </div>
              <span className="font-extrabold text-xl text-[#143826] tracking-tight">
                FoodWise
              </span>
            </div>

            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-100/70 text-emerald-800 border border-emerald-300 font-mono-data">
              SIH &apos;26 • AI Engine
            </span>
          </div>

          {/* Form Content */}
          <div className="my-6 space-y-5">
            <div className="text-center">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                Sign In
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                Welcome back! Please enter your details to continue
              </p>
            </div>

            {/* Role Radio Pill Selectors (Reference design style) */}
            <div className="flex items-center justify-center gap-2 sm:gap-4 flex-wrap pt-1">
              {roles.map((r) => {
                const isSelected = selectedRole === r.id;
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => handleRoleChange(r.id)}
                    className="flex items-center gap-2 text-xs font-semibold cursor-pointer py-1 px-2 rounded-lg transition-colors hover:bg-gray-100"
                  >
                    <span
                      className={`w-4 h-4 rounded-full flex items-center justify-center border transition-all ${
                        isSelected ? "border-emerald-700 bg-white" : "border-gray-300 bg-white"
                      }`}
                    >
                      {isSelected && <span className="w-2 h-2 rounded-full bg-[#164A31]" />}
                    </span>
                    <span className={isSelected ? "text-gray-900 font-bold" : "text-gray-600"}>
                      {r.label}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Social Sign-In Buttons */}
            <div className="space-y-2.5 pt-1">
              <button
                type="button"
                onClick={() => {
                  setIsLoading(true);
                  setCurrentRole(selectedRole);
                  setTimeout(() => router.push(currentRoleConfig.destination), 350);
                }}
                className="w-full py-2.5 px-4 rounded-full border border-gray-200 bg-white hover:bg-gray-50 text-xs sm:text-sm font-semibold text-gray-700 shadow-2xs flex items-center justify-center gap-3 transition-all cursor-pointer active:scale-[0.99]"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.24v3.15C3.26 21.36 7.34 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.24C.45 8.16 0 9.98 0 12s.45 3.84 1.24 5.42l4.04-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.24 6.58l4.04 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                  />
                </svg>
                <span>Sign in with Google</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsLoading(true);
                  setCurrentRole(selectedRole);
                  setTimeout(() => router.push(currentRoleConfig.destination), 350);
                }}
                className="w-full py-2.5 px-4 rounded-full border border-gray-200 bg-white hover:bg-gray-50 text-xs sm:text-sm font-semibold text-gray-700 shadow-2xs flex items-center justify-center gap-3 transition-all cursor-pointer active:scale-[0.99]"
              >
                <svg className="w-4 h-4 shrink-0 fill-current text-gray-900" viewBox="0 0 24 24">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.42c.62-.75 1.04-1.8 0.92-2.85-.9.04-1.99.6-2.63 1.35-.57.65-1.06 1.72-.93 2.74 1 .08 2.02-.49 2.64-1.24" />
                </svg>
                <span>Sign in with Apple</span>
              </button>
            </div>

            {/* OR Divider */}
            <div className="relative my-3 flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <span className="relative bg-[#FBF9F4] px-3 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                OR
              </span>
            </div>

            {/* Email & Password Form */}
            <form onSubmit={handleSignIn} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Email *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@organization.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-full border border-gray-200 bg-white text-xs sm:text-sm font-medium text-gray-900 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 transition-all shadow-2xs"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-gray-700">
                    Password *
                  </label>
                  <button
                    type="button"
                    onClick={() => alert("Pre-configured Demo Mode: Direct sign-in is enabled for testing all modules.")}
                    className="text-[11px] font-semibold text-emerald-800 hover:text-emerald-900 hover:underline cursor-pointer"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 rounded-full border border-gray-200 bg-white text-xs sm:text-sm font-medium text-gray-900 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 transition-all shadow-2xs"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 mt-1 rounded-full font-bold text-sm text-white shadow-lg shadow-emerald-950/20 flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-[0.98] hover:brightness-110"
                style={{
                  background: "#164A31",
                }}
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="text-center pt-1">
              <span className="text-xs text-gray-500">
                Don&apos;t have an account?{" "}
                <button
                  type="button"
                  onClick={() => alert("SIH 2026 Evaluation: All 3 roles (Kitchen, Factory, NGO) are pre-unlocked. Select any role above to enter.")}
                  className="font-bold text-emerald-800 hover:underline cursor-pointer"
                >
                  Sign Up
                </button>
              </span>
            </div>
          </div>

          {/* Quick Demo Access Bar */}
          <div className="pt-3 border-t border-gray-200/80 flex items-center justify-between text-[11px] text-gray-400">
            <span>Demo: Auto-filled credentials</span>
            <div className="flex items-center gap-2 font-semibold">
              <Link href="/kitchen/dashboard" className="text-emerald-700 hover:underline">Kitchen →</Link>
              <span>•</span>
              <Link href="/factory/dashboard" className="text-amber-700 hover:underline">Factory →</Link>
              <span>•</span>
              <Link href="/ngo/dashboard" className="text-blue-700 hover:underline">NGO →</Link>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Impact Quote & Thematic Illustration (5 cols) */}
        <div className="lg:col-span-5 bg-[#F5F2EB] p-6 sm:p-10 lg:p-12 flex flex-col justify-between relative overflow-hidden border-t lg:border-t-0 lg:border-l border-gray-200">
          {/* Top quote area */}
          <div className="space-y-3 relative z-10">
            {/* Orange Quote Mark */}
            <div className="text-[#E66A35] font-serif text-3xl font-black leading-none select-none">
              “
            </div>

            {/* Testimonial Quote */}
            <p className="text-xs sm:text-sm font-medium text-gray-800 leading-relaxed">
              {currentRoleConfig.quote}
            </p>

            <div className="text-[#E66A35] font-serif text-3xl font-black leading-none select-none text-right">
              ”
            </div>

            {/* Author Block */}
            <div className="flex items-center gap-3 pt-1">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs text-white shadow-xs shrink-0"
                style={{ background: currentRoleConfig.avatarBg }}
              >
                {currentRoleConfig.avatarInitials}
              </div>
              <div>
                <div className="font-bold text-xs sm:text-sm text-gray-900">
                  {currentRoleConfig.author}
                </div>
                <div className="text-[11px] text-gray-500">
                  {currentRoleConfig.title}
                </div>
              </div>
            </div>
          </div>

          {/* Project Illustration matching reference */}
          <div className="mt-6 -mx-6 -mb-6 sm:-mx-10 sm:-mb-10 lg:-mx-12 lg:-mb-12 relative flex justify-end">
            <img
              src="/login-illustration.png"
              alt="FoodWise Sustainable Kitchen & Food Logistics"
              className="w-full max-h-[310px] object-cover object-bottom opacity-95 hover:opacity-100 transition-opacity"
            />
          </div>
        </div>
      </div>

      {/* Footer Branding */}
      <div className="mt-6 text-center text-xs text-emerald-300/60 font-medium">
        FoodWise • AI Autonomous Food Waste Prevention & Redistribution Platform • Smart India Hackathon 2026
      </div>
    </div>
  );
}
