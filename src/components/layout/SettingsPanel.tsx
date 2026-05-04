"use client";
import { useState, useRef, useEffect } from "react";
import { useSettingsStore, useUIStore } from "@/store";
import { cn } from "@/utils";
import { 
  Settings, 
  X, 
  BookOpen, 
  BookMarked, 
  Leaf, 
  ChevronDown,
  Sun,
  Moon,
  Flame
} from "lucide-react";

const THEMES = [
  { id: "dark", label: "Dark", icon: Moon, color: "#EAEAEA", bg: "#141418" },
  { id: "light", label: "Light", icon: Sun, color: "#111318", bg: "#F0F2F5" },
  { id: "sepia", label: "Sepia", icon: BookOpen, color: "#2C1A0E", bg: "#F4ECD8" },
  { id: "green", label: "Green", icon: Leaf, color: "#D6F5D8", bg: "#071A0B" },
  { id: "red", label: "Red", icon: Flame, color: "#F5D8D8", bg: "#1A0808" },
] as const;

const ARABIC_FONTS = [
  { id: "kfgq", label: "KFGQPC Hafs", sample: "بِسْمِ ٱللَّهِ" },
  { id: "amiri", label: "Amiri Quran", sample: "بِسْمِ اللَّهِ" },
  { id: "scheherazade", label: "Scheherazade", sample: "بِسمِ اللَّهِ" },
] as const;

const TRANSLATION_LANGUAGES = [
  { id: "en", label: "English" },
  { id: "bn", label: "Bangla" },
  { id: "hi", label: "Hindi" },
  { id: "ur", label: "Urdu" },
  { id: "fr", label: "French" },
  { id: "ja", label: "Japanese" },
] as const;

