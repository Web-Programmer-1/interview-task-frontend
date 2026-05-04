"use client";
import Link from "next/link";
import { useUIStore } from "@/store";
import { useWishlistStore } from "@/store/wishlist";
import { BookOpen, Search, Heart, Settings, Home } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/utils";
import { useState, useEffect } from "react";

export function MobileNav() {
  const pathname = usePathname();
  const { openSearch, toggleSettingsPanel, toggleSurahSidebar } = useUIStore();
  const items = useWishlistStore((s) => s.items);
  const [count, setCount] = useState(0);

  // Hydration-safe count
  useEffect(() => {
    setCount(items.length);
  }, [items.length]);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around bg-bg-sidebar border-t border-border h-16 md:hidden px-2">
      <Link href="/" className={cn("mobile-nav-btn", pathname === "/" && "text-accent-green")}>
        <Home size={20} />
        <span className="text-[10px] mt-0.5">Home</span>
      </Link>

      <button
        onClick={toggleSurahSidebar}
        className={cn("mobile-nav-btn", pathname.includes("/reading") && "text-accent-green")}
      >
        <BookOpen size={20} />
        <span className="text-[10px] mt-0.5">Surahs</span>
      </button>

      <button onClick={openSearch} className="mobile-nav-btn">
        <Search size={20} />
        <span className="text-[10px] mt-0.5">Search</span>
      </button>

      <Link
        href="/wishlist"
        className={cn("mobile-nav-btn relative", pathname.includes("/wishlist") && "text-accent-green")}
      >
        <div className="relative">
          <Heart size={20} />
          {count > 0 && (
            <span
              className="absolute -top-1 -right-2 min-w-[14px] h-3.5 px-0.5 rounded-full flex items-center justify-center text-[8px] font-bold"
              style={{
                background: "linear-gradient(135deg, var(--color-accent), var(--color-accent-light))",
                color: "#fff",
              }}
            >
              {count > 99 ? "99+" : count}
            </span>
          )}
        </div>
        <span className="text-[10px] mt-0.5">Saved</span>
      </Link>

      <button onClick={toggleSettingsPanel} className="mobile-nav-btn">
        <Settings size={20} />
        <span className="text-[10px] mt-0.5">Settings</span>
      </button>
    </nav>
  );
}
