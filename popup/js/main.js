const timeInInputElement = document.getElementById("timeInInput");
const timeOutInputElement = document.getElementById("timeOutInput");

const convertButtonElement = document.getElementById("convertButton");
const switchModeButtonElement = document.getElementById("switchModeButton");

const spanResultElement = document.getElementById("resultSpan");
const spanDecimalResultElement = document.getElementById("resultDecimalSpan");

const timeOutContainerElement = document.getElementById("timeOutInputContainerElement");
const durationContainerElement = document.getElementById("durationResultContainerElement");

let lastInputValueLength = 0;

const applicationState = {
  mode: 0
}

convertButtonElement.addEventListener("click", () => {
  const timeIn = timeInInputElement.value;
  const timeOut = timeOutInputElement.value;
  
  const timeDiff = calculateDuration(timeIn, timeOut);

  if ( timeDiff < 0 || isNaN(timeDiff) ) {
    errorHandler();
  } else {
    spanResultElement.textContent = milisecondsToTime(timeDiff);
    spanDecimalResultElement.textContent = milisecondsToDecimalHours(timeDiff);
  }
}, {});

switchModeButtonElement.addEventListener("click", () => {
  toogleApplicationMode();
}, {})

timeInInputElement.addEventListener("input", inputMask);

timeOutInputElement.addEventListener("input", inputMask);

function toogleApplicationMode() {
  const workingHoursTextContent = "Switch to Working Hours";
  const timeInOutTextContent = "Switch to time in n out";

  switch (applicationState.mode) {
    case 1:
      applicationState.mode = 0;
      switchModeButtonElement.textContent = workingHoursTextContent;

      durationContainerElement.style.display = 'block';
      timeOutContainerElement.style.display = 'flex';
      
      break;
  
    case 0:
    default:
      applicationState.mode = 1;
      switchModeButtonElement.textContent = timeInOutTextContent;

      durationContainerElement.style.display = 'none';
      timeOutContainerElement.style.display = 'none';

      break;
  }
}

function calculateDuration(timeIn, timeOut) {
  if (applicationState.mode === 1) {
    timeOut = timeIn;
    timeIn = "00:00";
  }

  const timeStampIn = createDateWithTime(timeIn);
  const timeStapOut = createDateWithTime(timeOut);

  const timeDiff = timeStapOut - timeStampIn;

  if (timeDiff < 0) {
    errorHandler();
    return;
  }

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

function milisecondsToDecimalHours(time) {
  time = milisecondsToTime(time);

  const decimalMinutes = parseInt( ( time.split(':')[1] / 6 ) * 10 );
  const decimalHours = parseInt( time.split(':')[0] );

  const fixedTimeString = decimalHours + '.' + ( decimalMinutes < 10 ? '0' : '' ) + decimalMinutes;

  return parseFloat(fixedTimeString).toFixed(2);
}

function errorHandler() {
  spanResultElement.textContent = "e";
  spanDecimalResultElement.textContent = "e";

  return;
}

function inputMask(event) {
  const onlyNumberOrSeparator = /^[\d:]+/;
  const inputValue = event.target.value;
  const lastDigit = inputValue.substr(inputValue.length - 1);

  // handles last length 
  const lastInputValueLengthLocal = lastInputValueLength;
  lastInputValueLength = inputValue.length;

  // max length & valid digits
  if (inputValue.length > 5 || !onlyNumberOrSeparator.test(lastDigit)) { event.target.value = inputValue.slice(0, -1); }

  // do not run masking when deleting
  if (inputValue.length > lastInputValueLengthLocal) {

    // auto includes separator after 2 digit
    if (inputValue.length === 2 && !inputValue.includes(":")) { event.target.value = inputValue + ":"; }

    // auto includes 0 if only 1 digit for hour
    if (inputValue.length === 2 && inputValue.includes(":")) { event.target.value = "0" + inputValue; }
  }
}
