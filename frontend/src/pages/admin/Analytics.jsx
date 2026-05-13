import { motion } from "framer-motion";
import { Download, TrendingUp } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { getAnalyticsOverview } from "../../api/resources";
import AnimatedCounter from "../../components/ui/AnimatedCounter";
import AnimatedPage from "../../components/ui/AnimatedPage";
import Skeleton from "../../components/ui/Skeleton";

const colors = ["#0f766e", "#f97316", "#0284c7", "#64748b", "#14b8a6", "#fb923c"];
const toSeries = (object = {}) => Object.entries(object).map(([name, value]) => ({ name, value }));

const Analytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAnalyticsOverview().then(setAnalytics).finally(() => setLoading(false));
  }, []);

  const internshipGrowth = useMemo(() => toSeries(analytics?.internshipGrowth), [analytics]);
  const placementGrowth = useMemo(() => toSeries(analytics?.placementGrowth), [analytics]);
  const modeRatio = useMemo(() => toSeries(analytics?.internshipModes), [analytics]);
  const eventCategories = useMemo(() => toSeries(analytics?.eventsByCategory), [analytics]);

  if (loading) {
    return (
      <AnimatedPage>
        <div className="grid gap-4 md:grid-cols-4">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
      </AnimatedPage>
    );
  }

  return (
    <AnimatedPage>
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-black uppercase tracking-wide text-brand dark:text-teal-200">Institutional intelligence</p>
          <h1 className="mt-1 text-4xl font-black text-ink dark:text-white">Analytics Panel</h1>
          <p className="mt-2 text-slate-600 dark:text-slate-300">A dean-ready overview across events, achievements, internships, and placements.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button className="btn-secondary" onClick={async () => (await import("../../utils/simpleExports")).exportAnalyticsPDF(analytics)}><Download size={17} /> PDF</button>
          <button className="btn-secondary" onClick={async () => (await import("../../utils/simpleExports")).exportAnalyticsExcel(analytics)}><Download size={17} /> Excel</button>
          <button className="btn-primary" onClick={async () => (await import("../../utils/simpleExports")).exportAnalyticsPPT(analytics)}><Download size={17} /> PPT</button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metric label="Events" value={analytics.summary.events} />
        <Metric label="Achievements" value={analytics.summary.achievements} />
        <Metric label="Internships" value={analytics.summary.internships} />
        <Metric label="Placements" value={analytics.summary.placements} />
        <Metric label="Avg Stipend" value={analytics.summary.averageStipend} prefix="₹" />
        <Metric label="Highest Stipend" value={analytics.summary.highestStipend} prefix="₹" />
        <Metric label="Avg Package" value={analytics.summary.averagePackage} suffix=" LPA" decimals={1} />
        <Metric label="Highest Package" value={analytics.summary.highestPackage} suffix=" LPA" decimals={1} />
      </div>

      <div className="mt-6 grid gap-5 xl:grid-cols-2">
        <ChartCard title="Internship Growth">
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={internshipGrowth}>
              <defs><linearGradient id="internshipFill" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#0f766e" stopOpacity={0.35} /><stop offset="95%" stopColor="#0f766e" stopOpacity={0} /></linearGradient></defs>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="value" stroke="#0f766e" fill="url(#internshipFill)" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Placement Year-Wise Growth">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={placementGrowth}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" radius={[12, 12, 0, 0]} fill="#0284c7" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Internship Mode Ratio">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={modeRatio} dataKey="value" nameKey="name" outerRadius={105} label>
                {modeRatio.map((_, index) => <Cell key={index} fill={colors[index % colors.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Event Category Mix">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={eventCategories} dataKey="value" nameKey="name" outerRadius={105} label>
                {eventCategories.map((_, index) => <Cell key={index} fill={colors[index % colors.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="mt-6 grid gap-5 xl:grid-cols-2">
        <ChartCard title="Top Recruiters">
          <div className="space-y-3">
            {analytics.recruiters.map((item) => <RankBar key={item.name} name={item.name} value={item.value} max={analytics.recruiters[0]?.value || 1} />)}
          </div>
        </ChartCard>
        <ChartCard title="Top Technologies">
          <div className="space-y-3">
            {analytics.topTechnologies.map((item) => <RankBar key={item.name} name={item.name} value={item.value} max={analytics.topTechnologies[0]?.value || 1} />)}
          </div>
        </ChartCard>
      </div>
    </AnimatedPage>
  );
};

const Metric = ({ label, value, prefix = "", suffix = "", decimals = 0 }) => (
  <motion.div whileHover={{ y: -5 }} className="premium-card p-5">
    <p className="text-xs font-black uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</p>
    <p className="mt-2 text-3xl font-black text-ink dark:text-white">{prefix}<AnimatedCounter value={value || 0} suffix={suffix} decimals={decimals} /></p>
  </motion.div>
);

const ChartCard = ({ title, children }) => (
  <section className="glass-panel rounded-[2rem] p-5">
    <h2 className="mb-4 flex items-center gap-2 text-xl font-black text-ink dark:text-white"><TrendingUp className="text-brand" size={20} />{title}</h2>
    {children}
  </section>
);

const RankBar = ({ name, value, max }) => (
  <div>
    <div className="mb-1 flex justify-between text-sm font-bold text-slate-600 dark:text-slate-300"><span>{name}</span><span>{value}</span></div>
    <div className="h-3 overflow-hidden rounded-full bg-slate-200 dark:bg-white/10"><motion.div initial={{ width: 0 }} animate={{ width: `${(value / max) * 100}%` }} className="h-full rounded-full bg-gradient-to-r from-brand to-sky-500" /></div>
  </div>
);

export default Analytics;
