import { jsPDF } from "jspdf";

// Reusable FoodWise PDF Generator

export function downloadKitchenAuditPdf(params: {
  period?: string;
  facilityName?: string;
  facilityCode?: string;
  mealsServed?: number;
  wasteReduction?: string;
  fssaiCompliance?: string;
}) {
  const doc = new jsPDF();
  const period = params.period || "Current Cycle";
  const facility = params.facilityName || "IIT Delhi Central Dining Mess";
  const code = params.facilityCode || "DL-KIT-001";

  // Header Banner
  doc.setFillColor(16, 185, 129); // Emerald 500
  doc.rect(0, 0, 210, 32, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("FOODWISE — KITCHEN AUDIT & COMPLIANCE REPORT", 14, 15);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Official Facility Audit • ISO 22000 / FSSAI Food Hygiene Framework • Cycle: ${period}`, 14, 24);

  // Facility Info Block
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("FACILITY METADATA", 14, 42);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(`Facility Name: ${facility}`, 14, 49);
  doc.text(`Registration Code: ${code}`, 14, 55);
  doc.text(`Generated On: ${new Date().toLocaleDateString("en-IN", { dateStyle: "long" })} ${new Date().toLocaleTimeString("en-IN")}`, 14, 61);
  doc.text(`Lead Auditor / Warden: Dr. S.R. Sharma (Hostel Mess Management)`, 14, 67);

  // Divider
  doc.setDrawColor(226, 232, 240);
  doc.line(14, 73, 196, 73);

  // Key KPI Summary Boxes
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(14, 78, 55, 26, 3, 3, "F");
  doc.roundedRect(74, 78, 55, 26, 3, 3, "F");
  doc.roundedRect(134, 78, 62, 26, 3, 3, "F");

  doc.setTextColor(100, 116, 139);
  doc.setFontSize(8);
  doc.text("MEALS FORECAST & SERVED", 18, 86);
  doc.text("WASTE REDUCTION RATE", 78, 86);
  doc.text("FSSAI SAFETY COMPLIANCE", 138, 86);

  doc.setTextColor(15, 23, 42);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text(params.mealsServed ? params.mealsServed.toLocaleString() : "8,420 Meals", 18, 97);
  doc.setTextColor(16, 185, 129);
  doc.text(params.wasteReduction || "32.4% Cut", 78, 97);
  doc.setTextColor(37, 99, 235);
  doc.text(params.fssaiCompliance || "99.8% Passed", 138, 97);

  // Audit Logs Table
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("DAILY SHIFT PRODUCTION & SURPLUS AUDIT LOG", 14, 116);

  // Table Header
  doc.setFillColor(241, 245, 249);
  doc.rect(14, 121, 182, 8, "F");
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text("DATE", 18, 126);
  doc.text("SHIFT", 48, 126);
  doc.text("PREPARED", 78, 126);
  doc.text("CONSUMED", 108, 126);
  doc.text("SURPLUS REDISTRIBUTED", 138, 126);
  doc.text("TEMP (°C)", 178, 126);

  // Table Rows
  const rows = [
    ["Today", "Morning Breakfast", "820 meals", "805 meals", "15 meals (Aasha Shelter)", "68.2°C"],
    ["Today", "Lunch Service", "1,240 meals", "1,180 meals", "60 meals (Feeding India)", "71.4°C"],
    ["Yesterday", "Dinner Service", "1,150 meals", "1,110 meals", "40 meals (Robin Hood Army)", "69.1°C"],
    ["Yesterday", "Lunch Service", "1,220 meals", "1,175 meals", "45 meals (Aasha Shelter)", "70.5°C"],
    ["2 days ago", "Dinner Service", "1,100 meals", "1,070 meals", "30 meals (Goonj Mess)", "68.9°C"],
  ];

  let yPos = 135;
  rows.forEach((row, i) => {
    if (i % 2 === 1) {
      doc.setFillColor(248, 250, 252);
      doc.rect(14, yPos - 5, 182, 7, "F");
    }
    doc.setTextColor(30, 41, 59);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.text(row[0], 18, yPos);
    doc.text(row[1], 48, yPos);
    doc.text(row[2], 78, yPos);
    doc.text(row[3], 108, yPos);
    doc.text(row[4], 138, yPos);
    doc.text(row[5], 178, yPos);
    yPos += 8;
  });

  // Regulatory Compliance Declaration
  yPos += 10;
  doc.setFillColor(236, 253, 245);
  doc.setDrawColor(167, 243, 208);
  doc.roundedRect(14, yPos, 182, 28, 2, 2, "FD");

  doc.setTextColor(6, 95, 70);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text("FSSAI FOOD SAFETY & RECOVERY DECLARATION", 18, yPos + 7);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text(
    "All surplus food documented in this audit report was maintained above 65°C hot holding, packed in tamper-evident food-grade containers, and transferred to authorized partner NGOs within 60 minutes of post-shift audit under Safe Food Share regulations.",
    18,
    yPos + 14,
    { maxWidth: 174 }
  );

  // Signatures
  yPos += 45;
  doc.setDrawColor(148, 163, 184);
  doc.line(18, yPos, 80, yPos);
  doc.line(130, yPos, 192, yPos);

  doc.setTextColor(71, 85, 105);
  doc.setFontSize(8);
  doc.text("Dr. S.R. Sharma", 18, yPos + 5);
  doc.text("Warden & Head of Dining Operations", 18, yPos + 9);
  doc.text("IIT Delhi Central Dining Mess", 18, yPos + 13);

  doc.text("Verified FoodWise Platform Auditor", 130, yPos + 5);
  doc.text("Digital Blockchain Signature: FW-AUTH-9842-DL", 130, yPos + 9);
  doc.text("Platform Stamp: VERIFIED CLEAN AUDIT", 130, yPos + 13);

  // Footer
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  doc.text("FoodWise v2.4 AI Platform • Confidential Facility Audit Document • Page 1 of 1", 14, 285);

  doc.save(`FoodWise_Kitchen_Audit_${facility.replace(/\s+/g, "_")}.pdf`);
}

export function downloadFactoryAuditPdf(params: {
  title?: string;
  facilityName?: string;
  plantCode?: string;
  batchId?: string;
}) {
  const doc = new jsPDF();
  const title = params.title || "ISO 22000 Mass Balance & Spoilage Audit";
  const plant = params.facilityName || "Punjab Agro Processing Facility #4";
  const code = params.plantCode || "PB-IND-004";

  // Header Banner
  doc.setFillColor(30, 41, 59); // Slate 800
  doc.rect(0, 0, 210, 32, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text(`FOODWISE FACTORY — ${title.toUpperCase()}`, 14, 15);

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text(`Industrial Processing Audit • Mass Balance, IoT Telemetry & Spoilage Prevention`, 14, 24);

  // Facility Metadata
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("PLANT AUDIT SPECIFICATIONS", 14, 42);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.text(`Processing Facility: ${plant}`, 14, 49);
  doc.text(`Industrial Code: ${code}`, 14, 55);
  doc.text(`Active Batch Identifier: ${params.batchId || "TOM-2024-0234 (Tomatoes, 3,200 kg)"}`, 14, 61);
  doc.text(`Timestamp: ${new Date().toLocaleString("en-IN")}`, 14, 67);

  doc.setDrawColor(226, 232, 240);
  doc.line(14, 73, 196, 73);

  // Metrics
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(14, 78, 55, 24, 2, 2, "F");
  doc.roundedRect(74, 78, 55, 24, 2, 2, "F");
  doc.roundedRect(134, 78, 62, 24, 2, 2, "F");

  doc.setTextColor(100, 116, 139);
  doc.setFontSize(8);
  doc.text("RAW INTAKE VOLUME", 18, 85);
  doc.text("FINISHED PRODUCT YIELD", 78, 85);
  doc.text("BYPRODUCT SALVAGED", 138, 85);

  doc.setTextColor(15, 23, 42);
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.text("18,500 kg", 18, 95);
  doc.setTextColor(16, 185, 129);
  doc.text("91.8% Yield", 78, 95);
  doc.setTextColor(37, 99, 235);
  doc.text("1,420 kg Value-Add", 138, 95);

  // Telemetry Log Sample
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("MACHINERY TELEMETRY & LOSS LOG SUMMARY", 14, 114);

  doc.setFillColor(15, 23, 42);
  doc.roundedRect(14, 119, 182, 60, 2, 2, "F");
  doc.setTextColor(52, 211, 153);
  doc.setFont("courier", "bold");
  doc.setFontSize(8);
  doc.text("[14:22:04] SENSOR_PING: Optical gauge caliper connected. Freq: 50Hz", 18, 127);
  doc.text("[14:24:12] TELEMETRY_STREAM: Current rotor RPM: 1,420 (Spec: 1,400-1,450)", 18, 134);
  doc.setTextColor(251, 191, 36);
  doc.text("[14:25:31] ANOMALY_WARN: Peel depth delta +1.2mm detected on quadrant 2.", 18, 141);
  doc.text("[14:26:02] LOSS_RATE: Calculated waste delta: 180 kg/hr over baseline.", 18, 148);
  doc.setTextColor(52, 211, 153);
  doc.text("[14:27:00] PREVENTATIVE_FLAG: Flagged for preventative blade realignment.", 18, 155);
  doc.setTextColor(148, 163, 184);
  doc.text("[14:28:15] FSSAI_AUDIT_STAMP: Ingested to secure industrial audit ledger.", 18, 162);
  doc.text("[14:30:00] BYPRODUCT_RECOVERY: Lycopene extraction line operating at 94.2% efficiency.", 18, 169);

  // Signatures
  doc.setFont("helvetica", "normal");
  const yPos = 210;
  doc.setDrawColor(148, 163, 184);
  doc.line(18, yPos, 80, yPos);
  doc.line(130, yPos, 192, yPos);

  doc.setTextColor(71, 85, 105);
  doc.setFontSize(8);
  doc.text("Amit Kumar", 18, yPos + 5);
  doc.text("Plant Quality & Operations Director", 18, yPos + 9);
  doc.text(plant, 18, yPos + 13);

  doc.text("Verified Autonomous IoT Engine", 130, yPos + 5);
  doc.text("Certificate ID: FW-PLANT-ISO-2026-992", 130, yPos + 9);
  doc.text("Status: COMPLIANT WITH ISO 22000:2018", 130, yPos + 13);

  doc.save(`FoodWise_Factory_Report_${code}.pdf`);
}

export function downloadNgoImpactCertificatePdf(params: {
  ngoName?: string;
  mealsServed?: number;
  co2SavedKg?: number;
  donorName?: string;
  certificateType?: string;
}) {
  const doc = new jsPDF("landscape");
  const ngo = params.ngoName || "Robin Hood Army & Feeding India Coalition";
  const meals = params.mealsServed || 24800;
  const co2 = params.co2SavedKg || 12400;
  const certType = params.certificateType || "80G CSR Social Impact Certificate";

  // Certificate Decorative Border
  doc.setDrawColor(16, 185, 129);
  doc.setLineWidth(3);
  doc.rect(10, 10, 277, 190);

  doc.setDrawColor(209, 250, 229);
  doc.setLineWidth(1);
  doc.rect(13, 13, 271, 184);

  // Header Title
  doc.setTextColor(6, 95, 70);
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text("FOODWISE RELIEF & REDISTRIBUTION NETWORK", 148, 35, { align: "center" });

  doc.setTextColor(16, 185, 129);
  doc.setFontSize(14);
  doc.text(certType.toUpperCase(), 148, 45, { align: "center" });

  doc.setTextColor(100, 116, 139);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Verified Section 80G CSR Social & Environmental Sustainability Assessment", 148, 52, { align: "center" });

  // Certificate Body
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(12);
  doc.text("This is to formally certify and commend the impactful humanitarian relief delivered by:", 148, 68, { align: "center" });

  doc.setTextColor(15, 23, 42);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text(ngo, 148, 82, { align: "center" });

  doc.setTextColor(71, 85, 105);
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text(
    `Through the automated FoodWise Surplus & Logistics Matching Network, this organization has successfully rescued, verified, and distributed nutritious surplus meals to shelter homes, migrant relief centres, and underprivileged families across the Delhi-NCR territory.`,
    148,
    95,
    { align: "center", maxWidth: 220 }
  );

  // Impact Metric Cards
  doc.setFillColor(240, 253, 244);
  doc.roundedRect(40, 115, 60, 28, 3, 3, "F");
  doc.roundedRect(118, 115, 60, 28, 3, 3, "F");
  doc.roundedRect(196, 115, 60, 28, 3, 3, "F");

  doc.setTextColor(6, 95, 70);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text("MEALS DELIVERED", 70, 123, { align: "center" });
  doc.text("GHG EMISSIONS CUT", 148, 123, { align: "center" });
  doc.text("WATER CONSERVED", 226, 123, { align: "center" });

  doc.setTextColor(15, 23, 42);
  doc.setFontSize(16);
  doc.text(`${meals.toLocaleString()}`, 70, 135, { align: "center" });
  doc.setTextColor(16, 185, 129);
  doc.text(`${(co2 / 1000).toFixed(1)} MT CO2e`, 148, 135, { align: "center" });
  doc.setTextColor(37, 99, 235);
  doc.text(`${(meals * 140).toLocaleString()} Litres`, 226, 135, { align: "center" });

  // Verification & Signatures
  const y = 168;
  doc.setDrawColor(148, 163, 184);
  doc.line(40, y, 100, y);
  doc.line(196, y, 256, y);

  doc.setTextColor(71, 85, 105);
  doc.setFontSize(9);
  doc.text("Pooja Verma", 70, y + 5, { align: "center" });
  doc.text("Logistics Lead • Food Relief NGO Operations", 70, y + 9, { align: "center" });

  doc.text("FoodWise Social Impact Authority", 226, y + 5, { align: "center" });
  doc.text("Certificate Ref: FW-CSR-80G-2026", 226, y + 9, { align: "center" });

  doc.save(`FoodWise_Impact_Certificate_${ngo.replace(/\s+/g, "_")}.pdf`);
}

export function downloadDonorRankingPdf(params: {
  donorName?: string;
  rank?: number;
  totalPoints?: number;
  tier?: string;
  location?: string;
}) {
  const doc = new jsPDF("landscape");
  const donor = params.donorName || "IIT Delhi Central Dining Mess";
  const rank = params.rank || 2;
  const points = params.totalPoints || 2840;
  const tier = params.tier || "Gold";
  const location = params.location || "Hauz Khas, New Delhi";

  // Outer Gold Border
  doc.setDrawColor(217, 119, 6); // Amber 600
  doc.setLineWidth(3);
  doc.rect(10, 10, 277, 190);

  doc.setDrawColor(254, 243, 199);
  doc.setLineWidth(1);
  doc.rect(13, 13, 271, 184);

  // Title
  doc.setTextColor(146, 64, 14);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("FOODWISE SUSTAINABLE INSTITUTIONAL DONOR RECOGNITION", 148, 35, { align: "center" });

  doc.setTextColor(217, 119, 6);
  doc.setFontSize(14);
  doc.text(`ANNUAL GREEN DONOR CERTIFICATE OF EXCELLENCE • ${tier.toUpperCase()} TIER`, 148, 46, { align: "center" });

  doc.setTextColor(30, 41, 59);
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text("This prestigious credential is conferred upon:", 148, 62, { align: "center" });

  doc.setTextColor(15, 23, 42);
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text(donor, 148, 76, { align: "center" });

  doc.setTextColor(100, 116, 139);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`${location} • FSSAI Food Safe Verified Kitchen Partner`, 148, 84, { align: "center" });

  doc.setTextColor(51, 65, 85);
  doc.setFontSize(10.5);
  doc.text(
    `In recognition of exceptional dedication to Zero Hunger and Food Waste Mitigation, having maintained an uninterrupted daily donation streak, 99.8% FSSAI food quality safety score, and active redistribution coordination with certified NGO relief partners.`,
    148,
    98,
    { align: "center", maxWidth: 220 }
  );

  // Standing Cards
  doc.setFillColor(254, 243, 199);
  doc.roundedRect(45, 114, 55, 28, 3, 3, "F");
  doc.roundedRect(120, 114, 55, 28, 3, 3, "F");
  doc.roundedRect(195, 114, 55, 28, 3, 3, "F");

  doc.setTextColor(146, 64, 14);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text("CITY RANK", 72, 122, { align: "center" });
  doc.text("REPUTATION POINTS", 147, 122, { align: "center" });
  doc.text("DONOR TIER", 222, 122, { align: "center" });

  doc.setTextColor(15, 23, 42);
  doc.setFontSize(16);
  doc.text(`#${rank} in City`, 72, 134, { align: "center" });
  doc.setTextColor(217, 119, 6);
  doc.text(`${points.toLocaleString()} pts`, 147, 134, { align: "center" });
  doc.setTextColor(16, 185, 129);
  doc.text(`${tier} Tier`, 222, 134, { align: "center" });

  // Signatures
  const y = 168;
  doc.setDrawColor(148, 163, 184);
  doc.line(40, y, 100, y);
  doc.line(196, y, 256, y);

  doc.setTextColor(71, 85, 105);
  doc.setFontSize(9);
  doc.text("FoodWise Governing Council", 70, y + 5, { align: "center" });
  doc.text("National Food Recovery Initiative", 70, y + 9, { align: "center" });

  doc.text("Verified NGO Coalition Endorsement", 226, y + 5, { align: "center" });
  doc.text(`Issued: ${new Date().toLocaleDateString("en-IN")}`, 226, y + 9, { align: "center" });

  doc.save(`FoodWise_Donor_Recognition_${donor.replace(/\s+/g, "_")}.pdf`);
}
