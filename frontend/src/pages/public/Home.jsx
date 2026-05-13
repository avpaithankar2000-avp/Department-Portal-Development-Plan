import { motion } from "framer-motion";
import { ArrowRight, Award, BriefcaseBusiness, CalendarDays, GraduationCap, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getDashboardSummary } from "../../api/resources";
import aimlHero from "../../assets/aiml-department.jpg";
import AutoGallery from "../../components/public/AutoGallery";
import AnimatedCounter from "../../components/ui/AnimatedCounter";
import AnimatedPage from "../../components/ui/AnimatedPage";

const cards = [
  ["Events", "events", CalendarDays, "/events", "Department programs"],
  ["Achievements", "achievements", Award, "/achievements", "Student and faculty recognition"],
  ["Internships", "internships", GraduationCap, "/internships", "Industry exposure"],
  ["Placements", "placements", BriefcaseBusiness, "/placements", "Career outcomes"]
];

const Home = () => {
  const [summary, setSummary] = useState({ events: 0, achievements: 0, internships: 0, placements: 0 });
  const [heroFailed, setHeroFailed] = useState(false);

  useEffect(() => {
    getDashboardSummary()
      .then(setSummary)
      .catch(() => {});
  }, []);

  return (
    <AnimatedPage>
      <section className="relative min-h-[calc(100vh-76px)] overflow-hidden bg-night">
        {!heroFailed && (
          <img
            src={aimlHero}
            alt="AIML Department campus technology backdrop"
            className="absolute inset-0 h-full w-full scale-105 object-cover opacity-80 blur-[1.5px]"
            loading="eager"
            decoding="async"
            fetchPriority="high"
            onError={() => setHeroFailed(true)}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950/88 via-slate-950/58 to-teal-950/78" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(20,184,166,0.28),transparent_30%),radial-gradient(circle_at_84%_18%,rgba(249,115,22,0.18),transparent_28%)]" />
        <div className="pointer-events-none absolute inset-0 soft-grid opacity-15" />
        <motion.div className="absolute left-8 top-20 h-32 w-32 rounded-full bg-teal-300/30 blur-3xl" animate={{ y: [0, 22, 0], scale: [1, 1.08, 1] }} transition={{ duration: 7, repeat: Infinity }} />
        <motion.div className="absolute bottom-10 right-12 h-44 w-44 rounded-full bg-coral/25 blur-3xl" animate={{ y: [0, -26, 0], scale: [1, 0.95, 1] }} transition={{ duration: 8, repeat: Infinity }} />

        <div className="relative mx-auto grid min-h-[calc(100vh-76px)] w-full max-w-7xl items-center gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
          <div className="max-w-4xl text-center lg:text-left mx-auto lg:mx-0 flex flex-col items-center lg:items-start">
            <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/12 px-4 py-2 text-xs font-black uppercase tracking-wide text-teal-100 shadow-soft backdrop-blur-xl sm:text-sm">
              <Sparkles size={16} />
              Sanjivani University · AIML Department
            </motion.p>
            <motion.h1 initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="mt-4 max-w-4xl text-4xl font-black leading-[1.02] text-white sm:text-6xl lg:text-7xl">
              AIML Department Activity Portal
            </motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.22 }} className="mt-4 max-w-2xl text-base leading-7 text-slate-200 sm:text-lg">
              A professional ERP-style activity and analytics platform for events, achievements, internships, placements, and institutional reporting.
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.32 }} className="mt-6 flex flex-wrap justify-center lg:justify-start gap-3">
              <Link to="/events" className="btn-primary">
                Explore Activities
                <ArrowRight size={18} />
              </Link>
            </motion.div>
          </div>

          <motion.div initial={{ opacity: 0, x: 28 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="grid gap-3 sm:grid-cols-2">
            {cards.map(([label, key, Icon, to, description], index) => (
              <motion.div key={key} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.26 + index * 0.06 }} whileHover={{ y: -7, scale: 1.01 }}>
                <Link to={to} className="block min-h-[150px] rounded-[1.5rem] border border-white/20 bg-white/14 p-5 shadow-glow backdrop-blur-2xl transition hover:bg-white/20 sm:min-h-[172px]">
                  <div className="flex items-center justify-between">
                    <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white/90 text-brand shadow-sm">
                      <Icon size={21} />
                    </span>
                    <AnimatedCounter value={summary[key] ?? 0} className="text-3xl font-black text-white sm:text-4xl" />
                  </div>
                  <h2 className="mt-4 text-lg font-black text-white">{label}</h2>
                  <p className="mt-1 text-sm leading-6 text-slate-200">{description}</p>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <AutoGallery />


    </AnimatedPage>
  );
};

export default Home;
