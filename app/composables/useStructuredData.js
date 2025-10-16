import { siteUrl } from '@/utils/helpers'

export const useStructuredData = () => {
  const generateWebsiteSchema = () => {
    return {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'CrisDev',
      description: 'Portfolio de Cristhian Daza - Frontend Developer',
      url: siteUrl,
      author: {
        '@type': 'Person',
        name: 'Cristhian Daza',
        jobTitle: 'Frontend Developer',
        url: siteUrl,
        sameAs: [
          'https://github.com/CristhianDaza',
          'https://www.linkedin.com/in/cristhiandaza'
        ]
      },
      potentialAction: {
        '@type': 'SearchAction',
        target: `${siteUrl}/#search?q={search_term_string}`,
        'query-input': 'required name=search_term_string'
      }
    }
  }

  const generateBreadcrumbSchema = (items) => {
    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: item.url
      }))
    }
  }

  const generatePortfolioSchema = (projects) => {
    return {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: 'Proyectos Destacados',
      description: 'Portfolio de proyectos de desarrollo frontend',
      itemListElement: projects.map((project, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'CreativeWork',
          name: project.title,
          description: project.shortDescription,
          url: project.projectUrl || `${siteUrl}/#project-${project.id}`,
          image: project.image,
          author: {
            '@type': 'Person',
            name: 'Cristhian Daza'
          },
          keywords: project.technologies.join(', ')
        }
      }))
    }
  }

  return {
    generateWebsiteSchema,
    generateBreadcrumbSchema,
    generatePortfolioSchema
  }
}
