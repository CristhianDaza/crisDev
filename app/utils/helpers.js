export const siteUrl = 'https://cris-dev.com'

export const calculateYearsOfExperience = () => {
  const start = new Date(2018, 6, 1)
  const now = new Date()
  let years = now.getFullYear() - start.getFullYear()
  const month = now.getMonth() - start.getMonth()
  if (month < 0 || (month === 0 && now.getDate() < start.getDate())) {
    years--
  }
  return years
}

export const mainMenu = [
  { name: 'menu.home', id: '#home', order: 1 },
  { name: 'menu.projects', id: '#projects', order: 2 },
  { name: 'menu.experience', id: '#experience', order: 3 },
  { name: 'menu.skills', id: '#skills', order: 4 },
  { name: 'menu.contact', id: '#contact', order: 5 },
];

export const socialMediaLinks = [
  {
    name: 'social.github',
    url: 'https://github.com/CristhianDaza',
    icon: 'mdi:github',
    order: 1,
  },
  {
    name: 'social.linkedin',
    url: 'https://www.linkedin.com/in/cristhiandaza',
    icon: 'mdi:linkedin',
    order: 2,
  },
  {
    name: 'social.resume',
    url: 'https://drive.google.com/file/d/1X6agz63-sDAIfsmuuitAVO1O9gjzB6wy/view?usp=sharing',
    icon: 'mdi:file-account',
    order: 3,
  },
];

export const projects = [
  {
    id: 1,
    title: 'projects.redGlobal.title',
    shortDescription: 'projects.redGlobal.shortDescription',
    fullDescription: 'projects.redGlobal.fullDescription',
    technologies: [ 'Vue.js', 'Vite', 'TypeScript', 'Pinia', 'Tailwind CSS', 'Firebase (Auth/Firestore/Storage)', 'Cloudinary', 'EmailJS', 'XLSX'
    ],
    image: '/images/projects/redGlobalPromo.png',
    projectUrl: 'https://www.redglobalpromo.com.co/',
    githubUrl: 'https://github.com/CristhianDaza/redGlobal',
    featured: true,
    date: '2025',
    highlights: [
      'projects.redGlobal.highlights.highlight1',
      'projects.redGlobal.highlights.highlight2',
      'projects.redGlobal.highlights.highlight3',
      'projects.redGlobal.highlights.highlight4',
      'projects.redGlobal.highlights.highlight5',
    ],
  },
  {
    id: 2,
    title: 'projects.finControl.title',
    shortDescription: 'projects.finControl.shortDescription',
    fullDescription: 'projects.finControl.fullDescription',
    technologies: ['Vue.js', 'Vite', 'Chart.js', 'Firebase', 'Pinia'],
    image: '/images/projects/finControl.png',
    projectUrl: 'https://cris-dev.com/',
    featured: true,
    date: '2025',
    highlights: [
      'projects.finControl.highlights.highlight1',
      'projects.finControl.highlights.highlight2',
      'projects.finControl.highlights.highlight3',
      'projects.finControl.highlights.highlight4',
      'projects.finControl.highlights.highlight5',
    ],
  },
  {
    id: 3,
    title: 'projects.mega.title',
    shortDescription: 'projects.mega.shortDescription',
    fullDescription: 'projects.mega.fullDescription',
    technologies: ['Vue.js', 'Vite', 'TodoVue Components', 'Pinia', 'Firebase', 'PrimeVue', 'Tailwind CSS', 'Lodash', 'vue3-carousel'],
    image: '/images/projects/megapromocionales.png',
    projectUrl: 'https://megapromocionales.com.co/',
    githubUrl: 'https://github.com/CristhianDaza/megaprom',
    featured: false,
    date: '2024',
    highlights: [
      'projects.mega.highlights.highlight1',
      'projects.mega.highlights.highlight2',
      'projects.mega.highlights.highlight3',
      'projects.mega.highlights.highlight4',
      'projects.mega.highlights.highlight5',
    ],
  },
  {
    id: 4,
    title: 'projects.todoVue.title',
    shortDescription: 'projects.todoVue.shortDescription',
    fullDescription: 'projects.todoVue.fullDescription',
    technologies: ['Vue.js', 'Nuxt', 'Vite', 'Sass', 'TodoVue Components'],
    image: '/images/projects/TODOvue.png',
    projectUrl: 'https://tv-demo.netlify.app/',
    githubUrl: 'https://github.com/orgs/TODOvue/repositories',
    featured: false,
    date: '2023',
    highlights: [
      'projects.todoVue.highlights.highlight1',
      'projects.todoVue.highlights.highlight2',
      'projects.todoVue.highlights.highlight3',
      'projects.todoVue.highlights.highlight4',
      'projects.todoVue.highlights.highlight5',
    ],
  },
  {
    id: 6,
    title: 'projects.portfolio.title',
    shortDescription: 'projects.portfolio.shortDescription',
    fullDescription: 'projects.portfolio.fullDescription',
    technologies: ['Vue.js', 'Nuxt', 'Tailwind CSS'],
    image: '/images/projects/crisDev.png',
    githubUrl: 'https://github.com/CristhianDaza/crisDev',
    featured: false,
    date: '2025',
    highlights: [
      'projects.portfolio.highlights.highlight1',
      'projects.portfolio.highlights.highlight2',
      'projects.portfolio.highlights.highlight3',
      'projects.portfolio.highlights.highlight4'
    ],
  },
];

