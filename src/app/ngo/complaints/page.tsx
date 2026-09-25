"use client";

import React, { useState, useRef } from "react";
import {
  Camera,
  Upload,
  AlertTriangle,
  ShieldAlert,
  Send,
  CheckCircle2,
  Clock,
  MapPin,
  FileText,
  X,
  ImageIcon,
  Building2,
  Phone,
  ChevronDown,
  Eye,
  Flame,
  Bug,
  Droplets,
  ThermometerSun,
  PackageX,
  Sparkles,
  ExternalLink,
  Shield,
  Info,
} from "lucide-react";

interface Complaint {
  id: string;
  date: string;
  establishment: string;
  category: string;
  severity: "Critical" | "High" | "Medium" | "Low";
  status: "Submitted" | "Under Review" | "Action Taken" | "Resolved";
  fssaiRef: string;
  description: string;
  hasImage: boolean;
}

const COMPLAINT_CATEGORIES = [
  { label: "Contaminated / Spoiled Food", icon: Bug, color: "#DC2626" },
  { label: "Unhygienic Preparation", icon: Droplets, color: "#D97706" },
  { label: "Expired / Unsafe Food Served", icon: Clock, color: "#EF4444" },
  { label: "Temperature Violation", icon: ThermometerSun, color: "#F59E0B" },
  { label: "Adulterated Ingredients", icon: Flame, color: "#DC2626" },
  { label: "Improper Packaging / Storage", icon: PackageX, color: "#9333EA" },
];

const SEVERITY_LEVELS = [
  { label: "Critical", color: "#DC2626", bg: "#FEF2F2", border: "#FECACA", desc: "Immediate health risk — people may be affected" },
  { label: "High", color: "#EA580C", bg: "#FFF7ED", border: "#FED7AA", desc: "Serious violation — potential risk to consumers" },
  { label: "Medium", color: "#D97706", bg: "#FFF8EB", border: "#FDE68A", desc: "Notable concern — needs attention" },
  { label: "Low", color: "#059669", bg: "#ECFDF5", border: "#A7F3D0", desc: "Minor issue — for documentation purposes" },
];

