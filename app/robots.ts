import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/products/', '/products'],
    },
    sitemap: 'https://www.nayarai.com/sitemap.xml',
  }
}
