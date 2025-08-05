import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Equilibrio Vital Pro - Comparación Avanzada de Biorritmos',
  description: 'Versión profesional para comparar biorritmos de múltiples personas. Análisis grupal, recomendaciones personalizadas y funciones avanzadas.',
  applicationName: 'Equilibrio Vital Pro',
  keywords: ['biorritmos', 'comparación', 'análisis grupal', 'bienestar', 'profesional'],
  icons: {
    icon: [
      { url: '/img/icono-ritmoovital-pro.png', sizes: '32x32', type: 'image/png' },
      { url: '/img/icono-ritmoovital-pro.png', sizes: '16x16', type: 'image/png' },
    ],
    shortcut: '/favicon-pro.ico',
    apple: [
      { url: '/img/icono-ritmoovital-pro.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  themeColor: '#d97706', // Amber theme for Pro
}

export default function ProLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}