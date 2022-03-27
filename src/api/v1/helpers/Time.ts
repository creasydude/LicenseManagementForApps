export const compareTime = (time: string) => {
  const nowTime: number = new Date().getTime();
  const expireTime: number = new Date(time).getTime();
  return expireTime > nowTime;
  // if time not expire return true
};

export const addTime = (minutes: number) => {
  const nowTime: number = new Date().getTime();
  const newTime: number = nowTime + minutes * 60000;
  return new Date(newTime).toISOString();
};

export const compareDays = (time: string) => {
  const nowTime: number = new Date().getTime();
  const expireTime: number = new Date(time).getTime();
  const dayUntilInMs: number = 24 * 3600 * 1000;
  return Math.floor((expireTime - nowTime) / dayUntilInMs);
};
