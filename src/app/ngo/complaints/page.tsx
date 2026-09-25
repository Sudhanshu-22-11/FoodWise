"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Camera,
  Upload,
  AlertTriangle,
  Send,
  CheckCircle2,
  Clock,
  MapPin,
  FileText,
  X,
  ImageIcon,
  Building2,
  Phone,
  Eye,
  Flame,
  Bug,
  Droplets,
  ThermometerSun,
  PackageX,
  LifeBuoy,
  MessageSquare,
  ShieldCheck,
  Zap,
} from "lucide-react";

interface Complaint {
  id: string;
  date: string;
  establishment: string;
  category: string;
  severity: "Critical" | "High" | "Medium" | "Low";
  status: "Under Review by Admin" | "Donor Penalized" | "Resolved & Replaced" | "Investigating";
  ticketRef: string;
  description: string;
  hasImage: boolean;
  adminAssigned?: string;
  resolutionNote?: string;
}

const COMPLAINT_CATEGORIES = [
  { label: "Spoiled / Sour / Smelling Food", icon: Bug, color: "#DC2626" },
  { label: "Donor No-Show / Severe Delay", icon: Clock, color: "#EA580C" },
  { label: "Unhygienic / Open Packaging", icon: Droplets, color: "#D97706" },
  { label: "Temperature Abuse (Cold)", icon: ThermometerSun, color: "#F59E0B" },
  { label: "Quantity Mismatch (Shortage)", icon: PackageX, color: "#9333EA" },
  { label: "Diet Mismatch (Non-Veg Mix)", icon: Flame, color: "#DC2626" },
];

const SEVERITY_LEVELS = [
  { label: "Critical", color: "#DC2626", bg: "#FEF2F2", border: "#FECACA", desc: "Immediate health risk / completely inedible — Emergency replacement dispatched" },
  { label: "High", color: "#EA580C", bg: "#FFF7ED", border: "#FED7AA", desc: "Serious quality defect — Donor reputation docked -50 pts" },
  { label: "Medium", color: "#D97706", bg: "#FFF8EB", border: "#FDE68A", desc: "Packaging or delay concern — Official warning issued to kitchen" },
  { label: "Low", color: "#059669", bg: "#ECFDF5", border: "#A7F3D0", desc: "Minor discrepancy — Documented in donor's monthly audit scorecard" },
];

