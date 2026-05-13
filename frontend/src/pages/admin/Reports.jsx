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
  const [history, setHistory] = useState(() => JSON.parse(localStorage.getItem("aiml_export_history") || "[]"));

  useEffect(() => {
    getAnalyticsOverview().then(setAnalytics).finally(() => setLoading(false));
  }, []);

  const recordExport = (type) => {
    const next = [{ id: crypto.randomUUID(), type, filters, date: new Date().toISOString() }, ...history].slice(0, 8);
    setHistory(next);
    localStorage.setItem("aiml_export_history", JSON.stringify(next));
  };

  const runExport = async (type) => {
    setProgress(type);
    try {
      const { exportAnalyticsExcel, exportAnalyticsPDF, exportAnalyticsPPT } = await import("../../utils/simpleExports");
      if (type === "PDF") exportAnalyticsPDF(analytics, "AIML Department Export Summary");
      if (type === "Excel") await exportAnalyticsExcel(analytics);
      if (type === "PPT") await exportAnalyticsPPT(analytics);
      recordExport(type);
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
              <div className="grid gap-4 md:grid-cols-3">
                <ExportCard title="PDF Report" icon={FileText} busy={progress === "PDF"} onClick={() => runExport("PDF")} />
                <ExportCard title="Excel Workbook" icon={FileSpreadsheet} busy={progress === "Excel"} onClick={() => runExport("Excel")} />
                <ExportCard title="PowerPoint Deck" icon={Presentation} busy={progress === "PPT"} onClick={() => runExport("PPT")} />
              </div>
              <div className="glass-panel rounded-[2rem] p-5">
                <div className="flex items-start gap-3">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-brand to-sky-500 text-white shadow-glow"><Sparkles size={20} /></span>
                  <div>
                    <h2 className="text-xl font-black text-ink dark:text-white">Export Summary</h2>
                    <p className="mt-2 leading-7 text-slate-600 dark:text-slate-300">This export package includes ERP-style summary statistics for {analytics.summary.events} events, {analytics.summary.achievements} achievements, {analytics.summary.internships} internships, and {analytics.summary.placements} placements.</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </section>
      </div>

      <section className="glass-panel mt-6 rounded-[2rem] p-5">
        <h2 className="text-xl font-black text-ink dark:text-white">Download History</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {history.length === 0 && <p className="text-sm text-slate-500 dark:text-slate-400">No exports yet.</p>}
          {history.map((item) => (
            <div key={item.id} className="rounded-3xl bg-white/60 p-4 dark:bg-white/10">
              <p className="font-black text-ink dark:text-white">{item.type}</p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{new Date(item.date).toLocaleString()}</p>
            </div>
          ))}
        </div>
      </section>
    </AnimatedPage>
  );
};

const Field = ({ label, children }) => <label className="block"><span className="mb-2 block">{label}</span>{children}</label>;

const ExportCard = ({ title, icon: Icon, busy, onClick }) => (
  <motion.button whileHover={{ y: -6 }} className="premium-card p-6 text-left" onClick={onClick} disabled={busy}>
    <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-brand to-sky-500 text-white shadow-glow"><Icon size={22} /></span>
    <h3 className="mt-5 text-xl font-black text-ink dark:text-white">{title}</h3>
    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{busy ? "Generating export..." : "Generate and download instantly"}</p>
    <span className="btn-primary mt-5 w-full"><Download size={16} />{busy ? "Working..." : "Export"}</span>
  </motion.button>
);

export default Reports;
