export const useTheme = () => {
  const theme = useState('theme', () => 'default')
  const STORAGE_KEY = 'crisDev_theme'

  const themes = [
    { value: 'default', label: 'Default', icon: 'mdi:theme-light-dark' },
    { value: 'dark', label: 'Dark', icon: 'mdi:weather-night' },
    { value: 'light', label: 'Light', icon: 'mdi:white-balance-sunny' }
  ]

  const initializeTheme = () => {
    if (typeof window === 'undefined') return

    const savedTheme = localStorage.getItem(STORAGE_KEY)
    
    if (savedTheme && themes.some(t => t.value === savedTheme)) {
      theme.value = savedTheme
      applyTheme(savedTheme)
    } else {
      theme.value = 'default'
      localStorage.setItem(STORAGE_KEY, 'default')
      applyTheme('default')
    }
  }

  const applyTheme = (newTheme) => {
    if (typeof document === 'undefined') return
    const html = document.documentElement
    html.classList.remove('default', 'dark', 'light')
    html.classList.add(newTheme)
  }

  const changeTheme = (newTheme) => {
    if (typeof window === 'undefined') return
    
    theme.value = newTheme
    localStorage.setItem(STORAGE_KEY, newTheme)
    applyTheme(newTheme)
  }

  return {
    theme,
    themes,
    initializeTheme,
    changeTheme
  }
}

