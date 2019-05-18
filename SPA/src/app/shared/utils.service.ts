export function getTimePassed(publishDate: Date, isShort?: boolean): string {
  let formattedDate = '';

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
    formattedDate = Math.round(difference / year) + ' years ago';
  } else if (difference > 2 * month) {
    formattedDate = Math.round(difference / month) + ' months ago';
  } else if (difference > 2 * week) {
    formattedDate = Math.round(difference / week) + ' weeks ago';
  } else if (difference > 2 * day) {
    formattedDate = Math.round(difference / day) + ' days ago';
  } else if (difference > 2 * hour) {
    formattedDate = Math.round(difference / hour) + ' hours ago';
  } else if (difference > 2 * min) {
    formattedDate = Math.round(difference / min) + ' minutes ago';
  } else {
    formattedDate = isShort ? Math.round(difference / min) + ' m' : 'Just now!';
  }

  if (isShort) {
    const slices = formattedDate.split(' ');
    formattedDate = slices[0];

    if (slices[1] === 'months') {
      formattedDate += 'mo';
    } else if (slices[1] === 'minutes') {
      formattedDate += 'min';
    } else {
      formattedDate += slices[1][0];
    }
  }

  return formattedDate;
}

export function getUrlfiedString(uglyString: string): string {
  return uglyString.toLowerCase().replace(/ /g, '-');
}

export function getColourFromIndex(index: number): string {
  let colour = '';

  if (index < 10) {
    colour = '#00e676';
  } else if (index < 30) {
    colour = '#1de9b6';
  } else if (index < 60) {
    colour = '#00e5ff';
  } else if (index < 80) {
    colour = '#00b0ff';
  } else {
    colour = '#2979ff';
  }

  return colour;
}

export function getDateYYYYMMDD(date: Date) {
  let day = '' + date.getDate();
  if (date.getDate() < 10) {
    day = '0' + date.getDate();
  }
  let month = '' + (date.getMonth() + 1);
  if (date.getMonth() + 1 < 10) {
    month = '0' + (date.getMonth() + 1);
  }
  return (date.getUTCFullYear() + '-' + month + '-' + day);
}
