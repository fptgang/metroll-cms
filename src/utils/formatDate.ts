export const formatDate = (dateString: string) => {
  const seconds = parseFloat(dateString); // Convert to number
  const milliseconds = Math.floor(seconds * 1000); // Truncate to milliseconds
  const date = new Date(milliseconds);
  return date.toLocaleString();
};
