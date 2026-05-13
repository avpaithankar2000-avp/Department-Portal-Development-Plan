import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

const ConfirmModal = ({ open, title, message, confirmLabel = "Confirm", onConfirm, onClose }) => (
  <AnimatePresence>
    {open && (
      <motion.div className="fixed inset-0 z-[70] grid place-items-center bg-slate-950/60 p-4 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <motion.div initial={{ opacity: 0, y: 24, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 18, scale: 0.96 }} className="w-full max-w-md rounded-[2rem] border border-white/60 bg-white/95 p-5 shadow-glow dark:border-white/10 dark:bg-night/95">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-black text-ink dark:text-white">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{message}</p>
            </div>
            <button className="btn-secondary px-3 py-2" onClick={onClose} aria-label="Close dialog">
              <X size={16} />
            </button>
          </div>
          <div className="mt-5 flex justify-end gap-3">
            <button className="btn-secondary" onClick={onClose}>Cancel</button>
            <button className="btn-primary" onClick={onConfirm}>{confirmLabel}</button>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

export default ConfirmModal;
