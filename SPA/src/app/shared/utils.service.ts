export function getTimePassed(publishDate: Date): string {
  const min = 1000 * 60;
  const hour = 60 * min;
  const day = 24 * hour;
  const week = 7 * day;
  const month = 30 * day;
  const year = 12 * month;

  const published = publishDate.getTime();
  const current = new Date().getTime();

  const difference = current - published;

  if (difference > 2 * year) {
    return Math.round(difference / year) + ' years ago';
  } else if (difference > 2 * month) {
    return Math.round(difference / month) + ' months ago';
  } else if (difference > 2 * week) {
    return Math.round(difference / week) + ' weeks ago';
  } else if (difference > 2 * day) {
    return Math.round(difference / day) + ' days ago';
  } else if (difference > 2 * hour) {
    return Math.round(difference / hour) + ' hours ago';
  } else if (difference > 2 * min) {
    return Math.round(difference / min) + ' minutes ago';
  } else {
    return 'Just now!';
  }
}

export function getUrlfiedString(uglyString: string): string {
  return uglyString.toLowerCase().replace(/ /g, '-');
}
