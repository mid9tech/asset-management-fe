export const formatText = (str: string) => {
  if (!str) return str;
  return str
    .split(" ")
    .map((word) => {
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(" ");
};

export const formatStateText = (str: string) => {
  if (!str) return str;
  return str
    .split(/[_\s]/)
    .map((word) => {
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(" ");
};
