import type { Metadata } from "next";

import "./globals.css";

import { Toaster } from "react-hot-toast";

import {
  Geist,
  Geist_Mono,
} from "next/font/google";

import { ThemeProvider }
from "../components/ThemeProvider";

import SessionProviderWrapper
from "../components/SessionProviderWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

//////////////////////////////////////////////////////
// METADATA
//////////////////////////////////////////////////////

export const metadata: Metadata = {

  title:
    "Allo Health | Medical Inventory Dashboard",

  description:
    "Enterprise healthcare inventory and reservation management system built using Next.js, Prisma, PostgreSQL, and Tailwind CSS.",

  keywords: [

    "Medical Dashboard",

    "Healthcare Inventory",

    "Hospital Management",

    "Reservation System",

    "Warehouse Management",

    "Next.js Healthcare App",
  ],

  authors: [
    {
      name: "Allo Health",
    },
  ],

  openGraph: {

    title:
      "Allo Health Dashboard",

    description:
      "Professional healthcare inventory management platform.",

    siteName:
      "Allo Health",

    type:
      "website",
  },
};

//////////////////////////////////////////////////////
// ROOT LAYOUT
//////////////////////////////////////////////////////

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (

    <html
      lang="en"
      suppressHydrationWarning

      className={`
        ${geistSans.variable}
        ${geistMono.variable}
        h-full
        scroll-smooth
      `}
    >

      <body
        className="
          min-h-screen
          bg-slate-100
          text-slate-900
          antialiased
          font-sans
          overflow-x-hidden
        "
      >

        {/* SESSION */}
        <SessionProviderWrapper>

          {/* THEME */}
          <ThemeProvider>

            {/* TOASTER */}
            <Toaster
              position="top-right"
              reverseOrder={false}
            />

            {/* GLOBAL BACKGROUND */}
            <div
              className="
                fixed
                inset-0
                -z-10

                bg-[radial-gradient(circle_at_top_right,_rgba(6,182,212,0.12),transparent_35%),radial-gradient(circle_at_bottom_left,_rgba(59,130,246,0.10),transparent_35%)]
              "
            />

            {/* APP */}
            <main className="relative">

              {children}

            </main>

          </ThemeProvider>

        </SessionProviderWrapper>

      </body>

    </html>
  );
}