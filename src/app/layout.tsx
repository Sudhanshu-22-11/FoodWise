import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import ClientProvider from "@/components/providers/ClientProvider";

import NotificationDrawer from "@/components/common/NotificationDrawer";
import OnboardingModal from "@/components/common/OnboardingModal";
import ApiInspectorModal from "@/components/common/ApiInspectorModal";
import SettingsModal from "@/components/common/SettingsModal";
import PushNotificationPrompt from "@/components/common/PushNotificationPrompt";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://food-wise-puce.vercel.app"),
  title: "FoodWise | Making Every Meal Count",
  description:
    "AI-powered Smart Food Waste Management and Redistribution Platform for Institutional Kitchens and Food Processing Factories.",
  keywords: [
    "food waste management",
    "AI demand prediction",
    "predictive spoilage",
    "NGO food redistribution",
    "smart kitchen",
    "FSSAI compliance",
    "Making every meal count",
  ],
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png", sizes: "32x32" },
      { url: "/logo-badge.png", type: "image/png", sizes: "240x238" },
    ],
    shortcut: "/favicon.ico",
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  openGraph: {
    title: "FoodWise — Predict Less Waste. Feed More Lives.",
    description:
      "AI-powered Smart Food Waste Management and Redistribution Platform for Institutional Kitchens and Food Processing Factories.",
    url: "https://food-wise-puce.vercel.app",
    siteName: "FoodWise",
    images: [
      {
        url: "/logo.png",
        width: 653,
        height: 649,
        alt: "FoodWise Platform Logo",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FoodWise — Predict Less Waste. Feed More Lives.",
    description:
      "AI-powered Smart Food Waste Management and Redistribution Platform for Institutional Kitchens and Food Processing Factories.",
    images: ["/logo.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-[#F4F6FA] text-[#111827] font-sans antialiased selection:bg-[#10B981]/20 selection:text-[#10B981]">
        <ClientProvider>
          {children}
          <NotificationDrawer />
          <OnboardingModal />
          <ApiInspectorModal />
          <SettingsModal />
          <PushNotificationPrompt />

        </ClientProvider>
      </body>
    </html>
  );
}
