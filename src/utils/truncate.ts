export const truncateParagraph = (paragraph: string, maxLength: number) => {
  return paragraph.length > maxLength
    ? paragraph.substring(0, maxLength) + "..."
    : paragraph;
};