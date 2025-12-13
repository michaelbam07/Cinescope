import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProfileSelector from "@/components/ProfileSelector";
import ProfileSelectorWrapper from "@/components/ProfileSelectorWrapper";
import { MovieProvider } from "@/app/context/MovieContext";
import { ThemeProvider } from "@/app/context/ThemeContext";
import { ProfileProvider } from "@/app/context/ProfileContext";
import { SpeedInsights } from "@vercel/speed-insights/next"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "CineScope",
  description: "A next-gen platform to explore and discover movies.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>

        {/* Theme + Movie + Profile providers */}
        <ThemeProvider>
          <ProfileProvider>
            <MovieProvider>
              <ProfileSelectorWrapper />
              <Header />
              {children}
              <Footer />
            </MovieProvider>
          </ProfileProvider>
        </ThemeProvider>

      </body>
    </html>
  );
}
