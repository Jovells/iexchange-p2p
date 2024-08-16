
import { useTheme } from "@/common/contexts/ThemeProvider";
import { AnimatePresence, motion } from "framer-motion";
import { Moon, Sun } from "lucide-react"

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  const isDark = theme === "dark";

  const handleThemeToggle = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <button
      type="button"
      onClick={handleThemeToggle}
      className="bg-[#f5f5f5] py-1 px-1 flex flex-row items-center justify-center gap-2 border-2 rounded-[30px] shadow-lg"
    >
      <AnimatePresence>
        <motion.div
          key="light-mode-active"
          initial="inactive"
          animate={!isDark ? "active" : "inactive"}
          exit="inactive"
          variants={{
            active: {
              backgroundColor: "#01A2E4",
            },
            inactive: {
              backgroundColor: "transparent",
            },
          }}
          transition={{
            duration: 0.3,
            ease: "easeInOut",
          }}
          className="flex items-start justify-center p-1.5 rounded-full"
        >
          <Sun
            width={18}
            height={18}
            fill={!isDark ? "white" : "#3D4651"}
            stroke={!isDark ? "white" : "#3D4651"}
          />
        </motion.div>
        <motion.div
          key="dark-mode-active"
          initial="inactive"
          animate={isDark ? "active" : "inactive"}
          exit="inactive"
          variants={{
            active: {
              backgroundColor: "#01A2E4",
            },
            inactive: {
              backgroundColor: "transparent",
            },
          }}
          transition={{
            duration: 0.3,
            ease: "easeInOut",
          }}
          className="flex items-start justify-center p-1.5 rounded-full"
        >
          <Moon
            width={18}
            height={18}
            fill={isDark ? "white" : "#3D4651"}
            stroke={isDark ? "white" : "#3D4651"}
          />
        </motion.div>
      </AnimatePresence>
    </button>
  );
};

export default ThemeToggle;
