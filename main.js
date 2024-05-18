/* Variables */
// Elements needed from the DOM to handle the logic of the app
const bill = document.getElementById("bill");
const radioButtons = document.querySelectorAll(".form__input--radio");
const custom = document.getElementById("custom");
const numberOfPeople = document.getElementById("numberOfPeople");
const tipAmountValue = document.getElementById("tipAmountValue");
const totalValue = document.getElementById("totalValue");
const resetButton = document.getElementById("resetButton");
const inputContainers = document.querySelectorAll(".form__input-container");
const radioLabels = document.querySelectorAll(".form__label--radio");
const billErrorMessage = document.getElementById("billError");
const tipErrorMessage = document.getElementById("tipError");
const peopleErrorMessage = document.getElementById("peopleError");
// Regex to validate the inputs
const billRegex = /^[0-9.]*$/;
const customAndPeopleRegex = /^[0-9]*$/;
// Variables to handle the state of the inputs
let isBillValueSet = false;
let isRadioButtonSelected = false;
let isCustomValueSet = false;
let isNumberOfPeopleSet = false;
// Variable to handle the state of the reset button
let isButtonResetActive = false;
// Variables to handle the values of the inputs
let billValue = 0;
let tipValue = 0;
let customValue = 0;
let numberOfPeopleValue = 0;
// Variables to handle the values of the tip and total per person
let tipAmountPerPerson = 0;
let totalPerPerson = 0;

/* Functions */
// Function to validate the input with a regex
function validateInputWithRegex(event, regex) {
  if (!regex.test(event.key)) {
    event.preventDefault();
  }
}

// Function to deselect the radio buttons
function deselectRadioButtons() {
  radioButtons.forEach((radioButton) => {
    radioButton.checked = false;
  });
}

// Function to remove the selection styles of the radio labels
function removeRadioLabelSelectionStyles() {
  radioLabels.forEach((radioLabel) => {
    radioLabel.classList.remove("selected");
  });
}

// Function to display error messages
function displayErrorMessages(errorMessageElement, containerOrInputElement) {
  errorMessageElement.classList.add("invalid");
  containerOrInputElement.classList.add("invalid");
}

// Function to clean error messages
function cleanErrorMessages(errorMessageElement, containerOrInputElement) {
  errorMessageElement.classList.remove("invalid");
  containerOrInputElement.classList.remove("invalid");
}

// Function to check if the tip calculation can be performed
function canCalculateTip() {
  // Checking if all the values necessary to calculate the tip are set
  if (
    isBillValueSet &&
    (isRadioButtonSelected || isCustomValueSet) &&
    isNumberOfPeopleSet
  ) {
    if (isRadioButtonSelected) {
      calculateTip(billValue, tipValue, numberOfPeopleValue);
    } else {
      calculateTip(billValue, customValue, numberOfPeopleValue);
    }
    // Activating the reset button
    isButtonResetActive = true;
    resetButton.classList.add("active");
  } else {
    // Setting the tip and total per person values to zero and updating the DOM
    tipAmountPerPerson = 0;
    totalPerPerson = 0;
    tipAmountValue.textContent = "$0.00";
    totalValue.textContent = "$0.00";
    // Deactivating the reset button
    isButtonResetActive = false;
    resetButton.classList.remove("active");
  }
}

// Function to calculate the tip
function calculateTip(bill, tipValue, numberOfPeople) {
  // Calculating the tip and total per person
  const tip = bill * (tipValue / 100);
  tipAmountPerPerson = tip / numberOfPeople;
  totalPerPerson = bill / numberOfPeople + tipAmountPerPerson;
  // Rounding the values to two decimal places
  const tipAmountPerPersonString = tipAmountPerPerson.toFixed(2);
  const totalPerPersonString = totalPerPerson.toFixed(2);
  // Updating the DOM with the calculated values
  tipAmountValue.textContent = `$${tipAmountPerPersonString}`;
  totalValue.textContent = `$${totalPerPersonString}`;
}

/* Events */
// Events for the input containers (bill and number of people)
inputContainers.forEach((inputContainer) => {
  const input = inputContainer.querySelector("input");
  inputContainer.addEventListener("click", () => {
    input.focus();
  });
  input.addEventListener("focus", () => {
    inputContainer.classList.add("focus");
  });
  input.addEventListener("blur", () => {
    inputContainer.classList.remove("focus");
  });
});

// Events to validate the input with a regex
bill.addEventListener("keypress", (event) => {
  validateInputWithRegex(event, billRegex);
});
custom.addEventListener("keypress", (event) => {
  validateInputWithRegex(event, customAndPeopleRegex);
});
numberOfPeople.addEventListener("keypress", (event) => {
  validateInputWithRegex(event, customAndPeopleRegex);
});

