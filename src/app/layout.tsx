import type { Metadata, Viewport } from "next";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { ReduxProvider } from "@/components/providers/ReduxProvider";
import { Inter, Amiri_Quran, Amiri, Scheherazade_New } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const amiriQuran = Amiri_Quran({ weight: "400", subsets: ["arabic"], variable: "--font-amiri-quran" });
const amiri = Amiri({ weight: ["400", "700"], subsets: ["arabic"], variable: "--font-amiri" });
const scheherazade = Scheherazade_New({ weight: ["400", "500", "600", "700"], subsets: ["arabic"], variable: "--font-scheherazade" });

export const metadata: Metadata = {
  title: {
    template: "%s | QuranMazid",
    default: "QuranMazid — Read, Listen & Understand the Holy Quran",
  },
  description:
    "Read the Holy Quran with Arabic text, English translation, and audio recitation. Access all 114 surahs with beautiful typography and Islamic features.",
  keywords: ["Quran", "Islam", "Arabic", "Translation", "Recitation", "Surah", "Ayah"],
  authors: [{ name: "QuranMazid" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "QuranMazid",
  },
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0D0D0D",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${amiriQuran.variable} ${amiri.variable} ${scheherazade.variable}`} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.qurancomplex.gov.sa" />
      </head>
      <body className="bg-bg-primary text-text-primary antialiased font-sans">
        <ThemeProvider>
          <ReduxProvider>
            {children}
          </ReduxProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
