import Link from 'next/link'

export default function Header() {
  return (
    <header className="site-header">
      <Link href="/" className="wordmark">Divrei Dovid</Link>
      <nav className="nav">
        <Link href="/shiurim">Shiurim</Link>
        <Link href="/writings">Writings</Link>
        <Link href="/teshuva">Teshuva Reader</Link>
        <Link href="/get-involved">Get Involved</Link>
        <Link href="/about">About</Link>
      </nav>
    </header>
  )
}
