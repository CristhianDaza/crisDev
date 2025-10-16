export const useLanguage = () => {
  const { locale, locales, setLocale } = useI18n()
  const STORAGE_KEY = 'crisDev_language'

  const initializeLanguage = async () => {
    if (typeof window === 'undefined') return

    const savedLanguage = localStorage.getItem(STORAGE_KEY)
    
    if (savedLanguage) {
      const validLocale = locales.value.find(l => l.code === savedLanguage)
      if (validLocale) {
        await setLocale(savedLanguage)
        return
      }
    }

    localStorage.setItem(STORAGE_KEY, locale.value)
  }

  const changeLanguage = async (newLocale) => {
    if (typeof window === 'undefined') return
    
    await setLocale(newLocale)
    localStorage.setItem(STORAGE_KEY, newLocale)
  }

  return {
    locale,
    locales,
    initializeLanguage,
    changeLanguage
  }
}
