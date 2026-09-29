const { jsPDF } = require("jspdf");
const fs = require("fs");
const path = require("path");

function generateSihVideoScriptPdf() {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;
  let currentPage = 1;

  // Load logos if present
  let logoB64 = null;
  let fssaiB64 = null;
  try {
    if (fs.existsSync("public/logo-badge.png")) {
      logoB64 = "data:image/png;base64," + fs.readFileSync("public/logo-badge.png").toString("base64");
    }
    if (fs.existsSync("public/fssai-badge.jpg")) {
      fssaiB64 = "data:image/jpeg;base64," + fs.readFileSync("public/fssai-badge.jpg").toString("base64");
    }
  } catch (e) {
    console.warn("Could not load image assets:", e.message);
  }

  function addHeaderFooter(pageNum, totalPages) {
    // Header banner
    doc.setFillColor(15, 23, 42); // slate 900
    doc.rect(0, 0, pageWidth, 12, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.text("FOODWISE — SMART INDIA HACKATHON (SIH) 5-MINUTE VIDEO PITCH SCRIPT", margin, 8);

    doc.setFont("helvetica", "bold");
    doc.setTextColor(52, 211, 153); // emerald 400
    doc.text("OFFICIAL MOTTO: EVERY MEAL COUNTS", pageWidth - margin, 8, { align: "right" });

    // Footer rule & text
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.3);
    doc.line(margin, pageHeight - 11, pageWidth - margin, pageHeight - 11);

    doc.setFontSize(7.5);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 116, 139);
    doc.text("SIH 2026 Evaluation Prototype Script • Live Platform: food-wise-puce.vercel.app", margin, pageHeight - 6);
    doc.text(`Page ${pageNum} of ${totalPages}`, pageWidth - margin, pageHeight - 6, { align: "right" });
  }

  function checkPageBreak(currentY, neededHeight) {
    if (currentY + neededHeight > pageHeight - 16) {
      doc.addPage();
      currentPage++;
      return 18; // new start Y below header
    }
    return currentY;
  }

  // Helper to draw a section banner
  function drawSectionHeader(y, timestamp, title, duration) {
    y = checkPageBreak(y, 14);
    doc.setFillColor(15, 23, 42);
    doc.roundedRect(margin, y, contentWidth, 8.5, 1.5, 1.5, "F");

    // Timestamp pill
    doc.setFillColor(16, 185, 129); // Emerald 500
    doc.roundedRect(margin + 2, y + 1.25, 26, 6, 1, 1, "F");
    doc.setTextColor(15, 23, 42);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.text(timestamp, margin + 15, y + 5.2, { align: "center" });

    // Title
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8.5);
    doc.setFont("helvetica", "bold");
    doc.text(title, margin + 31, y + 5.5);

    // Duration tag
    doc.setTextColor(148, 163, 184);
    doc.setFontSize(7.5);
    doc.setFont("helvetica", "normal");
    doc.text(`Target: ${duration}`, pageWidth - margin - 3, y + 5.5, { align: "right" });

    return y + 11.5;
  }

  // Helper to draw a screen cue block
  function drawScreenCue(y, cueText) {
    y = checkPageBreak(y, 14);
    doc.setFillColor(241, 245, 249); // slate-100
    doc.setDrawColor(203, 213, 225); // slate-300
    doc.setLineWidth(0.3);

    const splitCue = doc.splitTextToSize(cueText, contentWidth - 28);
    const boxHeight = Math.max(10, splitCue.length * 4 + 4);
    y = checkPageBreak(y, boxHeight);

    doc.roundedRect(margin, y, contentWidth, boxHeight, 1.5, 1.5, "FD");

    // Screen icon / label
    doc.setFillColor(59, 130, 246); // blue 500
    doc.roundedRect(margin + 2, y + 2, 20, 5, 1, 1, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(6.5);
    doc.text("SCREEN CUE", margin + 12, y + 5.3, { align: "center" });

    doc.setTextColor(30, 41, 59); // slate 800
    doc.setFont("helvetica", "italic");
    doc.setFontSize(7.8);
    doc.text(splitCue, margin + 25, y + 4.8);

    return y + boxHeight + 2.5;
  }

  // Helper to draw dialogue block
  function drawDialogue(y, langLabel, speechText, accentColor = [16, 185, 129]) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.3);
    const splitSpeech = doc.splitTextToSize(speechText, contentWidth - 14);
    const boxHeight = splitSpeech.length * 4.2 + 8;
    y = checkPageBreak(y, boxHeight);

    // Left accent bar
    doc.setFillColor(accentColor[0], accentColor[1], accentColor[2]);
    doc.roundedRect(margin, y, 2.5, boxHeight, 0.8, 0.8, "F");

    // Light background
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(margin + 3, y, contentWidth - 3, boxHeight, 1, 1, "F");

    // Language label
    doc.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.2);
    doc.text(`[${langLabel}]`, margin + 6, y + 4.5);

    // Speech text
    doc.setTextColor(15, 23, 42);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.2);
    doc.text(splitSpeech, margin + 6, y + 8.5);

    return y + boxHeight + 3;
  }

  // ══════════════════════════════════════════════════════════════════════════
  // PAGE 1: COVER & BLUEPRINT
  // ══════════════════════════════════════════════════════════════════════════

  // Top Dark Banner
  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, pageWidth, 74, "F");

  if (logoB64) {
    doc.addImage(logoB64, "PNG", margin, 14, 18, 18);
  }
  if (fssaiB64) {
    doc.addImage(fssaiB64, "JPEG", pageWidth - margin - 20, 14, 20, 20);
  }

  doc.setTextColor(52, 211, 153); // Emerald
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("SMART INDIA HACKATHON 2026 — OFFICIAL EVALUATOR VIDEO SCRIPT", 36, 18);

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.text("FoodWise: Complete 5-Minute Prototype Pitch", 36, 26);

  doc.setTextColor(203, 213, 225);
  doc.setFontSize(9.5);
  doc.setFont("helvetica", "normal");
  doc.text("Crisp, Natural & Time-Stamped Screen-by-Screen Walkthrough", 36, 32);

  // Tagline badge
  doc.setFillColor(6, 95, 70); // Emerald 800
  doc.roundedRect(margin, 40, contentWidth, 10, 1.5, 1.5, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8.5);
  doc.setFont("helvetica", "bold");
  doc.text("PROJECT MOTTO: \"EVERY MEAL COUNTS\"  •  TAGLINE: \"PREDICT LESS WASTE. FEED MORE LIVES.\"", 105, 46.5, { align: "center" });

  // Quick stats strip
  doc.setFillColor(30, 41, 59);
  doc.roundedRect(margin, 53, contentWidth, 15, 1.5, 1.5, "F");
  
  const stats = [
    { label: "TARGET LENGTH", val: "4m 50s (680 words)" },
    { label: "SPEAKING SPEED", val: "135 - 140 words/min" },
    { label: "LIVE PROTOTYPE", val: "food-wise-puce.vercel.app" },
    { label: "TECH STACK", val: "Next.js 16 + React 19 + Mongo" },
  ];
  const colW = contentWidth / 4;
  stats.forEach((st, idx) => {
    const x = margin + idx * colW + colW / 2;
    doc.setTextColor(148, 163, 184);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.5);
    doc.text(st.label, x, 58, { align: "center" });
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.text(st.val, x, 64, { align: "center" });
  });

  // Table of 5-Minute Breakdown
  let curY = 82;
  doc.setTextColor(15, 23, 42);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10.5);
  doc.text("TIMED VIDEO BLUEPRINT & EVALUATION CRITERIA", margin, curY);

  curY += 4;
  doc.setFillColor(241, 245, 249);
  doc.rect(margin, curY, contentWidth, 7, "F");
  doc.setFontSize(7.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(71, 85, 105);
  doc.text("TIME", margin + 3, curY + 4.8);
  doc.text("SECTION / STAGE", margin + 26, curY + 4.8);
  doc.text("PROTOTYPE SCREEN SHOWN", margin + 80, curY + 4.8);
  doc.text("EVALUATOR WOW-FACTOR", margin + 140, curY + 4.8);

  const timetable = [
    ["0:00 - 0:45", "The Hook & National Paradox", "Landing Page & Waste Infographic", "Quantified ₹92,000 Cr loss vs 190M hungry"],
    ["0:45 - 1:15", "System Architecture & Live Tech", "Next.js 16 + Mongo Atlas Diagram", "Offline-first sync & sub-50ms query speed"],
    ["1:15 - 2:05", "Module 1: Kitchen Forecaster", "/kitchen/dashboard & Override", "Dynamic buffer (15% -> 4%) + Human-in-loop"],
    ["2:05 - 2:55", "Module 2: Industrial Factory", "/factory/spoilage & Machine IoT", "Weibull Decay Model + 50Hz Optical Blade drift"],
    ["2:55 - 3:45", "Module 3: FSSAI Redistribution", "/kitchen/surplus & /kitchen/routes", "VRPTW 2-hr window & 2-way OTP crypto lock"],
    ["3:45 - 4:25", "Module 4: ESG & Vector PDF", "/dashboard/impact & 1-Click PDF", "Instant client-side FSSAI audit certificate"],
    ["4:25 - 5:00", "Winning Close & Call to Action", "Multi-portal montage & Live URL", "Production-ready system vs slide-only apps"],
  ];

  curY += 7;
  timetable.forEach((row, i) => {
    doc.setFillColor(i % 2 === 0 ? 255 : 248, i % 2 === 0 ? 255 : 250, i % 2 === 0 ? 255 : 252);
    doc.rect(margin, curY, contentWidth, 6.5, "F");
    doc.setFont("helvetica", "bold");
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(7);
    doc.text(row[0], margin + 3, curY + 4.5);
    doc.setFont("helvetica", "normal");
    doc.text(row[1], margin + 26, curY + 4.5);
    doc.setTextColor(37, 99, 235);
    doc.text(row[2], margin + 80, curY + 4.5);
    doc.setTextColor(16, 185, 129);
    doc.text(row[3], margin + 140, curY + 4.5);
    curY += 6.5;
  });

  // Natural Delivery Guide Box
  curY += 5;
  doc.setFillColor(254, 243, 199); // Amber 100
  doc.setDrawColor(245, 158, 11);
  doc.roundedRect(margin, curY, contentWidth, 23, 1.5, 1.5, "FD");
  doc.setTextColor(146, 64, 14); // Amber 800
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.text("PRO TIPS FOR NATURAL VIDEO PRESENTATION (SOUND LIKE A FOUNDER, NOT A READER):", margin + 4, curY + 5);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.3);
  const advice = [
    "1. Speak like you are showing your proud creation to a colleague—keep energy high, warm, and confident.",
    "2. Don't read verbatim: glance at the screen action, click with purpose, and let your natural voice describe it.",
    "3. Use crisp pauses after numbers (e.g., 'sixty-eight million metric tonnes... [pause]... ninety-two thousand crore rupees').",
    "4. Point your cursor or circle the card you are discussing so the evaluator's eyes naturally follow your narration."
  ];
  advice.forEach((line, idx) => {
    doc.text(line, margin + 4, curY + 9.5 + idx * 3.8);
  });

  // Section 1 on Page 1
  curY += 28;
  curY = drawSectionHeader(curY, "0:00 - 0:45", "1. THE HOOK & THE NATIONAL PARADOX", "45 Seconds (~105 words)");
  curY = drawScreenCue(curY, "Split screen / Clean B-roll: India agricultural harvest vs. overflowing waste dumps. High-contrast bold counters: 68 Million MT Food Wasted (Rs 92,000+ Crore) vs. 190 Million Undernourished Citizens. Transition to FoodWise Logo with motto: 'Every Meal Counts'.");
  curY = drawDialogue(curY, "English Speech (Natural)", 
    "\"Namaste esteemed Smart India Hackathon evaluators. In our country, we face a heartbreaking paradox: over 68 million metric tonnes of food is wasted every single year—costing our economy upwards of 92,000 crore rupees—while at the very same time, 190 million citizens go to bed hungry. But here is the critical insight: this is not a crisis of food scarcity. It is a systemic breakdown across three stages: blind over-cooking in institutional kitchens, post-harvest spoilage in agro-processing, and a fragmented redistribution network. We built FoodWise—an intelligent, closed-loop operating system built on one guiding principle: Every Meal Counts!\"",
    [16, 185, 129]
  );
  curY = drawDialogue(curY, "Conversational Hinglish Alternative", 
    "\"Namaste respected judges! India me har saal 68 million metric tonnes khana waste hota hai—jiski value 92,000 Crore Rupees se zyada hai. Aur doosri taraf, 190 million log bhookhe sote hain. Problem khane ki kami nahi hai, balki PREDICTION, PRESERVATION aur REDISTRIBUTION ka complete breakdown hai. Isi problem ko jad se solve karne ke liye humne banaya hai FoodWise—jaha Every Meal Counts!\"",
    [245, 158, 11]
  );

  // ══════════════════════════════════════════════════════════════════════════
  // PAGE 2: ARCHITECTURE & MODULE 1 (KITCHEN) & MODULE 2 (FACTORY)
  // ══════════════════════════════════════════════════════════════════════════
  doc.addPage();
  currentPage++;
  curY = 18;

  // Section 2
  curY = drawSectionHeader(curY, "0:45 - 1:15", "2. ARCHITECTURE & LIVE TECHNICAL FOUNDATION", "30 Seconds (~75 words)");
  curY = drawScreenCue(curY, "Show live deployed platform at food-wise-puce.vercel.app with dark glassmorphism UI. Quick smooth fade to clean architectural graphic showing Next.js 16 Turbopack, MongoDB Atlas (17 collections), and Offline-First Local Storage sync layer.");
  curY = drawDialogue(curY, "English Speech (Natural)", 
    "\"FoodWise is not another static listing or charity portal. It is a production-grade digital backbone connecting institutional mess kitchens, industrial processing plants, and verified NGO relief shelters. Under the hood, it's powered by Next.js 16 with Turbopack, React 19, and MongoDB Atlas. We engineered dual-persistence caching: so even if a kitchen basement loses Wi-Fi, the entire UI and sensor logging continues offline seamlessly without dropping a single packet.\"",
    [37, 99, 235]
  );
  curY = drawDialogue(curY, "Conversational Hinglish Alternative", 
    "\"FoodWise koi basic directory app nahi hai, balki ek enterprise-grade digital infrastructure hai. Technical architecture me humne Next.js 16 Turbopack, React 19 aur MongoDB Atlas use kiya hai. Humne offline-first dual-persistence banaya hai taaki agar basement kitchen me internet cut bhi ho jaye, toh bhi data bina drop hue seamlessly cache aur sync ho sake.\"",
    [245, 158, 11]
  );

  // Section 3: Kitchen Mess
  curY = drawSectionHeader(curY, "1:15 - 2:05", "3. MODULE 1 — INSTITUTIONAL KITCHEN AI FORECASTER", "50 Seconds (~120 words)");
  curY = drawScreenCue(curY, "Screen on /kitchen/dashboard (IIT Delhi Central Mess). Hover over 'AI Demand Forecaster' card showing 863 meals. Point to Dynamic Safety Buffer (dropped to 4.2%). Grab the 'Human-in-the-Loop Override Slider', slide it up to 920, enter reason 'Annual Hostel Sports Meet', click 'Apply Override'—toast confirms instant DB sync.");
  curY = drawDialogue(curY, "English Speech (Natural)", 
    "\"Let's jump straight into our first live module: the Institutional Kitchen. In college hostels and hospital canteens, chefs cook on gut feel, producing a massive 20 to 30% surplus waste every day. Watch how FoodWise changes this. Our Dynamic Demand Forecaster ingests rolling historical averages, weekday consumption trends, exam calendars, and even weather forecasts to calculate precise meal counts—compressing wasteful safety buffers from 15% down to just 4.2%. And look here: when unexpected campus events occur, the warden uses our Human-in-the-Loop slider to adjust targets. The system adapts instantaneously, feeding human intuition right back into the model!\"",
    [16, 185, 129]
  );
  curY = drawDialogue(curY, "Conversational Hinglish Alternative", 
    "\"Aaiye dekhte hain humara pehla live module: Institutional Kitchen Mess. Har roz mess warden guesswork par khana banwata hai, jisse 20-30% khana waste hota hai. FoodWise me AI Forecaster historical attendance, weekday trends, exam schedules aur weather data ingest karke safety buffer ko 15% se ghata kar 4.2% par le aata hai. Aur agar sudden campus fest ho, toh warden Human-in-the-Loop slider se target adjust karta hai—aur AI model is override se future predictions ke liye continuously seekhta hai!\"",
    [245, 158, 11]
  );

  // Section 4: Industrial Factory
  curY = drawSectionHeader(curY, "2:05 - 2:55", "4. MODULE 2 — INDUSTRIAL AGRO-PROCESSING & WEIBULL SPOILAGE", "50 Seconds (~120 words)");
  curY = drawScreenCue(curY, "Switch to /factory/dashboard (Mother Dairy Processing Unit). Show 4-zone cold storage telemetry. Zoom into /factory/spoilage non-linear decay curve. Click 'Prioritize Batch' on TOM-0234 (2,800 kg tomatoes saved). Click /factory/machines, show Peeling Drum PM-03 blade drift (+1.2mm alert, +180 kg/hr waste) with 1-click preventative maintenance ticket.");
  curY = drawDialogue(curY, "English Speech (Natural)", 
    "\"Now, let's step up to the industrial scale: Agro-Processing Factories. Here, millions in perishable produce are lost due to cold-storage microclimate shifts and machine wear. FoodWise implements a non-linear Weibull Hazard Decay Model. By streaming temperature, humidity, and ethylene gas PPM, our engine calculates the true degradation velocity. With a single click on 'Prioritize Batch', at-risk tomatoes jump straight to front-of-line processing, salvaging 2,800 kg in one go. Simultaneously, 50Hz optical machine calipers detect blade wear on peeling drums, triggering maintenance alerts before thousands of kilos of pulp are unnecessarily shredded.\"",
    [16, 185, 129]
  );
  curY = drawDialogue(curY, "Conversational Hinglish Alternative", 
    "\"Ab aate hain industrial scale par. Agro-factories me perishable batches cold-storage temperature aur machine wear se kharab hote hain. FoodWise me hum Weibull Spoilage Decay Model use karte hain jo temperature, humidity aur ethylene gas PPM ke hisab se real-time spoilage window calculate karta hai. Operator sirf 'Prioritize Batch' par click karke 2,800 kg produce ko waste hone se pehle front-of-line schedule kar deta hai. Saath hi 50Hz machine sensors peeling drum ki blade wear detect karke loss rok dete hain.\"",
    [245, 158, 11]
  );

  // ══════════════════════════════════════════════════════════════════════════
  // PAGE 3: MODULE 3 (REDISTRIBUTION) & MODULE 4 (ESG/PDF) & CONCLUSION
  // ══════════════════════════════════════════════════════════════════════════
  doc.addPage();
  currentPage++;
  curY = 18;

  // Section 5: FSSAI Surplus
  curY = drawSectionHeader(curY, "2:55 - 3:45", "5. MODULE 3 — LEGAL FSSAI SURPLUS REDISTRIBUTION NETWORK", "50 Seconds (~120 words)");
  curY = drawScreenCue(curY, "Navigate to /kitchen/surplus. Highlight verified sensor check (Temp >65C hot holding). Click 'Broadcast Surplus' -> jump to /kitchen/routes. Display live VRPTW routing map with 18-minute ETA to Robin Hood Army. Point to 2-Hour FSSAI Countdown Clock and click 'Verify Delivery' to simulate 6-digit OTP handshake.");
  curY = drawDialogue(curY, "English Speech (Natural)", 
    "\"Even with great planning, surplus food can still happen. But how do we redistribute it safely without legal liability or food poisoning? FoodWise is strictly compliant with the Government of India's FSSAI Surplus Food Regulations 2019. The portal locks redistribution broadcasts until kitchen sensors certify thermal safety—above 65°C for hot meals or below 5°C for cold storage. Our Vehicle Routing Engine solves multi-stop pickups with strict time windows, guaranteeing dispatch and delivery well within the 120-minute safety threshold. Finally, an immutable two-way OTP handshake confirms safe handoff from donor to shelter.\"",
    [16, 185, 129]
  );
  curY = drawDialogue(curY, "Conversational Hinglish Alternative", 
    "\"Khana bachne par use safe tarike se needy tak kaise pahuchayein? FoodWise Indian FSSAI Surplus Regulations 2019 ke saath 100% compliant hai. Khana tabhi broadcast hota hai jab temperature sensors verify karte hain ki hot food 65°C se upar hai ya cold food 5°C se niche. Humara routing engine 120-minute safety window ke andar multi-drop delivery optimize karta hai—aur 6-digit cryptographic OTP ke bina koi food transfer complete nahi hota!\"",
    [245, 158, 11]
  );

  // Section 6: ESG & Vector PDF Engine
  curY = drawSectionHeader(curY, "3:45 - 4:25", "6. MODULE 4 — ESG IMPACT & CLIENT-SIDE VECTOR PDF ENGINE", "40 Seconds (~95 words)");
  curY = drawScreenCue(curY, "Open /dashboard/impact. Highlight live counters: 42.8 MT CO2e avoided, 2.4M Litres water saved, 18,400+ meals served. Click 'Download FSSAI Audit Certificate'—show instant PDF popup with Government FSSAI compliance badge and unique verification hash FW-DONOR-2002840.");
  curY = drawDialogue(curY, "English Speech (Natural)", 
    "\"To guarantee long-term adoption, we gave institutions a powerful incentive loop. Every meal saved is converted into verified ESG metrics: calculating exact carbon dioxide equivalents avoided and virtual agricultural water conserved. Donors level up on a public reputation leaderboard. And best of all, our built-in client-side vector PDF engine lets institutions instantly download tamper-proof FSSAI audit certificates and Section 80G tax benefit reports with a cryptographic verification hash—ready for corporate sustainability audits!\"",
    [16, 185, 129]
  );
  curY = drawDialogue(curY, "Conversational Hinglish Alternative", 
    "\"Donors ise roz roz kyun use karenge? Humne platform me complete ESG aur Gamification Loop diya hai. Har saved food se CO2e aur water footprint calculation hoti hai aur donor leaderboard rank hota hai. Aur sabse khaas: platform me integrated Vector PDF Engine se donors ek click me official FSSAI-sealed audit certificate aur tax compliance certificate download kar sakte hain!\"",
    [245, 158, 11]
  );

  // Section 7: Conclusion
  curY = drawSectionHeader(curY, "4:25 - 5:00", "7. THE SIH WINNING CLOSE & CALL TO ACTION", "35 Seconds (~80 words)");
  curY = drawScreenCue(curY, "Show quick 4-panel split montage of Kitchen, Factory, Logistics, and Impact dashboards. Transition to final title screen displaying live URL (food-wise-puce.vercel.app), GitHub repository, and team details.");
  curY = drawDialogue(curY, "English Speech (Natural)", 
    "\"Respected evaluators, while many hackathon projects remain theoretical pitch decks or basic CRUD forms, Team FoodWise has delivered a fully deployed, production-ready full-stack ecosystem. From predictive prevention in kitchens, to spoilage containment in agro-factories, to safe FSSAI last-mile distribution. We have engineered the digital infrastructure to transform India's food supply chain. FoodWise: Predict Less Waste. Feed More Lives. Because Every Meal Counts! Thank you.\"",
    [16, 185, 129]
  );
  curY = drawDialogue(curY, "Conversational Hinglish Alternative", 
    "\"Respected judges, FoodWise koi theoretical concept nahi hai—yeh ek fully deployed, production-ready ecosystem hai jo kitchen ke guesswork se lekar industrial spoilage aur NGO distribution tak har leak ko real-time me plug karta hai. Aaiye milkar ek Zero-Waste, Zero-Hunger India banayein. FoodWise: Predict Less Waste, Feed More Lives — Because Every Meal Counts! Thank you!\"",
    [245, 158, 11]
  );

  // ══════════════════════════════════════════════════════════════════════════
  // PAGE 4: SIH EVALUATOR RAPID DEFENSE (TOUGH QUESTIONS & WINNING ANSWERS)
  // ══════════════════════════════════════════════════════════════════════════
  doc.addPage();
  currentPage++;
  curY = 18;

  doc.setFillColor(15, 23, 42);
  doc.roundedRect(margin, curY, contentWidth, 8, 1.5, 1.5, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.text("SIH EVALUATOR VIVA DEFENSE — TOP 6 TOUGH QUESTIONS & CRISP 20-SEC ANSWERS", margin + 4, curY + 5.2);

  curY += 12;

  const faqs = [
    {
      q: "Q1. How is your AI Demand Forecaster different from basic moving averages or Excel formulas?",
      a: "Simple averages only look backward and fail on structural shifts. Our model integrates multi-variate factors including campus calendar proximity, weekday cyclicality (e.g. Biryani Friday vs. light Sunday), and precipitation. We implement dynamic buffer throttling that shrinks safety margins from 15% to 4.2%, and an active Human-in-the-Loop continuous feedback loop that feeds warden overrides directly into model retraining."
    },
    {
      q: "Q2. If redistributed food causes food poisoning, who is legally liable?",
      a: "We enforce strict structural compliance with the Food Safety and Standards (Recovery & Distribution of Surplus Food) Regulations, 2019. The portal physically locks surplus broadcast unless sensors confirm core temperature thresholds (>65°C hot or <5°C cold). Our VRP engine enforces a hard 120-minute delivery time-box, and chain of custody is established via a two-way digital OTP handshake, protecting compliant donors under Good Samaritan principles."
    },
    {
      q: "Q3. What is the mathematical basis for predicting raw crop spoilage in agro-factories?",
      a: "We deploy a non-linear Weibull Hazard Decay Function: Q(t) = Q0 * exp(-(t/eta)^beta). Unlike linear estimates, biological decay accelerates exponentially as bacteria multiply. Our edge IoT gateway feeds real-time chamber temperature, relative humidity, and ethylene gas concentration into the scale parameter eta, recalculating remaining shelf-life at 10-minute intervals."
    },
    {
      q: "Q4. What happens if internet connectivity drops in a basement kitchen or rural plant?",
      a: "FoodWise is designed with an offline-first state resilience pattern. If connectivity drops, client state and sensor logs are cached locally in browser storage and gateway memory. The moment network handshake is re-established, our AppContext automatically reconciles pending logs with MongoDB Atlas via idempotent API endpoints with zero data loss."
    },
    {
      q: "Q5. How does machine anomaly detection prevent mass food wastage on the processing line?",
      a: "Our IoT engine samples high-frequency telemetry (50Hz) from critical equipment like Peeling Drum PM-03. Optical caliper gauges measure blade clearance and peel thickness delta. When peel thickness exceeds the 1.2mm spec threshold, the system computes the live excess financial and biomass loss rate (+180 kg/hr) and triggers preventative maintenance work orders before thousands of kilograms are wasted."
    },
    {
      q: "Q6. What is the sustainable business model and revenue stream for FoodWise?",
      a: "FoodWise operates a high-margin B2B SaaS + ESG Verification model: (1) Commercial Kitchens & Universities pay a monthly SaaS subscription justified by saving Rs 1.5 - 2 Lakhs/month in raw food procurement; (2) Food Processing Plants pay for predictive maintenance and byproduct upcycling optimization; (3) Corporates purchase auditable CSR and ESG carbon offset credits generated from verified surplus food redistribution."
    }
  ];

  faqs.forEach((faq, idx) => {
    const qLines = doc.splitTextToSize(faq.q, contentWidth - 8);
    const aLines = doc.splitTextToSize(faq.a, contentWidth - 8);
    const blockH = qLines.length * 4 + aLines.length * 3.6 + 6;
    curY = checkPageBreak(curY, blockH);

    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(margin, curY, contentWidth, blockH, 1, 1, "FD");

    doc.setTextColor(15, 23, 42);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.8);
    doc.text(qLines, margin + 4, curY + 4);

    doc.setTextColor(71, 85, 105);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.3);
    doc.text(aLines, margin + 4, curY + 4 + qLines.length * 4);

    curY += blockH + 2.5;
  });

  // Final recording checklist box
  curY = checkPageBreak(curY, 28);
  doc.setFillColor(240, 253, 244); // Green 50
  doc.setDrawColor(34, 197, 94);
  doc.roundedRect(margin, curY, contentWidth, 24, 1.5, 1.5, "FD");
  doc.setTextColor(22, 101, 52); // Green 800
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.text("PRE-RECORDING TECHNICAL CHECKLIST (FOR 10/10 VIDEO SCORE):", margin + 4, curY + 5);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.2);
  const checklist = [
    "[ ] Set display scaling in Chrome to 110% so all metric cards and table rows are crystal clear on 1080p.",
    "[ ] Pre-open tabs: Tab 1 (Landing), Tab 2 (/kitchen/dashboard), Tab 3 (/factory/dashboard), Tab 4 (/dashboard/impact).",
    "[ ] Use high-quality microphone audio with noise cancellation. Good audio is 60% of an evaluator's impression!",
    "[ ] Keep background music subtle (under 10% volume) so your spoken voice is front-and-center throughout the 5 minutes."
  ];
  checklist.forEach((item, i) => {
    doc.text(item, margin + 4, curY + 9 + i * 3.6);
  });

  // Stamp header & footer across all pages
  const totalPages = doc.internal.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    addHeaderFooter(p, totalPages);
  }

  // Save to public/ and root
  const publicPath = path.join("public", "FoodWise_SIH_5Min_Video_Script.pdf");
  const rootPath = path.join(".", "FoodWise_SIH_5Min_Video_Script.pdf");
  
  const pdfBytes = doc.output();
  fs.writeFileSync(publicPath, Buffer.from(pdfBytes, "binary"));
  fs.writeFileSync(rootPath, Buffer.from(pdfBytes, "binary"));

  console.log(`Successfully generated PDF: ${publicPath} (${pdfBytes.length} bytes, ${totalPages} pages)`);
  console.log(`Successfully generated PDF: ${rootPath}`);
}

generateSihVideoScriptPdf();
