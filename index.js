// Get references to HTML elements
const yearsResult = document.getElementById("years-result");
const monthsResult = document.getElementById("months-result");
const daysResult = document.getElementById("days-result");
const submitBtn = document.getElementById("submit-button");

const dayInput = document.getElementById("day-input");
const monthInput = document.getElementById("month-input");
const yearInput = document.getElementById("year-input");
const invalidDay = document.querySelector("#day-input + .invalid-input");
const invalidMonth = document.querySelector("#month-input + .invalid-input");
const invalidYear = document.querySelector("#year-input + .invalid-input");

// Function to parse input values
function parseInputs() {
  return {
    day: parseInt(dayInput.value),
    month: parseInt(monthInput.value),
    year: parseInt(yearInput.value)
  };
}

// Function to update validity display and label color
function updateValidity(isValid, invalidElement, inputElement, message) {
  invalidElement.innerText = isValid ? "" : message;
  invalidElement.style.display = isValid ? "none" : "inline";
  inputElement.style.borderColor = isValid ? "" : "red";

  // Get corresponding label
  const labelElement = inputElement.previousElementSibling;
  // Change label color to red if input is invalid
  labelElement.style.color = isValid ? "" : "red";
}

// Function to validate date inputs
function validateDate(day, month, year) {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;
  const currentDay = currentDate.getDate();

  // If any input field is empty, display "This field is required" message
  if (!day || !month || !year) {
    updateValidity(false, invalidDay, dayInput, "This field is required");
    updateValidity(false, invalidMonth, monthInput, "This field is required");
    updateValidity(false, invalidYear, yearInput, "This field is required");
    return false;
  }

  // Validate year
  const isYearValid = year <= currentYear;
  updateValidity(isYearValid, invalidYear, yearInput, "Must be in the past");

  // Validate month
  const isMonthValid = month >= 1 && month <= 12;
  updateValidity(isMonthValid, invalidMonth, monthInput, "Must be a valid month");

  // If the year and month are in the future, the date is invalid
  if (year > currentYear || (year === currentYear && month > currentMonth)) {
    updateValidity(false, invalidDay, dayInput, "Must be a valid day");
    updateValidity(false, invalidMonth, monthInput, "Must be a valid month");
    return false;
  }

  // If the year is the current year and month is in the future, the date is invalid
  if (year === currentYear && month > currentMonth) {
    updateValidity(false, invalidDay, dayInput, "Must be a valid day");
    return false;
  }

  // If the year and month are the current year and month, but the day is in the future, the date is invalid
  if (year === currentYear && month === currentMonth && day > currentDay) {
    updateValidity(false, invalidDay, dayInput, "Must be a valid day");
    return false;
  }

  // Validate day
  const maxDaysInMonth = new Date(year, month, 0).getDate();
  const isDayValid = day >= 1 && day <= maxDaysInMonth;
  updateValidity(isDayValid, invalidDay, dayInput, "Must be a valid day");

  // Return overall validity
  return isYearValid && isMonthValid && isDayValid;
}

// Function to validate all inputs
function validateInputs() {
  const { day, month, year } = parseInputs();
  validateDate(day, month, year);
}

// Function to calculate age
function calcAge() {
  // Get input values
  const { day, month, year } = parseInputs();

  // Validate input values
  if (!validateDate(day, month, year)) return;

  // Calculate age
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;
  const currentDay = currentDate.getDate();

  let years = currentYear - year;
  let months = currentMonth - month;
  let days = currentDay - day;

  if (months < 0 || (months === 0 && days < 0)) {
    years--;
    months += 12;
  }
  if (days < 0) {
    const prevMonthLastDay = new Date(year, month - 1, 0).getDate();
    days += prevMonthLastDay;
    months--;
  }

  // Display age results
  yearsResult.innerText = years;
  monthsResult.innerText = months;
  daysResult.innerText = days;
}

// Function to handle form submission
function handleFormSubmit(event) {
  event.preventDefault();

  // Get input values
  const { day, month, year } = parseInputs();

  // Validate input values
  if (!validateDate(day, month, year)) {
    // If any input field is empty, display "This field is required" message
    if (!day) updateValidity(false, invalidDay, dayInput, "This field is required");
    if (!month) updateValidity(false, invalidMonth, monthInput, "This field is required");
    if (!year) updateValidity(false, invalidYear, yearInput, "This field is required");
    return;
  }

  // Calculate and display age if the input is valid
  calcAge();
}

// Add event listeners
dayInput.addEventListener("input", validateInputs);
monthInput.addEventListener("input", validateInputs);
yearInput.addEventListener("input", validateInputs);
submitBtn.addEventListener("click", handleFormSubmit);
