"use client";
import { useEffect, useState } from "react";
import { useSettingsStore } from "@/store";

export type AppTheme = "dark" | "light" | "sepia" | "green" | "red";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme } = useSettingsStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      document.documentElement.setAttribute("data-theme", theme);
    }
  }, [theme, mounted]);

  return <>{children}</>;
}
