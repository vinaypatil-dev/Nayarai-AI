import React from "react"
import type { Metadata } from 'next'
import { Inter, Space_Grotesk } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import LoadingScreen from '@/components/loading-screen'
import './globals.css'
import { FloatingNav } from "@/components/floating-nav"
import { Footer } from "@/components/footer"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-sans',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({ 
  subsets: ["latin"],
  variable: '--font-display',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'NAYARAi™ - Healthcare Regulatory Excellence',
    template: '%s | NAYARAi™'
  },
  description:
    'Expert regulatory strategies and full lifecycle compliance solutions for medical devices, pharmaceuticals, biotechnology, and SaMD globally.',

  metadataBase: new URL('https://www.nayarai.com'),

  alternates: {
    canonical: '/',
  },

  openGraph: {
    title: 'NAYARAi™ - Healthcare Regulatory Excellence',
    description:
      'Expert regulatory strategies and full lifecycle compliance solutions for healthcare products globally.',
    url: 'https://www.nayarai.com',
    siteName: 'NAYARAi™',
    images: [
      {
        url: 'https://www.nayarai.com/logo-1.png',
        secureUrl: 'https://www.nayarai.com/logo-1.png',
        width: 1200,
        height: 630,
        alt: 'NAYARAi™ Healthcare Regulatory Excellence',
        type: 'image/png',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },

  twitter: {
    card: 'summary_large_image',
    site: '@nayarai', // optional (add your handle)
    creator: '@nayarai', // optional
    title: 'NAYARAi™ - Healthcare Regulatory Excellence',
    description:
      'Expert regulatory strategies and full lifecycle compliance solutions for healthcare products globally.',
    images: [
      {
        url: 'https://www.nayarai.com/logo-1.png',
        alt: 'NAYARAi™ Healthcare Regulatory Excellence',
      },
    ],
  },

  // Extra meta for better compatibility (LinkedIn + fallback crawlers)
  other: {
    'og:image:secure_url': 'https://www.nayarai.com/logo-1.png',
    'og:image:type': 'image/png',
    'og:image:width': '1200',
    'og:image:height': '630',

    // LinkedIn prefers this sometimes
    'og:updated_time': new Date().toISOString(),
  },

  robots: {
    index: true,
    follow: true,
  },

  icons: {
    icon: [
      { url: '/favicon/favicon.ico' },
      { url: '/favicon/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: '/favicon/apple-touch-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${spaceGrotesk.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange={false}
        >
          <LoadingScreen />
          <FloatingNav/>
          {children}
          <Footer/>
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  )
}
