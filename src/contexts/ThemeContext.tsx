'use client'; // Client Component

import { createContext, ReactNode, useContext, useMemo, useState } from 'react';

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

// 1. Context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// 2. Provider สำหรับแชร์ข้อมูล
export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<Theme>('dark');

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const contextValue = useMemo(() => ({ theme, toggleTheme }), [theme]);
  
  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

// 3. Hook สำหรับเรียกใช้ Context
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
