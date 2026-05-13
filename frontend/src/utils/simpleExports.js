import ExcelJS from "exceljs";
import jsPDF from "jspdf";
import pptxgen from "pptxgenjs";

const downloadBlob = (blob, fileName) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
};

export const exportAnalyticsPDF = (analytics, title = "AIML Department Activity Report") => {
  const doc = new jsPDF();
  
  // Header Background
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, 210, 45, "F");
  
  // Header Branding
  doc.setTextColor(45, 212, 191); // teal-400
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("SANJIVANI UNIVERSITY", 14, 18);
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.text(title, 14, 28);
  
  doc.setTextColor(148, 163, 184); // slate-400
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 36);

  // Summary Section Title
  doc.setTextColor(15, 23, 42);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("Executive Summary", 14, 60);

  // Summary Cards
  const stats = [
    { label: "Total Events", value: analytics.summary?.events || 0 },
    { label: "Achievements", value: analytics.summary?.achievements || 0 },
    { label: "Internships", value: analytics.summary?.internships || 0 },
    { label: "Placements", value: analytics.summary?.placements || 0 },
  ];

  let startX = 14;
  stats.forEach((stat, idx) => {
    // Card Box
    doc.setDrawColor(226, 232, 240); // slate-200
    doc.setFillColor(248, 250, 252); // slate-50
    doc.roundedRect(startX, 65, 42, 22, 2, 2, "FD");
    
    // Card Value
    doc.setTextColor(15, 118, 110); // teal-700
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text(String(stat.value), startX + 21, 76, { align: "center" });
    
    // Card Label
    doc.setTextColor(100, 116, 139); // slate-500
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text(stat.label, startX + 21, 82, { align: "center" });
    
    startX += 46;
  });

  // Detailed Metrics Section
  doc.setTextColor(15, 23, 42);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("Key Analytics Breakdown", 14, 105);

  let currentY = 115;
  const drawTable = (title, dataObj) => {
    if (!dataObj || Object.keys(dataObj).length === 0) return;
    
    if (currentY > 260) {
      doc.addPage();
      currentY = 20;
    }

    doc.setFillColor(20, 184, 166); // teal-500
    doc.rect(14, currentY, 182, 8, "F");
    
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text(title.toUpperCase(), 18, currentY + 5.5);
    
    currentY += 8;
    
    let isGray = false;
    Object.entries(dataObj).forEach(([key, value]) => {
      if (currentY > 280) {
        doc.addPage();
        currentY = 20;
      }
      if (isGray) {
        doc.setFillColor(248, 250, 252);
        doc.rect(14, currentY, 182, 8, "F");
      }
      
      doc.setTextColor(71, 85, 105); // slate-600
      doc.setFont("helvetica", "normal");
      doc.text(key, 18, currentY + 5.5);
      
      doc.setTextColor(15, 23, 42);
      doc.setFont("helvetica", "bold");
      const valStr = Number(value).toFixed && !Number.isInteger(value) ? Number(value).toFixed(1) : String(value);
      doc.text(valStr, 188, currentY + 5.5, { align: "right" });
      
      currentY += 8;
      isGray = !isGray;
    });
    
    // Add border
    doc.setDrawColor(226, 232, 240);
    doc.rect(14, currentY - (Object.keys(dataObj).length * 8) - 8, 182, (Object.keys(dataObj).length * 8) + 8, "S");
    
    currentY += 15;
  };

  drawTable("Events By Category", analytics.eventsByCategory);
  drawTable("Internship Modes", analytics.internshipModes);
  drawTable("Internship Growth", analytics.internshipGrowth);
  drawTable("Placement Types", analytics.placementTypes);
  drawTable("Placement Growth", analytics.placementGrowth);

  // Footer
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setTextColor(148, 163, 184);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text("© 2026 Sanjivani University - AIML Department", 14, 290);
    doc.text(`Page ${i} of ${pageCount}`, 196, 290, { align: "right" });
  }

  doc.save(`aiml-report-${Date.now()}.pdf`);
};

export const exportAnalyticsExcel = async (analytics) => {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "AIML Department";
  workbook.created = new Date();

  // Cover Sheet
  const cover = workbook.addWorksheet("Report Overview");
  cover.mergeCells("B2:E2");
  cover.getCell("B2").value = "AIML DEPARTMENT ACTIVITY REPORT";
  cover.getCell("B2").font = { size: 16, bold: true, color: { argb: "FFFFFFFF" } };
  cover.getCell("B2").fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF0F766E" } };
  cover.getCell("B2").alignment = { vertical: "middle", horizontal: "center" };
  
  cover.getCell("B4").value = "Generated On:";
  cover.getCell("C4").value = new Date().toLocaleString();
  
  cover.getCell("B6").value = "Executive Summary";
  cover.getCell("B6").font = { bold: true, size: 12 };
  
  const stats = [
    ["Total Events", analytics.summary?.events || 0],
    ["Achievements", analytics.summary?.achievements || 0],
    ["Internships", analytics.summary?.internships || 0],
    ["Placements", analytics.summary?.placements || 0]
  ];
  
  cover.addTable({
    name: "SummaryTable",
    ref: "B8",
    headerRow: true,
    totalsRow: false,
    style: { theme: "TableStyleMedium2" },
    columns: [{ name: "Metric", filterButton: false }, { name: "Value", filterButton: false }],
    rows: stats
  });
  
  cover.getColumn("B").width = 25;
  cover.getColumn("C").width = 20;

  // Data Sheets
  const addDataSheet = (title, dataObj) => {
    if (!dataObj || Object.keys(dataObj).length === 0) return;
    const sheet = workbook.addWorksheet(title);
    
    sheet.columns = [
      { header: "Category / Name", key: "name", width: 30 },
      { header: "Metric Value", key: "value", width: 20 }
    ];
    
    sheet.getRow(1).font = { bold: true, color: { argb: "FFFFFFFF" } };
    sheet.getRow(1).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF0F766E" } };
    
    Object.entries(dataObj).forEach(([name, value]) => sheet.addRow({ name, value }));
    
    sheet.autoFilter = "A1:B1";
  };

  addDataSheet("Events", analytics.eventsByCategory);
  addDataSheet("Internship Modes", analytics.internshipModes);
  addDataSheet("Placement Types", analytics.placementTypes);
  addDataSheet("Historical Growth", analytics.placementGrowth); // Merging or keeping separate based on real data

  const buffer = await workbook.xlsx.writeBuffer();
  downloadBlob(new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }), `aiml-analytics-${Date.now()}.xlsx`);
};

