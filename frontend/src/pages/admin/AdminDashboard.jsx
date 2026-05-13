import { ArcElement, BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, LineElement, PointElement, Tooltip } from "chart.js";
import { Award, BriefcaseBusiness, CalendarDays, GraduationCap } from "lucide-react";
import { useEffect, useState } from "react";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import { getDashboardSummary, getPlacementStats, listResource } from "../../api/resources";
import AnimatedCounter from "../../components/ui/AnimatedCounter";
import AnimatedPage from "../../components/ui/AnimatedPage";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, LineElement, PointElement, Tooltip, Legend);

const statCards = [
  ["Events", "events", CalendarDays],
  ["Achievements", "achievements", Award],
  ["Internships", "internships", GraduationCap],
  ["Placements", "placements", BriefcaseBusiness]
];

const AdminDashboard = () => {
  const [summary, setSummary] = useState(null);
  const [placementStats, setPlacementStats] = useState(null);
  const [internshipStats, setInternshipStats] = useState([]);

  useEffect(() => {
    Promise.all([getDashboardSummary(), getPlacementStats(), listResource("internships", { limit: 50 })])
      .then(([summaryData, statsData, internships]) => {
        setSummary(summaryData);
        setPlacementStats(statsData);
        const grouped = internships.items.reduce((acc, item) => {
          acc[item.academicYear] = (acc[item.academicYear] || 0) + 1;
          return acc;
        }, {});
        setInternshipStats(Object.entries(grouped).map(([year, count]) => ({ year, count })));
      })
      .catch(() => {});
  }, []);

  return (
    <AnimatedPage>
      <div className="mb-6">
        <p className="text-sm font-black uppercase tracking-wide text-brand dark:text-teal-200">Live overview</p>
        <h1 className="mt-1 text-4xl font-black text-ink dark:text-white">Dashboard</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-300">Record totals, placement highlights, internship velocity, and recruiter activity.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map(([label, key, Icon]) => (
          <div key={key} className="premium-card p-5">
            <div className="flex items-center justify-between">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-brand/15 to-sky-500/15 text-brand dark:from-white/15 dark:to-white/5 dark:text-teal-200">
                <Icon size={20} />
              </span>
              <AnimatedCounter value={summary?.[key] ?? 0} className="text-4xl font-black text-ink dark:text-white" />
            </div>
            <p className="mt-4 text-sm font-black text-slate-600 dark:text-slate-300">{label}</p>
          </div>
        ))}
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <Highlight label="Highest Package" value={placementStats?.overview?.highestPackage || 0} suffix=" LPA" />
        <Highlight label="Average Package" value={placementStats?.overview?.averagePackage || 0} suffix=" LPA" />
        <Highlight label="Placed Students" value={placementStats?.overview?.totalStudents || 0} />
      </div>
      <div className="mt-6 grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="glass-panel rounded-[2rem] p-5">
          <h2 className="mb-4 text-xl font-black text-ink dark:text-white">Placement Trend</h2>
          <Line
            data={{
              labels: placementStats?.byYear?.map((item) => item._id) || [],
              datasets: [
                { label: "Students", data: placementStats?.byYear?.map((item) => item.count) || [], borderColor: "#0f766e", backgroundColor: "rgba(15,118,110,0.18)", tension: 0.35, fill: true },
                { label: "Average LPA", data: placementStats?.byYear?.map((item) => item.averagePackage?.toFixed(1)) || [], borderColor: "#f97316", tension: 0.35 }
              ]
            }}
          />
        </div>
        <div className="glass-panel rounded-[2rem] p-5">
          <h2 className="mb-4 text-xl font-black text-ink dark:text-white">Internship Chart</h2>
          <Bar data={{ labels: internshipStats.map((item) => item.year), datasets: [{ label: "Internships", data: internshipStats.map((item) => item.count), backgroundColor: "#0284c7" }] }} />
        </div>
      </div>
      <div className="mt-6 grid gap-5 xl:grid-cols-[0.75fr_1.25fr]">
        <div className="glass-panel rounded-[2rem] p-5">
          <h2 className="mb-4 text-xl font-black text-ink dark:text-white">Recruiter Mix</h2>
          <Doughnut data={{ labels: placementStats?.byCompany?.map((item) => item._id) || [], datasets: [{ data: placementStats?.byCompany?.map((item) => item.count) || [], backgroundColor: ["#0f766e", "#f97316", "#0284c7", "#14b8a6", "#64748b", "#fb923c", "#38bdf8"] }] }} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {(placementStats?.byCompany || []).slice(0, 6).map((company, index) => (
            <div key={company._id} className="premium-card p-5">
              <p className="text-sm font-bold text-slate-500 dark:text-slate-400">Top Recruiter #{index + 1}</p>
              <h3 className="mt-2 text-2xl font-black text-ink dark:text-white">{company._id}</h3>
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{company.count} selected students</p>
            </div>
          ))}
        </div>
      </div>
    </AnimatedPage>
  );
};

const Highlight = ({ label, value, suffix = "" }) => (
  <div className="premium-card p-5">
    <p className="text-sm font-bold text-slate-500 dark:text-slate-400">{label}</p>
    <p className="mt-2 text-3xl font-black text-ink dark:text-white">
      <AnimatedCounter value={value} suffix={suffix} decimals={suffix ? 1 : 0} />
    </p>
  </div>
);

export default AdminDashboard;
