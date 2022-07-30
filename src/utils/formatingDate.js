export const getFormattedDate = ({ value }) => {
  return new Date(value).toLocaleDateString('ru-RU')
}
