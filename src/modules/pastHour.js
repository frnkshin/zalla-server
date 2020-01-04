const pastHour = (date) => {
  const now = Date.now();
  const then = Date.parse(date);
  const diff = Math.abs(then - now);
  const mins = Math.floor((diff / 1000) / 60);

  if (mins > 60) return true;
  return false;
};

module.exports = pastHour;
