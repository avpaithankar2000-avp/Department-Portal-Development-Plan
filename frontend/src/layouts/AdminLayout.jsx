import { AnimatePresence, motion } from "framer-motion";
import { BarChart3, Bell, CalendarDays, ChevronLeft, Download, Globe2, GraduationCap, LogOut, Medal, Menu, PanelLeft, PieChart, ShieldCheck, Trophy, UserRound, X, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
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
  const [notifOpen, setNotifOpen] = useState(false);

  const profileRef = useRef(null);
  const notifRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const Sidebar = (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 92 : 280 }}
      className="flex h-screen min-h-screen flex-col overflow-hidden border-r border-white/10 bg-night/90 text-white shadow-night backdrop-blur-2xl"
    >
      <div className={`flex items-center ${collapsed ? "justify-center" : "gap-3 px-5"} border-b border-white/10 py-5`}>
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-brand to-sky-500 shadow-glow">
          <PanelLeft size={22} />
        </span>
        {!collapsed && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-w-0">
            <p className="font-black">Admin Panel</p>
            <p className="truncate text-xs text-slate-300">{user?.email}</p>
          </motion.div>
        )}
        {!collapsed && (
          <button className="ml-auto hidden rounded-2xl bg-white/10 p-2 lg:grid" onClick={() => setCollapsed(true)} aria-label="Collapse sidebar">
            <ChevronLeft className="transition" size={18} />
          </button>
        )}
        <button className="ml-auto rounded-2xl bg-white/10 p-2 lg:hidden" onClick={() => setMobileOpen(false)} aria-label="Close sidebar">
          <X size={18} />
        </button>
      </div>
      {collapsed && (
        <button className="mx-auto mt-4 hidden rounded-2xl bg-white/10 p-2 lg:grid" onClick={() => setCollapsed(false)} aria-label="Expand sidebar">
          <ChevronLeft className="rotate-180 transition" size={18} />
        </button>
      )}
      <nav className="min-h-0 flex-1 space-y-2 overflow-y-auto hide-scrollbar p-4">
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
              `group relative flex items-center ${collapsed ? "justify-center" : "gap-3 px-3"} rounded-2xl py-3 text-sm font-bold transition ${isActive ? "bg-white text-ink shadow-glow" : "text-slate-300 hover:bg-white/10 hover:text-white"}`
            }
          >
            <Icon size={19} className="shrink-0" />
            {!collapsed && <span className="truncate">{label}</span>}
          </NavLink>
        ))}
      </nav>
      <NavLink
        to="/"
        onClick={() => setMobileOpen(false)}
        className={`mx-4 mb-2 flex items-center ${collapsed ? "justify-center" : "gap-3 px-3"} rounded-2xl py-3 text-sm font-bold text-slate-300 transition hover:bg-white/10 hover:text-white`}
      >
        <Globe2 size={18} className="shrink-0" />
        {!collapsed && <span className="truncate">Public Website</span>}
      </NavLink>
      <button onClick={() => setLogoutOpen(true)} className={`mx-4 mb-4 flex items-center ${collapsed ? "justify-center" : "gap-3 px-3"} rounded-2xl py-3 text-sm font-bold text-slate-300 transition hover:bg-white/10 hover:text-white`}>
        <LogOut size={18} className="shrink-0" />
        {!collapsed && <span className="truncate">Logout</span>}
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
            
            {/* Notification Dropdown */}
            <div className="relative" ref={notifRef}>
              <button 
                className={`btn-secondary relative px-3 transition-colors ${notifOpen ? "bg-white/20 dark:bg-white/10" : ""}`} 
                onClick={() => setNotifOpen((value) => !value)} 
                aria-label="Notifications"
              >
                <Bell size={18} />
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-coral shadow-[0_0_8px_rgba(249,115,22,0.8)]" />
              </button>
              <AnimatePresence>
                {notifOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-14 z-[100] w-80 overflow-hidden rounded-3xl border border-white/60 bg-white/90 p-4 shadow-[0_20px_40px_rgba(0,0,0,0.1)] backdrop-blur-2xl dark:border-white/10 dark:bg-slate-900/95 dark:shadow-[0_20px_40px_rgba(0,0,0,0.4)]"
                  >
                    <div className="mb-3 flex items-center justify-between border-b border-slate-200/50 pb-2 dark:border-white/10">
                      <h3 className="font-bold text-ink dark:text-white">Notifications</h3>
                      <span className="rounded-full bg-coral/10 px-2 py-0.5 text-[10px] font-bold text-coral">1 NEW</span>
                    </div>
                    <div className="flex items-start gap-3 rounded-2xl bg-slate-50 p-3 transition hover:bg-slate-100 dark:bg-white/5 dark:hover:bg-white/10">
                      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand/20 text-brand dark:text-teal-400">
                        <ShieldCheck size={14} />
                      </span>
                      <div>
                        <p className="text-sm font-bold text-ink dark:text-white">System Update</p>
                        <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">Export system has been upgraded to v2.0.</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Profile Dropdown */}
            <div className="relative" ref={profileRef}>
              <button 
                className={`btn-secondary px-3 transition-colors ${profileOpen ? "bg-white/20 dark:bg-white/10" : ""}`} 
                onClick={() => setProfileOpen((value) => !value)} 
                aria-label="Profile menu"
              >
                <UserRound size={18} />
              </button>
              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-14 z-[100] w-64 overflow-hidden rounded-3xl border border-white/60 bg-white/90 shadow-[0_20px_40px_rgba(0,0,0,0.1)] backdrop-blur-2xl dark:border-white/10 dark:bg-slate-900/95 dark:shadow-[0_20px_40px_rgba(0,0,0,0.4)]"
                  >
                    <div className="border-b border-slate-200/50 bg-slate-50/50 p-5 dark:border-white/10 dark:bg-white/5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand to-teal-500 text-white shadow-md">
                          <User size={20} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-black text-ink dark:text-white">{user?.name || "Portal Admin"}</p>
                          <p className="truncate text-xs text-slate-500 dark:text-slate-400">{user?.email}</p>
                        </div>
                      </div>
                      <div className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-teal-500/20 bg-teal-500/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-teal-600 dark:text-teal-400">
                        <ShieldCheck size={12} /> Super Admin
                      </div>
                    </div>
                    <div className="p-2">
                      <button 
                        className="group flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-bold text-red-600 transition hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10" 
                        onClick={() => { setProfileOpen(false); setLogoutOpen(true); }}
                      >
                        <LogOut size={16} className="transition-transform group-hover:-translate-x-1" />
                        Sign Out
                      </button>
                    </div>
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
