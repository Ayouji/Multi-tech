const WORKING_HOURS = {
  mon: { start: 9, end: 19 },
  tue: { start: 9, end: 19 },
  wed: { start: 9, end: 19 },
  thu: { start: 9, end: 19 },
  fri: { start: 9, end: 19 },
  sat: { start: 9, end: 15 },
  sun: { start: null, end: null }
};

export function calculateAvailability(tasks) {
  let currentDate = new Date();
  if (currentDate.getHours() < 9) currentDate.setHours(9, 0, 0, 0);
  
  const pendingTasks = tasks.filter(t => t.statut === 'pending' && !t.task_libre);
  
  for (let task of pendingTasks) {
    let remainingDuration = task.duree || 0;
    while (remainingDuration > 0) {
      const days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
      const dayOfWeek = days[currentDate.getDay()];
      const dayHours = WORKING_HOURS[dayOfWeek];
      
      if (!dayHours.start) {
        currentDate.setDate(currentDate.getDate() + 1);
        currentDate.setHours(9, 0, 0, 0);
        continue;
      }
      
      let currentHour = currentDate.getHours();
      let currentMinutes = currentDate.getMinutes() / 60;
      let currentTime = currentHour + currentMinutes;
      
      let availableHours = dayHours.end - Math.max(currentTime, dayHours.start);
      
      if (availableHours <= 0) {
        currentDate.setDate(currentDate.getDate() + 1);
        currentDate.setHours(WORKING_HOURS[days[currentDate.getDay()]].start || 9, 0, 0, 0);
        continue;
      }
      
      const hoursToUse = Math.min(remainingDuration, availableHours);
      remainingDuration -= hoursToUse;
      
      if (remainingDuration > 0) {
        currentDate.setDate(currentDate.getDate() + 1);
        currentDate.setHours(9, 0, 0, 0);
      } else {
        const newHour = Math.floor(currentTime + hoursToUse);
        const newMinutes = Math.round((currentTime + hoursToUse - newHour) * 60);
        currentDate.setHours(newHour, newMinutes, 0, 0);
      }
    }
  }
  return currentDate;
}
