import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.nayarai.com'

  const routes = [
    '',
    '/about',
    '/contact',
    '/services',
    '/careers',
    '/resources',
    '/privacy',
    '/terms-of-service',
    '/cookie',
    '/legal',
  ]

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'daily' : 'weekly',
    priority: route === '' ? 1 : 0.8,
  }))
}