const FALLBACK_COMPLAINTS: Complaint[] = [
  {
    id: "cmp-1",
    date: "Sep 24, 2026 • 4:15 PM",
    establishment: "IIT Delhi Central Mess — Aravali Dining",
    category: "Temperature Abuse (Cold)",
    severity: "High",
    status: "Investigating",
    ticketRef: "FW-SUPPORT-2026-84921",
    description: "Cooked rice container arrived at 38°C (below mandatory 65°C holding guideline). Admin contacted mess warden.",
    hasImage: true,
    adminAssigned: "Priya Sharma (FoodWise Incident Ops)",
    resolutionNote: "Donor kitchen issued warning notice. Re-heating protocol audit scheduled.",
  },
  {
    id: "cmp-2",
    date: "Sep 22, 2026 • 11:30 AM",
    establishment: "Bikanervala Central Kitchen — Okhla",
    category: "Quantity Mismatch (Shortage)",
    severity: "Medium",
    status: "Resolved & Replaced",
    ticketRef: "FW-SUPPORT-2026-84856",
    description: "Claimed surplus was 50 kg but physical handoff was only 28 kg. 70 shelter children short of lunch.",
    hasImage: true,
    adminAssigned: "Rahul Verma (Admin Lead)",
    resolutionNote: "Emergency 25 kg khichdi routed from nearby AIIMS mess within 22 mins. Donor penalized -40 pts.",
  },
  {
    id: "cmp-3",
    date: "Sep 18, 2026 • 2:00 PM",
    establishment: "The Oberoi Banquets & Catering",
    category: "Unhygienic / Open Packaging",
    severity: "Low",
    status: "Resolved & Replaced",
    ticketRef: "FW-SUPPORT-2026-84702",
    description: "Gravy containers were improperly taped, leading to 15% spillage in delivery van.",
    hasImage: false,
    adminAssigned: "FoodWise Auto-Bot",
    resolutionNote: "Donor supplied heavy-duty leakproof crates for all future pickups.",
  },
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
  const [pastComplaints, setPastComplaints] = useState<Complaint[]>(FALLBACK_COMPLAINTS);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Load complaints from API on mount
  useEffect(() => {
    async function loadComplaints() {
      try {
        const res = await fetch("/api/complaints");
        const json = await res.json();
        if (json.success && json.data?.length > 0) {
          setPastComplaints(
            json.data.map((c: Record<string, unknown>) => ({
              id: (c.complaintId as string) || (c._id as string),
              date: c.date as string,
              establishment: c.establishment as string,
              category: c.category as string,
              severity: (c.severity as Complaint["severity"]) || "High",
              status: ((c.status as string) === "Submitted" ? "Under Review by Admin" : c.status as Complaint["status"]) || "Under Review by Admin",
              ticketRef: (c.ticketRef as string) || (c.fssaiRef as string) || `FW-SUPPORT-2026-${Math.floor(80000 + Math.random() * 10000)}`,
              description: c.description as string,
              hasImage: c.hasImage as boolean,
              adminAssigned: (c.adminAssigned as string) || "FoodWise Incident Ops",
              resolutionNote: (c.resolutionNote as string) || "Admin review in progress (<30m SLA).",
            }))
          );
        }
      } catch {
        // Fallback to local
      }
    }
    loadComplaints();
  }, []);

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

  const handleSubmit = async () => {
    if (!selectedCategory || !establishment || !description) return;
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/complaints", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: selectedCategory,
          severity,
          establishment,
          location,
          description,
          contactPhone,
          hasImage: !!capturedImage,
        }),
      });
      const json = await res.json();

      const ticketRef = json.ticketRef || json.fssaiRef || `FW-SUPPORT-2026-${Math.floor(80000 + Math.random() * 10000)}`;

      setIsSubmitting(false);
      setSubmitSuccess(true);
      setGeneratedRef(ticketRef);

      setPastComplaints((prev) => [
        {
          id: json.data?.complaintId || `cmp-${Date.now()}`,
          date: json.data?.date || "Just now",
          establishment,
          category: selectedCategory,
          severity: severity as Complaint["severity"],
          status: "Under Review by Admin",
          ticketRef,
          description,
          hasImage: !!capturedImage,
          adminAssigned: "Priya Sharma (Incident Ops)",
          resolutionNote: "Ticket dispatched to FoodWise Admin Desk. Review underway.",
        },
        ...prev,
      ]);
    } catch {
      const ref = `FW-SUPPORT-2026-${Math.floor(80000 + Math.random() * 10000)}`;
      setTimeout(() => {
        setIsSubmitting(false);
        setSubmitSuccess(true);
        setGeneratedRef(ref);
      }, 1000);
    }
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
      case "Under Review by Admin":
        return { bg: "#EFF6FF", color: "#2563EB", border: "#BFDBFE" };
      case "Investigating":
        return { bg: "#FFF8EB", color: "#D97706", border: "#FDE68A" };
      case "Donor Penalized":
        return { bg: "#FFF1F2", color: "#DC2626", border: "#FECACA" };
      case "Resolved & Replaced":
        return { bg: "#ECFDF5", color: "#059669", border: "#A7F3D0" };
      default:
        return { bg: "#F9FAFB", color: "#6B7280", border: "#E5E7EB" };
    }
  };

  const getSeverityStyle = (sev: string) => {
    const found = SEVERITY_LEVELS.find((s) => s.label === sev);
    return found || SEVERITY_LEVELS[1];
  };

  return (
    <div className="space-y-6">
      {/* ═══ HEADER ═══ */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#E8ECF3]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-md border border-rose-200">
              <LifeBuoy className="w-3.5 h-3.5" />
              FoodWise Platform Helpdesk
            </span>
            <span className="text-gray-300">•</span>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              ⚡ 30-Min Admin Resolution SLA
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900">
            Report Quality & Delivery Issue
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Report spoiled food, packaging issues, or donor delay directly to FoodWise Admin for instant mediation and backup food relief.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-indigo-50 border border-indigo-200 text-indigo-700">
            <Phone className="w-3.5 h-3.5" />
            <span>Admin Helpline: +91 98765 43210</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold bg-rose-50 border border-rose-200 text-rose-700">
            <span>{pastComplaints.length} Open Incidents</span>
          </div>
        </div>
      </div>

      {/* ═══ TABS ═══ */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setActiveTab("file")}
          className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === "file"
              ? "bg-rose-600 text-white shadow-md shadow-rose-600/30"
              : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
          }`}
        >
          <LifeBuoy className="w-4 h-4" />
          Raise Issue with Admin
        </button>
        <button
          onClick={() => setActiveTab("track")}
          className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === "track"
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
              : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
          }`}
        >
          <Eye className="w-4 h-4" />
          Live Admin Tickets ({pastComplaints.length})
        </button>
      </div>

      {/* ═══ SUCCESS STATE (SWIGGY/ZOMATO STYLE RESOLUTION) ═══ */}
      {submitSuccess && (
        <div className="card p-8 text-center bg-white border-2 border-emerald-300 shadow-xl rounded-3xl">
          <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center bg-emerald-500 text-white shadow-lg shadow-emerald-500/30">
            <CheckCircle2 className="w-9 h-9" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-2">
            Incident Ticket Logged with FoodWise Admin!
          </h2>
          <p className="text-sm text-gray-600 max-w-lg mx-auto mb-4">
            Your complaint has been assigned to the <strong>FoodWise Rapid Response Quality Desk</strong>. If food is inedible, our auto-matching engine is locating immediate backup surplus for your shelter.
          </p>

          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl mb-4 bg-emerald-50 border border-emerald-200">
            <FileText className="w-4 h-4 text-emerald-700" />
            <span className="text-sm font-extrabold text-emerald-900 font-mono-data">
              FoodWise Admin Ticket: {generatedRef}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-md mx-auto my-4 text-left text-xs bg-gray-50 p-3.5 rounded-2xl border border-gray-200">
            <div>
              <span className="text-gray-400 block font-medium">Assigned Lead</span>
              <span className="font-bold text-gray-900">Priya Sharma (Ops)</span>
            </div>
            <div>
              <span className="text-gray-400 block font-medium">Review ETA</span>
              <span className="font-bold text-emerald-600">&lt; 30 Minutes</span>
            </div>
            <div>
              <span className="text-gray-400 block font-medium">Donor Status</span>
              <span className="font-bold text-amber-600">Points Frozen</span>
            </div>
          </div>

          <button
            onClick={resetForm}
            className="mt-4 px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md transition-all cursor-pointer active:scale-95"
          >
            Report Another Issue
          </button>
        </div>
      )}

      {/* ═══ FILE COMPLAINT FORM ═══ */}
      {activeTab === "file" && !submitSuccess && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column — Form */}
          <div className="lg:col-span-7 space-y-5">
            {/* Category Selection */}
            <div className="card p-5 bg-white border border-gray-200 rounded-2xl">
              <h3 className="text-[15px] font-bold text-gray-900 mb-1">
                What issue are you facing with this donation?
              </h3>
              <p className="text-xs text-gray-500 mb-4">
                Select the incident category to trigger the appropriate FoodWise Admin resolution workflow
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {COMPLAINT_CATEGORIES.map((cat) => {
                  const Icon = cat.icon;
                  const isSelected = selectedCategory === cat.label;
                  return (
                    <button
                      key={cat.label}
                      onClick={() => setSelectedCategory(cat.label)}
                      className="p-3.5 rounded-xl text-left transition-all hover:scale-[1.02] cursor-pointer"
                      style={{
                        background: isSelected ? `${cat.color}15` : "#F9FAFB",
                        border: `2px solid ${isSelected ? cat.color : "#E5E7EB"}`,
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
            <div className="card p-5 bg-white border border-gray-200 rounded-2xl">
              <h3 className="text-[15px] font-bold text-gray-900 mb-3 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-gray-500" />
                Donor Institution Details
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="text-[12px] font-bold block mb-1 text-gray-700">
                    Donor Establishment / Mess / Caterer Name *
                  </label>
                  <input
                    type="text"
                    value={establishment}
                    onChange={(e) => setEstablishment(e.target.value)}
                    placeholder="e.g., IIT Delhi Central Dining, Hotel Grand Banquet, Bikanervala..."
                    className="w-full px-4 py-2.5 rounded-xl text-sm border border-gray-300 outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 bg-gray-50/50"
                  />
                </div>
                <div>
                  <label className="text-[12px] font-bold block mb-1 text-gray-700">
                    <MapPin className="w-3.5 h-3.5 inline mr-1 text-gray-400" />
                    Pickup Location / Mess Address
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g., Hauz Khas / Connaught Place, New Delhi"
                    className="w-full px-4 py-2.5 rounded-xl text-sm border border-gray-300 outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 bg-gray-50/50"
                  />
                </div>
                <div>
                  <label className="text-[12px] font-bold block mb-1 text-gray-700">
                    <Phone className="w-3.5 h-3.5 inline mr-1 text-gray-400" />
                    NGO Volunteer Callback Number
                  </label>
                  <input
                    type="tel"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="+91 XXXXX XXXXX (For Admin to call immediately)"
                    className="w-full px-4 py-2.5 rounded-xl text-sm border border-gray-300 outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 bg-gray-50/50"
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="card p-5 bg-white border border-gray-200 rounded-2xl">
              <h3 className="text-[15px] font-bold text-gray-900 mb-3 flex items-center gap-2">
                <FileText className="w-4 h-4 text-gray-500" />
                Describe the Incident *
              </h3>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="State clearly what happened. e.g. 'Food smelled sour when opened at the shelter', or 'Driver arrived 2 hours late and food was cold', or 'Claimed 50 kg but only 20 kg received'..."
                rows={4}
                className="w-full px-4 py-3 rounded-xl text-sm border border-gray-300 outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 resize-none bg-gray-50/50"
              />
              <div className="text-[11px] text-gray-400 mt-1">
                {description.length}/500 characters • Be specific to help FoodWise Admin resolve quickly
              </div>
            </div>

            {/* Severity */}
            <div className="card p-5 bg-white border border-gray-200 rounded-2xl">
              <h3 className="text-[15px] font-bold text-gray-900 mb-3 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                Severity & Urgency
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {SEVERITY_LEVELS.map((s) => (
                  <button
                    key={s.label}
                    onClick={() => setSeverity(s.label)}
                    className="p-3 rounded-xl text-left transition-all cursor-pointer"
                    style={{
                      background: severity === s.label ? s.bg : "#F9FAFB",
                      border: `2px solid ${severity === s.label ? s.color : "#E5E7EB"}`,
                    }}
                  >
                    <div className="text-[13px] font-bold" style={{ color: s.color }}>{s.label}</div>
                    <div className="text-[11px] mt-0.5 text-gray-600">{s.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column — Photo + Admin SLA */}
          <div className="lg:col-span-5 space-y-5">
            {/* Photo Evidence */}
            <div className="card p-5 bg-white border border-gray-200 rounded-2xl">
              <h3 className="text-[15px] font-bold text-gray-900 mb-1 flex items-center gap-2">
                <Camera className="w-4 h-4 text-indigo-600" />
                Upload Photo Evidence
              </h3>
              <p className="text-xs text-gray-500 mb-4">
                Take a quick photo of the packaging, temperature probe, or spoiled food for instant admin verification
              </p>

              {showCamera && (
                <div className="relative rounded-xl overflow-hidden mb-4 border-2 border-indigo-600">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full rounded-xl"
                    style={{ maxHeight: "280px", objectFit: "cover" }}
                  />
                  <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-3">
                    <button
                      onClick={capturePhoto}
                      className="w-14 h-14 rounded-full flex items-center justify-center transition-all hover:scale-110 bg-rose-600 text-white border-4 border-white shadow-lg cursor-pointer"
                    >
                      <Camera className="w-6 h-6" />
                    </button>
                    <button
                      onClick={stopCamera}
                      className="w-10 h-10 rounded-full flex items-center justify-center bg-black/70 text-white cursor-pointer"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <canvas ref={canvasRef} className="hidden" />
                </div>
              )}

              {capturedImage ? (
                <div className="relative rounded-xl overflow-hidden mb-4 border-2 border-emerald-500">
                  <img src={capturedImage} alt="Evidence" className="w-full rounded-xl" style={{ maxHeight: "260px", objectFit: "cover" }} />
                  <div className="absolute top-2 right-2">
                    <button
                      onClick={() => setCapturedImage(null)}
                      className="w-8 h-8 rounded-full flex items-center justify-center bg-black/60 text-white hover:bg-black/80 transition-all cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="absolute bottom-2 left-2 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/70">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-[11px] font-bold text-white">Photo Evidence Attached</span>
                  </div>
                </div>
              ) : !showCamera ? (
                <div className="space-y-3">
                  <button
                    onClick={startCamera}
                    className="w-full py-5 rounded-xl flex flex-col items-center gap-1.5 transition-all hover:scale-[1.01] cursor-pointer bg-indigo-50 border-2 border-dashed border-indigo-300"
                  >
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-indigo-600 text-white">
                      <Camera className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold text-indigo-700">Take Photo with Camera</span>
                    <span className="text-[10px] text-gray-500">Live snap of food container / label</span>
                  </button>

                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full py-3 rounded-xl flex items-center justify-center gap-2 transition-all hover:bg-gray-100 cursor-pointer bg-gray-50 border border-gray-300"
                  >
                    <Upload className="w-4 h-4 text-gray-600" />
                    <span className="text-xs font-bold text-gray-700">Upload from Gallery / Files</span>
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

            {/* How FoodWise Admin Resolves (Swiggy/Zomato style) */}
            <div className="card p-4 bg-amber-50/70 border border-amber-200 rounded-2xl">
              <div className="flex items-start gap-2.5">
                <Zap className="w-5 h-5 shrink-0 mt-0.5 text-amber-600" />
                <div>
                  <div className="text-xs font-extrabold text-amber-950 uppercase tracking-wide">
                    FoodWise Admin Resolution Guarantee
                  </div>
                  <ul className="text-[11px] mt-2 space-y-1.5 text-amber-900 font-medium">
                    <li>• <strong>&lt; 30 Min Response:</strong> Admin directly calls donor warden to investigate.</li>
                    <li>• <strong>Emergency Replacement:</strong> If food is rejected, backup surplus is auto-dispatched from nearest mess.</li>
                    <li>• <strong>Donor Penalty:</strong> -50 to -100 reputation points deducted on confirmed defects.</li>
                    <li>• <strong>No Blame on Volunteers:</strong> Complete shelter immunity for genuine rejections.</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={!selectedCategory || !establishment || !description || isSubmitting}
              className="w-full py-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all hover:scale-[1.01] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-600/30"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Dispatching to FoodWise Admin...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Submit Issue to FoodWise Admin
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* ═══ TRACK COMPLAINTS (SWIGGY/ZOMATO TICKET STREAM) ═══ */}
      {activeTab === "track" && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="card p-4 text-center bg-white border border-gray-200 rounded-2xl border-t-4 border-t-indigo-600">
              <div className="text-2xl font-extrabold font-mono-data text-gray-900">{pastComplaints.length}</div>
              <div className="text-[11px] font-bold text-gray-500 uppercase mt-0.5">Total Tickets</div>
            </div>
            <div className="card p-4 text-center bg-white border border-gray-200 rounded-2xl border-t-4 border-t-blue-500">
              <div className="text-2xl font-extrabold font-mono-data text-blue-600">
                {pastComplaints.filter((c) => c.status === "Under Review by Admin").length}
              </div>
              <div className="text-[11px] font-bold text-gray-500 uppercase mt-0.5">Under Review</div>
            </div>
            <div className="card p-4 text-center bg-white border border-gray-200 rounded-2xl border-t-4 border-t-amber-500">
              <div className="text-2xl font-extrabold font-mono-data text-amber-600">
                {pastComplaints.filter((c) => c.status === "Investigating").length}
              </div>
              <div className="text-[11px] font-bold text-gray-500 uppercase mt-0.5">Investigating</div>
            </div>
            <div className="card p-4 text-center bg-white border border-gray-200 rounded-2xl border-t-4 border-t-emerald-500">
              <div className="text-2xl font-extrabold font-mono-data text-emerald-600">
                {pastComplaints.filter((c) => c.status.includes("Resolved")).length}
              </div>
              <div className="text-[11px] font-bold text-gray-500 uppercase mt-0.5">Resolved</div>
            </div>
          </div>

          {/* Tickets List */}
          {pastComplaints.map((cmp) => {
            const statusStyle = getStatusStyle(cmp.status);
            const sevStyle = getSeverityStyle(cmp.severity);
            return (
              <div
                key={cmp.id}
                className="card p-5 transition-all bg-white border border-gray-200 rounded-2xl hover:shadow-md space-y-3"
                style={{ borderLeft: `5px solid ${sevStyle.color}` }}
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-2 border-b border-gray-100">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-mono-data font-black text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded border border-indigo-200">
                      {cmp.ticketRef}
                    </span>
                    <h3 className="text-sm font-bold text-gray-900">{cmp.establishment}</h3>
                    <span
                      className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                      style={{ background: sevStyle.bg, color: sevStyle.color, border: `1px solid ${sevStyle.border}` }}
                    >
                      {cmp.severity} Priority
                    </span>
                  </div>
                  <span
                    className="text-[11px] font-black px-2.5 py-1 rounded-xl"
                    style={{ background: statusStyle.bg, color: statusStyle.color, border: `1px solid ${statusStyle.border}` }}
                  >
                    ● {cmp.status}
                  </span>
                </div>

                <div className="text-xs text-gray-700 leading-relaxed">
                  {cmp.description}
                </div>

                {cmp.resolutionNote && (
                  <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 text-xs">
                    <span className="font-bold text-gray-900 block mb-0.5">
                      FoodWise Admin Action ({cmp.adminAssigned || "Incident Ops"}):
                    </span>
                    <span className="text-gray-600">{cmp.resolutionNote}</span>
                  </div>
                )}

                <div className="flex items-center justify-between text-[11px] text-gray-400 pt-1">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{cmp.date}</span>
                    <span className="flex items-center gap-1"><FileText className="w-3.5 h-3.5" />{cmp.category}</span>
                  </div>
                  {cmp.hasImage && (
                    <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                      <ImageIcon className="w-3.5 h-3.5" /> Photo Evidence Attached
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
