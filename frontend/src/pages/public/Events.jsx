import { AnimatePresence, motion } from "framer-motion";
import { CalendarDays, Code2, MapPin, Music2, X } from "lucide-react";
import { useState } from "react";
import FilterBar from "../../components/public/FilterBar";
import PageHeader from "../../components/public/PageHeader";
import Pagination from "../../components/public/Pagination";
import StateBlock from "../../components/public/StateBlock";
import AnimatedPage from "../../components/ui/AnimatedPage";
import useResourceList from "../../hooks/useResourceList";
import { formatDate } from "../../utils/formatters";

const categories = ["Workshop", "Seminar", "Hackathon", "Guest Lecture", "Conference", "Other"];
const technicalCategories = ["Workshop", "Seminar", "Hackathon", "Guest Lecture", "Conference", "AI Workshop", "Coding Competition", "Robotics"];
const eventTypeFor = (category = "") => (technicalCategories.some((item) => category.toLowerCase().includes(item.toLowerCase())) ? "Technical" : "Non-Technical");

const Events = () => {
  const [params, setParams] = useState({ page: 1, limit: 9, search: "", category: "", from: "", to: "", activityGroup: "" });
  const [selected, setSelected] = useState(null);
  const { items, pagination, loading, error } = useResourceList("events", params);

  return (
    <AnimatedPage>
      <PageHeader title="Events" eyebrow="Department calendar">Browse programs by date and category.</PageHeader>
      <main className="section">
        <div className="mb-6 grid gap-4 md:grid-cols-2">
          {["Technical", "Non-Technical"].map((type) => (
            <motion.button key={type} whileHover={{ y: -6 }} className={`premium-card p-6 text-left ${params.activityGroup === type ? "ring-2 ring-brand" : ""}`} onClick={() => setParams((prev) => ({ ...prev, activityGroup: prev.activityGroup === type ? "" : type, page: 1 }))}>
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-brand to-sky-500 text-white shadow-glow">{type === "Technical" ? <Code2 size={22} /> : <Music2 size={22} />}</span>
              <h2 className="mt-4 text-2xl font-black text-ink dark:text-white">{type} Events</h2>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{type === "Technical" ? "Hackathons, AI workshops, coding competitions, robotics, and research programs." : "Cultural events, sports, leadership, debate, and community activities."}</p>
            </motion.button>
          ))}
        </div>
        <FilterBar search={params.search} setSearch={(search) => setParams((prev) => ({ ...prev, search, page: 1 }))}>
          <select value={params.activityGroup} onChange={(event) => setParams((prev) => ({ ...prev, activityGroup: event.target.value, page: 1 }))}>
            <option value="">Technical and Non-Technical</option>
            <option>Technical</option>
            <option>Non-Technical</option>
          </select>
          <select value={params.category} onChange={(event) => setParams((prev) => ({ ...prev, category: event.target.value, page: 1 }))}>
            <option value="">All categories</option>
            {categories.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
          <input type="date" value={params.from} onChange={(event) => setParams((prev) => ({ ...prev, from: event.target.value, page: 1 }))} />
          <input type="date" value={params.to} onChange={(event) => setParams((prev) => ({ ...prev, to: event.target.value, page: 1 }))} />
        </FilterBar>
        <StateBlock loading={loading} error={error} empty={!loading && items.length === 0} />
        <div className="relative space-y-5 before:absolute before:left-5 before:top-0 before:hidden before:h-full before:w-px before:bg-gradient-to-b before:from-brand before:via-sky-400 before:to-transparent md:before:block">
          {items.filter((event) => !params.activityGroup || eventTypeFor(event.category) === params.activityGroup).map((event) => (
            <motion.article
              key={event._id}
              whileHover={{ x: 6 }}
              className="grid gap-4 md:grid-cols-[42px_1fr]"
            >
              <div className="relative hidden md:block">
                <span className="absolute left-0 top-6 grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-brand to-sky-500 text-white shadow-glow">
                  <CalendarDays size={18} />
                </span>
              </div>
              <button onClick={() => setSelected(event)} className="premium-card overflow-hidden text-left md:grid md:grid-cols-[260px_1fr]">
                <div className="h-52 bg-slate-200 dark:bg-white/10 md:h-full">
                  {event.image?.url && <img src={event.image.url} alt={event.title} className="h-full w-full object-cover transition duration-500 hover:scale-105" />}
                </div>
                <div className="p-6">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-black text-brand dark:bg-teal-300/10 dark:text-teal-200">{eventTypeFor(event.category)} · {event.category}</span>
                    <span className="text-sm font-bold text-slate-500 dark:text-slate-400">{formatDate(event.date)}</span>
                  </div>
                  <h2 className="mt-4 text-2xl font-black text-ink dark:text-white">{event.title}</h2>
                  <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{event.description}</p>
                  <p className="mt-4 flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-200"><MapPin size={16} />{event.venue}</p>
                </div>
              </button>
            </motion.article>
          ))}
        </div>
        <Pagination pagination={pagination} onPage={(page) => setParams((prev) => ({ ...prev, page }))} />
      </main>
      <AnimatePresence>
        {selected && (
          <motion.div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/60 p-4 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div initial={{ opacity: 0, scale: 0.92, y: 24 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.94, y: 18 }} className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-[2rem] border border-white/50 bg-white/95 shadow-glow dark:border-white/10 dark:bg-night/95">
              <div className="flex items-center justify-between border-b border-slate-200/70 p-5 dark:border-white/10">
                <div>
                  <p className="text-sm font-black uppercase tracking-wide text-brand dark:text-teal-200">{selected.category}</p>
                  <h2 className="text-2xl font-black text-ink dark:text-white">{selected.title}</h2>
                </div>
                <button className="btn-secondary px-3" onClick={() => setSelected(null)} aria-label="Close event">
                  <X size={18} />
                </button>
              </div>
              {selected.image?.url && (
                <div className="grid gap-3 p-5 sm:grid-cols-3">
                  {[0, 1, 2].map((item) => (
                    <img key={item} src={selected.image.url} alt={selected.title} className="h-52 w-full rounded-3xl object-cover shadow-soft" />
                  ))}
                </div>
              )}
              <div className="p-5 pt-0">
                <p className="leading-7 text-slate-600 dark:text-slate-300">{selected.description}</p>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-3xl bg-slate-100 p-4 dark:bg-white/10"><b>Date:</b> {formatDate(selected.date)}</div>
                  <div className="rounded-3xl bg-slate-100 p-4 dark:bg-white/10"><b>Venue:</b> {selected.venue}</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AnimatedPage>
  );
};

export default Events;
