import { motion } from "framer-motion";
import { Award, GraduationCap, Trophy, UserRound } from "lucide-react";
import { useState } from "react";
import FilterBar from "../../components/public/FilterBar";
import PageHeader from "../../components/public/PageHeader";
import Pagination from "../../components/public/Pagination";
import StateBlock from "../../components/public/StateBlock";
import AnimatedPage from "../../components/ui/AnimatedPage";
import useResourceList from "../../hooks/useResourceList";
import { formatDate } from "../../utils/formatters";

const Achievements = () => {
  const [params, setParams] = useState({ page: 1, limit: 10, search: "", achieverType: "", categoryGroup: "" });
  const { items, pagination, loading, error } = useResourceList("achievements", params);
  const categoryFor = (item) => /tech|code|ai|ml|paper|research|hack|robot|project/i.test(`${item.category} ${item.title}`) ? "Technical" : "Non-Technical";
  const filtered = items.filter((item) => (!params.categoryGroup || categoryFor(item) === params.categoryGroup));
  const students = filtered.filter((item) => item.achieverType === "Student").slice(0, 5);
  const faculty = filtered.filter((item) => item.achieverType === "Faculty").slice(0, 5);

  return (
    <AnimatedPage>
      <PageHeader title="Achievements" eyebrow="Recognition">Student and faculty milestones in one place.</PageHeader>
      <main className="section">
        <div className="mb-6 grid gap-4 md:grid-cols-4">
          {[
            ["Technical Student", "Technical", "Student", GraduationCap],
            ["Technical Faculty", "Technical", "Faculty", UserRound],
            ["Non-Technical Student", "Non-Technical", "Student", Trophy],
            ["Non-Technical Faculty", "Non-Technical", "Faculty", Award]
          ].map(([label, categoryGroup, achieverType, Icon]) => (
            <motion.button key={label} whileHover={{ y: -5 }} className="premium-card p-4 text-left" onClick={() => setParams((prev) => ({ ...prev, categoryGroup, achieverType, page: 1 }))}>
              <Icon className="text-brand" size={22} />
              <p className="mt-3 text-sm font-black text-ink dark:text-white">{label}</p>
            </motion.button>
          ))}
        </div>
        <FilterBar search={params.search} setSearch={(search) => setParams((prev) => ({ ...prev, search, page: 1 }))}>
          <select value={params.categoryGroup} onChange={(event) => setParams((prev) => ({ ...prev, categoryGroup: event.target.value, page: 1 }))}>
            <option value="">Technical and Non-Technical</option>
            <option>Technical</option>
            <option>Non-Technical</option>
          </select>
          <select value={params.achieverType} onChange={(event) => setParams((prev) => ({ ...prev, achieverType: event.target.value, page: 1 }))}>
            <option value="">Students and faculty</option>
            <option>Student</option>
            <option>Faculty</option>
          </select>
        </FilterBar>
        <div className="mb-6 grid gap-5 lg:grid-cols-2">
          <section className="glass-panel rounded-[2rem] p-5">
            <h2 className="mb-4 text-xl font-black text-ink dark:text-white">Student Leaderboard</h2>
            <div className="space-y-3">{students.map((item, index) => <Rank key={item._id} index={index + 1} name={item.achieverName} title={item.title} />)}</div>
          </section>
          <section className="glass-panel rounded-[2rem] p-5">
            <h2 className="mb-4 text-xl font-black text-ink dark:text-white">Faculty Highlights</h2>
            <div className="space-y-3">{faculty.map((item, index) => <Rank key={item._id} index={index + 1} name={item.achieverName} title={item.title} />)}</div>
          </section>
        </div>
        <StateBlock loading={loading} error={error} empty={!loading && items.length === 0} />
        <div className="grid gap-5 lg:grid-cols-2">
          {filtered.map((item) => (
            <motion.article key={item._id} whileHover={{ y: -6 }} className="premium-card grid overflow-hidden sm:grid-cols-[200px_1fr]">
              <div className="h-48 bg-slate-100 dark:bg-white/10 sm:h-full">
                {item.image?.url ? <img src={item.image.url} alt={item.title} className="h-full w-full object-cover" /> : null}
              </div>
              <div className="p-5">
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-skysoft px-3 py-1 text-xs font-black text-sky-800">{item.achieverType}</span>
                  <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-black text-coral">{categoryFor(item)} · {item.category}</span>
                </div>
                <h2 className="mt-4 text-xl font-black text-ink dark:text-white">{item.title}</h2>
                <p className="mt-1 text-sm font-bold text-slate-700 dark:text-slate-200">{item.achieverName}</p>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{item.description}</p>
                <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">{formatDate(item.awardDate)}</p>
              </div>
            </motion.article>
          ))}
        </div>
        <Pagination pagination={pagination} onPage={(page) => setParams((prev) => ({ ...prev, page }))} />
      </main>
    </AnimatedPage>
  );
};

const Rank = ({ index, name, title }) => (
  <div className="flex items-center gap-3 rounded-3xl bg-white/60 p-3 dark:bg-white/10">
    <span className="grid h-9 w-9 place-items-center rounded-2xl bg-gradient-to-br from-brand to-sky-500 text-sm font-black text-white">{index}</span>
    <div>
      <p className="font-black text-ink dark:text-white">{name}</p>
      <p className="text-xs text-slate-500 dark:text-slate-400">{title}</p>
    </div>
  </div>
);

export default Achievements;
