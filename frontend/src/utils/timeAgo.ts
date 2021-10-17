export const calculateTime = (createdAt: string): string => {
  const secondsDifference = (new Date().getTime() - +createdAt) / 1000; // seconds of difference between when the post was created and current date.

  let timeAgo = secondsDifference.toString();
  if (secondsDifference < 60) {
    timeAgo = Math.round(+timeAgo) + " seconds ago";
  } else if (secondsDifference < 3600) {
    timeAgo = Math.round(+timeAgo / 60) + " minutes ago"; // 1 hour
  } else if (secondsDifference < 86400) {
    timeAgo = Math.round(+timeAgo / 3600) + " hours ago";
  } else timeAgo = Math.round(+timeAgo / 86400) + " days ago";

  return timeAgo;
};
