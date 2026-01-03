const extractDate = (date: Date) => ({
  year: date.getFullYear(),
  month: String(date.getMonth() + 1).padStart(2, '0'),
  day: String(date.getDate()).padStart(2, '0'),
});

export const formatDateDotted = (date: Date): string => {
  const {year, month, day} = extractDate(date);
  return `${year}.${month}.${day}`;
};

export const formatDateDashed = (date: Date): string => {
  const {year, month, day} = extractDate(date);
  return `${year}-${month}-${day}`;
};

export const isSameDate = (date1: Date, date2: Date): boolean => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}
