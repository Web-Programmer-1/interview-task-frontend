"use client";
import { useWishlistStore, type WishlistItem } from "@/store/wishlist";
import { useSettingsStore } from "@/store";
import { Heart, Trash2, Copy, Play, BookOpen, Search, X, ArrowLeft, Share2, Filter, SortAsc, SortDesc } from "lucide-react";
import { cn } from "@/utils";
import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { AudioButton } from "@/features/reader/components/AudioButton";

// ─────────────────────────────────────────────────────────────
// Sort / Filter Options
// ─────────────────────────────────────────────────────────────
type SortMode = "newest" | "oldest" | "surah-asc" | "surah-desc";

// ─────────────────────────────────────────────────────────────
// Individual Wishlist Card
// ─────────────────────────────────────────────────────────────
function WishlistCard({ item, index }: { item: WishlistItem; index: number }) {
  const { removeItem } = useWishlistStore();
  const { font } = useSettingsStore();
  const [copied, setCopied] = useState(false);
  const [removing, setRemoving] = useState(false);

  const handleCopy = async () => {
    const text = `${item.text_uthmani}\n\n${item.translation}\n\n[${item.verse_key}]`;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRemove = () => {
    setRemoving(true);
    setTimeout(() => removeItem(item.verse_key), 300);
  };

  const [surahNum, verseNum] = item.verse_key.split(":");
  const savedDate = new Date(item.savedAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const fontFamilyMap: Record<string, string> = {
    kfgq: "'KFGQPC Uthmanic Script HAFS', serif",
    amiri: "'Amiri Quran', 'Amiri', serif",
    scheherazade: "'Scheherazade New', serif",
    hafs: "'KFGQPC Uthmanic Script HAFS', serif",
  };

  return (
    <div
      className={cn(
        "wishlist-card group relative rounded-2xl border overflow-hidden transition-all duration-300",
        removing && "opacity-0 scale-95 -translate-x-4"
      )}
      style={{
        background: "var(--bg-card)",
        borderColor: "var(--border)",
        animationDelay: `${index * 60}ms`,
      }}
    >
      {/* Top bar — surah info + actions */}
      <div
        className="flex items-center justify-between px-5 py-3 border-b"
        style={{ borderColor: "var(--border)" }}
      >
        <div className="flex items-center gap-3">
          {/* Surah badge */}
          <Link
            href={`/reading/${surahNum}`}
            className="flex items-center gap-2 group/link"
          >
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold"
              style={{
                background: "linear-gradient(135deg, var(--color-accent), var(--color-accent-light))",
                color: "#fff",
                boxShadow: "0 2px 8px rgba(66,128,56,0.3)",
              }}
            >
              {surahNum}
            </div>
            <div className="flex flex-col">
              <span
                className="text-xs font-semibold group-hover/link:underline"
                style={{ color: "var(--text-primary)" }}
              >
                {item.surah_name || `Surah ${surahNum}`}
              </span>
              <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>
                Verse {verseNum} • Saved {savedDate}
              </span>
            </div>
          </Link>
        </div>

        {/* Card actions */}
        <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <AudioButton
            verseKey={item.verse_key}
            verseId={item.id}
            surahId={item.surah_id}
          />
          <button
            onClick={handleCopy}
            title="Copy verse"
            className="flex items-center justify-center w-7 h-7 rounded-full transition-all duration-200"
            style={{
              border: "1px solid var(--border)",
              color: copied ? "var(--color-accent)" : "var(--text-icon)",
            }}
          >
            {copied ? (
              <span className="text-[9px] font-bold">✓</span>
            ) : (
              <Copy size={12} />
            )}
          </button>
          <button
            onClick={handleRemove}
            title="Remove from saved"
            className="flex items-center justify-center w-7 h-7 rounded-full transition-all duration-200 hover:bg-red-500/10 hover:text-red-400 hover:border-red-400/30"
            style={{
              border: "1px solid var(--border)",
              color: "var(--text-icon)",
            }}
          >
            <Trash2 size={12} />
          </button>
        </div>
      </div>

      {/* Arabic text */}
      <div className="px-5 pt-5 pb-3">
        <p
          className="leading-loose"
          dir="rtl"
          lang="ar"
          style={{
            fontFamily: fontFamilyMap[font.arabicFont] ?? fontFamilyMap.kfgq,
            fontSize: `${Math.min(font.arabicFontSize, 28)}px`,
            lineHeight: "2.0",
            color: "var(--text-arabic)",
            textAlign: "right",
          }}
        >
          {item.text_uthmani}
        </p>
      </div>

      {/* Translation */}
      {font.showTranslation && item.translation && (
        <div className="px-5 pb-5">
          <p
            className="leading-relaxed"
            style={{
              fontSize: `${font.translationFontSize}px`,
              color: "var(--text-secondary)",
              lineHeight: "1.7",
            }}
          >
            {item.translation}
          </p>
        </div>
      )}

      {/* Hover glow border */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          border: "1px solid var(--color-accent)",
          boxShadow: "0 0 20px rgba(66,128,56,0.08)",
        }}
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Empty State
// ─────────────────────────────────────────────────────────────
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      {/* Animated heart icon */}
      <div
        className="relative w-24 h-24 rounded-full flex items-center justify-center mb-8"
        style={{
          background: "linear-gradient(135deg, var(--color-accent-muted), transparent)",
          boxShadow: "0 0 60px rgba(66,128,56,0.1)",
        }}
      >
        <Heart
          size={40}
          style={{ color: "var(--color-accent)" }}
          className="animate-pulse"
        />
        <div
          className="absolute inset-0 rounded-full animate-ping"
          style={{
            border: "1px solid var(--color-accent)",
            opacity: 0.2,
            animationDuration: "3s",
          }}
        />
      </div>

      <h2
        className="text-xl font-bold mb-3"
        style={{ color: "var(--text-primary)" }}
      >
        Your Collection is Empty
      </h2>
      <p
        className="text-sm max-w-sm mb-8 leading-relaxed"
        style={{ color: "var(--text-muted)" }}
      >
        Start saving your favorite verses by tapping the{" "}
        <Heart size={12} className="inline-block mx-0.5" style={{ color: "var(--color-accent)" }} />{" "}
        icon while reading. Your saved verses will appear here for easy access.
      </p>

      <Link
        href="/reading/1"
        className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
        style={{
          background: "linear-gradient(135deg, var(--color-accent), var(--color-accent-light))",
          color: "#fff",
          boxShadow: "0 4px 16px rgba(66,128,56,0.3)",
        }}
      >
        <BookOpen size={16} />
        Start Reading
      </Link>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Wishlist Page (Main)
// ─────────────────────────────────────────────────────────────
export default function WishlistPage() {
  const { items, clearAll } = useWishlistStore();
  const [sortMode, setSortMode] = useState<SortMode>("newest");
  const [searchQuery, setSearchQuery] = useState("");
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Hydration guard
  useEffect(() => {
    setMounted(true);
  }, []);

  // Filtered & sorted items
  const processedItems = useMemo(() => {
    let result = [...items];

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (i) =>
          i.text_uthmani.includes(searchQuery) ||
          i.translation.toLowerCase().includes(q) ||
          i.verse_key.includes(q) ||
          (i.surah_name && i.surah_name.toLowerCase().includes(q))
      );
    }

    // Sort
    switch (sortMode) {
      case "newest":
        result.sort((a, b) => b.savedAt - a.savedAt);
        break;
      case "oldest":
        result.sort((a, b) => a.savedAt - b.savedAt);
        break;
      case "surah-asc":
        result.sort((a, b) => a.surah_id - b.surah_id || a.verse_number - b.verse_number);
        break;
      case "surah-desc":
        result.sort((a, b) => b.surah_id - a.surah_id || b.verse_number - a.verse_number);
        break;
    }

    return result;
  }, [items, searchQuery, sortMode]);

  if (!mounted) {
    return (
      <div className="flex items-center justify-center py-32">
        <div
          className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
          style={{ borderColor: "var(--color-accent)", borderTopColor: "transparent" }}
        />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* ── Page Header ── */}
      <div
        className="relative overflow-hidden px-6 pt-8 pb-6"
        style={{ borderBottom: "1px solid var(--border)" }}
      >
        {/* Background decorative gradient */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse at top center, var(--color-accent-muted) 0%, transparent 60%)",
            opacity: 0.5,
          }}
        />

        <div className="relative z-10">
          {/* Back link */}
          <Link
            href="/reading/1"
            className="inline-flex items-center gap-1.5 text-xs font-medium mb-5 transition-colors duration-200 hover:opacity-80"
            style={{ color: "var(--text-muted)" }}
          >
            <ArrowLeft size={14} />
            Back to Reading
          </Link>

          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{
                    background: "linear-gradient(135deg, var(--color-accent), var(--color-accent-light))",
                    boxShadow: "0 4px 16px rgba(66,128,56,0.3)",
                  }}
                >
                  <Heart size={20} className="text-white" />
                </div>
                <div>
                  <h1
                    className="text-2xl font-bold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    Saved Verses
                  </h1>
                  <p
                    className="text-xs mt-0.5"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {items.length === 0
                      ? "No verses saved yet"
                      : `${items.length} verse${items.length !== 1 ? "s" : ""} in your collection`}
                  </p>
                </div>
              </div>
            </div>

            {/* Clear all button */}
            {items.length > 0 && (
              <div className="relative">
                {showClearConfirm ? (
                  <div
                    className="flex items-center gap-2 px-3 py-2 rounded-xl border text-xs"
                    style={{
                      background: "var(--bg-elevated)",
                      borderColor: "var(--border)",
                    }}
                  >
                    <span style={{ color: "var(--text-muted)" }}>Clear all?</span>
                    <button
                      onClick={() => {
                        clearAll();
                        setShowClearConfirm(false);
                      }}
                      className="px-2.5 py-1 rounded-lg text-xs font-semibold transition-all duration-200 hover:opacity-80"
                      style={{
                        background: "rgba(220,38,38,0.15)",
                        color: "#ef4444",
                      }}
                    >
                      Yes
                    </button>
                    <button
                      onClick={() => setShowClearConfirm(false)}
                      className="px-2.5 py-1 rounded-lg text-xs font-semibold transition-all duration-200 hover:opacity-80"
                      style={{
                        background: "var(--bg-hover)",
                        color: "var(--text-secondary)",
                      }}
                    >
                      No
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowClearConfirm(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all duration-200 hover:border-red-400/30 hover:text-red-400"
                    style={{
                      background: "var(--bg-elevated)",
                      borderColor: "var(--border)",
                      color: "var(--text-muted)",
                    }}
                  >
                    <Trash2 size={12} />
                    Clear All
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Search & Sort Bar ── */}
      {items.length > 0 && (
        <div
          className="flex items-center gap-3 px-6 py-4 border-b"
          style={{ borderColor: "var(--border)" }}
        >
          {/* Search */}
          <div
            className="flex-1 flex items-center gap-2 px-3 py-2 rounded-xl border"
            style={{
              background: "var(--bg-elevated)",
              borderColor: searchQuery ? "var(--color-accent)" : "var(--border)",
              transition: "border-color 0.2s ease",
            }}
          >
            <Search size={14} style={{ color: "var(--text-muted)", flexShrink: 0 }} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search saved verses..."
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-[var(--text-disabled)]"
              style={{ color: "var(--text-primary)" }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center transition-colors"
                style={{ background: "var(--bg-hover)", color: "var(--text-muted)" }}
              >
                <X size={10} />
              </button>
            )}
          </div>

          {/* Sort dropdown */}
          <div className="relative">
            <select
              value={sortMode}
              onChange={(e) => setSortMode(e.target.value as SortMode)}
              className="appearance-none px-3 py-2 rounded-xl border text-xs font-medium cursor-pointer outline-none"
              style={{
                background: "var(--bg-elevated)",
                borderColor: "var(--border)",
                color: "var(--text-secondary)",
                paddingRight: "28px",
              }}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="surah-asc">Surah ↑</option>
              <option value="surah-desc">Surah ↓</option>
            </select>
            <SortAsc
              size={12}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: "var(--text-muted)" }}
            />
          </div>
        </div>
      )}

      {/* ── Search results count ── */}
      {searchQuery && items.length > 0 && (
        <div
          className="px-6 py-3 text-xs"
          style={{
            color: "var(--text-muted)",
            borderBottom: "1px solid var(--border)",
          }}
        >
          {processedItems.length === 0
            ? "No matching verses found"
            : `${processedItems.length} verse${processedItems.length !== 1 ? "s" : ""} found`}
        </div>
      )}

      {/* ── Verse Cards ── */}
      {items.length === 0 ? (
        <EmptyState />
      ) : processedItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Search
            size={32}
            className="mb-4"
            style={{ color: "var(--text-disabled)" }}
          />
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            No verses match &ldquo;{searchQuery}&rdquo;
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4 px-6 py-6">
          {processedItems.map((item, idx) => (
            <WishlistCard key={item.verse_key} item={item} index={idx} />
          ))}
        </div>
      )}

      {/* Bottom spacer */}
      <div className="h-24" />
    </div>
  );
}