export const exportAnalyticsPPT = async (analytics) => {
  const pptx = new pptxgen();
  pptx.layout = "LAYOUT_WIDE";
  pptx.author = "AIML Department";
  pptx.company = "Sanjivani University";

  // Cover Slide
  const cover = pptx.addSlide();
  cover.background = { color: "0F172A" }; // slate-900
  
  // Accent shape
  cover.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: "100%", h: 0.2, fill: { color: "14B8A6" } });
  
  cover.addText("SANJIVANI UNIVERSITY", { x: 1, y: 2, w: 10, h: 0.5, fontSize: 16, bold: true, color: "14B8A6", letterSpacing: 2 });
  cover.addText("AIML Department", { x: 1, y: 2.5, w: 10, h: 1, fontSize: 44, bold: true, color: "FFFFFF" });
  cover.addText("Activity & Analytics Report", { x: 1, y: 3.5, w: 10, h: 0.5, fontSize: 24, color: "94A3B8" });
  cover.addText(`Generated: ${new Date().toLocaleString()}`, { x: 1, y: 6, w: 10, h: 0.5, fontSize: 12, color: "64748B" });

  // Summary Slide
  const summarySlide = pptx.addSlide();
  summarySlide.background = { color: "F8FAFC" };
  summarySlide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: "100%", h: 1, fill: { color: "0F766E" } });
  summarySlide.addText("Executive Summary", { x: 0.5, y: 0.2, w: 5, h: 0.6, fontSize: 24, bold: true, color: "FFFFFF" });
  
  const stats = [
    { label: "Total Events", value: analytics.summary?.events || 0 },
    { label: "Achievements", value: analytics.summary?.achievements || 0 },
    { label: "Internships", value: analytics.summary?.internships || 0 },
    { label: "Placements", value: analytics.summary?.placements || 0 },
  ];

  stats.forEach((stat, idx) => {
    const x = 1 + (idx % 2) * 6;
    const y = 2 + Math.floor(idx / 2) * 2.5;
    
    // Card background
    summarySlide.addShape(pptx.ShapeType.roundRect, { x, y, w: 4.5, h: 1.8, fill: { color: "FFFFFF" }, line: { color: "E2E8F0", width: 1 }, rectRadius: 0.1 });
    // Value
    summarySlide.addText(String(stat.value), { x: x + 0.5, y: y + 0.3, w: 3.5, h: 0.8, fontSize: 36, bold: true, color: "0F766E", align: "center" });
    // Label
    summarySlide.addText(stat.label, { x: x + 0.5, y: y + 1.1, w: 3.5, h: 0.4, fontSize: 14, color: "64748B", align: "center" });
  });

  // Data Slide helper
  const addDataSlide = (title, dataObj) => {
    if (!dataObj || Object.keys(dataObj).length === 0) return;
    
    const slide = pptx.addSlide();
    slide.background = { color: "F8FAFC" };
    slide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: "100%", h: 1, fill: { color: "0F766E" } });
    slide.addText(title, { x: 0.5, y: 0.2, w: 8, h: 0.6, fontSize: 24, bold: true, color: "FFFFFF" });

    // Format data for table
    const tableData = [
      [
        { text: "Category / Metric", options: { bold: true, color: "FFFFFF", fill: "14B8A6" } },
        { text: "Value", options: { bold: true, color: "FFFFFF", fill: "14B8A6" } }
      ]
    ];
    
    Object.entries(dataObj).forEach(([k, v]) => {
      tableData.push([k, String(v)]);
    });

    slide.addTable(tableData, {
      x: 1, y: 1.5, w: 8,
      border: { pt: 1, color: "E2E8F0" },
      fill: "FFFFFF",
      fontSize: 14,
      color: "334155",
      rowH: 0.5,
      valign: "middle"
    });
  };

  addDataSlide("Events Breakdown", analytics.eventsByCategory);
  addDataSlide("Internships Overview", analytics.internshipModes);
  addDataSlide("Placement Overview", analytics.placementTypes);

  await pptx.writeFile({ fileName: `aiml-presentation-${Date.now()}.pptx` });
};
