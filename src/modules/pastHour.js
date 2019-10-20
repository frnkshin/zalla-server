const pastHour = (date) => {
  let now = Date.now();
  let then = Date.parse(date);
  let diff = Math.abs(then - now);
  let mins = Math.floor((diff / 1000) / 60);

  if (mins > 60) return true;
  return false;
};

module.exports = pastHour;