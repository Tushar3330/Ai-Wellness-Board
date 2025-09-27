import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/toaster'
import { WellnessProvider } from '@/store/wellness-context'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://ai-wellness-board.vercel.app'),
  title: 'AI Wellness Board - Personalized Health Recommendations',
  description: 'Get personalized wellness recommendations powered by AI. Discover health tips tailored to your age, gender, and wellness goals.',
  keywords: ['wellness', 'health', 'AI', 'recommendations', 'personalized', 'fitness'],
  authors: [{ name: 'Tushar' }],
  creator: 'Tushar',
  publisher: 'AI Wellness Board',
  openGraph: {
    title: 'AI Wellness Board - Personalized Health Recommendations',
    description: 'Get personalized wellness recommendations powered by AI.',
    url: 'https://ai-wellness-board.vercel.app',
    siteName: 'AI Wellness Board',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'AI Wellness Board',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Wellness Board',
    description: 'Personalized wellness recommendations powered by AI',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#14b8a6" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <WellnessProvider>
          <main className="min-h-screen bg-gradient-to-br from-wellness-50 via-white to-wellness-100">
            {children}
          </main>
          <Toaster />
        </WellnessProvider>
      </body>
    </html>
  )
}