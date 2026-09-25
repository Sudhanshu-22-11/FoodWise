"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { InstitutionRole } from "@/lib/types";
import {
  Sparkles,
  Utensils,
  Factory,
  HeartHandshake,
  Truck,
  Shield,
  ArrowRight,
  Lock,
  Mail,
  CheckCircle2,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { setCurrentRole } = useApp();
  const [selectedRole, setSelectedRole] = useState<InstitutionRole>("KITCHEN_MANAGER");
  const [email, setEmail] = useState("warden.mess@iitd.ac.in");
  const [password, setPassword] = useState("••••••••••••");
  const [isLoading, setIsLoading] = useState(false);

  const roles: {
    id: InstitutionRole;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    defaultEmail: string;
    destination: string;
    description: string;
  }[] = [
    {
      id: "KITCHEN_MANAGER",
      label: "Kitchen Manager",
      icon: Utensils,
      defaultEmail: "warden.mess@iitd.ac.in",
      destination: "/kitchen/dashboard",
      description: "IIT Delhi Central Mess & Student Hostels",
    },
    {
      id: "FACTORY_MANAGER",
      label: "Factory Manager",
      icon: Factory,
      defaultEmail: "ops.head@haldirams.com",
      destination: "/factory/dashboard",
      description: "Haldiram's Food Processing Unit 3",
    },
    {
      id: "NGO_PARTNER",
      label: "NGO Partner",
      icon: HeartHandshake,
      defaultEmail: "relief@robinhoodarmy.com",
      destination: "/ngo/dashboard",
      description: "Robin Hood Army Delhi-NCR Hub",
    },
    {
      id: "LOGISTICS",
      label: "Logistics",
      icon: Truck,
      defaultEmail: "fleet.delhi@foodwise.in",
      destination: "/kitchen/routes",
      description: "Cold-Chain Dispatch & Route Fleet",
    },
    {
      id: "ADMIN",
      label: "Admin",
      icon: Shield,
      defaultEmail: "governance@sih2026.gov.in",
      destination: "/dashboard/impact",
      description: "FSSAI & Ministry ESG Oversight",
    },
  ];

  const handleRoleSelect = (roleItem: typeof roles[0]) => {
    setSelectedRole(roleItem.id);
    setEmail(roleItem.defaultEmail);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setCurrentRole(selectedRole);

    setTimeout(() => {
      const active = roles.find((r) => r.id === selectedRole);
      router.push(active ? active.destination : "/kitchen/dashboard");
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#F4F6FA] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-gradient-to-b from-[#00D4AA]/15 to-transparent blur-[120px] pointer-events-none" />
      <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none" />

      {/* Main Login Card */}
      <div className="w-full max-w-xl card border border-[#E8ECF3] p-8 rounded-3xl shadow-2xl relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#00D4AA] to-[#10B981] p-0.5 shadow-lg shadow-[#10B981]/20">
              <div className="w-full h-full bg-[#F4F6FA] rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-[#10B981]" />
              </div>
            </div>
            <span className="text-xl font-black text-[#111827]">
              FoodWise <span className="text-[#10B981]">AI</span>
            </span>
          </Link>
          <h1 className="text-xl font-bold text-[#111827]">Institutional Access Portal</h1>
          <p className="text-xs text-[#6B7280] mt-1">
            Choose your organization role to launch the tailored AI dashboard
          </p>
        </div>

        {/* Role Selector Grid */}
        <div className="mb-6">
          <label className="block text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-2.5">
            Select Operational Persona
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {roles.map((r) => {
              const Icon = r.icon;
              const isSelected = selectedRole === r.id;
              return (
                <button
                  type="button"
                  key={r.id}
                  onClick={() => handleRoleSelect(r)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    isSelected
                      ? "bg-[#10B981]/15 border-[#00D4AA] ring-1 ring-[#00D4AA]"
                      : "bg-[#FAFBFC] border-[#E8ECF3] hover:border-white/20 hover:bg-[#F9FAFB]"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <Icon
                      className={`w-4 h-4 ${
                        isSelected ? "text-[#10B981]" : "text-[#6B7280]"
                      }`}
                    />
                    {isSelected && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
                    )}
                  </div>
                  <div className="text-xs font-bold text-[#111827] truncate">{r.label}</div>
                  <div className="text-[10px] text-[#6B7280] truncate">{r.description}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#6B7280] mb-1.5">
              Authorized Institutional Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#6B7280] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F9FAFB] border border-[#E8ECF3] text-[#111827] text-xs sm:text-sm focus:outline-none focus:border-[#00D4AA] transition-colors"
                placeholder="name@institution.gov.in"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-[#6B7280]">
                Security PIN / Password
              </label>
              <span className="text-[11px] text-[#10B981] cursor-pointer hover:underline">
                Pre-authenticated demo
              </span>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#6B7280] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F9FAFB] border border-[#E8ECF3] text-[#111827] text-xs sm:text-sm focus:outline-none focus:border-[#00D4AA] transition-colors"
                placeholder="••••••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-[#10B981] hover:bg-[#10B981]/90 text-white font-bold text-xs sm:text-sm shadow-lg shadow-[#10B981]/20 transition-all flex items-center justify-center gap-2 hover:scale-[1.01]"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 border-2 border-[#0A0F1E] border-t-transparent rounded-full animate-spin" />
                Authenticating Role Session...
              </span>
            ) : (
              <>
                <span>Enter {roles.find((r) => r.id === selectedRole)?.label}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Security badge note */}
        <div className="mt-6 pt-5 border-t border-[#E8ECF3] flex items-center justify-between text-[11px] text-[#6B7280]">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#10B981]" />
            256-Bit FSSAI Handshake
          </span>
          <Link href="/" className="hover:text-[#111827] transition-colors">
            ← Return to Landing
          </Link>
        </div>
      </div>
    </div>
  );
}
