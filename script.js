const displayNumber = document.getElementById('display-number');
const displayOperand = document.getElementById('display-operand');
const equalButton = document.getElementById('equal-button');
const numberButtons = document.querySelectorAll('.number-button');
const operatorButtons = document.querySelectorAll('.operator-button');

let operand = null;
let pendingOperator = null;
let shouldResetDisplay = false;

function calculate(num1Str, operator, num2Str) {
    const num1 = parseFloat(num1Str);
    const num2 = parseFloat(num2Str);

    if (isNaN(num1) || isNaN(num2)) {
        console.error("無効な数値です:", num1Str, operator, num2Str)
        return "Error";
    }

    switch (operator) {
        case "+":
            console.log(operator + "で計算。 数値:", num1 + num2)
            return num1 + num2;
        case "-": return num1 - num2;
        case "*": return num1 * num2;
        case '/':
            if (num2 === 0) {
                console.error("ゼロ除算エラー");
                return "Error";
            }
            return num1 / num2;
        default:
            console.error("無効な演算子です:", operator);
            return "Error";
    }
}

numberButtons.forEach(button => {
    button.addEventListener('click', (event) => {
        const clickedNumber = event.target.dataset.value;

        if (displayNumber.textContent === "0" && clickedNumber === "0") {
            console.log("一桁目に0が既に保持されています。");
            return;
        } else if (displayNumber.textContent === "0" && clickedNumber !== "0") {
            displayNumber.textContent -= "0";
            displayNumber.textContent = clickedNumber;
            operand = displayNumber.textContent;
            console.log("数値が保持されました。:", clickedNumber)
            return;
        } else {
            displayNumber.textContent += clickedNumber;
            operand = displayNumber.textContent;
            console.log("数値が保持されました。:", clickedNumber)
        }
    });
});

operatorButtons.forEach(button => {
    button.addEventListener('click', (event) => {
        const clickedOperator = event.target.dataset.value;
        if (pendingOperator === null && operand === null) {
            console.log("数値が保持されていません。");
            return;
        } else if (pendingOperator === null) {
            operand = displayNumber.textContent;
            pendingOperator = clickedOperator;
            displayOperand.textContent = operand + clickedOperator;
            console.log("最初の数値と演算子を保持:", displayNumber.textContent + clickedOperator);
            displayNumber.textContent = "0";
            return;
        } else {
            calculate(operand, pendingOperator, displayNumber.textContent);
        };
    });
});
