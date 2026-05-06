"use client";
import { X, Users, Share2, MessageCircle, Globe, Link2, Check } from "lucide-react";
import { useState } from "react";
import { cn } from "@/utils";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  shareUrl: string;
  title: string;
}

export function ShareModal({ isOpen, onClose, shareUrl, title }: ShareModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareOptions = [
    {
      name: "Facebook",
      icon: Users,
      color: "#1877F2",
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    },
    {
      name: "Twitter",
      icon: Share2,
      color: "#1DA1F2",
      url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(title)}`,
    },
    {
      name: "WhatsApp",
      icon: MessageCircle,
      color: "#25D366",
      url: `https://wa.me/?text=${encodeURIComponent(title + " " + shareUrl)}`,
    },
    {
      name: "Instagram",
      icon: Globe,
      color: "#E4405F",
      url: `https://www.instagram.com/`,
    },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-md animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      {}
      <div 
        className="relative w-full max-w-sm rounded-3xl border shadow-2xl overflow-hidden animate-in zoom-in-95 fade-in duration-300"
        style={{
          background: "var(--glass-bg)",
          backdropFilter: "blur(24px)",
          borderColor: "var(--border)",
        }}
      >
        {}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
          <h3 className="font-bold text-lg text-text-primary">Share Ayah</h3>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/5 text-text-muted hover:text-text-primary transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <p className="text-sm text-text-muted mb-6">Share this beautiful verse with your friends and family.</p>
          
          {}
          <div className="grid grid-cols-4 gap-4 mb-8">
            {shareOptions.map((opt) => (
              <a
                key={opt.name}
                href={opt.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-2 group"
              >
                <div 
                  className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-lg"
                  style={{ 
                    background: `${opt.color}15`, 
                    color: opt.color,
                    border: `1px solid ${opt.color}30`
                  }}
                >
                  <opt.icon size={22} className="group-hover:scale-110 transition-transform" />
                </div>
                <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider group-hover:text-text-primary transition-colors">
                  {opt.name.split(" ")[0]}
                </span>
              </a>
            ))}
          </div>

          {}
          <div 
            className="flex items-center gap-2 p-3 rounded-2xl bg-white/5 border border-white/10 group cursor-pointer"
            onClick={handleCopy}
          >
            <div className="flex-1 truncate text-xs text-text-secondary font-medium">
              {shareUrl}
            </div>
            <button 
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase transition-all",
                copied 
                  ? "bg-accent-green text-white" 
                  : "bg-white/10 text-text-primary hover:bg-white/20"
              )}
            >
              {copied ? (
                <>
                  <Check size={12} />
                  Copied
                </>
              ) : (
                <>
                  <Link2 size={12} />
                  Copy
                </>
              )}
            </button>
          </div>
        </div>

        {}
        <div className="px-6 py-4 bg-white/5 text-center">
          <p className="text-[10px] text-text-disabled font-medium uppercase tracking-[0.2em]">Quran Guide • Divine Wisdom</p>
        </div>
      </div>
    </div>
  );
}
