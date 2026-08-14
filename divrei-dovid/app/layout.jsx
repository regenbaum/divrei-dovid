import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata = {
  metadataBase: new URL('https://divreidovid.com'),
  title: {
    default: 'Divrei Dovid — The Torah & Legacy of Rabbi David Ebner zt"l',
    template: '%s | Divrei Dovid',
  },
  description:
    'A growing digital home for the shiurim, writings, and poetry of Rabbi David (Dovid) Ebner zt"l — preserved for his students, and for those who never had the chance to learn from him.',
  openGraph: {
    title: 'Divrei Dovid',
    description:
      'The Torah & legacy of Rabbi David Ebner zt"l — shiurim, writings, and poetry.',
    url: 'https://divreidovid.com',
    siteName: 'Divrei Dovid',
    type: 'website',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
