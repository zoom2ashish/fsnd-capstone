export const getDate = (timestampInSeconds: number = 0) => {
  if (!isNaN(timestampInSeconds) && timestampInSeconds > 0) {
    const date = new Date(timestampInSeconds * 1000); // convert in Milliseconds
    return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
  } else {
    return "N/A";
  }
};