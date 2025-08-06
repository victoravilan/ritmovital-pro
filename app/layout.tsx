import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import DynamicLayout from '@/components/dynamic-layout'
import { SimpleTranslationProvider } from '@/lib/simple-translations'
import './global.css'

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_APP_VERSION === 'pro' 
    ? 'Equilibrio Vital Pro - Comparación Avanzada' 
    : 'Equilibrio Vital - Descubre tu Bienestar',
  description: process.env.NEXT_PUBLIC_APP_VERSION === 'pro'
    ? 'Versión profesional para comparar biorritmos de múltiples personas. Análisis grupal y recomendaciones avanzadas.'
    : 'Descubre tu bienestar holístico con un guía virtual. Explora salud, astrología, sugerencias y cita motivadora.',
  generator: 'Next.js',
  applicationName: 'Equilibrio Vital',
  keywords: ['bienestar', 'holístico', 'salud', 'astrología', 'motivación', 'equilibrio'],
  authors: [{ name: 'Equilibrio Vital' }],
  creator: 'Equilibrio Vital',
  publisher: 'Equilibrio Vital',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { 
        url: process.env.NEXT_PUBLIC_APP_VERSION === 'pro' ? '/img/favicon ritmovital-pro.png' : '/img/icono-ritmoovital.png', 
        sizes: '32x32', 
        type: 'image/png' 
      },
      { 
        url: process.env.NEXT_PUBLIC_APP_VERSION === 'pro' ? '/img/favicon ritmovital-pro.png' : '/img/icono-ritmoovital.png', 
        sizes: '16x16', 
        type: 'image/png' 
      },
    ],
    shortcut: process.env.NEXT_PUBLIC_APP_VERSION === 'pro' ? '/favicon-pro.ico' : '/img/icono-ritmoovital.png',
    apple: [
      { 
        url: process.env.NEXT_PUBLIC_APP_VERSION === 'pro' ? '/img/favicon ritmovital-pro.png' : '/img/icono-ritmoovital.png', 
        sizes: '180x180', 
        type: 'image/png' 
      },
    ],
  },
  manifest: process.env.NEXT_PUBLIC_APP_VERSION === 'pro' ? '/manifest-pro.json' : '/manifest.json',
  themeColor: '#8B5CF6',
  colorScheme: 'dark',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {  
  return (
    <html lang="es" className={`${GeistSans.variable} ${GeistMono.variable} dark`}>
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content={process.env.NEXT_PUBLIC_APP_VERSION === 'pro' ? 'Equilibrio Vital Pro' : 'Equilibrio Vital'} />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content={process.env.NEXT_PUBLIC_APP_VERSION === 'pro' ? '#d97706' : '#8B5CF6'} />
        <meta name="msapplication-TileImage" content={process.env.NEXT_PUBLIC_APP_VERSION === 'pro' ? '/img/favicon ritmovital-pro.png' : '/img/icono-ritmoovital.png'} />
        <link rel="apple-touch-icon" href={process.env.NEXT_PUBLIC_APP_VERSION === 'pro' ? '/img/favicon ritmovital-pro.png' : '/img/icono-ritmoovital.png'} />
        <link rel="apple-touch-icon" sizes="152x152" href={process.env.NEXT_PUBLIC_APP_VERSION === 'pro' ? '/img/favicon ritmovital-pro.png' : '/img/icono-ritmoovital.png'} />
        <link rel="apple-touch-icon" sizes="180x180" href={process.env.NEXT_PUBLIC_APP_VERSION === 'pro' ? '/img/favicon ritmovital-pro.png' : '/img/icono-ritmoovital.png'} />
        <link rel="apple-touch-icon" sizes="167x167" href={process.env.NEXT_PUBLIC_APP_VERSION === 'pro' ? '/img/favicon ritmovital-pro.png' : '/img/icono-ritmoovital.png'} />
      </head>
      <body>
        <SimpleTranslationProvider>
          <DynamicLayout>
            {children}
          </DynamicLayout>
        </SimpleTranslationProvider>
      </body>
    </html>
  )
}