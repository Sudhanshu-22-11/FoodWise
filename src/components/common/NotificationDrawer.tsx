"use client";

import React from "react";
import { useApp } from "@/context/AppContext";
import { X, Bell, AlertTriangle, AlertCircle, CheckCircle2, Info, ArrowRight, Check } from "lucide-react";
import Link from "next/link";

export default function NotificationDrawer() {
  const {
    notifications,
    isNotificationOpen,
    setIsNotificationOpen,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    unreadCount,
  } = useApp();

  if (!isNotificationOpen) return null;

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "urgent":
        return <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />;
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />;
      case "success":
        return <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />;
      default:
        return <Info className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />;
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "urgent":
        return "bg-red-500/10 text-red-400 border-red-500/20";
      case "warning":
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      case "success":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      default:
        return "bg-indigo-500/10 text-indigo-400 border-indigo-500/20";
    }
  };

  const formatNotificationTime = (time: string, createdAt?: number) => {
    if (createdAt) {
      const diffMs = Date.now() - createdAt;
      const diffSec = Math.floor(diffMs / 1000);
      if (diffSec < 45) return "Just now";
      const diffMins = Math.floor(diffSec / 60);
      if (diffMins < 60) return `${diffMins}m ago`;
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `${diffHours}h ago`;
      return `${Math.floor(diffHours / 24)}d ago`;
    }
    if (time === "Just now") return "2m ago";
    return time;
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm transition-opacity duration-300">
      <div 
        className="w-full max-w-md h-full bg-[#0F1629] border-l border-white/10 flex flex-col shadow-2xl animate-in slide-in-from-right duration-300"
      >
        {/* Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#00D4AA]/10 border border-[#00D4AA]/20 flex items-center justify-center text-[#00D4AA]">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-white text-base flex items-center gap-2">
                Live Alert Stream
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-red-500/20 text-red-400 border border-red-500/30">
                    {unreadCount} new
                  </span>
                )}
              </h2>
              <p className="text-xs text-[#94A3B8]">Real-time operational alerts & AI triggers</p>
            </div>
          </div>
          <button
            onClick={() => setIsNotificationOpen(false)}
            className="p-2 rounded-lg text-[#94A3B8] hover:text-white hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Actions Bar */}
        <div className="px-5 py-2.5 bg-white/[0.02] border-b border-white/5 flex items-center justify-between text-xs">
          <span className="text-[#94A3B8]">Connected to 42 Edge Sensors</span>
          {unreadCount > 0 && (
            <button
              onClick={markAllNotificationsAsRead}
              className="text-[#00D4AA] hover:underline flex items-center gap-1 font-medium"
            >
              <Check className="w-3.5 h-3.5" /> Mark all read
            </button>
          )}
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => markNotificationAsRead(notif.id)}
              className={`p-4 rounded-xl border transition-all cursor-pointer ${
                notif.read
                  ? "bg-white/[0.02] border-white/5 opacity-80"
                  : "bg-white/[0.05] border-white/15 hover:border-white/25 shadow-lg"
              }`}
            >
              <div className="flex items-start gap-3">
                {getSeverityIcon(notif.severity)}
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span
                      className={`text-[11px] uppercase font-bold tracking-wider px-2 py-0.5 rounded border ${getSeverityBadge(
                        notif.severity
                      )}`}
                    >
                      {notif.category}
                    </span>
                    <span className="text-[11px] text-[#94A3B8]">{formatNotificationTime(notif.time, notif.createdAt)}</span>
                  </div>
                  <h3 className="text-sm font-semibold text-white mb-1">
                    {notif.title}
                  </h3>
                  <p className="text-xs text-[#94A3B8] leading-relaxed mb-3">
                    {notif.message}
                  </p>
                  {notif.actionLabel && notif.actionUrl && (
                    <Link
                      href={notif.actionUrl}
                      onClick={() => setIsNotificationOpen(false)}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#00D4AA] hover:text-[#00D4AA]/80 bg-[#00D4AA]/10 hover:bg-[#00D4AA]/15 px-3 py-1.5 rounded-lg transition-colors border border-[#00D4AA]/20"
                    >
                      {notif.actionLabel}
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-[#0A0F1E] flex items-center justify-between text-xs text-[#94A3B8]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
            <span>AI Event Bus: Active</span>
          </div>
          <span className="font-mono-data text-[11px] text-[#475569]">v2.4.0</span>
        </div>
      </div>
    </div>
  );
}
