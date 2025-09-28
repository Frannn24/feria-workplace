import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Mi Tienda de Arte',
  description: 'Tienda online para artistas e ilustradores',
  keywords: 'arte, ilustración, stickers, pins, prints, tienda online',
  authors: [{ name: 'Tu Artista' }],
  openGraph: {
    title: 'Mi Tienda de Arte',
    description: 'Descubre arte único y productos originales',
    type: 'website',
    images: ['/og-image.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mi Tienda de Arte',
    description: 'Descubre arte único y productos originales',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <head>
        <link 
          rel="stylesheet" 
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" 
        />
      </head>
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-50">
          {children}
        </div>
      </body>
    </html>
  )
}