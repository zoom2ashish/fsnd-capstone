export const getDate = (timestamp: number = 0) => {
  if (!isNaN(timestamp) && timestamp > 0) {
    const date = new Date(timestamp);
    return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
  } else {
    return "N/A";
  }
};