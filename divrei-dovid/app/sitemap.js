export default function sitemap() {
  const base = 'https://divreidovid.com'
  const routes = [
    '', '/about', '/shiurim', '/writings', '/teshuva',
    '/get-involved', '/support', '/contribute', '/tributes',
  ]
  return routes.map((route) => ({
    url: `${base}${route}`,
    lastModified: new Date(),
  }))
}
