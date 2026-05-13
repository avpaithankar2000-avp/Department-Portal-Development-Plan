import { motion } from "framer-motion";

const GlassCard = ({ children, className = "", delay = 0, hover = true }) => (
  <motion.div
    className={`premium-card ${className}`}
    initial={{ opacity: 0, y: 22 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.45, delay, ease: "easeOut" }}
    whileHover={hover ? { y: -6, scale: 1.01 } : undefined}
  >
    {children}
  </motion.div>
);

export default GlassCard;
