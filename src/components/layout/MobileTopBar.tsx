"use client";
import { useUIStore } from "@/store";
import { Menu, Search, Settings, ChevronLeft, ChevronRight } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

export function MobileTopBar() {
  const { toggleSurahSidebar, openSearch, toggleSettingsPanel } = useUIStore();
  const params = useParams();
  const router = useRouter();
  const currentId = Number(params?.surahId ?? 1);

  return (
    <div className="sticky top-0 z-20 flex items-center gap-2 px-3 py-3 bg-bg-primary border-b border-border md:hidden">
      <button
        onClick={toggleSurahSidebar}
        className="icon-btn-sm"
        title="Open surah list"
      >
        <Menu size={18} />
      </button>

      <div className="flex-1 flex items-center justify-center gap-3">
        <button
          onClick={() => currentId > 1 && router.push(`/reading/${currentId - 1}`)}
          disabled={currentId <= 1}
          className="icon-btn-sm disabled:opacity-30"
        >
          <ChevronLeft size={16} />
        </button>
        <span className="text-sm font-semibold text-text-primary">Surah {currentId}</span>
        <button
          onClick={() => currentId < 114 && router.push(`/reading/${currentId + 1}`)}
          disabled={currentId >= 114}
          className="icon-btn-sm disabled:opacity-30"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      <button onClick={openSearch} className="icon-btn-sm" title="Search">
        <Search size={18} />
      </button>
      <button onClick={toggleSettingsPanel} className="icon-btn-sm" title="Settings">
        <Settings size={18} />
      </button>
    </div>
  );
}
