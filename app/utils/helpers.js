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
