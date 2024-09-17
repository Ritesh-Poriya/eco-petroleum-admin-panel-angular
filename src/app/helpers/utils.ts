export function setStartDate(date) {
  let newStartDate = date == undefined ? new Date() : new Date(date);
  newStartDate.setHours(0, 0, 0, 0);
  return newStartDate.toISOString();
}

export function setEndDate(date) {
  let newEndDate = date == undefined ? new Date() : new Date(date);
  newEndDate.setHours(23, 59, 59, 999);
  return newEndDate.toISOString();
}

export function getCurrentWeek(current) {
  let week = new Array();
  // Starting Monday not Sunday
  current.setDate(current.getDate() - current.getDay() + 1);
  for (let i = 0; i < 7; i++) {
    week.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }
  return week;
}
