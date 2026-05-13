import { motion } from "framer-motion";

const UploadProgress = ({ value = 0 }) => (
  <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-white/10">
    <motion.div
      className="h-full rounded-full bg-gradient-to-r from-brand to-sky-500"
      initial={{ width: 0 }}
      animate={{ width: `${Math.min(value, 100)}%` }}
      transition={{ duration: 0.25 }}
    />
  </div>
);

export default UploadProgress;
