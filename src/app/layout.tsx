import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Synapse IT — Premium Software Engineering, Milan',
  description: 'We architect, build, and scale digital products for companies that need engineering they can depend on. 120+ products delivered. 98% client retention.',
  keywords: 'software engineering, web development, mobile apps, devops, milan, italy',
  openGraph: {
    title: 'Synapse IT — Premium Software Engineering',
    description: 'We architect, build, and scale digital products for companies that need engineering they can depend on.',
    type: 'website',
  },
}

import Loader from '@/components/Loader'
import GSAPProvider from '@/components/GSAPProvider'
import CustomCursor from '@/components/CustomCursor'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Syne:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Loader />
        <GSAPProvider />
        <CustomCursor />
        {children}
      </body>
    </html>
  )
}
