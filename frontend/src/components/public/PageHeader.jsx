import { motion } from "framer-motion";

const PageHeader = ({ title, eyebrow, children }) => (
  <section className="relative overflow-hidden border-b border-white/40 bg-white/45 dark:border-white/10 dark:bg-white/5">
    <div className="absolute right-10 top-8 h-28 w-28 rounded-full bg-brand/20 blur-3xl" />
    <div className="section py-12">
      <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="text-sm font-black uppercase tracking-wide text-brand dark:text-teal-200">
        {eyebrow}
      </motion.p>
      <motion.h1 initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="mt-2 text-4xl font-black text-ink dark:text-white sm:text-5xl">
        {title}
      </motion.h1>
      {children && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.18 }} className="mt-4 max-w-3xl text-slate-600 dark:text-slate-300">{children}</motion.p>}
    </div>
  </section>
);

export default PageHeader;
