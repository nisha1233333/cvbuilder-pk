import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'CVBuilder Pakistan - AI-Powered CV & Resume Builder',
    template: '%s | CVBuilder Pakistan',
  },
  description: "Create professional, ATS-friendly CVs with Pakistani format. Includes CNIC field, Matric/FSc sections, and AI-powered content generation. Pakistan's #1 CV builder.",
  keywords: ['CV builder Pakistan', 'resume builder Pakistan', 'ATS CV Pakistan', 'CV format Pakistan 2025', 'Pakistani CV template'],
  authors: [{ name: 'CVBuilder Pakistan' }],
  creator: 'CVBuilder Pakistan',
  openGraph: {
    type: 'website',
    locale: 'en_PK',
    siteName: 'CVBuilder Pakistan',
    title: 'CVBuilder Pakistan - AI-Powered CV Builder',
    description: "Pakistan's #1 AI-powered CV builder with Pakistani format, CNIC fields, and ATS optimization.",
    images: [{ url: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?w=1200&h=630&fit=crop' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CVBuilder Pakistan - AI-Powered CV Builder',
    description: "Pakistan's #1 AI-powered CV builder.",
    images: ['https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?w=1200&h=630&fit=crop'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}