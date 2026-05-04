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

export default async function ReadingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const surahs = await getAllSurahs();

  return (
    <div className="h-screen overflow-hidden flex bg-transparent">

      {/* ── 1. Left Icon Sidebar — fixed width on desktop only ── */}
      <div className="hidden lg:flex flex-shrink-0 w-[64px] border-r border-border">
        <IconSidebar />
      </div>

      {/* ── 2. Surah List Sidebar — Collapsible drawer/sidebar ── */}
      <SurahSidebar surahs={surahs} />

      {/* ── 3. Main Reading Area ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">

        {/* Mobile Top Bar */}
        <MobileTopBar />

        {/* Desktop Top Header */}
        <div className="hidden lg:block">
          <TopHeader />
        </div>

        {/* Scrollable content area */}
        <main className="flex-1 overflow-y-auto relative custom-scrollbar">
          <div className="pb-16 lg:pb-0">
            {children}
          </div>
        </main>

        {/* Audio Bar (Desktop only or global) */}
        <AudioBar />
      </div>

      {/* ── 4. Settings Panel — Collapsible drawer/sidebar ── */}
      <SettingsPanel />

      {/* ── Overlays & Navigation ── */}
      <SearchModal />
      <AudioEngine />
      <MobileNav />
    </div>
  );
}
