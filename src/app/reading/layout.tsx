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

      {}
      <div className="hidden lg:flex flex-shrink-0 w-[64px] border-r border-border">
        <IconSidebar />
      </div>

      {}
      <SurahSidebar surahs={surahs} />

      {}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">

        {}
        <MobileTopBar />

        {}
        <div className="hidden lg:block">
          <TopHeader />
        </div>

        {}
        <main className="flex-1 overflow-y-auto relative custom-scrollbar">
          <div className="pb-16 lg:pb-0">
            {children}
          </div>
        </main>

        {}
        <AudioBar />
      </div>

      {}
      <SettingsPanel />

      {}
      <SearchModal />
      <AudioEngine />
      <MobileNav />
    </div>
  );
}
