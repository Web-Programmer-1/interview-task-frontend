"use client";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { useUIStore } from "@/store";
import { useGetSurahsQuery, type SurahMeta } from "@/store/redux/apiSlice";
import { cn } from "@/utils";
import { Search, X, BookOpen, List, BookMarked } from "lucide-react";
import { useState, useMemo } from "react";

// Quran page → Surah mapping (pages 1-604)
// Each entry: [pageStart, surahId] - simplified reference
const JUZ_INFO: { juz: number; verseKey: string; pageStart: number }[] = [
  { juz: 1, verseKey: "1:1", pageStart: 1 },
  { juz: 2, verseKey: "2:142", pageStart: 22 },
  { juz: 3, verseKey: "2:253", pageStart: 42 },
  { juz: 4, verseKey: "3:92", pageStart: 62 },
  { juz: 5, verseKey: "4:24", pageStart: 82 },
  { juz: 6, verseKey: "4:148", pageStart: 102 },
  { juz: 7, verseKey: "5:82", pageStart: 121 },
  { juz: 8, verseKey: "6:111", pageStart: 142 },
  { juz: 9, verseKey: "7:88", pageStart: 162 },
  { juz: 10, verseKey: "8:41", pageStart: 182 },
  { juz: 11, verseKey: "9:93", pageStart: 201 },
  { juz: 12, verseKey: "11:6", pageStart: 221 },
  { juz: 13, verseKey: "12:53", pageStart: 242 },
  { juz: 14, verseKey: "15:1", pageStart: 262 },
  { juz: 15, verseKey: "17:1", pageStart: 282 },
  { juz: 16, verseKey: "18:75", pageStart: 302 },
  { juz: 17, verseKey: "21:1", pageStart: 322 },
  { juz: 18, verseKey: "23:1", pageStart: 342 },
  { juz: 19, verseKey: "25:21", pageStart: 362 },
  { juz: 20, verseKey: "27:56", pageStart: 382 },
  { juz: 21, verseKey: "29:46", pageStart: 402 },
  { juz: 22, verseKey: "33:31", pageStart: 422 },
  { juz: 23, verseKey: "36:28", pageStart: 442 },
  { juz: 24, verseKey: "39:32", pageStart: 462 },
  { juz: 25, verseKey: "41:47", pageStart: 482 },
  { juz: 26, verseKey: "46:1", pageStart: 502 },
  { juz: 27, verseKey: "51:31", pageStart: 522 },
  { juz: 28, verseKey: "58:1", pageStart: 542 },
  { juz: 29, verseKey: "67:1", pageStart: 562 },
  { juz: 30, verseKey: "78:1", pageStart: 582 },
];

interface SurahSidebarProps {
  surahs?: SurahMeta[];
}

const TABS = ["Surah", "Juz", "Page"] as const;