export default function NgoComplaintsPage() {
  const [activeTab, setActiveTab] = useState<"file" | "track">("file");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [severity, setSeverity] = useState<string>("High");
  const [establishment, setEstablishment] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [generatedRef, setGeneratedRef] = useState("");
  const [showCamera, setShowCamera] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const pastComplaints: Complaint[] = [
    {
      id: "cmp-1",
      date: "Sep 24, 2026 • 4:15 PM",
      establishment: "Roadside Dhaba — Sarai Kale Khan",
      category: "Unhygienic Preparation",
      severity: "High",
      status: "Under Review",
      fssaiRef: "FSSAI-CMP-2026-84921",
      description: "Open cooking without gloves, flies around food prep area. Food being served to daily wage workers.",
      hasImage: true,
    },
    {
      id: "cmp-2",
      date: "Sep 22, 2026 • 11:30 AM",
      establishment: "Sharma Sweets & Namkeen — Lajpat Nagar",
      category: "Expired / Unsafe Food Served",
      severity: "Critical",
      status: "Action Taken",
      fssaiRef: "FSSAI-CMP-2026-84856",
      description: "Expired packaged sweets (best before: Aug 2026) being sold. Multiple packets with fungal growth spotted.",
      hasImage: true,
    },
    {
      id: "cmp-3",
      date: "Sep 18, 2026 • 2:00 PM",
      establishment: "Green Valley Caterers — Dwarka",
      category: "Temperature Violation",
      severity: "Medium",
      status: "Resolved",
      fssaiRef: "FSSAI-CMP-2026-84702",
      description: "Buffet food kept at room temperature for 5+ hours during an event. No chafing dishes or heating arrangement.",
      hasImage: false,
    },
  ];

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      streamRef.current = stream;
      setShowCamera(true);
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }, 100);
    } catch {
      alert("Camera access denied. Please allow camera permissions or upload a photo instead.");
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx?.drawImage(video, 0, 0);
      const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
      setCapturedImage(dataUrl);
      stopCamera();
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setShowCamera(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCapturedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (!selectedCategory || !establishment || !description) return;
    setIsSubmitting(true);
    const ref = `FSSAI-CMP-2026-${Math.floor(80000 + Math.random() * 10000)}`;
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setGeneratedRef(ref);
    }, 2500);
  };

  const resetForm = () => {
    setSelectedCategory(null);
    setSeverity("High");
    setEstablishment("");
    setLocation("");
    setDescription("");
    setContactPhone("");
    setCapturedImage(null);
    setSubmitSuccess(false);
    setGeneratedRef("");
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Submitted": return { bg: "#EFF6FF", color: "#2563EB", border: "#BFDBFE" };
      case "Under Review": return { bg: "#FFF8EB", color: "#D97706", border: "#FDE68A" };
      case "Action Taken": return { bg: "#FFF1F2", color: "#DC2626", border: "#FECACA" };
      case "Resolved": return { bg: "#ECFDF5", color: "#059669", border: "#A7F3D0" };
      default: return { bg: "#F9FAFB", color: "#6B7280", border: "#E5E7EB" };
    }
  };

  const getSeverityStyle = (sev: string) => {
    const found = SEVERITY_LEVELS.find((s) => s.label === sev);
    return found || SEVERITY_LEVELS[1];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4" style={{ borderBottom: "1px solid #E8ECF3" }}>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5" style={{ color: "#DC2626" }}>
              <ShieldAlert className="w-3.5 h-3.5" />
              Food Safety Complaint Portal
            </span>
            <span style={{ color: "#D1D5DB" }}>•</span>
            <span className="text-xs" style={{ color: "#9CA3AF" }}>FSSAI Direct Reporting</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight" style={{ color: "#111827" }}>
            Raise Complaint to Food Authority
          </h1>
          <p className="text-sm mt-1" style={{ color: "#6B7280" }}>
            Report food safety violations with photo evidence — complaints go directly to FSSAI
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="https://foscos.fssai.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all hover:scale-105"
            style={{ background: "#EFF6FF", border: "1px solid #BFDBFE", color: "#2563EB" }}
          >
            <ExternalLink className="w-3.5 h-3.5" />
            FSSAI Portal
          </a>
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold" style={{ background: "#FEF2F2", border: "1px solid #FECACA", color: "#DC2626" }}>
            <Shield className="w-3.5 h-3.5" />
            {pastComplaints.length} Active Complaints
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setActiveTab("file")}
          className="px-5 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2"
          style={{
            background: activeTab === "file" ? "linear-gradient(135deg, #DC2626, #B91C1C)" : "#FFFFFF",
            color: activeTab === "file" ? "#FFFFFF" : "#6B7280",
            border: activeTab === "file" ? "none" : "1px solid #E5E7EB",
            boxShadow: activeTab === "file" ? "0 4px 14px rgba(220, 38, 38, 0.3)" : "none",
          }}
        >
          <ShieldAlert className="w-4 h-4" />
          File New Complaint
        </button>
        <button
          onClick={() => setActiveTab("track")}
          className="px-5 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2"
          style={{
            background: activeTab === "track" ? "linear-gradient(135deg, #2563EB, #1D4ED8)" : "#FFFFFF",
            color: activeTab === "track" ? "#FFFFFF" : "#6B7280",
            border: activeTab === "track" ? "none" : "1px solid #E5E7EB",
            boxShadow: activeTab === "track" ? "0 4px 14px rgba(37, 99, 235, 0.3)" : "none",
          }}
        >
          <Eye className="w-4 h-4" />
          Track Complaints ({pastComplaints.length})
        </button>
      </div>

      {/* SUCCESS STATE */}
      {submitSuccess && (
        <div className="card p-8 text-center" style={{ border: "2px solid #A7F3D0" }}>
          <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ background: "linear-gradient(135deg, #10B981, #059669)" }}>
            <CheckCircle2 className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-xl font-bold mb-2" style={{ color: "#059669" }}>Complaint Filed Successfully!</h2>
          <p className="text-sm mb-4" style={{ color: "#6B7280" }}>
            Your complaint has been submitted directly to the Food Safety & Standards Authority of India (FSSAI).
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl mb-4" style={{ background: "#F0FDF4", border: "1px solid #BBF7D0" }}>
            <FileText className="w-4 h-4" style={{ color: "#059669" }} />
            <span className="text-sm font-bold" style={{ color: "#059669" }}>Reference: {generatedRef}</span>
          </div>
          <div className="flex items-center justify-center gap-3 mt-4 text-xs" style={{ color: "#9CA3AF" }}>
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Expected response: 48–72 hours</span>
            <span>•</span>
            <span className="flex items-center gap-1"><Shield className="w-3 h-3" /> Complainant identity protected</span>
          </div>
          <button
            onClick={resetForm}
            className="mt-6 px-5 py-2.5 rounded-xl text-sm font-bold transition-all hover:scale-105"
            style={{ background: "#10B981", color: "#FFFFFF", boxShadow: "0 4px 12px rgba(16,185,129,0.3)" }}
          >
            File Another Complaint
          </button>
        </div>
      )}

      {/* FILE COMPLAINT FORM */}
      {activeTab === "file" && !submitSuccess && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column — Form */}
          <div className="lg:col-span-7 space-y-5">
            {/* Category Selection */}
            <div className="card p-5">
              <h3 className="text-[15px] font-bold mb-1" style={{ color: "#111827" }}>
                What&apos;s the issue?
              </h3>
              <p className="text-xs mb-4" style={{ color: "#9CA3AF" }}>Select the type of food safety violation</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {COMPLAINT_CATEGORIES.map((cat) => {
                  const Icon = cat.icon;
                  const isSelected = selectedCategory === cat.label;
                  return (
                    <button
                      key={cat.label}
                      onClick={() => setSelectedCategory(cat.label)}
                      className="p-3 rounded-xl text-left transition-all hover:scale-[1.02]"
                      style={{
                        background: isSelected ? `${cat.color}12` : "#F9FAFB",
                        border: `2px solid ${isSelected ? cat.color : "#E5E7EB"}`,
                        boxShadow: isSelected ? `0 4px 12px ${cat.color}20` : "none",
                      }}
                    >
                      <Icon className="w-5 h-5 mb-2" style={{ color: cat.color }} />
                      <div className="text-[12px] font-bold leading-tight" style={{ color: isSelected ? cat.color : "#374151" }}>
                        {cat.label}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Establishment Details */}
            <div className="card p-5">
              <h3 className="text-[15px] font-bold mb-3 flex items-center gap-2" style={{ color: "#111827" }}>
                <Building2 className="w-4 h-4" style={{ color: "#6B7280" }} />
                Establishment Details
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="text-[12px] font-semibold block mb-1" style={{ color: "#374151" }}>
                    Name of Restaurant / Hotel / Vendor *
                  </label>
                  <input
                    type="text"
                    value={establishment}
                    onChange={(e) => setEstablishment(e.target.value)}
                    placeholder="e.g., Sharma Dhaba, Hotel Grand Palace..."
                    className="w-full px-4 py-2.5 rounded-xl text-sm border outline-none transition-all focus:ring-2"
                    style={{ border: "1px solid #E5E7EB", background: "#FAFAFA" }}
                  />
                </div>
                <div>
                  <label className="text-[12px] font-semibold block mb-1" style={{ color: "#374151" }}>
                    <MapPin className="w-3 h-3 inline mr-1" />
                    Location / Address
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g., Near Metro Station, Connaught Place, New Delhi"
                    className="w-full px-4 py-2.5 rounded-xl text-sm border outline-none transition-all focus:ring-2"
                    style={{ border: "1px solid #E5E7EB", background: "#FAFAFA" }}
                  />
                </div>
                <div>
                  <label className="text-[12px] font-semibold block mb-1" style={{ color: "#374151" }}>
                    <Phone className="w-3 h-3 inline mr-1" />
                    Your Contact (Optional — kept confidential)
                  </label>
                  <input
                    type="tel"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="+91 XXXXX XXXXX"
                    className="w-full px-4 py-2.5 rounded-xl text-sm border outline-none transition-all focus:ring-2"
                    style={{ border: "1px solid #E5E7EB", background: "#FAFAFA" }}
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="card p-5">
              <h3 className="text-[15px] font-bold mb-3 flex items-center gap-2" style={{ color: "#111827" }}>
                <FileText className="w-4 h-4" style={{ color: "#6B7280" }} />
                Describe the Issue *
              </h3>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what you observed in detail. Include timing, affected food items, number of people served, and any health impacts noticed..."
                rows={5}
                className="w-full px-4 py-3 rounded-xl text-sm border outline-none transition-all focus:ring-2 resize-none"
                style={{ border: "1px solid #E5E7EB", background: "#FAFAFA", lineHeight: "1.6" }}
              />
              <div className="text-[10px] mt-1" style={{ color: "#9CA3AF" }}>
                {description.length}/500 characters • Be specific — include dates, times, and food items
              </div>
            </div>

            {/* Severity */}
            <div className="card p-5">
              <h3 className="text-[15px] font-bold mb-3 flex items-center gap-2" style={{ color: "#111827" }}>
                <AlertTriangle className="w-4 h-4" style={{ color: "#D97706" }} />
                Severity Level
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {SEVERITY_LEVELS.map((s) => (
                  <button
                    key={s.label}
                    onClick={() => setSeverity(s.label)}
                    className="p-3 rounded-xl text-left transition-all"
                    style={{
                      background: severity === s.label ? s.bg : "#F9FAFB",
                      border: `2px solid ${severity === s.label ? s.color : "#E5E7EB"}`,
                    }}
                  >
                    <div className="text-[13px] font-bold" style={{ color: s.color }}>{s.label}</div>
                    <div className="text-[10px] mt-0.5" style={{ color: "#6B7280" }}>{s.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column — Photo + Submit */}
          <div className="lg:col-span-5 space-y-5">
            {/* Photo Evidence */}
            <div className="card p-5">
              <h3 className="text-[15px] font-bold mb-1 flex items-center gap-2" style={{ color: "#111827" }}>
                <Camera className="w-4 h-4" style={{ color: "#2563EB" }} />
                Photo Evidence
              </h3>
              <p className="text-xs mb-4" style={{ color: "#9CA3AF" }}>
                Photograph the food or premises — this strengthens your complaint
              </p>

              {showCamera && (
                <div className="relative rounded-xl overflow-hidden mb-4" style={{ border: "2px solid #2563EB" }}>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full rounded-xl"
                    style={{ maxHeight: "300px", objectFit: "cover" }}
                  />
                  <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-3">
                    <button
                      onClick={capturePhoto}
                      className="w-14 h-14 rounded-full flex items-center justify-center transition-all hover:scale-110"
                      style={{
                        background: "linear-gradient(135deg, #DC2626, #B91C1C)",
                        border: "4px solid white",
                        boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
                      }}
                    >
                      <Camera className="w-6 h-6 text-white" />
                    </button>
                    <button
                      onClick={stopCamera}
                      className="w-10 h-10 rounded-full flex items-center justify-center bg-black/60 text-white"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <canvas ref={canvasRef} className="hidden" />
                </div>
              )}

              {capturedImage ? (
                <div className="relative rounded-xl overflow-hidden mb-4" style={{ border: "2px solid #10B981" }}>
                  <img src={capturedImage} alt="Evidence" className="w-full rounded-xl" style={{ maxHeight: "280px", objectFit: "cover" }} />
                  <div className="absolute top-2 right-2">
                    <button
                      onClick={() => setCapturedImage(null)}
                      className="w-8 h-8 rounded-full flex items-center justify-center bg-black/60 text-white hover:bg-black/80 transition-all"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="absolute bottom-2 left-2 flex items-center gap-1.5 px-2.5 py-1 rounded-lg" style={{ background: "rgba(0,0,0,0.7)" }}>
                    <CheckCircle2 className="w-3 h-3 text-green-400" />
                    <span className="text-[10px] font-bold text-white">Photo attached</span>
                  </div>
                </div>
              ) : !showCamera ? (
                <div className="space-y-3">
                  <button
                    onClick={startCamera}
                    className="w-full py-6 rounded-xl flex flex-col items-center gap-2 transition-all hover:scale-[1.01] cursor-pointer"
                    style={{
                      background: "linear-gradient(135deg, #EFF6FF, #DBEAFE)",
                      border: "2px dashed #93C5FD",
                    }}
                  >
                    <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: "#2563EB" }}>
                      <Camera className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-sm font-bold" style={{ color: "#2563EB" }}>Take Photo</span>
                    <span className="text-[10px]" style={{ color: "#6B7280" }}>Use camera to capture evidence</span>
                  </button>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full py-4 rounded-xl flex items-center justify-center gap-2 transition-all hover:scale-[1.01] cursor-pointer"
                    style={{
                      background: "#F9FAFB",
                      border: "2px dashed #D1D5DB",
                    }}
                  >
                    <Upload className="w-4 h-4" style={{ color: "#6B7280" }} />
                    <span className="text-sm font-semibold" style={{ color: "#6B7280" }}>Upload from Gallery</span>
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                </div>
              ) : null}
            </div>

            {/* FSSAI Info */}
            <div className="card p-4" style={{ background: "#FFFBEB", border: "1px solid #FDE68A" }}>
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 shrink-0 mt-0.5" style={{ color: "#D97706" }} />
                <div>
                  <div className="text-[13px] font-bold" style={{ color: "#92400E" }}>
                    How FSSAI Handles Complaints
                  </div>
                  <ul className="text-[11px] mt-2 space-y-1.5" style={{ color: "#78350F" }}>
                    <li>• Complaints are reviewed within <strong>48–72 hours</strong></li>
                    <li>• Inspectors are dispatched for Critical/High severity cases</li>
                    <li>• Establishments can face <strong>license suspension</strong> or <strong>fines up to ₹5 Lakhs</strong></li>
                    <li>• Your identity is <strong>kept confidential</strong></li>
                    <li>• Track status using the reference number</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={!selectedCategory || !establishment || !description || isSubmitting}
              className="w-full py-4 rounded-xl text-[15px] font-bold flex items-center justify-center gap-2 transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              style={{
                background: (!selectedCategory || !establishment || !description) 
                  ? "#D1D5DB" 
                  : "linear-gradient(135deg, #DC2626, #991B1B)",
                color: "#FFFFFF",
                boxShadow: (!selectedCategory || !establishment || !description) 
                  ? "none" 
                  : "0 6px 20px rgba(220, 38, 38, 0.35)",
              }}
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Filing Complaint to FSSAI...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Submit Complaint to FSSAI
                </>
              )}
            </button>

            {(!selectedCategory || !establishment || !description) && (
              <div className="text-center text-[11px]" style={{ color: "#9CA3AF" }}>
                Please fill category, establishment name, and description to submit
              </div>
            )}
          </div>
        </div>
      )}

      {/* TRACK COMPLAINTS */}
      {activeTab === "track" && (
        <div className="space-y-4">
          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="card p-4 text-center" style={{ borderTop: "3px solid #2563EB" }}>
              <div className="text-2xl font-extrabold font-mono-data" style={{ color: "#111827" }}>{pastComplaints.length}</div>
              <div className="text-[11px] font-medium" style={{ color: "#6B7280" }}>Total Filed</div>
            </div>
            <div className="card p-4 text-center" style={{ borderTop: "3px solid #D97706" }}>
              <div className="text-2xl font-extrabold font-mono-data" style={{ color: "#111827" }}>
                {pastComplaints.filter((c) => c.status === "Under Review").length}
              </div>
              <div className="text-[11px] font-medium" style={{ color: "#6B7280" }}>Under Review</div>
            </div>
            <div className="card p-4 text-center" style={{ borderTop: "3px solid #DC2626" }}>
              <div className="text-2xl font-extrabold font-mono-data" style={{ color: "#111827" }}>
                {pastComplaints.filter((c) => c.status === "Action Taken").length}
              </div>
              <div className="text-[11px] font-medium" style={{ color: "#6B7280" }}>Action Taken</div>
            </div>
            <div className="card p-4 text-center" style={{ borderTop: "3px solid #059669" }}>
              <div className="text-2xl font-extrabold font-mono-data" style={{ color: "#111827" }}>
                {pastComplaints.filter((c) => c.status === "Resolved").length}
              </div>
              <div className="text-[11px] font-medium" style={{ color: "#6B7280" }}>Resolved</div>
            </div>
          </div>

          {/* Complaints List */}
          {pastComplaints.map((cmp) => {
            const statusStyle = getStatusStyle(cmp.status);
            const sevStyle = getSeverityStyle(cmp.severity);
            return (
              <div key={cmp.id} className="card p-5 transition-all hover:shadow-md" style={{ borderLeft: `4px solid ${sevStyle.color}` }}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <h3 className="text-[14px] font-bold" style={{ color: "#111827" }}>{cmp.establishment}</h3>
                      <span
                        className="text-[10px] font-bold px-2 py-0.5 rounded-md"
                        style={{ background: sevStyle.bg, color: sevStyle.color, border: `1px solid ${sevStyle.border}` }}
                      >
                        {cmp.severity}
                      </span>
                      <span
                        className="text-[10px] font-bold px-2 py-0.5 rounded-md"
                        style={{ background: statusStyle.bg, color: statusStyle.color, border: `1px solid ${statusStyle.border}` }}
                      >
                        {cmp.status}
                      </span>
                    </div>
                    <div className="text-[12px] mb-2" style={{ color: "#6B7280" }}>{cmp.description}</div>
                    <div className="flex items-center gap-3 flex-wrap text-[11px]" style={{ color: "#9CA3AF" }}>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{cmp.date}</span>
                      <span className="flex items-center gap-1"><FileText className="w-3 h-3" />{cmp.category}</span>
                      {cmp.hasImage && <span className="flex items-center gap-1"><ImageIcon className="w-3 h-3" />Photo attached</span>}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-[10px] font-mono-data" style={{ color: "#9CA3AF" }}>{cmp.fssaiRef}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
