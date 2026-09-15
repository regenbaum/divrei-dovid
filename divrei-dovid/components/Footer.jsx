import content from '@/content/site-content.json'

export default function Footer() {
  return (
    <footer className="site-footer">
      <span>{content.footer.tagline}</span>
      <span>
        Divrei Dovid · <a href="/admin/login" style={{ opacity: 0.55 }}>Admin</a>
      </span>
    </footer>
  )
}
