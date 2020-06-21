const s = 1000; // 1 s
const m = s * 60; // 1 m
const h = m * 60; // 1 h
const d = h * 24; // 1 d
const w = d * 7; // 1 w

const RelativeTimeConfig = [
  { base: s, max: 10 * s, text: '{x} moment', pluPrefix: 'few' }, // 1s -> 10s
  { base: s, max: m, text: '{x} second' }, // 1s -> 1m
  { base: m, max: h, text: '{x} minute' }, // 1m -> 1h
  { base: h, max: d, text: '{x} hour', singPrefix: 'an' }, // 1h -> 1d
  { base: d, max: w, text: '{x} day' }, // 1d -> 1w
];

const getRelativePosition = (timeDiff: number) =>
  RelativeTimeConfig.find(config => timeDiff < config.max);

const prefix = (relativeCount: number, relativePosition) => {
  if (relativeCount > 1) {
    return relativePosition.pluPrefix || relativeCount;
  }
  return relativePosition.singPrefix || 'a';
};

/**
 * Get the elapse time from a date object
 * @param {Date|string} date
 * @returns {string}
 */
export const formatDate = (date: Date | string | number) => {
  const dateObj = date instanceof Date ? date : new Date(date);
  // get the time difference in seconds
  const timeDiff = (Date.now() - dateObj.getTime());

  const relativePosition = getRelativePosition(timeDiff);

  if (relativePosition) {
    // take care of special 10 second case, as will never go above
    const relativeCount = Math.round(timeDiff / relativePosition.base);
    const relativeStr = relativePosition.text.replace(/{x}/, prefix(relativeCount, relativePosition));

    return `${relativeStr}${relativeCount > 1 ? 's' : ''} ago`;
  }

  return date.toDateString();
};
