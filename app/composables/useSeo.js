import { calculateYearsOfExperience } from '@/utils/helpers'
import { siteUrl } from '@/data/constants'

export const useSeo = () => {
  const { t, locale } = useI18n()

  const setProjectSeo = (project) => {
    if (!project) return

    const projectTitle = t(project.title)
    const projectDescription = t(project.shortDescription)
    const projectUrl = `${siteUrl}/#project-${project.id}`
    const imageUrl = project.image || `${siteUrl}/og-image.jpg`

    useHead({
      htmlAttrs: {
        lang: locale.value
      },
      title: `${projectTitle} | Cristhian Daza`,
      meta: [
        { name: 'description', content: projectDescription },
        { name: 'keywords', content: `${project.technologies.join(', ')}, frontend developer, cristhian daza, portfolio` },

        { property: 'og:title', content: `${projectTitle} | Cristhian Daza` },
        { property: 'og:description', content: projectDescription },
        { property: 'og:url', content: projectUrl },
        { property: 'og:image', content: imageUrl },
        { property: 'og:image:secure_url', content: imageUrl },
        { property: 'og:image:alt', content: projectTitle },
        { property: 'og:type', content: 'website' },
        { property: 'og:locale', content: locale.value === 'es' ? 'es_ES' : 'en_US' },

        { name: 'twitter:title', content: `${projectTitle} | Cristhian Daza` },
        { name: 'twitter:description', content: projectDescription },
        { name: 'twitter:image', content: imageUrl },
        { name: 'twitter:image:alt', content: projectTitle },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:site', content: '@CristhianDaza' },
      ],
      link: [
        { rel: 'canonical', href: projectUrl }
      ],
      script: [
        {
          type: 'application/ld+json',
          children: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'CreativeWork',
            name: projectTitle,
            description: projectDescription,
            author: {
              '@type': 'Person',
              name: 'Cristhian Daza',
              url: siteUrl
            },
            url: project.projectUrl || projectUrl,
            image: imageUrl,
            keywords: project.technologies.join(', '),
            datePublished: `${project.date}-01-01`,
            inLanguage: locale.value
          })
        }
      ]
    })
  }

  const resetSeo = () => {
    const defaultTitle = 'Cristhian Daza | Frontend Developer'
    const years = calculateYearsOfExperience()
    const defaultDescription = locale.value === 'es'
      ? `Desarrollador Frontend con más de ${years} años de experiencia creando experiencias web rápidas, accesibles y centradas en el usuario.`
      : `Frontend developer with over ${years} years of experience building modern, accessible, and scalable interfaces using Vue, LitElement, and Tailwind. Passionate about clean code, modular architecture, and user-centered experiences.`

    useHead({
      htmlAttrs: {
        lang: locale.value
      },
      title: defaultTitle,
      meta: [
        { name: 'description', content: defaultDescription },
        { name: 'keywords', content: 'frontend developer, vue.js, nuxt, javascript, typescript, tailwind css, web development, cristhian daza' },

        { property: 'og:title', content: defaultTitle },
        { property: 'og:description', content: defaultDescription },
        { property: 'og:url', content: siteUrl },
        { property: 'og:image', content: `${siteUrl}/og-image.jpg` },
        { property: 'og:image:secure_url', content: `${siteUrl}/og-image.jpg` },
        { property: 'og:image:alt', content: 'Cristhian Daza - Frontend Developer Portfolio' },
        { property: 'og:locale', content: locale.value === 'es' ? 'es_ES' : 'en_US' },

        { name: 'twitter:title', content: defaultTitle },
        { name: 'twitter:description', content: defaultDescription },
        { name: 'twitter:image', content: `${siteUrl}/og-image.jpg` },
        { name: 'twitter:image:alt', content: 'Cristhian Daza - Frontend Developer Portfolio' },
      ],
      link: [
        { rel: 'canonical', href: siteUrl }
      ]
    })
  }

  const setSectionSeo = (section) => {
    const sections = {
      projects: {
        title: t('menu.projects'),
        description: locale.value === 'es'
          ? 'Proyectos destacados de desarrollo frontend con Vue.js, Nuxt y tecnologías modernas'
          : 'Featured frontend development projects with Vue.js, Nuxt and modern technologies'
      },
      experience: {
        title: t('menu.experience'),
        description: locale.value === 'es'
          ? 'Experiencia profesional como Frontend Developer en diferentes empresas y proyectos'
          : 'Professional experience as Frontend Developer in different companies and projects'
      },
      skills: {
        title: t('menu.skills'),
        description: locale.value === 'es'
          ? 'Tecnologías y habilidades en desarrollo frontend: Vue.js, Nuxt, JavaScript, TypeScript, Tailwind CSS'
          : 'Frontend development technologies and skills: Vue.js, Nuxt, JavaScript, TypeScript, Tailwind CSS'
      },
      contact: {
        title: t('menu.contact'),
        description: locale.value === 'es'
          ? 'Ponte en contacto para proyectos, colaboraciones o consultas'
          : 'Get in touch for projects, collaborations or inquiries'
      }
    }

    const sectionData = sections[section]
    if (!sectionData) return

    useHead({
      htmlAttrs: {
        lang: locale.value
      },
      title: `${sectionData.title} | Cristhian Daza`,
      meta: [
        { name: 'description', content: sectionData.description },
        { property: 'og:title', content: `${sectionData.title} | Cristhian Daza` },
        { property: 'og:description', content: sectionData.description },
        { property: 'og:url', content: `${siteUrl}/#${section}` },
        { property: 'og:locale', content: locale.value === 'es' ? 'es_ES' : 'en_US' },
        { name: 'twitter:title', content: `${sectionData.title} | Cristhian Daza` },
        { name: 'twitter:description', content: sectionData.description },
      ],
      link: [
        { rel: 'canonical', href: `${siteUrl}/#${section}` }
      ]
    })
  }

  return {
    setProjectSeo,
    resetSeo,
    setSectionSeo
  }
}
