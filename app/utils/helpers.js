import TODOvue from '@/assets/images/projects/TODOvue.png';
import crisDev from '@/assets/images/projects/crisDev.png';
import finControl from '@/assets/images/projects/finControl.png';
import megapromocionales from '@/assets/images/projects/megapromocionales.png';
import redGlobalPromo from '@/assets/images/projects/redGlobalPromo.png';

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
    image: redGlobalPromo,
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
    image: finControl,
    projectUrl: 'https://fin-control.netlify.app/',
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
    image: megapromocionales,
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
    image: TODOvue,
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
    image: crisDev,
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
