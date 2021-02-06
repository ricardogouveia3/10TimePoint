const timeInInputElement = document.getElementById("timeInInput");
const timeOutInputElement = document.getElementById("timeOutInput");

const convertButtonElement = document.getElementById("convertButton");

const spanResultElement = document.getElementById("resultSpan");
const spanDecimalResultElement = document.getElementById("resultDecimalSpan");

convertButtonElement.addEventListener("click", () => {
  const timeIn = timeInInputElement.value;
  const timeOut = timeOutInputElement.value;
  
  const timeDiff = calculateDuration(timeIn, timeOut);

  spanResultElement.textContent = milisecondsToTime(timeDiff);
  spanDecimalResultElement.textContent = millisecondsToDecimalHours(timeDiff)
}, {});

function calculateDuration(timeIn, timeOut) {
  const timeStampIn = createDateWithTime(timeIn);
  const timeStapOut = createDateWithTime(timeOut);

  const timeDiff = timeStapOut - timeStampIn;

  if (timeDiff < 0) { return 'error' }

  return timeDiff;
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

function millisecondsToDecimalHours(time) {
  time = milisecondsToTime(time);

  const decimalMinutes = parseInt( ( time.split(':')[1] / 6 ) * 10 );
  const decimalHours = parseInt( time.split(':')[0] );

  const fixedTimeString = decimalHours + '.' + ( decimalMinutes < 10 ? '0' : '' ) + decimalMinutes;

  return parseFloat(fixedTimeString).toFixed(2);
}
