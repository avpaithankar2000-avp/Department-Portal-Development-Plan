import { motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

const ThemeToggle = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative flex h-11 w-[82px] items-center rounded-full border border-white/50 bg-white/70 p-1 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/10"
      aria-label="Toggle dark mode"
    >
      <motion.span
        className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-brand to-sky-500 text-white shadow-glow"
        animate={{ x: isDark ? 36 : 0 }}
        transition={{ type: "spring", stiffness: 420, damping: 28 }}
      >
        {isDark ? <Moon size={17} /> : <Sun size={17} />}
      </motion.span>
    </button>
  );
};

export default ThemeToggle;
