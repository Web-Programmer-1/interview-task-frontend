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

      {}
      <div className="hidden md:flex flex-shrink-0 w-[60px]">
        <IconSidebar />
      </div>

      {}
      <SurahSidebar surahs={surahs} />

      {}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">

        {}
        <MobileTopBar />

        {}
        <div className="hidden md:block">
          <TopHeader />
        </div>

        {}
        <main className="flex-1 overflow-y-auto">
          {}
          <div className="pb-20 md:pb-20">
            {children}
          </div>
        </main>

        {}
        <AudioBar />
      </div>

      {}
      <SettingsPanel />

      {}
      <AudioEngine />

      {}
      <SearchModal />

      {}
      <MobileNav />
    </div>
  );
}
