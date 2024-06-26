// Define the options for the date format
const options = {day: "2-digit", month: "2-digit",  year: "numeric",  };

// Create an Intl.DateTimeFormat object with the specified options
const formatter = new Intl.DateTimeFormat(['ban', 'id'], options);

export const formatDate = (date) => {
  return formatter.format(date);
};
