export const formatText = (str: string) => {
  if (!str) return str;
  str = str.replace(/_/g, ' ');
  return str
    .split(" ")
    .map((word) => {
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(" ");
};

export const formatStateText = (str: string) => {
  if (!str) return str;
  str = str.toLowerCase().replace(/_/g, ' '); // Convert to lowercase and replace underscores with spaces
  return str.charAt(0).toUpperCase() + str.slice(1);
};
