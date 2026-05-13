import { AnimatePresence, motion } from "framer-motion";
import { BarChart3, Bell, CalendarDays, ChevronLeft, Download, Globe2, GraduationCap, LogOut, Medal, Menu, PanelLeft, PieChart, ShieldCheck, Trophy, UserRound, X } from "lucide-react";
import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import ConfirmModal from "../components/ui/ConfirmModal";
import ThemeToggle from "../components/ui/ThemeToggle";
import { useAuth } from "../context/AuthContext";

const links = [
  ["Dashboard", "/admin", BarChart3],
  ["Events", "/admin/events", CalendarDays],
  ["Achievements", "/admin/achievements", Trophy],
  ["Internships", "/admin/internships", GraduationCap],
  ["Placements", "/admin/placements", Medal],
  ["Analytics", "/admin/analytics", PieChart],
  ["Export Center", "/admin/reports", Download]
];

const AdminLayout = () => {
  const { logout, user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);

  const Sidebar = (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 92 : 280 }}
      className="flex h-screen min-h-screen flex-col overflow-hidden border-r border-white/10 bg-night/90 text-white shadow-night backdrop-blur-2xl"
    >
      <div className="flex items-center gap-3 border-b border-white/10 px-5 py-5">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-brand to-sky-500 shadow-glow">
          <PanelLeft size={22} />
        </span>
        {!collapsed && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-w-0">
            <p className="font-black">Admin Panel</p>
            <p className="truncate text-xs text-slate-300">{user?.email}</p>
          </motion.div>
        )}
        <button className="ml-auto hidden rounded-2xl bg-white/10 p-2 lg:grid" onClick={() => setCollapsed((value) => !value)} aria-label="Collapse sidebar">
          <ChevronLeft className={collapsed ? "rotate-180 transition" : "transition"} size={18} />
        </button>
        <button className="ml-auto rounded-2xl bg-white/10 p-2 lg:hidden" onClick={() => setMobileOpen(false)} aria-label="Close sidebar">
          <X size={18} />
        </button>
      </div>
      <nav className="min-h-0 flex-1 space-y-2 overflow-y-auto p-4">
        {!collapsed && (
          <div className="mb-4 rounded-3xl bg-white/10 p-4">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-2xl bg-emerald-400/20 text-emerald-200">
                <ShieldCheck size={18} />
              </span>
              <div>
                <p className="text-sm font-black">{user?.name || "Portal Admin"}</p>
                <p className="text-xs text-slate-300">JWT session active</p>
              </div>
            </div>
          </div>
        )}
        {links.map(([label, to, Icon]) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/admin"}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              `group relative flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-bold transition ${isActive ? "bg-white text-ink shadow-glow" : "text-slate-300 hover:bg-white/10 hover:text-white"}`
            }
          >
            <Icon size={19} />
            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>
      <NavLink
        to="/"
        onClick={() => setMobileOpen(false)}
        className="mx-4 mb-2 flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-bold text-slate-300 transition hover:bg-white/10 hover:text-white"
      >
        <Globe2 size={18} />
        {!collapsed && <span>Public Website</span>}
      </NavLink>
      <button onClick={() => setLogoutOpen(true)} className="m-4 flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-bold text-slate-300 hover:bg-white/10 hover:text-white">
        <LogOut size={18} />
        {!collapsed && "Logout"}
      </button>
    </motion.aside>
  );

  return (
    <div className="min-h-screen bg-premium-light text-ink dark:bg-premium-dark dark:text-slate-100 lg:flex lg:h-screen lg:overflow-hidden">
      <div className="hidden shrink-0 lg:sticky lg:top-0 lg:block lg:h-screen">{Sidebar}</div>
      <AnimatePresence>
        {mobileOpen && (
          <motion.div className="fixed inset-0 z-50 lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <button className="absolute inset-0 bg-slate-950/50" onClick={() => setMobileOpen(false)} aria-label="Close sidebar backdrop" />
            <motion.div initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }} className="relative h-screen w-[280px]">
              {Sidebar}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <main className="min-h-screen min-w-0 flex-1 overflow-y-auto p-4 sm:p-6 lg:h-screen lg:min-h-0 lg:p-8">
        <div className="mb-6 flex items-center justify-between rounded-[2rem] border border-white/60 bg-white/70 p-3 shadow-soft backdrop-blur-2xl dark:border-white/10 dark:bg-white/10">
          <button className="btn-secondary px-3 lg:hidden" onClick={() => setMobileOpen(true)} aria-label="Open sidebar">
            <Menu size={18} />
          </button>
          <div className="hidden text-sm font-bold text-slate-500 dark:text-slate-400 sm:block">AIML Department Activity Portal</div>
          <div className="ml-auto flex items-center gap-2">
            <ThemeToggle />
            <button className="btn-secondary relative px-3" aria-label="Notifications">
              <Bell size={18} />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-coral" />
            </button>
            <div className="relative">
              <button className="btn-secondary px-3" onClick={() => setProfileOpen((value) => !value)} aria-label="Profile menu">
                <UserRound size={18} />
              </button>
              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="absolute right-0 top-14 w-64 rounded-3xl border border-white/60 bg-white/90 p-4 shadow-soft backdrop-blur-2xl dark:border-white/10 dark:bg-night/95"
                  >
                    <p className="font-bold text-ink dark:text-white">{user?.name || "Portal Admin"}</p>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{user?.email}</p>
                    <button className="btn-primary mt-4 w-full" onClick={() => setLogoutOpen(true)}>
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
        <Outlet />
      </main>
      <ConfirmModal open={logoutOpen} title="Logout from admin?" message="Your session token will be cleared from this browser. Public portal pages will remain available." confirmLabel="Logout" onClose={() => setLogoutOpen(false)} onConfirm={() => { setLogoutOpen(false); logout(); }} />
    </div>
  );
};

export default AdminLayout;
