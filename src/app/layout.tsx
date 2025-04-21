import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "../styles/fonts.css";
import '../styles/fontawesome.min.css';
import { Toaster } from 'react-hot-toast'

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AuthModal from "@/components/shared/AuthModal"

import PageTransition from "@/components/ui/PageTransition";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SokoYetu AI",
  description: "Kenya's AI-powered agricultural marketplace",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
          integrity="sha512-yLh2r+7lC5v0dfGrOtQAKYQ4U7Mc8JUP8xTFO05I1EOhq5I4np95aMvYzV0rTbPYWT+0A37FvZXjI4RVlRcBLw=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-dark`}
      >
        <Header />
        <Toaster position="top-center" toastOptions={{ duration: 5000 }} />

        <PageTransition>
        <main className="min-h-screen">{children}</main>
          </PageTransition>
        <Footer />
        <AuthModal />
      </body>
    </html>
  );
}
