import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import { useEffect } from "react";

const AnimatedCounter = ({ value = 0, suffix = "", decimals = 0, className = "" }) => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => `${Number(latest).toFixed(decimals)}${suffix}`);

  useEffect(() => {
    const controls = animate(count, Number(value || 0), { duration: 1.2, ease: "easeOut" });
    return controls.stop;
  }, [count, value]);

  return <motion.span className={className}>{rounded}</motion.span>;
};

export default AnimatedCounter;
