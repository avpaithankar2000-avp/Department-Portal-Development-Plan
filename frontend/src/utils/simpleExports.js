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

export const exportAnalyticsPDF = (analytics, title = "AIML Analytics Summary") => {
  const doc = new jsPDF();
  doc.setFillColor(15, 118, 110);
  doc.rect(0, 0, 210, 32, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(17);
  doc.text(title, 14, 20);
  doc.setTextColor(23, 32, 51);
  doc.setFontSize(11);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 43);
  Object.entries(analytics.summary || {}).forEach(([key, value], index) => {
    doc.text(`${key}: ${Number(value).toFixed ? Number(value).toFixed(1) : value}`, 14, 58 + index * 8);
  });
  doc.save(`aiml-summary-${Date.now()}.pdf`);
};

export const exportAnalyticsExcel = async (analytics) => {
  const workbook = new ExcelJS.Workbook();
  const summary = workbook.addWorksheet("Summary");
  summary.columns = [{ header: "Metric", key: "metric", width: 28 }, { header: "Value", key: "value", width: 18 }];
  Object.entries(analytics.summary || {}).forEach(([metric, value]) => summary.addRow({ metric, value }));
  ["eventsByCategory", "internshipGrowth", "internshipModes", "placementGrowth", "placementTypes"].forEach((key) => {
    const sheet = workbook.addWorksheet(key);
    sheet.columns = [{ header: "Name", key: "name", width: 28 }, { header: "Value", key: "value", width: 18 }];
    Object.entries(analytics[key] || {}).forEach(([name, value]) => sheet.addRow({ name, value }));
  });
  const buffer = await workbook.xlsx.writeBuffer();
  downloadBlob(new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }), `aiml-report-${Date.now()}.xlsx`);
};

export const exportAnalyticsPPT = async (analytics) => {
  const pptx = new pptxgen();
  pptx.layout = "LAYOUT_WIDE";
  const slide = pptx.addSlide();
  slide.background = { color: "0F766E" };
  slide.addText("AIML Department Analytics", { x: 0.7, y: 0.8, w: 10, h: 0.6, fontSize: 32, bold: true, color: "FFFFFF" });
  slide.addText("Institutional activity, internship, placement, event, and achievement overview.", { x: 0.75, y: 1.55, w: 10, h: 0.4, fontSize: 15, color: "E0F2FE" });
  const stats = Object.entries(analytics.summary || {}).slice(0, 8);
  stats.forEach(([label, value], index) => {
    const x = 0.8 + (index % 4) * 3;
    const y = 2.4 + Math.floor(index / 4) * 1.2;
    slide.addText(label, { x, y, w: 2.4, h: 0.25, fontSize: 9, bold: true, color: "E0F2FE" });
    slide.addText(String(Number(value).toFixed ? Number(value).toFixed(1) : value), { x, y: y + 0.32, w: 2.4, h: 0.35, fontSize: 18, bold: true, color: "FFFFFF" });
  });
  await pptx.writeFile({ fileName: `aiml-analytics-${Date.now()}.pptx` });
};
