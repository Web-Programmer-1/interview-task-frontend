"use client";
import { useEffect, useState, useCallback, useRef } from "react";
import { useUIStore } from "@/store";
import { useSearchVersesQuery } from "@/store/redux/apiSlice";
import { X, Search, Loader2, BookOpen } from "lucide-react";
import Link from "next/link";
import { cn } from "@/utils";

interface SearchResult {
  verse_key: string;
  text: string;
  translations: { text: string; name: string }[];
}

export function SearchModal() {
  const { searchOpen, closeSearch } = useUIStore();
  const [query, setQuery] = useState("");
  const [debouncedTerm, setDebouncedTerm] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null);

  const { data: results = [], isLoading: loading } = useSearchVersesQuery(debouncedTerm, {
    skip: !debouncedTerm.trim(),
  });

  // Focus input when modal opens
  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery("");
      setDebouncedTerm("");
    }
  }, [searchOpen]);

  // Keyboard shortcut: Ctrl+K or /
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey && e.key === "k") || (e.key === "/" && !searchOpen)) {
        e.preventDefault();
        if (searchOpen) closeSearch();
        else useUIStore.getState().openSearch();
      }
      if (e.key === "Escape") closeSearch();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [searchOpen, closeSearch]);

  // Debounced search
  const handleSearch = useCallback((value: string) => {
    setQuery(value);
    if (timerRef.current) clearTimeout(timerRef.current);
    
    timerRef.current = setTimeout(() => {
      setDebouncedTerm(value);
    }, 400);
  }, []);

  if (!searchOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-20 px-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={closeSearch}
      />

      {/* Modal */}
      <div
        className="relative w-full max-w-2xl rounded-2xl overflow-hidden shadow-modal animate-fade-in"
        style={{ 
          background: "var(--glass-bg)", 
          backdropFilter: "blur(24px)",
          border: "1px solid var(--border)" 
        }}
      >
        {/* Search Input */}
        <div className="flex items-center gap-3 px-4 py-4 border-b border-border">
          <Search size={18} className="text-icon flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search by surah name, ayah text, or translation..."
            className="flex-1 bg-transparent text-text-primary text-sm outline-none placeholder-text-muted"
          />
          {loading && <Loader2 size={16} className="text-icon animate-spin" />}
          <button
            onClick={closeSearch}
            className="text-icon hover:text-white p-1 rounded transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Shortcut hint */}
        {!query && (
          <div className="px-4 py-3 flex items-center gap-3 text-[11px] text-text-disabled border-b border-border/40">
            <span className="px-1.5 py-0.5 bg-bg-elevated rounded text-[10px] border border-border">Ctrl+K</span>
            <span>to open</span>
            <span className="px-1.5 py-0.5 bg-bg-elevated rounded text-[10px] border border-border">Esc</span>
            <span>to close</span>
          </div>
        )}

        {/* Results */}
        <div className="max-h-[60vh] overflow-y-auto">
          {results.length > 0 ? (
            <ul>
              {results.map((r, i) => {
                const [surahId] = r.verse_key.split(":");
                const cleanTrans = r.translations?.[0]?.text?.replace(/<[^>]*>/g, "") ?? "";
                return (
                  <li key={i}>
                    <Link
                      href={`/reading/${surahId}#verse-${r.verse_key}`}
                      onClick={closeSearch}
                      className="flex flex-col gap-2 px-4 py-4 border-b border-border/40 hover:bg-bg-hover transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-accent-green">
                          {r.verse_key}
                        </span>
                      </div>
                      <p
                        className="text-base text-text-arabic text-right"
                        style={{ fontFamily: "'Amiri Quran', serif" }}
                        dir="rtl"
                        lang="ar"
                      >
                        {r.text?.slice(0, 100)}...
                      </p>
                      <p className="text-xs text-text-secondary leading-relaxed line-clamp-2">
                        {cleanTrans?.slice(0, 150)}...
                      </p>
                    </Link>
                  </li>
                );
              })}
            </ul>
          ) : query && !loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <BookOpen size={36} className="text-text-disabled mb-3" />
              <p className="text-text-muted text-sm">No results found</p>
              <p className="text-text-disabled text-xs mt-1">Try different keywords</p>
            </div>
          ) : !query ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Search size={36} className="text-text-disabled mb-3" />
              <p className="text-text-muted text-sm">Search the Quran</p>
              <p className="text-text-disabled text-xs mt-1">Search by Arabic text or English translation</p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
