// HTML nodes references
const timeInInputElement = document.getElementById("timeInInput");
const timeOutInputElement = document.getElementById("timeOutInput");

const lunchCheckboxElement = document.getElementById("lunchTimeCheckbox")

const convertButtonElement = document.getElementById("convertButton");
const clearButtonElement = document.getElementById("clearButton");

// const resultDurationElement = document.getElementById("resultDuration");
const resultDecimalElement = document.getElementById("resultDecimal");

const footerVersionElement = document.getElementById("footerVersion");

// global variables
let lastInputValueLength = 0;


// event listeners
convertButtonElement.addEventListener("click", updateResult);
clearButtonElement.addEventListener("click", clearFields);

timeInInputElement.addEventListener("input", inputMask);
timeOutInputElement.addEventListener("input", inputMask);

// init routine
getVersionFromManifest();
recoverLocalStorageValues();


// functions
function recoverLocalStorageValues() {
  let recoveredCheckinTime = null;
  let recoveredCheckoutTime = null;

  chrome.storage.sync.get(["checkinTime", "checkoutTime"], ({checkinTime, checkoutTime}) => {
    recoveredCheckinTime = checkinTime;
    recoveredCheckoutTime = checkoutTime;

    if (!recoveredCheckinTime || !recoveredCheckoutTime) { return; }

    timeInInputElement.value = recoveredCheckinTime;
    timeOutInputElement.value = recoveredCheckoutTime;
  
    updateResult();
  });
}

function updateResult() {
  resultDecimalElement.value = calculateTime();
  // resultDurationElement.value = calculateDuration();
}

function calculateTime() {
  const checkinTime = timeInInputElement.value;
  chrome.storage.sync.set({checkinTime: checkinTime});

  const checkoutTime = timeOutInputElement.value;
  chrome.storage.sync.set({checkoutTime: checkoutTime});


  if (!checkinTime || !checkoutTime) {
    this.errorHandler();
    return;
  }

  const lunch = lunchCheckboxElement.checked ? 1 : 0;

  const result = convertToDecimal(checkoutTime) - convertToDecimal(checkinTime) - lunch;
  return result.toFixed(2);
}

// function calculateDuration() {}

function convertToDecimal(time) {
  const stringTime = time.split(":");
  const hours = parseInt(stringTime[0]);
  const minutes = parseInt(stringTime[1]);

  return hours + minutes / 60;
} 

function errorHandler() {
  // resultDurationElement.value = "e";
  resultDecimalElement.value = "e";

  return;
}

function clearFields() {
  timeInInputElement.value = "";
  chrome.storage.sync.set({checkinTime: null});

  timeOutInputElement.value = "";
  chrome.storage.sync.set({checkoutTime: null});

  // resultDurationElement.value = "";
  resultDecimalElement.value = "";
}

function inputMask(event) {
  const onlyNumberOrSeparator = /^[\d]+/;
  const inputValue = event.target.value;
  const lastDigit = inputValue.substr(inputValue.length - 1);

  // handles last length 
  const lastInputValueLengthLocal = lastInputValueLength;
  lastInputValueLength = inputValue.length;

  // max length
  if (inputValue.length > 5 ) { event.target.value = inputValue.slice(0, -1); }

  // do not run masking when deleting
  if (inputValue.length >= lastInputValueLengthLocal) {
    // valid first digit
    const regex0to2 = /^[0-2]/;
    if (inputValue.length === 1 && !regex0to2.test(lastDigit)) { event.target.value = inputValue.slice(0, -1); }

    // valid second digit
    const regexDigit = /^[\d]/;
    if (inputValue.length === 2 && !regexDigit.test(lastDigit)) { event.target.value = inputValue.slice(0, -1); }

    // auto includes separator after 2 digit
    if (inputValue.length === 2 && !inputValue.includes(":")) { event.target.value = inputValue + ":"; }

    // auto includes 0 if only 1 digit for hour
    if (inputValue.length === 2 && inputValue.includes(":")) { event.target.value = "0" + inputValue; }

    // valid third digit
    const regex0to5 = /^[0-5]/;
    if (inputValue.length === 4 && !regex0to5.test(lastDigit)) { event.target.value = inputValue.slice(0, -1); }

    // valid last digit
    if (inputValue.length === 5 && !regexDigit.test(lastDigit)) { event.target.value = inputValue.slice(0, -1); }
  }
}

function getVersionFromManifest() {
  const manifestData = chrome.runtime.getManifest();
  footerVersionElement.innerText = manifestData.version;
}