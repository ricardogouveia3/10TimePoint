const timeInInputElement = document.getElementById("timeInInput");
const timeOutInputElement = document.getElementById("timeOutInput");

const convertButtonElement = document.getElementById("convertButton");

const spanResultElement = document.getElementById("resultSpan");

convertButtonElement.addEventListener("click", () => {
  const timeIn = timeInInputElement.value;
  const timeOut = timeOutInputElement.value;
  
  spanResultElement.textContent = calculateDuration(timeIn, timeOut);
}, {});

function calculateDuration(timeIn, timeOut) {
  const timeStampIn = createDateWithTime(timeIn);
  const timeStapOut = createDateWithTime(timeOut);

  const timeDiff = timeStapOut - timeStampIn;

  if (timeDiff < 0) { return 'error' }

  return milisecondsToTime(timeDiff);
}

function createDateWithTime(time) {
  const createdDate = new Date();

  const timeHours = time.split(":")[0];
  const timeMinutes = time.split(":")[1];

  createdDate.setHours(timeHours);
  createdDate.setMinutes(timeMinutes);
  createdDate.setSeconds(00);
  
  return createdDate.getTime();
}

function milisecondsToTime(duration) {
  let minutes = Math.floor((duration / (1000 * 60)) % 60);
  let hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

  hours = (hours < 10) ? "0" + hours : hours;
  minutes = (minutes < 10) ? "0" + minutes : minutes;

  return hours + ":" + minutes;
}