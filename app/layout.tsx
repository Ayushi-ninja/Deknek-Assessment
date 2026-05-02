import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'

const inter = Inter({ subsets: ['latin'], weight: ['400', '500', '600', '700', '800', '900'] })

export const metadata: Metadata = {
  title: 'DekNek 3D — Imagination to Reality',
  description: 'AI-powered 3D model marketplace by DekNek 3D. Browse, download, and request custom 3D models for your projects.',
  keywords: '3D models, 3D marketplace, custom 3D, DekNek, text to 3D, image to 3D',
  openGraph: {
    title: 'DekNek 3D — Imagination to Reality',
    description: 'AI-powered 3D model marketplace. Browse thousands of 3D assets or request custom models.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        <main className="min-h-screen bg-black">
          {children}
        </main>
      </body>
    </html>
  )
}
