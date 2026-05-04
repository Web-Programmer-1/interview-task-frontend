import { getAllSurahs } from "@/features/reader/services/quran-data";
import { IconSidebar } from "@/components/layout/IconSidebar";
import { SurahSidebar } from "@/components/layout/SurahSidebar";
import { SettingsPanel } from "@/components/layout/SettingsPanel";
import { MobileNav } from "@/components/layout/MobileNav";
import { MobileTopBar } from "@/components/layout/MobileTopBar";
import { SearchModal } from "@/features/search/components/SearchModal";
import { AudioBar } from "@/features/reader/components/AudioBar";
import { AudioEngine } from "@/features/reader/components/AudioEngine";
import { TopHeader } from "@/components/layout/TopHeader";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Saved Verses | QuranMazid",
  description: "Your collection of saved Quran verses. Access and manage your favorite ayahs.",
};

export default async function WishlistLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const surahs = await getAllSurahs();

  return (
    <div className="h-screen overflow-hidden flex" style={{ background: "var(--bg-primary)" }}>

      {/* ── 1. Left Icon Sidebar — 60px fixed, desktop only ── */}
      <div className="hidden md:flex flex-shrink-0 w-[60px]">
        <IconSidebar />
      </div>

      {/* ── 2. Surah List Sidebar — 280px, collapsible ── */}
      <SurahSidebar surahs={surahs} />

      {/* ── 3. Main Reading Area ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">

        {/* Mobile Top Bar — hidden on desktop */}
        <MobileTopBar />

        {/* ─── Desktop Top Header — glassmorphism ─── */}
        <div className="hidden md:block">
          <TopHeader />
        </div>

        {/* Scrollable content */}
        <main className="flex-1 overflow-y-auto">
          {/* Bottom padding: mobile nav (64px) or audio bar (72px) */}
          <div className="pb-20 md:pb-20">
            {children}
          </div>
        </main>

        {/* Audio Playback Bar — bottom of reading area */}
        <AudioBar />
      </div>

      {/* ── 4. Settings Panel — always visible on desktop ── */}
      <SettingsPanel />

      {/* ── Audio Engine (headless) ── */}
      <AudioEngine />

      {/* ── Overlays ── */}
      <SearchModal />

      {/* ── Mobile Bottom Navigation ── */}
      <MobileNav />
    </div>
  );
}
