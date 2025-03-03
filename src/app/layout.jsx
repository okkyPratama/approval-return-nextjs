import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Mandiri Utama Finance',
  description: 'Build with ❤️ by Okky Pratama',
  icons: {
    icon: [
      {
        url: '/fav.png',
        type: 'image/png' 
      }
    ]
  }
}

export default function RootLayout({
  children,
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
