'use client';

import { useTheme } from '@/common/contexts/ThemeProvider';
import { Moon, SunDim } from 'lucide-react';

const ThemeToggler = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center rounded-full transition duration-300"
    >
      {!isDarkMode ? (
        <SunDim className="w-8 h-8" />
      ) : (
        <Moon className="w-6 h-6 text-white fill-white" />
      )}
    </button>
  );
};

export default ThemeToggler;
