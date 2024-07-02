export const formatDateCustome = (
  dateString: string,
  format: string
): string => {

  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  if (format === "DMY") {
    return `${day}-${month}-${year}`;
  } else if (format === "YMD") {
    return `${year}-${month}-${day}`;
  } else if (format === "ISO") {
    return new Date(date)
      .toLocaleDateString("pt-br")
      .split("/")
      .reverse()
      .join("-"); // Returns yyyy-mm-dd
  }
  return dateString;
};
