"use client";

// imports
import { useTheme } from "next-themes";
import { AnimatePresence, motion } from "framer-motion";

// components
import { SunIcon, MoonIcon } from "./icons";

const ThemeToggle = () => {
  // hooks
  const { theme, setTheme } = useTheme();

  // derived state
  const isDark = theme === "dark";

  // handlers
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
          <SunIcon
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
          <MoonIcon
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
