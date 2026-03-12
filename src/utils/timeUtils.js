export const minutesToMilliseconds = (minutes) => {
  return minutes * 60000;
};

export const isWithinOfficeTime = (start, end) => {

  const now = new Date();

  const currentTime = now.getHours() * 60 + now.getMinutes();

  const [startHour, startMin] = start.split(":").map(Number);
  const [endHour, endMin] = end.split(":").map(Number);

  const startTime = startHour * 60 + startMin;
  const endTime = endHour * 60 + endMin;

  return currentTime >= startTime && currentTime <= endTime;

};