// Events to handle the input values
bill.addEventListener("input", () => {
  const inputContainer = bill.parentNode;
  cleanErrorMessages(billErrorMessage, inputContainer);
  // Verifying if the input is not empty and does not contain the letter "e"
  if (bill.value !== "" && !bill.value.toLowerCase().includes("e")) {
    billValue = Number(bill.value);
    // Checking if the input is greater than zero
    if (billValue > 0) {
      // Rounding the value to two decimal places
      if (bill.value.includes(".") && bill.value.split(".")[1].length > 2) {
        const billValueStrings = bill.value.split(".");
        billValueStrings[1] = billValueStrings[1].slice(0, 2);
        billValue = Number(billValueStrings.join("."));
        bill.value = billValue;
      }
      isBillValueSet = true;
      canCalculateTip();
    } else if (billValue === 0) {
      displayErrorMessages(billErrorMessage, inputContainer);
      isBillValueSet = false;
      canCalculateTip();
    } else {
      // Reset to zero in case the input is negative
      billValue = 0;
      bill.value = "";
      isBillValueSet = false;
      canCalculateTip();
    }
  } else {
    // Reset to zero in case the input is empty or contains the letter "e"
    billValue = 0;
    isBillValueSet = false;
    canCalculateTip();
  }
});

custom.addEventListener("input", () => {
  cleanErrorMessages(tipErrorMessage, custom);
  // Verifying if the input is not empty and does not contain the letter "e"
  if (custom.value !== "" && !custom.value.toLowerCase().includes("e")) {
    customValue = Number(custom.value);
    // Checking if input is greater than or equal to one
    if (customValue >= 1) {
      // Rounding the value to an integer
      if (!Number.isInteger(customValue)) {
        customValue = Math.floor(customValue);
        custom.value = customValue;
      }
      isCustomValueSet = true;
      canCalculateTip();
    } else if (customValue >= 0) {
      displayErrorMessages(tipErrorMessage, custom);
      customValue = 0;
      custom.value = 0;
      isCustomValueSet = false;
      canCalculateTip();
    } else {
      // Reset to zero in case the input is negative
      customValue = 0;
      custom.value = "";
      isCustomValueSet = false;
      canCalculateTip();
    }
  } else {
    // Reset to zero in case the input is empty or contains the letter "e"
    customValue = 0;
    isCustomValueSet = false;
    canCalculateTip();
  }
});

numberOfPeople.addEventListener("input", () => {
  const inputContainer = numberOfPeople.parentNode;
  cleanErrorMessages(peopleErrorMessage, inputContainer);
  // Verifying if the input is not empty and does not contain the letter "e"
  if (
    numberOfPeople.value !== "" &&
    !numberOfPeople.value.toLowerCase().includes("e")
  ) {
    numberOfPeopleValue = Number(numberOfPeople.value);
    // Checking if the input is greater than or equal to one
    if (numberOfPeopleValue >= 1) {
      // Rounding the value to an integer
      if (!Number.isInteger(numberOfPeopleValue)) {
        numberOfPeopleValue = Math.floor(numberOfPeopleValue);
        numberOfPeople.value = numberOfPeopleValue;
      }
      isNumberOfPeopleSet = true;
      canCalculateTip();
    } else if (numberOfPeopleValue >= 0) {
      displayErrorMessages(peopleErrorMessage, inputContainer);
      numberOfPeopleValue = 0;
      numberOfPeople.value = 0;
      isNumberOfPeopleSet = false;
      canCalculateTip();
    } else {
      // Reset to zero in case the input is negative
      numberOfPeopleValue = 0;
      numberOfPeople.value = "";
      isNumberOfPeopleSet = false;
      canCalculateTip();
    }
  } else {
    // Reset to zero in case the input is empty or contains the letter "e"
    numberOfPeopleValue = 0;
    isNumberOfPeopleSet = false;
    canCalculateTip();
  }
});

// Event to handle the radio buttons
radioButtons.forEach((radioButton) => {
  // Event to handle the change of the radio button
  radioButton.addEventListener("change", () => {
    // Clean the error message and the custom value
    cleanErrorMessages(tipErrorMessage, custom);
    customValue = 0;
    custom.value = "";
    isCustomValueSet = false;
    removeRadioLabelSelectionStyles();
    // Add style to selected label
    const radioLabel = radioButton.nextElementSibling;
    radioLabel.classList.add("selected");
    // Getting the value of the selected radius
    tipValue = Number(radioButton.value);
    isRadioButtonSelected = true;
    canCalculateTip();
  });
});

// Focus event for custom input
custom.addEventListener("focus", () => {
  deselectRadioButtons();
  removeRadioLabelSelectionStyles();
  tipValue = 0;
  isRadioButtonSelected = false;
  canCalculateTip();
});

// Event to handle the reset button
resetButton.addEventListener("click", () => {
  // Verifying if the reset button is active
  if (isButtonResetActive) {
    // Resetting the values of the inputs and the state of the app
    billValue = 0;
    bill.value = "";
    isBillValueSet = false;
    tipValue = 0;
    deselectRadioButtons();
    removeRadioLabelSelectionStyles();
    isRadioButtonSelected = false;
    customValue = 0;
    custom.value = "";
    isCustomValueSet = false;
    numberOfPeopleValue = 0;
    numberOfPeople.value = "";
    isNumberOfPeopleSet = false;
    canCalculateTip();
  }
});
