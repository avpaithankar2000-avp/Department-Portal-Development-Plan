import { motion } from "framer-motion";
import { Trophy, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { Bar, BarChart, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { getPlacementStats } from "../../api/resources";
import CompanyLogoCard from "../../components/documents/CompanyLogoCard";
import FilterBar from "../../components/public/FilterBar";
import PageHeader from "../../components/public/PageHeader";
import Pagination from "../../components/public/Pagination";
import StateBlock from "../../components/public/StateBlock";
import AnimatedCounter from "../../components/ui/AnimatedCounter";
import AnimatedPage from "../../components/ui/AnimatedPage";
import useResourceList from "../../hooks/useResourceList";
import { formatDate, moneyLpa } from "../../utils/formatters";

const colors = ["#0f766e", "#f97316", "#0284c7", "#64748b"];

const Placements = () => {
  const [params, setParams] = useState({ page: 1, limit: 10, search: "", academicYear: "" });
  const [stats, setStats] = useState(null);
  const { items, pagination, loading, error } = useResourceList("placements", params);

  useEffect(() => {
    getPlacementStats().then(setStats).catch(() => {});
  }, []);

  const typeData = items.reduce((acc, item) => {
    const type = item.offerType || item.placementType || "Full-time";
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});
  const typeSeries = Object.entries(typeData).map(([name, value]) => ({ name, value }));

  return (
    <AnimatedPage>
      <PageHeader title="Placements" eyebrow="Career outcomes">Public placement showcase with recruiter and package analytics.</PageHeader>
      <main className="section">
        <div className="mb-6 grid gap-4 md:grid-cols-3">
          <Stat label="Placed Students" value={stats?.overview?.totalStudents || 0} />
          <Stat label="Highest Package" value={stats?.overview?.highestPackage || 0} suffix=" LPA" decimals={1} />
          <Stat label="Average Package" value={stats?.overview?.averagePackage || 0} suffix=" LPA" decimals={1} />
        </div>

        <div className="mb-6 grid gap-5 lg:grid-cols-2">
          <ChartCard title="Year-wise Placement Growth">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={stats?.byYear || []}>
                <XAxis dataKey="_id" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#0f766e" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
          <ChartCard title="Placement Type Ratio">
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={typeSeries} dataKey="value" nameKey="name" outerRadius={90} label>
                  {typeSeries.map((_, index) => <Cell key={index} fill={colors[index % colors.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {stats?.byCompany?.length > 0 && (
          <div className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {stats.byCompany.slice(0, 4).map((company, index) => (
              <motion.div key={company._id} whileHover={{ y: -6 }} className="premium-card p-5">
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-coral to-brand text-white shadow-glow"><Trophy size={19} /></span>
                <h3 className="mt-4 text-xl font-black text-ink dark:text-white">{company._id}</h3>
                <p className="mt-1 text-sm font-bold text-slate-500 dark:text-slate-400">Rank {index + 1} · {company.count} selections</p>
              </motion.div>
            ))}
          </div>
        )}

        <FilterBar search={params.search} setSearch={(search) => setParams((prev) => ({ ...prev, search, page: 1 }))}>
          <input placeholder="Academic year" value={params.academicYear} onChange={(event) => setParams((prev) => ({ ...prev, academicYear: event.target.value, page: 1 }))} />
        </FilterBar>
        <StateBlock loading={loading} error={error} empty={!loading && items.length === 0} />

        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-white/5">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 text-slate-500 dark:bg-white/5 dark:text-slate-400">
              <tr>
                <th className="px-4 py-3 font-bold">Student</th>
                <th className="px-4 py-3 font-bold">Company & Role</th>
                <th className="px-4 py-3 font-bold">Package</th>
                <th className="px-4 py-3 font-bold">Year / Type</th>
                <th className="px-4 py-3 font-bold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-white/10">
              {items.map((item) => (
                <tr key={item._id} className="transition-colors hover:bg-slate-50 dark:hover:bg-white/5">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="grid h-8 w-8 shrink-0 place-items-center overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
                        {item.studentPhoto?.secure_url ? <img src={item.studentPhoto.secure_url} alt={item.studentName} className="h-full w-full object-cover" /> : <UserRound className="h-4 w-4 text-slate-400" />}
                      </div>
                      <span className="font-bold text-ink dark:text-white">{item.studentName}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-bold text-ink dark:text-white">{item.company}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">{item.role}</div>
                  </td>
                  <td className="px-4 py-3 font-black text-brand dark:text-teal-400">{moneyLpa(item.packageLpa || item.package)}</td>
                  <td className="px-4 py-3">
                    <div className="text-ink dark:text-white">{item.academicYear}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">{item.offerType || item.placementType}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-slate-600 dark:bg-white/10 dark:text-slate-300">{item.verificationStatus || "Pending"}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination pagination={pagination} onPage={(page) => setParams((prev) => ({ ...prev, page }))} />
      </main>
    </AnimatedPage>
  );
};

const Stat = ({ label, value, suffix = "", decimals = 0 }) => <div className="premium-card p-5"><p className="text-sm font-bold text-slate-500 dark:text-slate-400">{label}</p><p className="mt-2 text-3xl font-black text-ink dark:text-white"><AnimatedCounter value={value} suffix={suffix} decimals={decimals} /></p></div>;
const ChartCard = ({ title, children }) => <section className="glass-panel rounded-[2rem] p-5"><h2 className="mb-4 font-black text-ink dark:text-white">{title}</h2>{children}</section>;
const Info = ({ label, value, highlight = false }) => <div className={`rounded-3xl p-4 ${highlight ? "bg-gradient-to-br from-brand to-sky-600 text-white shadow-glow" : "bg-slate-100 dark:bg-white/10"}`}><p className={`text-xs font-black uppercase tracking-wide ${highlight ? "text-white/80" : "text-slate-500 dark:text-slate-400"}`}>{label}</p><p className={`mt-1 font-black ${highlight ? "text-xl text-white" : "text-ink dark:text-white"}`}>{value || "N/A"}</p></div>;

export default Placements;
