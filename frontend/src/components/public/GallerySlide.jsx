import { motion } from "framer-motion";
import { CalendarDays, ChevronRight } from "lucide-react";

const GallerySlide = ({ item, isActive }) => {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-3xl bg-slate-900 group">
      {/* Background Image with Zoom Animation */}
      <motion.div
        className="absolute inset-0 h-full w-full"
        initial={{ scale: 1.1 }}
        animate={{ scale: isActive ? 1 : 1.1 }}
        transition={{ duration: 6, ease: "easeOut" }}
      >
        <img
          src={item.image}
          alt={item.title}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {/* Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent" />
      </motion.div>

      {/* Content */}
      <div className="absolute bottom-0 left-0 flex w-full flex-col justify-end p-6 sm:p-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 20 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {/* Category Badge & Date */}
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center rounded-full border border-teal-500/30 bg-teal-500/20 px-3 py-1 text-xs font-black uppercase tracking-wider text-teal-300 shadow-[0_0_15px_rgba(20,184,166,0.3)] backdrop-blur-md">
              {item.category}
            </span>
            <span className="flex items-center gap-1.5 text-xs font-bold text-slate-300">
              <CalendarDays size={14} className="text-teal-400" />
              {new Date(item.eventDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>

          {/* Title */}
          <h3 className="mb-3 max-w-2xl text-2xl font-black leading-tight text-white sm:text-4xl">
            {item.title}
          </h3>

          {/* Description */}
          <p className="mb-6 line-clamp-2 max-w-3xl text-sm leading-relaxed text-slate-300 sm:text-base">
            {item.description}
          </p>

          {/* CTA */}
          <button className="group relative flex items-center gap-2 overflow-hidden rounded-full bg-white px-6 py-2.5 text-sm font-black text-slate-900 transition-all hover:bg-teal-50 hover:text-teal-900 hover:shadow-[0_0_20px_rgba(255,255,255,0.4)]">
            <span className="relative z-10">View Details</span>
            <ChevronRight size={16} className="relative z-10 transition-transform group-hover:translate-x-1" />
          </button>
        </motion.div>
      </div>

      {/* Glassmorphism Border & Glow Effects */}
      <div className="pointer-events-none absolute inset-0 rounded-3xl border border-white/10" />
      <div className="pointer-events-none absolute -bottom-10 -right-10 h-64 w-64 rounded-full bg-teal-500/20 blur-[80px]" />
    </div>
  );
};

export default GallerySlide;
