export const formatText = (str: string) => {
  if (!str) return str;
  str = str.replace(/_/g, ' ');
  return str.split(' ').map(word => {
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  }).join(' ');
};
