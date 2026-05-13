import { Menu, X } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import sanjivaniLogo from "../assets/sanjivani-logo.png";
import ThemeToggle from "../components/ui/ThemeToggle";

const links = [
  ["Home", "/"],
  ["Events", "/events"],
  ["Achievements", "/achievements"],
  ["Internships", "/internships"],
  ["Placements", "/placements"]
];

const PublicLayout = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-premium-light text-ink dark:bg-premium-dark dark:text-slate-100">
      <div className="pointer-events-none fixed inset-0 soft-grid opacity-60 dark:opacity-20" />
      <header className="sticky top-0 z-20 border-b border-white/40 bg-white/70 backdrop-blur-2xl dark:border-white/10 dark:bg-night/70">
        <div className="mx-auto flex h-[76px] w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex min-w-0 items-center gap-3">
            <motion.span whileHover={{ scale: 1.05 }} className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-2xl border border-white/70 bg-white shadow-glow dark:border-white/10 dark:bg-white/90">
              <img src={sanjivaniLogo} alt="Sanjivani University" className="h-full w-full object-contain p-1" loading="eager" decoding="async" />
            </motion.span>
            <span className="min-w-0">
              <span className="block truncate text-base font-black text-ink dark:text-white sm:text-lg">AIML Activity Portal</span>
              <span className="hidden truncate text-xs font-bold text-slate-500 dark:text-slate-400 sm:block">Sanjivani University</span>
            </span>
          </Link>
          <nav className="hidden items-center md:flex md:gap-1">
            {links.map(([label, to]) => (
              <NavLink
                key={to}
                to={to}
                end={to === "/"}
                className={({ isActive }) =>
                  `rounded-xl px-3 py-2 text-[13px] font-bold transition lg:px-4 lg:text-sm ${isActive ? "bg-white text-brand shadow-sm dark:bg-white/15 dark:text-teal-400" : "text-slate-600 hover:bg-white/60 dark:text-slate-300 dark:hover:bg-white/10"}`
                }
              >
                {label}
              </NavLink>
            ))}
            <div className="ml-2 pl-2 border-l border-slate-200 dark:border-white/10">
              <ThemeToggle />
            </div>
          </nav>
          <button className="btn-secondary px-3 md:hidden" onClick={() => setOpen((value) => !value)} aria-label="Toggle menu">
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
        {open && (
          <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="border-t border-white/40 bg-white/90 px-4 py-3 backdrop-blur-2xl dark:border-white/10 dark:bg-night/90 md:hidden">
            {links.map(([label, to]) => (
              <NavLink key={to} to={to} onClick={() => setOpen(false)} className="block rounded-2xl px-3 py-3 text-sm font-bold text-slate-700 dark:text-slate-100">
                {label}
              </NavLink>
            ))}
            <div className="my-3">
              <ThemeToggle />
            </div>
          </motion.div>
        )}
      </header>
      <div className="relative">
        <Outlet />
      </div>
      <footer className="relative border-t border-white/40 bg-white/60 backdrop-blur-2xl dark:border-white/10 dark:bg-night/60">
        <div className="section py-6 text-sm text-slate-500 dark:text-slate-400">AIML Department Activity Portal</div>
      </footer>
    </div>
  );
};

export default PublicLayout;
