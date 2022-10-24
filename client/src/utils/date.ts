export const timeSinceDate = (date: string) => {
  let seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);

  let interval = seconds / 31536000;

  if (interval > 1) {
    const years = Math.floor(interval);
    return years + ' year' + (years > 1 ? 's' : '');
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    const months = Math.floor(interval);
    return months + ' month' + (months > 1 ? 's' : '');
  }
  interval = seconds / 86400;
  if (interval > 1) {
    const days = Math.floor(interval);
    return days + ' day' + (days > 1 ? 's' : '');
  }
  interval = seconds / 3600;
  if (interval > 1) {
    const hours = Math.floor(interval);
    return hours + ' hour' + (hours > 1 ? 's' : '');
  }
  interval = seconds / 60;
  if (interval > 1) {
    const mins = Math.floor(interval);
    if (mins === 1) return mins + ' minute';
    return mins + ' minutes';
  }
  const secs = Math.floor(seconds);
  if (secs === 1) return secs + ' second';
  return Math.floor(seconds) + ' seconds';
};
