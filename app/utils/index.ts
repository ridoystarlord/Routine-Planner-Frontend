export function formatDateToYYYYMMDD(date: Date) {
  if (!(date instanceof Date)) {
    console.error("The provided parameter is not a Date object.");
    return null;
  }

  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");

  return `${year}-${month}-${day}`;
}
