"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUIStore } from "@/store";
import { useBookmarkStore } from "@/store/bookmarks";
import { useWishlistStore } from "@/store/wishlist";
import { cn } from "@/utils";
import { Home, BookOpen, Search, Heart, Menu, Bookmark } from "lucide-react";
import { useState, useEffect } from "react";

const NAV_ITEMS = [
  { icon: Home, label: "Home", href: "/" },
  { icon: BookOpen, label: "Reading", href: "/reading/1", matchPrefix: "/reading" },
  { icon: Bookmark, label: "Bookmarks", href: "/bookmarks", matchPrefix: "/bookmarks" },
  { icon: Heart, label: "Saved", href: "/wishlist", matchPrefix: "/wishlist" },
] as const;

export function IconSidebar() {
  const pathname = usePathname();
  const { toggleSurahSidebar, openSearch } = useUIStore();
  
  // Stores
  const wishlistItems = useWishlistStore((s) => s.items);
  const bookmarkItems = useBookmarkStore((s) => s.items);
  
  // Hydration-safe counts
  const [counts, setCounts] = useState({ saved: 0, bookmarks: 0 });

  useEffect(() => {
    setCounts({
      saved: wishlistItems.length,
      bookmarks: bookmarkItems.length
    });
  }, [wishlistItems.length, bookmarkItems.length]);

  return (
    <aside className="w-full h-full flex flex-col items-center bg-white/[0.03] backdrop-blur-2xl border-r border-white/5 py-6 relative overflow-hidden group">
      
      {/* Animated accent border top */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-accent-green to-transparent opacity-50 animate-pulse-soft" />

      {/* Hamburger — toggle surah sidebar */}
      <div className="px-2 w-full mb-3">
        <button 
          onClick={toggleSurahSidebar} 
          title="Toggle surah list" 
          className="w-full aspect-square rounded-2xl flex items-center justify-center text-text-muted hover:bg-accent-green/10 hover:text-accent-green transition-all duration-500 group/btn border border-transparent hover:border-accent-green/20"
        >
          <Menu size={22} className="group-hover/btn:rotate-90 transition-transform duration-500" />
        </button>
      </div>

      {/* Divider */}
      <div className="w-8 h-px bg-white/5 mb-3" />

      {/* Nav icons */}
      <nav className="flex flex-col items-center gap-1 flex-1 w-full px-2">
        {NAV_ITEMS.map((item) => {
          const isActive =
            "matchPrefix" in item
              ? pathname.startsWith(item.matchPrefix)
              : pathname === item.href;
          return (
            <Link key={item.label} href={item.href} title={item.label} className="w-full relative group/nav">
              {/* Active side indicator pill */}
              {isActive && (
                 <div className="absolute left-[-8px] top-1/2 -translate-y-1/2 w-1.5 h-8 bg-accent-green rounded-r-full shadow-[0_0_15px_rgba(76,175,80,0.8)] z-50 animate-in slide-in-from-left-2 duration-500" />
              )}

              <span className={cn(
                "w-full aspect-square rounded-2xl flex items-center justify-center transition-all duration-500 relative overflow-hidden",
                isActive 
                  ? "bg-accent-green text-white shadow-[0_10px_20px_-5px_rgba(76,175,80,0.4)]" 
                  : "text-text-muted hover:bg-white/5 hover:text-text-primary"
              )}>
                {/* Glossy overlay for active item */}
                {isActive && (
                   <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent pointer-events-none" />
                )}

                <item.icon size={20} className={cn("transition-all duration-500 relative z-10", isActive ? "scale-110" : "group-hover/nav:scale-110")} />
                
                {/* Count Badge — dynamic for Bookmarks and Saved */}
                {((item.label === "Saved" && counts.saved > 0) || (item.label === "Bookmarks" && counts.bookmarks > 0)) && (
                  <div
                    className="absolute top-1 right-1 min-w-[16px] h-[16px] px-1 rounded-full flex items-center justify-center text-[8px] font-black z-20 shadow-lg border border-white/20"
                    style={{
                      background: item.label === "Saved" 
                        ? "linear-gradient(135deg, #FF4B2B, #FF416C)" 
                        : "linear-gradient(135deg, #FFB75E, #ED8F03)",
                      color: "#fff",
                    }}
                  >
                    {item.label === "Saved" ? (counts.saved > 99 ? "99+" : counts.saved) : (counts.bookmarks > 99 ? "99+" : counts.bookmarks)}
                  </div>
                )}
              </span>
            </Link>
          );
        })}

        {/* Divider with minimal margin */}
        <div className="w-8 h-px bg-white/5 my-0.5" />

        <button 
          onClick={openSearch} 
          title="Search" 
          className="w-full aspect-square rounded-2xl flex items-center justify-center text-text-muted hover:bg-white/5 hover:text-text-primary transition-all duration-500 group/search"
        >
          <Search size={20} className="group-hover/search:scale-110 transition-transform duration-500" />
        </button>
      </nav>

      {/* Bottom Profile/User section */}
      <div className="mt-auto pb-6 px-2 w-full">
         <button className="w-full aspect-square rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-text-muted hover:border-accent-green/50 hover:text-accent-green transition-all duration-500 group/profile relative overflow-hidden">
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-accent-green/30 to-blue-500/30 border border-white/10 flex items-center justify-center text-[10px] font-black group-hover:scale-110 transition-transform duration-500">
               MS
            </div>
            {/* Online status indicator */}
            <div className="absolute bottom-2 right-2 w-2 h-2 rounded-full bg-accent-green border-2 border-bg-sidebar shadow-[0_0_5px_rgba(76,175,80,0.8)]" />
         </button>
      </div>
    </aside>
  );
}
