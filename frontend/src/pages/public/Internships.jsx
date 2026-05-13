import { motion } from "framer-motion";
import { BriefcaseBusiness, MapPin, UserRound } from "lucide-react";
import { useMemo, useState } from "react";
import { Bar, BarChart, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import CompanyLogoCard from "../../components/documents/CompanyLogoCard";
import VerificationBadge from "../../components/documents/VerificationBadge";
import FilterBar from "../../components/public/FilterBar";
import PageHeader from "../../components/public/PageHeader";
import Pagination from "../../components/public/Pagination";
import StateBlock from "../../components/public/StateBlock";
import AnimatedPage from "../../components/ui/AnimatedPage";
import useResourceList from "../../hooks/useResourceList";
import { formatDate } from "../../utils/formatters";

const colors = ["#0f766e", "#0284c7", "#f97316", "#64748b"];

const Internships = () => {
  const [params, setParams] = useState({ page: 1, limit: 12, search: "", mode: "", academicYear: "", verificationStatus: "" });
  const { items, pagination, loading, error } = useResourceList("internships", params);

  const stats = useMemo(() => {
    const modes = {};
    const tech = {};
    let topStipend = 0;
    items.forEach((item) => {
      modes[item.mode || "Unknown"] = (modes[item.mode || "Unknown"] || 0) + 1;
      topStipend = Math.max(topStipend, Number(item.stipend || 0));
      (item.technologiesUsed || []).forEach((name) => {
        tech[name] = (tech[name] || 0) + 1;
      });
    });
    return {
      modes: Object.entries(modes).map(([name, value]) => ({ name, value })),
      technologies: Object.entries(tech).map(([name, value]) => ({ name, value })).slice(0, 8),
      averageStipend: items.length ? items.reduce((sum, item) => sum + Number(item.stipend || 0), 0) / items.length : 0,
      topStipend
    };
  }, [items]);

  return (
    <AnimatedPage>
      <PageHeader title="Internships" eyebrow="Industry exposure">Public internship showcase with verified academic and role details.</PageHeader>
      <main className="section">
        <div className="mb-6 grid gap-4 lg:grid-cols-4">
          <Stat title="Visible Records" value={items.length} />
          <Stat title="Average Stipend" value={`₹${Math.round(stats.averageStipend)}`} />
          <Stat title="Top Stipend" value={`₹${stats.topStipend}`} />
          <Stat title="Mode Types" value={stats.modes.length} />
        </div>

        <div className="mb-6 grid gap-5 xl:grid-cols-2">
          <ChartCard title="Internship Modes Ratio">
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={stats.modes} dataKey="value" nameKey="name" outerRadius={86} label>
                  {stats.modes.map((_, index) => <Cell key={index} fill={colors[index % colors.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
          <ChartCard title="Top Technologies">
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={stats.technologies}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#0f766e" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        <FilterBar search={params.search} setSearch={(search) => setParams((prev) => ({ ...prev, search, page: 1 }))}>
          <select value={params.mode} onChange={(event) => setParams((prev) => ({ ...prev, mode: event.target.value, page: 1 }))}>
            <option value="">All modes</option>
            <option>Remote</option>
            <option>On-site</option>
            <option>Hybrid</option>
          </select>
          <input placeholder="Academic year" value={params.academicYear} onChange={(event) => setParams((prev) => ({ ...prev, academicYear: event.target.value, page: 1 }))} />
          <select value={params.verificationStatus} onChange={(event) => setParams((prev) => ({ ...prev, verificationStatus: event.target.value, page: 1 }))}>
            <option value="">All status</option>
            <option>Verified</option>
            <option>Pending</option>
            <option>Rejected</option>
          </select>
        </FilterBar>

        <StateBlock loading={loading} error={error} empty={!loading && items.length === 0} />
        <div className="grid gap-5 lg:grid-cols-2">
          {items.map((item) => (
            <motion.article key={item._id} whileHover={{ y: -7, scale: 1.01 }} className="premium-card p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex gap-4">
                  <CompanyLogoCard logo={item.companyLogo} company={item.company} />
                  <div>
                    <div className="flex flex-wrap gap-2">
                      <VerificationBadge status={item.verificationStatus} />
                      <span className="rounded-full bg-sky-500/10 px-3 py-1 text-xs font-black text-sky-700 dark:text-sky-300">{item.mode}</span>
                    </div>
                    <h2 className="mt-3 text-2xl font-black text-ink dark:text-white">{item.studentName}</h2>
                    <p className="font-bold text-slate-600 dark:text-slate-300">{item.role}</p>
                  </div>
                </div>
                <div className="grid h-14 w-14 place-items-center overflow-hidden rounded-2xl bg-slate-100 dark:bg-white/10">
                  {item.studentPhoto?.secure_url ? <img src={item.studentPhoto.secure_url} alt={item.studentName} className="h-full w-full object-cover" /> : <UserRound className="text-slate-400" />}
                </div>
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <Info label="Duration" value={`${formatDate(item.startDate)} - ${formatDate(item.endDate)}`} />
                <Info label="Stipend" value={item.stipend ? `₹${item.stipend}` : "N/A"} />
                <Info label="Academic Year" value={item.academicYear} />
              </div>
              <p className="mt-4 flex items-center gap-2 text-sm font-bold text-slate-600 dark:text-slate-300"><MapPin size={16} />{item.location || item.department || "AIML Department"}</p>
              {item.technologiesUsed?.length > 0 && <div className="mt-4 flex flex-wrap gap-2">{item.technologiesUsed.map((tech) => <span key={tech} className="rounded-full bg-white/70 px-3 py-1 text-xs font-bold text-slate-600 dark:bg-white/10 dark:text-slate-300">{tech}</span>)}</div>}
            </motion.article>
          ))}
        </div>
        <Pagination pagination={pagination} onPage={(page) => setParams((prev) => ({ ...prev, page }))} />
      </main>
    </AnimatedPage>
  );
};

const Stat = ({ title, value }) => <div className="premium-card p-5"><p className="text-xs font-black uppercase tracking-wide text-slate-500 dark:text-slate-400">{title}</p><p className="mt-2 text-3xl font-black text-ink dark:text-white">{value}</p></div>;
const ChartCard = ({ title, children }) => <section className="glass-panel rounded-[2rem] p-5"><h2 className="mb-4 text-xl font-black text-ink dark:text-white">{title}</h2>{children}</section>;
const Info = ({ label, value }) => <div className="rounded-3xl bg-slate-100 p-4 dark:bg-white/10"><p className="text-xs font-black uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</p><p className="mt-1 font-bold text-ink dark:text-white">{value}</p></div>;

export default Internships;
