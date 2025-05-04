import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import Toast from '@/components/common/Toast';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Soko Yetu - Agricultural Marketplace',
  description: 'Connecting farmers and buyers across East Africa with AI-driven insights for fair pricing and data-driven decisions.',
  keywords: 'agriculture, marketplace, farmers, AI insights, East Africa',
  openGraph: {
    title: 'Soko Yetu',
    description: 'Empowering farmers with AI-driven insights and direct market access.',
    url: 'https://www.sokoyetu.com',
    siteName: 'Soko Yetu',
    images: [
      {
        url: `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/v1234567890/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'Soko Yetu Open Graph Image',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Soko Yetu',
    description: 'Connecting farmers and buyers with AI-driven insights.',
    images: [`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/v1234567890/og-image.png`],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Header />
        <main>{children}</main>
        <Footer />
        <Toast />
      </body>
    </html>
  );
}