export function SettingsPanel() {
  const { settingsTab, setSettingsTab, settingsPanelOpen, toggleSettingsPanel } = useUIStore();
  const { font, reading, updateFontSettings, updateReadingSettings } = useSettingsStore();

  return (
    <>
      {/* ── Mobile backdrop ── */}
      {settingsPanelOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 lg:hidden animate-fade-in backdrop-blur-sm"
          onClick={toggleSettingsPanel}
        />
      )}

      <aside
        className={cn(
          "fixed top-0 right-0 h-full z-40 bg-bg-sidebar border-l border-border transition-all duration-500 ease-in-out flex flex-col shadow-2xl",
          // Desktop: Always visible and relative
          "lg:relative lg:translate-x-0 lg:z-auto lg:shadow-none lg:w-[320px]",
          // Mobile: Drawer behavior
          settingsPanelOpen ? "translate-x-0 w-[320px]" : "translate-x-full w-[320px] lg:translate-x-0"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border flex-shrink-0 bg-bg-sidebar/80 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-accent-green/10 text-accent-green">
              <Settings size={18} />
            </div>
            <h2 className="text-sm font-bold text-text-primary uppercase tracking-tight">Settings</h2>
          </div>
          <button
            onClick={toggleSettingsPanel}
            className="p-2 rounded-xl text-text-muted hover:text-text-primary hover:bg-bg-hover transition-all active:scale-95 lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex p-1.5 gap-1.5 bg-bg-card/30 border-b border-border flex-shrink-0">
          {[
            { id: "translation", label: "Translation", icon: BookOpen },
            { id: "reading", label: "Reading", icon: BookMarked },
          ].map((tab) => {
            const isActive = settingsTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSettingsTab(tab.id as any)}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2.5 py-2.5 rounded-xl text-[10px] font-black transition-all duration-500 relative overflow-hidden group",
                  isActive
                    ? "text-white shadow-lg shadow-accent-green/20 scale-[1.02]"
                    : "text-text-muted hover:text-text-primary hover:bg-bg-hover"
                )}
              >
                {/* Background Gradient for Active Tab */}
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-br from-accent-green to-accent-green-light" />
                )}
                
                <tab.icon size={14} className={cn("relative z-10 transition-transform duration-300", isActive && "scale-110")} />
                <span className="relative z-10 uppercase tracking-widest">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-5 py-6 space-y-8 custom-scrollbar">
          {/* ── App Theme ── */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-[11px] font-bold text-text-muted uppercase tracking-widest">App Theme</h3>
            </div>
            
            <CustomThemeDropdown />
          </section>

          {settingsTab === "translation" && (
            <>
              {/* ── Arabic Font ── */}
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-[11px] font-bold text-text-muted uppercase tracking-widest">Arabic Font</h3>
                  <ChevronDown size={14} className="text-text-muted" />
                </div>
                <div className="relative group">
                  <select
                    value={font.arabicFont}
                    onChange={(e) => updateFontSettings({ arabicFont: e.target.value as any })}
                    className="w-full appearance-none bg-bg-card border border-border text-text-primary text-sm rounded-xl px-4 py-3 pr-10 focus:outline-none focus:border-accent-green focus:ring-1 focus:ring-accent-green/50 transition-all cursor-pointer group-hover:border-border-light"
                  >
                    {ARABIC_FONTS.map((f) => (
                      <option key={f.id} value={f.id} className="bg-bg-sidebar">
                        {f.label}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-text-muted group-hover:text-text-primary transition-colors">
                    <ChevronDown size={16} />
                  </div>
                </div>
              </section>

              {/* ── Translation Language ── */}
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-[11px] font-bold text-text-muted uppercase tracking-widest">Translation Language</h3>
                  <ChevronDown size={14} className="text-text-muted" />
                </div>
                <div className="relative group">
                  <select
                    value={font.translationLang}
                    onChange={(e) => updateFontSettings({ translationLang: e.target.value })}
                    className="w-full appearance-none bg-bg-card border border-border text-text-primary text-sm rounded-xl px-4 py-3 pr-10 focus:outline-none focus:border-accent-green focus:ring-1 focus:ring-accent-green/50 transition-all cursor-pointer group-hover:border-border-light"
                  >
                    {TRANSLATION_LANGUAGES.map((l) => (
                      <option key={l.id} value={l.id} className="bg-bg-sidebar">
                        {l.label}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-text-muted group-hover:text-text-primary transition-colors">
                    <ChevronDown size={16} />
                  </div>
                </div>
              </section>

              {/* ── Font Sizes ── */}
              <section className="space-y-6 pt-2">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-text-secondary">Arabic Size</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-bg-elevated text-accent-green border border-border">
                      {font.arabicFontSize}px
                    </span>
                  </div>
                  <input
                    type="range"
                    min="18"
                    max="60"
                    value={font.arabicFontSize}
                    onChange={(e) => updateFontSettings({ arabicFontSize: parseInt(e.target.value) })}
                    className="w-full accent-accent-green h-1.5 bg-border rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-text-secondary">Translation Size</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-bg-elevated text-accent-green border border-border">
                      {font.translationFontSize}px
                    </span>
                  </div>
                  <input
                    type="range"
                    min="12"
                    max="30"
                    value={font.translationFontSize}
                    onChange={(e) => updateFontSettings({ translationFontSize: parseInt(e.target.value) })}
                    className="w-full accent-accent-green h-1.5 bg-border rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </section>

              {/* ── Visibility Toggles ── */}
              <section className="space-y-3 pt-4 border-t border-border">
                <ToggleRow
                  label="Show Translation"
                  checked={font.showTranslation}
                  onChange={(v) => updateFontSettings({ showTranslation: v })}
                />
                <ToggleRow
                  label="Show Transliteration"
                  checked={font.showTransliteration}
                  onChange={(v) => updateFontSettings({ showTransliteration: v })}
                />
              </section>
            </>
          )}

          {settingsTab === "reading" && (
            <>
              {/* ── Change Mushaf ── */}
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[11px] font-bold text-text-muted uppercase tracking-widest">Change Mushaf</h3>
                </div>
                <div className="space-y-2.5">
                  {[
                    {
                      id: "hafezi",
                      label: "Hafezi Quran Mushaf",
                      image: "/Reading tab card/2.webp",
                    },
                    {
                      id: "qaloon",
                      label: "Qaloon Mushaf",
                      image: "/Reading tab card/5.webp",
                    },
                    {
                      id: "madani",
                      label: "Shemerly Mushaf",
                      image: "/Reading tab card/100.webp",
                    },
                    {
                      id: "nurani",
                      label: "Warsh Mushaf",
                      image: "/Reading tab card/6.webp",
                    },
                    {
                      id: "unicode",
                      label: "Tanzil Mushaf",
                      image: "/Reading tab card/7.webp",
                    },
                  ].map((style) => {
                    const isActive = reading.mushafStyle === style.id;
                    return (
                      <button
                        key={style.id}
                        onClick={() => updateReadingSettings({ mushafStyle: style.id as any })}
                        className={cn(
                          "w-full flex items-center gap-3 p-3 rounded-2xl border transition-all duration-300 group active:scale-[0.98]",
                          isActive
                            ? "border-accent-green bg-accent-green/5 ring-1 ring-accent-green/10"
                            : "border-border hover:border-border-light hover:bg-bg-hover shadow-sm"
                        )}
                      >
                        {/* Radio */}
                        <div className={cn(
                          "w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all",
                          isActive ? "border-accent-green" : "border-text-muted"
                        )}>
                          {isActive && <div className="w-2 h-2 rounded-full bg-accent-green animate-in zoom-in-50" />}
                        </div>

                        {/* Label */}
                        <span className={cn(
                          "text-xs font-semibold flex-1 text-left leading-tight",
                          isActive ? "text-text-primary" : "text-text-secondary group-hover:text-text-primary"
                        )}>
                          {style.label}
                        </span>

                        {/* Image Preview */}
                        <div className="flex-shrink-0 w-16 h-10 rounded-lg overflow-hidden border border-border shadow-inner bg-bg-elevated">
                          <img 
                            src={style.image} 
                            alt={style.label} 
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </section>

              {/* ── Reading Options ── */}
              <section className="space-y-4 pt-6 border-t border-border">
                <h3 className="text-[11px] font-bold text-text-muted uppercase tracking-widest">Reading Options</h3>
                <div className="space-y-3">
                  <ToggleRow
                    label="Auto Scroll"
                    checked={reading.autoScroll}
                    onChange={(v) => updateReadingSettings({ autoScroll: v })}
                  />
                  <ToggleRow
                    label="Word by Word"
                    checked={reading.wordByWord}
                    onChange={(v) => updateReadingSettings({ wordByWord: v })}
                  />
                </div>
              </section>
            </>
          )}
        </div>
      </aside>
    </>
  );
}

function CustomThemeDropdown() {
  const { theme, setTheme } = useSettingsStore();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentTheme = THEMES.find(t => t.id === theme) || THEMES[0];

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between bg-bg-card border border-border px-4 py-3 rounded-xl hover:border-border-light transition-all active:scale-[0.99] group shadow-sm"
      >
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 rounded-full border border-white/10 shadow-sm flex items-center justify-center overflow-hidden" style={{ backgroundColor: currentTheme.bg }}>
             <currentTheme.icon size={10} style={{ color: currentTheme.color }} />
          </div>
          <span className="text-sm font-bold text-text-primary uppercase tracking-wide">{currentTheme.label}</span>
        </div>
        <ChevronDown size={16} className={cn("text-text-muted transition-transform duration-300", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 p-1.5 bg-bg-sidebar border border-border rounded-2xl shadow-2xl z-[60] animate-in fade-in zoom-in-95 duration-200">
          {THEMES.map((t) => {
            const isActive = theme === t.id;
            return (
              <button
                key={t.id}
                onClick={() => {
                  setTheme(t.id as any);
                  setIsOpen(false);
                }}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group/item mb-0.5 last:mb-0",
                  isActive ? "bg-accent-green/10 text-accent-green" : "hover:bg-bg-hover text-text-secondary"
                )}
              >
                <div 
                  className="w-6 h-6 rounded-lg flex items-center justify-center border border-white/5 shadow-inner" 
                  style={{ backgroundColor: t.bg }}
                >
                  <t.icon size={12} style={{ color: t.color }} />
                </div>
                <span className="flex-1 text-left text-xs font-bold uppercase tracking-wide group-hover/item:text-text-primary">
                  {t.label}
                </span>
                {isActive && (
                  <div className="w-4 h-4 rounded-full bg-accent-green flex items-center justify-center text-white">
                    <span className="text-[8px]">✓</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function ToggleRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center justify-between cursor-pointer group">
      <span className="text-sm text-text-secondary group-hover:text-text-primary transition-colors">
        {label}
      </span>
      <div
        onClick={() => onChange(!checked)}
        className={cn(
          "relative w-10 h-5 rounded-full transition-colors duration-200 flex-shrink-0",
          checked ? "bg-accent-green" : "bg-bg-elevated border border-border"
        )}
      >
        <div
          className={cn(
            "absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200",
            checked ? "translate-x-5" : "translate-x-0.5"
          )}
        />
      </div>
    </label>
  );
}

