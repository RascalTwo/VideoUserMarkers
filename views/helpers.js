module.exports = {
  secondsToHMS(seconds, delimiters = '::', minimalPlaces = 1) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor((seconds % 3600) % 60);
    return (
      (h > 0 || minimalPlaces >= 3 ? h.toString().padStart(2, '0') + delimiters[0] : '') +
      (m > 0 || minimalPlaces >= 2 ? m.toString().padStart(2, '0') + delimiters[1] : '') +
      (s.toString().padStart(2, '0') + (delimiters[2] || ''))
    );
  },
  hmsToSeconds(hms) {
    return hms
      .split(/(\d+[a-z]+)/i)
      .filter(Boolean)
      .reduce((seconds, string) => {
        const multiplier = string.endsWith('h') ? 3600 : string.endsWith('m') ? 60 : 1;
        console.log(parseInt(string), multiplier, parseInt(string) * multiplier);
        return seconds + parseInt(string) * multiplier;
      }, 0);
  },
};