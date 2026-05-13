const Skeleton = ({ className = "" }) => (
  <div className={`relative overflow-hidden rounded-3xl bg-slate-200/80 dark:bg-white/10 ${className}`}>
    <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/60 to-transparent dark:via-white/10" style={{ animation: "shimmer 1.6s infinite" }} />
  </div>
);

export default Skeleton;
