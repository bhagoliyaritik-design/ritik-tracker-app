// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ritik Tracker — All-In-One Personal Productivity, Health & Study Suite",
  description: "Ritik Tracker helps you manage daily habits, study progress, lectures, water intake, workouts, and calendars in a sleek, unified, dark-themed premium dashboard. Developed by Ritik Bhagoliya.",
  applicationName: "Ritik Tracker",
  manifest: "/manifest.json",
  keywords: ["Ritik Tracker", "Habit Tracker", "Study progress tracking", "Water tracker", "Workout log", "Productivity apps", "Ritik Bhagoliya", "Mind Decoded"],
  authors: [{ name: "Ritik Bhagoliya", url: "https://youtube.com/@minddecoded-b8v?si=dVjWKjUhZGmGPr9u" }],
  creator: "Ritik Bhagoliya",
  publisher: "Ritik Tracker",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://ritiktracker.vercel.app", // Adjust if hosted on your custom domain
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://ritiktracker.vercel.app",
    title: "Ritik Tracker — Premium Life & Productivity Workspace",
    description: "Track your habits, log workouts, measure study progress, and build deep daily routines with real-time secure database synchronization.",
    siteName: "Ritik Tracker",
    images: [
      {
        url: "/icon-512.png",
        width: 512,
        height: 512,
        alt: "Ritik Tracker Platform Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ritik Tracker — Built by Ritik Bhagoliya",
    description: "Streamlined metrics for habits, water logs, and analytics inside an interactive premium user engine.",
    images: ["/icon-512.png"],
  },
  icons: {
    icon: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/icon-192.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
      style={{ colorScheme: "dark" }}
    >
      <head>
        {/* Google AdSense Verification */}
        <meta
          name="google-adsense-account"
          content="ca-pub-4635586046789022"
        />
      </head>
      <body className="min-h-full bg-[#070814] text-zinc-100 antialiased selection:bg-indigo-500/30 selection:text-indigo-200">
        {children}

        {/* Google AdSense Script */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4635586046789022"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        <Analytics />
      </body>
    </html>
  );
}