export function SurahSidebar({ surahs: initialSurahs }: SurahSidebarProps) {
  const { data: fetchedSurahs, isLoading, isError } = useGetSurahsQuery();
  const surahs = fetchedSurahs || initialSurahs || [];

  const params = useParams();
  const pathname = usePathname();
  const currentId = Number(params?.surahId ?? 1);
  const { surahSidebarOpen, activeTab, setActiveTab, closeSurahSidebar } = useUIStore();
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search.trim()) return surahs;
    const q = search.toLowerCase();
    return surahs.filter(
      (s) =>
        s.name_simple.toLowerCase().includes(q) ||
        s.translated_name?.name?.toLowerCase().includes(q) ||
        String(s.id).includes(q) ||
        s.name_arabic.includes(search)
    );
  }, [surahs, search]);

  return (
    <>
      {/* ── Mobile backdrop ── */}
      {surahSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 md:hidden animate-fade-in"
          onClick={closeSurahSidebar}
        />
      )}

      {/* ── Sidebar Panel ── */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-full z-40 bg-bg-sidebar border-r border-border flex flex-col transition-all duration-500 ease-in-out",
          "md:relative md:z-auto",
          surahSidebarOpen
            ? "w-[280px] translate-x-0"
            : "w-[280px] -translate-x-full md:w-0 md:translate-x-0 md:border-r-0"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border flex-shrink-0 bg-white/5 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-accent-green/10 flex items-center justify-center border border-accent-green/20 shadow-inner group overflow-hidden">
              <img
                src="/pngtree-quran-png-design-png-image_3169195.jpg"
                alt="Logo"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>
            <div>
              <h2 className="text-[15px] font-bold text-text-primary tracking-tight">Quran Guide</h2>
              <p className="text-[10px] text-text-muted font-medium uppercase tracking-[0.1em]">Divine Wisdom</p>
            </div>
          </div>
          <button
            onClick={closeSurahSidebar}
            className="md:hidden text-text-muted hover:text-text-primary p-2 hover:bg-white/5 rounded-xl transition-all"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex p-1.5 gap-1 bg-bg-card/50 border-b border-border flex-shrink-0">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.toLowerCase();
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab.toLowerCase() as "surah" | "juz" | "page")}
                className={cn(
                  "flex-1 py-2 text-[11px] font-bold uppercase tracking-widest rounded-lg transition-all duration-300",
                  isActive
                    ? "bg-accent-green text-white shadow-lg shadow-accent-green/20"
                    : "text-text-muted hover:text-text-secondary hover:bg-white/5"
                )}
              >
                {tab}
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="px-5 py-4 border-b border-border flex-shrink-0 bg-white/2">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Search size={14} className="text-text-muted group-focus-within:text-accent-green transition-colors" />
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={`Search ${activeTab}...`}
              className="w-full bg-bg-card border border-border rounded-2xl pl-10 pr-10 py-2.5 text-xs text-text-primary placeholder:text-text-disabled outline-none focus:border-accent-green focus:ring-4 focus:ring-accent-green/5 transition-all shadow-sm"
            />
            {search && (
              <button 
                onClick={() => setSearch("")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-text-muted hover:text-text-primary transition-colors"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="p-5 space-y-4">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="flex items-center gap-4 animate-pulse">
                  <div className="w-10 h-10 bg-white/5 rounded-xl" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-white/5 rounded w-3/4" />
                    <div className="h-2 bg-white/5 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : isError ? (
            <div className="p-10 text-center">
              <p className="text-xs text-red-400">Failed to load surahs</p>
            </div>
          ) : activeTab === "surah" ? (
            <nav>
              {filtered.map((surah) => {
                const isActive = surah.id === currentId;
                return (
                  <Link
                    key={surah.id}
                    href={`/reading/${surah.id}`}
                    onClick={() => {
                      if (typeof window !== "undefined" && window.innerWidth < 768) {
                        closeSurahSidebar();
                      }
                    }}
                    className={cn(
                      "flex items-center gap-4 px-5 py-3.5 border-b border-border/30",
                      "hover:bg-accent-green/5 transition-all duration-300 group relative overflow-hidden",
                      isActive && "bg-accent-green/5"
                    )}
                  >
                    {/* Active indicator bar */}
                    {isActive && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent-green shadow-[0_0_10px_rgba(76,175,80,0.5)]" />
                    )}

                    {/* Number badge */}
                    <div
                      className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-bold transition-all duration-500 shadow-sm",
                        isActive
                          ? "bg-accent-green text-white rotate-[360deg] shadow-accent-green/30"
                          : "bg-bg-elevated text-text-muted group-hover:bg-accent-green/20 group-hover:text-accent-green"
                      )}
                    >
                      {surah.id}
                    </div>
 
                    {/* Names */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-0.5">
                        <span
                          className={cn(
                            "text-[14px] font-bold truncate transition-colors",
                            isActive ? "text-accent-green" : "text-text-primary group-hover:text-text-primary"
                          )}
                        >
                          {surah.name_simple}
                        </span>
                        <span
                          className={cn(
                            "text-xl flex-shrink-0 text-text-arabic transition-all duration-700",
                            isActive ? "text-white scale-110" : "opacity-60 group-hover:opacity-100"
                          )}
                          style={{ fontFamily: "var(--font-amiri)" }}
                          lang="ar"
                        >
                          {surah.name_arabic}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className={cn(
                          "text-[10px] font-bold uppercase tracking-widest truncate transition-colors",
                          isActive ? "text-white/80" : "text-text-muted"
                        )}>
                          {surah.translated_name?.name}
                        </span>
                        <span className={cn("text-[10px] opacity-40", isActive ? "text-white" : "text-text-disabled")}>•</span>
                        <div className={cn(
                          "flex items-center gap-1 px-1.5 py-0.5 rounded-md border",
                          isActive ? "bg-white/20 border-white/20" : "bg-white/5 border-white/5"
                        )}>
                          <span className={cn(
                            "text-[9px] font-black uppercase",
                            isActive ? "text-white" : "text-text-muted"
                          )}>
                            {surah.verses_count} Ayahs
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}

              {filtered.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                  <BookOpen size={28} className="text-text-disabled mb-2" />
                  <p className="text-text-muted text-sm">No surah found</p>
                </div>
              )}
            </nav>
          ) : activeTab === "page" ? (
            // ── Page list (1-604) ──
            <nav>
              {Array.from({ length: 604 }, (_, i) => {
                const p = i + 1;
                const juzEntry = JUZ_INFO.filter(j => j.pageStart <= p).at(-1);
                const isActive = pathname === `/reading/mushaf/${p}`;
                return (
                  <Link
                    key={p}
                    href={`/reading/mushaf/${p}`}
                    onClick={() => {
                      if (typeof window !== "undefined" && window.innerWidth < 768) {
                        closeSurahSidebar();
                      }
                    }}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 border-b border-border/30",
                      "hover:bg-bg-hover transition-colors duration-150 group",
                      isActive && "sidebar-item-active"
                    )}
                  >
                    {/* Page number badge */}
                    <div
                      className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-[11px] font-bold",
                        isActive
                          ? "bg-accent-green text-white"
                          : "bg-bg-elevated text-text-muted group-hover:bg-bg-active"
                      )}
                    >
                      {p}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className={cn(
                        "text-sm font-medium",
                        isActive ? "text-accent-green-light" : "text-text-primary"
                      )}>
                        Page {p}
                      </span>
                      <div className="text-[10px] text-text-disabled">
                        {juzEntry ? `Juz ${juzEntry.juz}` : ""}
                      </div>
                    </div>
                    <BookMarked size={12} className={cn(
                      "flex-shrink-0",
                      isActive ? "text-accent-green" : "text-text-disabled group-hover:text-text-muted"
                    )} />
                  </Link>
                );
              })}
            </nav>
          ) : (
            // ── Juz list ──
            <nav>
              {JUZ_INFO.map((juz) => (
                <Link
                  key={juz.juz}
                  href={`/reading/mushaf/${juz.pageStart}`}
                  className="flex items-center gap-3 px-3 py-3 border-b border-border/30 hover:bg-bg-hover transition-colors group"
                >
                  <div className="w-8 h-8 rounded-lg bg-bg-elevated flex items-center justify-center text-[11px] font-bold text-text-muted group-hover:bg-bg-active">
                    {juz.juz}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-text-primary font-medium">Juz {juz.juz}</p>
                    <p className="text-[10px] text-text-disabled">Starts page {juz.pageStart}</p>
                  </div>
                </Link>
              ))}
            </nav>
          )}
        </div>
      </aside>
    </>
  );
}
