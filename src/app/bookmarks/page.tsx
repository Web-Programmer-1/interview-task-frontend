"use client";
import { useBookmarkStore, type BookmarkItem } from "@/store/bookmarks";
import { useSettingsStore } from "@/store";
import { Bookmark, Trash2, BookOpen, ArrowLeft, SortAsc, Search, X } from "lucide-react";
import { cn } from "@/utils";
import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// ─────────────────────────────────────────────────────────────
// Sort / Filter Options
// ─────────────────────────────────────────────────────────────
type SortMode = "newest" | "oldest" | "surah-asc" | "surah-desc";

// ─────────────────────────────────────────────────────────────
// Individual Bookmark Card
// ─────────────────────────────────────────────────────────────
import { MoreHorizontal } from "lucide-react";
import { ShareModal } from "@/components/ui/ShareModal";

function BookmarkCard({ item, index }: { item: BookmarkItem; index: number }) {
  const { removeBookmark } = useBookmarkStore();
  const { font } = useSettingsStore();
  const router = useRouter();
  const [removing, setRemoving] = useState(false);
  const [showShare, setShowShare] = useState(false);

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setRemoving(true);
    setTimeout(() => removeBookmark(item.verse_key), 300);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setShowShare(true);
  };

  const shareUrl = typeof window !== "undefined" 
    ? `${window.location.origin}/reading/${item.surah_id}#verse-${item.verse_key}`
    : "";
  
  const shareTitle = `Read Ayah ${item.verse_key} from Surah ${item.surah_name || item.surah_id} on Quran Guide`;

  const handleResume = () => {
    router.push(`/reading/${item.surah_id}#verse-${item.verse_key}`);
  };

  const savedDate = new Date(item.savedAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const fontFamilyMap: Record<string, string> = {
    kfgq: "'KFGQPC Uthmanic Script HAFS', serif",
    amiri: "var(--font-amiri-quran), var(--font-amiri), serif",
    scheherazade: "var(--font-scheherazade), serif",
    hafs: "'KFGQPC Uthmanic Script HAFS', serif",
  };

  // Truncate text for preview
  const truncatedArabic = item.text_uthmani.length > 80 
    ? item.text_uthmani.substring(0, 80) + "..." 
    : item.text_uthmani;
    
  const truncatedTrans = item.translation && item.translation.length > 100
    ? item.translation.substring(0, 100) + "..."
    : item.translation;

  return (
    <div
      onClick={handleResume}
      className={cn(
        "group relative rounded-2xl border overflow-hidden transition-all duration-300 cursor-pointer flex flex-col sm:flex-row items-stretch",
        removing && "opacity-0 scale-95 -translate-y-4"
      )}
      style={{
        background: "var(--bg-card)",
        borderColor: "var(--border)",
        animationDelay: `${index * 50}ms`,
      }}
    >
      {/* Left Accent Bar */}
      <div 
        className="w-1.5 hidden sm:block" 
        style={{ background: "linear-gradient(to bottom, var(--color-accent), var(--color-accent-light))" }}
      />

      <div className="flex-1 p-5 flex flex-col justify-between">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shadow-sm"
              style={{ background: "linear-gradient(135deg, var(--color-accent), var(--color-accent-light))" }}
            >
              {item.surah_id}
            </div>
            <div>
              <h3 className="font-bold text-lg leading-tight" style={{ color: "var(--text-primary)" }}>
                {item.surah_name || `Surah ${item.surah_id}`}
              </h3>
              <p className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>
                Verse {item.verse_number} • Saved {savedDate}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="flex items-center justify-center w-8 h-8 rounded-full border transition-all duration-200 hover:bg-accent-green/10 hover:text-accent-green hover:border-accent-green/30 z-10"
              style={{ borderColor: "var(--border)", color: "var(--text-icon)" }}
            >
              <MoreHorizontal size={14} />
            </button>
            
            <button
              onClick={handleRemove}
              title="Remove bookmark"
              className="flex items-center justify-center w-8 h-8 rounded-full border transition-all duration-200 hover:bg-red-500/10 hover:text-red-400 hover:border-red-400/30 z-10"
              style={{ borderColor: "var(--border)", color: "var(--text-icon)" }}
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>

        {/* Text Preview */}
        <div className="mb-5 flex-1 opacity-70 group-hover:opacity-100 transition-opacity">
          <p
            className="text-right leading-loose mb-2"
            dir="rtl"
            lang="ar"
            style={{
              fontFamily: fontFamilyMap[font.arabicFont] ?? fontFamilyMap.kfgq,
              fontSize: "18px",
              color: "var(--text-arabic)",
            }}
          >
            {truncatedArabic}
          </p>
          {font.showTranslation && truncatedTrans && (
            <p
              className="text-sm leading-relaxed"
              style={{ color: "var(--text-secondary)" }}
            >
              {truncatedTrans}
            </p>
          )}
        </div>

        {/* Action button */}
        <div className="mt-auto">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 group-hover:-translate-y-0.5"
            style={{
              background: "var(--bg-elevated)",
              color: "var(--color-accent)",
              border: "1px solid var(--border)",
            }}
          >
            <BookOpen size={16} />
            Resume Reading
          </div>
        </div>
      </div>
      
      {/* Share Modal */}
      <ShareModal
        isOpen={showShare}
        onClose={() => setShowShare(false)}
        shareUrl={shareUrl}
        title={shareTitle}
      />

      {/* Hover glow */}
      <div
        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ boxShadow: "inset 0 0 0 1px var(--color-accent)" }}
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Empty State
// ─────────────────────────────────────────────────────────────
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
      <div
        className="relative w-24 h-24 rounded-full flex items-center justify-center mb-8"
        style={{
          background: "linear-gradient(135deg, var(--color-accent-muted), transparent)",
        }}
      >
        <Bookmark
          size={40}
          style={{ color: "var(--color-accent)" }}
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
        className="text-2xl font-bold mb-3"
        style={{ color: "var(--text-primary)" }}
      >
        No Bookmarks Yet
      </h2>
      <p
        className="text-sm max-w-sm mb-8 leading-relaxed"
        style={{ color: "var(--text-muted)" }}
      >
        You haven't bookmarked any verses. Click the <Bookmark size={12} className="inline-block mx-0.5" style={{ color: "var(--color-accent)" }} /> icon while reading to save your position and easily return later.
      </p>

      <Link
        href="/reading/1"
        className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 hover:scale-[1.02]"
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
// Main Page Component
// ─────────────────────────────────────────────────────────────
export default function BookmarksPage() {
  const { items, clearAll } = useBookmarkStore();
  const [sortMode, setSortMode] = useState<SortMode>("newest");
  const [searchQuery, setSearchQuery] = useState("");
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const processedItems = useMemo(() => {
    let result = [...items];

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
    <div className="max-w-3xl mx-auto min-h-screen flex flex-col">
      {/* Header */}
      <div
        className="relative overflow-hidden px-6 pt-10 pb-8 border-b"
        style={{ borderColor: "var(--border)" }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse at top right, var(--color-accent-muted) 0%, transparent 60%)",
            opacity: 0.6,
          }}
        />

        <div className="relative z-10">
          <Link
            href="/reading/1"
            className="inline-flex items-center gap-1.5 text-xs font-medium mb-6 transition-colors hover:opacity-80"
            style={{ color: "var(--text-muted)" }}
          >
            <ArrowLeft size={14} />
            Back to Reading
          </Link>

          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg"
                style={{
                  background: "linear-gradient(135deg, var(--color-accent), var(--color-accent-light))",
                }}
              >
                <Bookmark size={22} className="text-white fill-white/20" />
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight" style={{ color: "var(--text-primary)" }}>
                  Reading Bookmarks
                </h1>
                <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
                  {items.length === 0
                    ? "Resume your reading from where you left off"
                    : `${items.length} bookmarked position${items.length !== 1 ? "s" : ""}`}
                </p>
              </div>
            </div>

            {items.length > 0 && (
              <div className="relative">
                {showClearConfirm ? (
                  <div className="flex items-center gap-2 px-3 py-2 rounded-xl border text-xs" style={{ background: "var(--bg-elevated)", borderColor: "var(--border)" }}>
                    <span style={{ color: "var(--text-muted)" }}>Clear all?</span>
                    <button
                      onClick={() => { clearAll(); setShowClearConfirm(false); }}
                      className="px-2.5 py-1 rounded-lg font-semibold text-red-500 bg-red-500/10 hover:bg-red-500/20"
                    >
                      Yes
                    </button>
                    <button
                      onClick={() => setShowClearConfirm(false)}
                      className="px-2.5 py-1 rounded-lg font-semibold"
                      style={{ background: "var(--bg-hover)", color: "var(--text-secondary)" }}
                    >
                      No
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowClearConfirm(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all hover:border-red-400/30 hover:text-red-400"
                    style={{ background: "var(--bg-elevated)", borderColor: "var(--border)", color: "var(--text-muted)" }}
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

      {/* Toolbar */}
      {items.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-3 px-6 py-4 border-b" style={{ borderColor: "var(--border)" }}>
          <div className="flex-1 relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search bookmarks..."
              className="w-full bg-transparent text-sm outline-none rounded-xl border px-9 py-2.5 focus:border-accent-green transition-colors"
              style={{
                background: "var(--bg-elevated)",
                borderColor: searchQuery ? "var(--color-accent)" : "var(--border)",
                color: "var(--text-primary)",
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full flex items-center justify-center transition-colors hover:opacity-80"
                style={{ background: "var(--bg-hover)", color: "var(--text-muted)" }}
              >
                <X size={10} />
              </button>
            )}
          </div>

          <div className="relative">
            <select
              value={sortMode}
              onChange={(e) => setSortMode(e.target.value as SortMode)}
              className="appearance-none w-full sm:w-auto px-4 py-2.5 rounded-xl border text-sm font-medium cursor-pointer outline-none focus:border-accent-green transition-colors"
              style={{
                background: "var(--bg-elevated)",
                borderColor: "var(--border)",
                color: "var(--text-secondary)",
                paddingRight: "36px",
              }}
            >
              <option value="newest">Latest Bookmarks</option>
              <option value="oldest">Oldest First</option>
              <option value="surah-asc">Surah Order</option>
            </select>
            <SortAsc size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "var(--text-muted)" }} />
          </div>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 flex flex-col p-6">
        {items.length === 0 ? (
          <div className="m-auto"><EmptyState /></div>
        ) : processedItems.length === 0 ? (
          <div className="m-auto flex flex-col items-center justify-center text-center">
            <Search size={32} className="mb-4" style={{ color: "var(--text-disabled)" }} />
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              No bookmarks match &ldquo;{searchQuery}&rdquo;
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5">
            {processedItems.map((item, idx) => (
              <BookmarkCard key={item.verse_key} item={item} index={idx} />
            ))}
          </div>
        )}
      </div>
      
      <div className="h-10" />
    </div>
  );
}
