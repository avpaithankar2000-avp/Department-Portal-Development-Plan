import { motion } from "framer-motion";
import { Download, FileSpreadsheet, FileText, Presentation, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { getAnalyticsOverview } from "../../api/resources";
import AnimatedPage from "../../components/ui/AnimatedPage";
import Skeleton from "../../components/ui/Skeleton";

const Reports = () => {
  const [filters, setFilters] = useState({ academicYear: "", categoryType: "", audienceType: "", from: "", to: "" });
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState("");

  useEffect(() => {
    getAnalyticsOverview().then(setAnalytics).finally(() => setLoading(false));
  }, []);



  const runExport = async (type) => {
    setProgress(type);
    try {
      const { exportAnalyticsExcel, exportAnalyticsPDF, exportAnalyticsPPT } = await import("../../utils/simpleExports");
      if (type === "PDF") exportAnalyticsPDF(analytics, "AIML Department Export Summary");
      if (type === "Excel") await exportAnalyticsExcel(analytics);
      if (type === "PPT") await exportAnalyticsPPT(analytics);
    } finally {
      setProgress("");
    }
  };

  return (
    <AnimatedPage>
      <div className="mb-6">
        <p className="text-sm font-black uppercase tracking-wide text-brand dark:text-teal-200">Export center</p>
        <h1 className="mt-1 text-4xl font-black text-ink dark:text-white">Accreditation Reports</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-300">Export internship, placement, event, achievement, and analytics summaries for institutional review.</p>
      </div>

      <div className="grid gap-5 xl:grid-cols-[380px_1fr]">
        <section className="glass-panel rounded-[2rem] p-5">
          <h2 className="text-xl font-black text-ink dark:text-white">Export Filters</h2>
          <div className="mt-5 space-y-4">
            <Field label="Academic Year"><input value={filters.academicYear} onChange={(event) => setFilters((prev) => ({ ...prev, academicYear: event.target.value }))} placeholder="2026" /></Field>
            <Field label="Technical / Non-Technical"><select value={filters.categoryType} onChange={(event) => setFilters((prev) => ({ ...prev, categoryType: event.target.value }))}><option value="">All</option><option>Technical</option><option>Non-Technical</option></select></Field>
            <Field label="Student / Faculty"><select value={filters.audienceType} onChange={(event) => setFilters((prev) => ({ ...prev, audienceType: event.target.value }))}><option value="">All</option><option>Student</option><option>Faculty</option></select></Field>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="From"><input type="date" value={filters.from} onChange={(event) => setFilters((prev) => ({ ...prev, from: event.target.value }))} /></Field>
              <Field label="To"><input type="date" value={filters.to} onChange={(event) => setFilters((prev) => ({ ...prev, to: event.target.value }))} /></Field>
            </div>
          </div>
        </section>

        <section className="space-y-5">
          {loading ? <Skeleton className="h-64" /> : (
            <>
              <div className="grid gap-6 md:grid-cols-3">
                <ExportCard title="PDF Report" icon={FileText} busy={progress === "PDF"} onClick={() => runExport("PDF")} color="from-rose-500 to-red-600" />
                <ExportCard title="Excel Workbook" icon={FileSpreadsheet} busy={progress === "Excel"} onClick={() => runExport("Excel")} color="from-emerald-500 to-teal-600" />
                <ExportCard title="PowerPoint Deck" icon={Presentation} busy={progress === "PPT"} onClick={() => runExport("PPT")} color="from-orange-500 to-amber-600" />
              </div>
            </>
          )}
        </section>
      </div>
    </AnimatedPage>
  );
};

const Field = ({ label, children }) => <label className="block"><span className="mb-2 block">{label}</span>{children}</label>;

const ExportCard = ({ title, icon: Icon, busy, onClick, color }) => (
  <motion.button 
    whileHover={{ y: -4, scale: 1.02 }} 
    className="flex flex-col items-start rounded-2xl bg-white p-6 shadow-md transition-all hover:shadow-xl dark:bg-slate-800 dark:border dark:border-slate-700" 
    onClick={onClick} 
    disabled={busy}
  >
    <span className={`grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br ${color} text-white shadow-lg`}>
      <Icon size={24} />
    </span>
    <h3 className="mt-6 text-lg font-bold text-slate-900 dark:text-white">{title}</h3>
    <p className="mt-2 flex-1 text-sm text-slate-500 dark:text-slate-400 text-left leading-relaxed">
      {busy ? "Generating secure export..." : "Click to instantly generate and download report."}
    </p>
    <div className={`mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-50 py-3 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-950`}>
      <Download size={16} />
      {busy ? "Processing..." : "Download Now"}
    </div>
  </motion.button>
);

export default Reports;
