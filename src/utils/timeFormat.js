// Define the options for the date format
const options = { year: "numeric", month: "2-digit", day: "2-digit" };

// Create an Intl.DateTimeFormat object with the specified options
const formatter = new Intl.DateTimeFormat(['ban', 'id'], options);

export const formatDate = (date) => {
  return formatter.format(date);
};