export const experiences = [
  {
    id: 1,
    company: 'experience.company1.name',
    position: 'experience.company1.position',
    description: 'experience.company1.description',
    startDate: { month: 7, year: 2022 },
    endDate: null,
    technologies: ['JavaScript', 'LitElement', 'Web Components', 'Cells', 'Polymer'],
    type: 'full-time',
  },
  {
    id: 2,
    company: 'experience.company2.name',
    position: 'experience.company2.position',
    description: 'experience.company2.description',
    startDate: { month: 12, year: 2021 },
    endDate: { month: 6, year: 2022 },
    technologies: ['Vue.js', 'NativeScript', 'TypeScript', 'Tailwind CSS'],
    type: 'full-time',
  },
  {
    id: 3,
    company: 'experience.company3.name',
    position: 'experience.company3.position',
    description: 'experience.company3.description',
    startDate: { month: 8, year: 2021 },
    endDate: { month: 11, year: 2021 },
    technologies: ['Vue.js', 'MicroFrontend', 'Vuetify', 'TypeScript', 'Vue Test Utils'],
    type: 'contract',
  },
  {
    id: 4,
    company: 'experience.company4.name',
    position: 'experience.company4.position',
    description: 'experience.company4.description',
    startDate: { month: 6, year: 2018 },
    endDate: { month: 7, year: 2021 },
    technologies: ['Vue.js', 'Vuetify', 'Firebase'],
    type: 'full-time',
  },
];

function experienceYears(startYear, startMonth = 1, endYear = null, endMonth = null) {
  const start = new Date(startYear, startMonth - 1)
  const end = endYear ? new Date(endYear, (endMonth || 1) - 1) : new Date()
  const diff = (end - start) / (1000 * 60 * 60 * 24 * 365.25)
  return Math.max(0, Math.floor(diff))
}

export const skillCategories = [
  {
    id: 'frontend',
    name:'skills.categories.frontend',
    icon: 'mdi:code-tags',
    color: 'var(--primary)',
    skills: [
      { name: 'JavaScript', icon: 'mdi:language-javascript', years: experienceYears(2018) },
      { name: 'Vue.js', icon: 'mdi:vuejs', years: experienceYears(2018) },
      { name: 'LitElement', icon: 'mdi:web', years: experienceYears(2022) },
      { name: 'Web Components', icon: 'mdi:puzzle', years: experienceYears(2022) },
      { name: 'TypeScript', icon: 'mdi:language-typescript', years: experienceYears(2021) },
      { name: 'Vuetify', icon: 'mdi:vuetify', years: experienceYears(2020, 1, 2022, 6) },
    ],
  },
  {
    id: 'styling',
    name: 'skills.categories.styling',
    icon: 'mdi:palette',
    color: 'var(--accent)',
    skills: [
      { name: 'CSS', icon: 'mdi:palette-outline', years: experienceYears(2018) },
      { name: 'Tailwind CSS', icon: 'mdi:tailwind', years: experienceYears(2021, 12, 2025, 6) },
    ],
  },
  {
    id: 'tools',
    name: 'skills.categories.tools',
    icon: 'mdi:tools',
    color: '#f59e0b',
    skills: [
      { name: 'Git', icon: 'mdi:git', years: experienceYears(2020) },
      { name: 'Firebase', icon: 'mdi:firebase', years: experienceYears(2018, 6, 2021, 7) },
      { name: 'Vue Test Utils', icon: 'mdi:test-tube', years: experienceYears(2021, 8, 2025, 11) },
    ],
  },
  {
    id: 'mobile',
    name: 'skills.categories.mobile',
    icon: 'mdi:cellphone',
    color: '#8b5cf6',
    skills: [
      { name: 'NativeScript',  icon: 'mdi:cellphone-cog', years: experienceYears(2021, 1, 2022, 12) },
      { name: 'Responsive Design', icon: 'mdi:monitor-cellphone', years: experienceYears(2018) },
    ],
  },
  {
    id: 'practices',
    name: 'skills.categories.practices',
    icon: 'mdi:target',
    color: '#10b981',
    skills: [
      { name: 'Accessibility', icon: 'mdi:accessibility', years: experienceYears(2022) },
      { name: 'Performance', icon: 'mdi:speedometer', years: experienceYears(2021) },
      { name: 'Testing', icon: 'mdi:flask', years: experienceYears(2021, 8, 2025, 11) },
      { name: 'Clean Code', icon: 'mdi:check-decagram', years: experienceYears(2018) },
    ],
  },
]
