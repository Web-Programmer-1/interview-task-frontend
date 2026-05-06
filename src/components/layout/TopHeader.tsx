"use client";
import { useState, useRef, useEffect } from "react";
import { Search, ChevronDown, Sun, Moon, BookOpen, Leaf, Flame } from "lucide-react";
import { useSettingsStore, type AppTheme } from "@/store";
import { useUIStore } from "@/store";
import { cn } from "@/utils";

const THEMES: {
  id: AppTheme;
  label: string;
  icon: React.ElementType;
  color: string;
  bg: string;
}[] = [
  {
    id: "dark",
    label: "Dark",
    icon: Moon,
    color: "#EAEAEA",
    bg: "#141418",
  },
  {
    id: "light",
    label: "Light",
    icon: Sun,
    color: "#111318",
    bg: "#F0F2F5",
  },
  {
    id: "sepia",
    label: "Sepia",
    icon: BookOpen,
    color: "#2C1A0E",
    bg: "#F4ECD8",
  },
  {
    id: "green",
    label: "Green",
    icon: Leaf,
    color: "#D6F5D8",
    bg: "#071A0B",
  },
  {
    id: "red",
    label: "Red",
    icon: Flame,
    color: "#F5D8D8",
    bg: "#1A0808",
  },
];

function ThemeDropdown() {
  const { theme, setTheme } = useSettingsStore();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (!mounted) {
    return (
      <div className="w-24 h-8 bg-bg-elevated/50 animate-pulse rounded-xl" />
    );
  }

  const current = THEMES.find((t) => t.id === theme) ?? THEMES[0];

  return (
    <div ref={ref} className="relative">
      {}
      <button
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium",
          "border transition-all duration-200",
          "hover:scale-[1.02] active:scale-[0.98]"
        )}
        style={{
          background: "var(--bg-elevated)",
          borderColor: "var(--border)",
          color: "var(--text-secondary)",
        }}
        title="Change theme"
      >
        {}
        <span
          className="w-3.5 h-3.5 rounded-full flex-shrink-0 border border-white/20 shadow-sm"
          style={{ backgroundColor: current.bg }}
        />
        <span className="hidden sm:inline">{current.label}</span>
        <ChevronDown
          size={12}
          className="transition-transform duration-200"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        />
      </button>

      {}
      {open && (
        <div
          className="absolute right-0 top-full mt-3 w-48 rounded-2xl border overflow-hidden z-50 shadow-2xl origin-top-right animate-in fade-in zoom-in-95 duration-200"
          style={{
            background: "var(--glass-bg)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            borderColor: "var(--border)",
            boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
          }}
        >
          <div className="p-2 space-y-1.5">
            {THEMES.map((t) => {
              const isActive = theme === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => {
                    setTheme(t.id);
                    setOpen(false);
                  }}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200",
                    isActive ? "scale-100 shadow-sm" : "hover:scale-[1.02] hover:shadow-sm"
                  )}
                  style={{
                    background: t.bg,
                    color: t.color,
                    border: `1px solid ${isActive ? "var(--color-accent)" : t.bg}`,
                    outline: isActive ? `2px solid var(--color-accent-muted)` : "none",
                  }}
                >
                  {}
                  <span
                    className="flex items-center justify-center w-6 h-6 rounded-full flex-shrink-0"
                    style={{
                      background: "rgba(128,128,128,0.1)",
                      color: t.color,
                    }}
                  >
                    <t.icon size={13} />
                  </span>
                  
                  <span className="flex-1 text-left">{t.label}</span>
                  
                  {}
                  {isActive && (
                    <span
                      className="w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold"
                      style={{ background: "var(--color-accent)", color: "#fff" }}
                    >
                      ✓
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export function TopHeader() {
  const { openSearch } = useUIStore();

  return (
    <header
      className="flex-shrink-0 flex items-center justify-between px-5 py-2.5 z-30"
      style={{
        background: "var(--glass-bg)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid var(--glass-border)",
        height: "52px",
        transition: "background 0.3s ease",
      }}
    >
      {}
      <div className="flex items-center gap-3">
        {}
      </div>

      {}
      <div className="flex items-center gap-2">

        {}
        <button
          onClick={openSearch}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          style={{
            background: "var(--bg-elevated)",
            borderColor: "var(--border)",
            color: "var(--text-muted)",
          }}
          title="Search (Ctrl+K)"
        >
          <Search size={13} style={{ color: "var(--text-icon)" }} />
          <span className="hidden md:inline" style={{ color: "var(--text-muted)" }}>
            Search...
          </span>
          <kbd
            className="hidden lg:inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-mono border"
            style={{
              background: "var(--bg-card)",
              borderColor: "var(--border-light)",
              color: "var(--text-disabled)",
            }}
          >
            ⌘K
          </kbd>
        </button>
      </div>
    </header>
  );
}
