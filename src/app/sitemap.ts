import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
    return [
        {
            url: 'https://www.menturo.in',
            lastModified: new Date(),
        },
    ]
}