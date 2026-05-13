import { motion } from "framer-motion";

const AnimatedPage = ({ children, className = "" }) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, y: 18 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -14 }}
    transition={{ duration: 0.45, ease: "easeOut" }}
  >
    {children}
  </motion.div>
);

export default AnimatedPage;
