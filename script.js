var display = document.querySelector(".display");
display.textContent = "0";

function add(a, b) {
  return a + b;
}

function subtract(a, b) {
  return a - b;
}

function multiply(a, b) {
  return a * b;
}

function divide(a, b) {
  if (b !== 0) {
    return a / b;
  } else {
    return "Nope :)";
  }
}

function modulo(a, b) {
  return a % b;
}

function operate(a, b, operator) {
  var result;
  switch (operator) {
    case "+":
      result = add(a, b);
      break;
    case "-":
      result = subtract(a, b);
      break;
    case "*":
      result = multiply(a, b);
      break;
    case "/":
      result = divide(a, b);
      break;
    case "%":
      result = modulo(a, b);
      break;
    default:
      result = "Invalid input";
  }
  // check if the result is too large for display
  if (result.toString().length > 9) {
    if (Number.isInteger(result)) {
      result = result.toExponential(5);
    } else {
      result = parseFloat(result.toFixed(5));
    }
  }

  return result;
}

var firstNum = "";
var secondNum = "";
var operator = "";
var resetDisplay = false; // flag to track whether to reset the display

function clearDisplay() {
  var display = document.querySelector(".display");
  display.textContent = "0";
  var operators = document.querySelectorAll(".operator");
  operators.forEach((op) => op.classList.remove("clicked"));
  resetOperands(); // reset operands and operator
}

function resetOperands() {
  firstNum = "";
  secondNum = "";
  operator = "";
}

function isOperator(value) {
  // check if the value is an operator
  return (
    value === "+" ||
    value === "-" ||
    value === "*" ||
    value === "/" ||
    value === "%"
  );
}

function negate() {
  var display = document.querySelector(".display");
  if (display.textContent > 0) {
    display.textContent = -Math.abs(display.textContent);
  } else {
    display.textContent = Math.abs(display.textContent);
  }
}

function populateDisplay(button) {
  var display = document.querySelector(".display");
  var value = button.textContent;

  // check if the display needs to be reset
  if (resetDisplay) {
    clearDisplay();
    resetDisplay = false;
  }

  // check if an operator is set
  if (operator) {
    // if an operator is set, append the value to the secondNum
    if (secondNum.length < 9) {
      secondNum += value;
      display.textContent = secondNum;
    }
  } else {
    // if no operator is set, handle appending numbers as before
    if (isOperator(display.textContent) && display.textContent !== "0") {
      operator = value;
    } else if (value === "." && display.textContent.includes(".")) {
      // if the display already contains a decimal point, do nothing
      return;
    } else {
      // when the result of the calculation is 0, setting the fistNum to be the value
      if (firstNum === "0") {
        firstNum = value;
        console.log("resetting calculation");
      } else if (firstNum.length < 9) {
        // limiting to 9 digits
        firstNum += value; // append the value to the firstNum
      }
      display.textContent = firstNum; // update the display
    }
  }
  // remove "clicked" class from all operator buttons
  var operators = document.querySelectorAll(".operator");
  operators.forEach((op) => op.classList.remove("clicked"));
}

function setOperator(button) {
  var display = document.querySelector(".display");
  var value = button.textContent;

  // check if a number is set
  if (display.textContent !== "") {
    button.classList.add("clicked");

    if (value === "=") {
      // remove "clicked" class from all operator elements
      var operators = document.querySelectorAll(".operator");
      operators.forEach((op) => op.classList.remove("clicked"));

      if (firstNum && operator && secondNum) {
        console.log("This is the firstNum ", firstNum);
        console.log("This is the operator: ", operator);
        console.log("This is the secondNum: ", secondNum);
        // perform calculation only if all necessary data is present
        var result = operate(
          parseFloat(firstNum),
          parseFloat(secondNum),
          operator
        );

        display.textContent = result;

        if (parseFloat(result) === 0) {
          console.log("result is 0, resetting everything");
          clearDisplay();
        }

        firstNum = result.toString();
        secondNum = "";
        operator = "";

        resetDisplay = false; // flag to track whether to reset the display
      }
    } else if (isOperator(value)) {
      // if an operator is clicked after an equal sign, treat the result as the new first number
      // and allow for a new calculation
      if (resetDisplay) {
        firstNum = display.textContent;
        resetDisplay = false;
      } else {
        operator = value;
        firstNum = display.textContent;
      }
    } else {
      // if the clicked button is a number, update the display and firstNum or secondNum
      populateDisplay(button);
    }
  }
}

// add event listener for button clicks
document.querySelectorAll(".operator, .button").forEach((button) => {
  button.addEventListener("click", () => {
    // remove "clicked" class from all operator buttons
    document
      .querySelectorAll(".operator")
      .forEach((op) => op.classList.remove("clicked"));

    // add "pressed" class for visual feedback on click
    button.classList.add("pressed");
    setTimeout(() => {
      button.classList.remove("pressed");
    }, 50);

    // add "clicked" class to the clicked button if it's not the equal button or AC
    if (
      !button.classList.contains("equal") &&
      !button.classList.contains("AC")
    ) {
      button.classList.add("clicked");
    }
  });
});
