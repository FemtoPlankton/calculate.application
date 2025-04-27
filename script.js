const displayNumber = document.getElementById('display-number');
const displayOperand = document.getElementById('display-operand');

const numberButtons = document.querySelectorAll('.number-button');
const operatorButtons = document.querySelectorAll('.operator-button');
const decimalButton = document.querySelector('.decimal-button')
const equalButton = document.querySelector('.equal-button')

const historyContainer = document.getElementById('history');
const resetButton = document.getElementById('reset')

let operand = null;
let previousOperand = "0";
let pendingOperator = null;
let shouldResetDisplay = false;
let equalJudgment = false;
let resetHistory = false;

function calculate(num1Str, operator, num2Str) {
    const num1 = parseFloat(num1Str);
    const num2 = parseFloat(num2Str);

    previousOperand = num1Str;

    if (isNaN(num1) || isNaN(num2)) {
        console.error("無効な数値です:", num1Str, operator, num2Str)
        return "Error";
    }

    let result;

    switch (operator) {
        case "+":
            result = num1 + num2;
            break;
        case "-":
            result = num1 - num2;
            break;
        case "*":
            result = num1 * num2;
            break;
        case '/':
            if (num2 === 0) {
                console.error("ゼロ除算エラー");
                return "Error";
            }
            result = num1 / num2;
            break;
        default:
            console.error("無効な演算子です:", operator);
            return "Error";
    }

    const roundedResult = parseFloat(result.toFixed(8));
    result = roundedResult;

    console.log(operator, "で計算。結果:", roundedResult);
    return result;
}

numberButtons.forEach(button => {
    button.addEventListener('click', (event) => {
        const clickedNumber = event.target.dataset.value;

        if (equalJudgment) {
            displayOperand.textContent = "";
            operand = null;
            pendingOperator = null;
            resetHistory = true;
            equalJudgment = false;
        }

        if (shouldResetDisplay) {
            displayNumber.textContent = "";
            shouldResetDisplay = false;
        }

        if (displayNumber.textContent === "0" && clickedNumber === "0") {
            console.log("一桁目に0が既に保持されています。");
            return;
        } else if (displayNumber.textContent === "0" && clickedNumber !== "0") {
            displayNumber.textContent = clickedNumber;
            operand = clickedNumber;
            return;
        } else {
            if (equalJudgment) {
                displayNumber.textContent = clickedNumber;
                console.log("数値が保持されました。:", clickedNumber);
            } else {
                displayNumber.textContent += clickedNumber;
                console.log("数値が保持されました。:", clickedNumber);
            }
        }
    });
});

operatorButtons.forEach(button => {
    button.addEventListener('click', (event) => {
        const clickedOperator = event.target.dataset.value;

        if (equalJudgment) {
            if (historyDisplay.textContent.includes('finish')) {
                let currentHistory = historyDisplay.textContent;
                let cleanedHistory = currentHistory.replace("finish", '');
                historyDisplay.textContent = cleanedHistory;
            };
            equalJudgment = false;
        }

        if (displayNumber.textContent === null) {
            console.log("数値が保持されていません。");
            return;
        } else if (pendingOperator === null) {
            operand = displayNumber.textContent;
            pendingOperator = clickedOperator;
            if (pendingOperator === "*") {
                displayOperand.textContent = operand + " ×";
                console.log("最初の数値と演算子を保持:", displayNumber.textContent + " ×");
            } else if (pendingOperator === "/") {
                displayOperand.textContent = operand + " ÷";
                console.log("最初の数値と演算子を保持:", displayNumber.textContent + " ÷");
            } else {
                displayOperand.textContent = operand + " " + clickedOperator;
                console.log("最初の数値と演算子を保持:", displayNumber.textContent + " " + clickedOperator);
            }
            displayNumber.textContent = null;
            return;
        } else {
            if (pendingOperator === clickedOperator) {
                if (displayNumber.textContent === null) {
                    console.log("数値が保持されていません。")
                    return;
                } else {
                    const currentDisplay = displayOperand.textContent;
                    const result = calculate(operand, pendingOperator, currentDisplay);

                    if (result === "Error") {
                        displayNumber.textContent = "Error";
                        displayOperand.textContent = "";
                        operand = null;
                        pendingOperator = null;
                        shouldResetDisplay = true;
                    } else {
                        let cycleDelete = historyDisplay.textContent.split('\n');

                        if (cycleDelete.length > 15) {
                            cycleDelete.splice(14, 1);
                            historyDisplay.textContent = cycleDelete.join('\n');
                        }

                        if (resetHistory) {
                            historyDisplay.textContent = '';
                            resetHistory = false;
                        }

                        let displayOpSymbol = clickedOperator;
                        if (clickedOperator === "*") displayOpSymbol = "×";
                        if (clickedOperator === "/") displayOpSymbol = "÷";

                        historyContainer.style.display = "block";
                        historyDisplay.textContent = previousOperand + " " + pendingOperator + " " + displayNumber.textContent + " = " + result + "\n" + historyDisplay.textContent;

                        displayOperand.textContent = result + " " + displayOpSymbol;
                        displayNumber.textContent = result;
                        operand = result.toString();
                        pendingOperator = clickedOperator;
                        shouldResetDisplay = true;
                        console.log("計算実行:", result, "次の演算子:", pendingOperator);
                    }
                }
            } else {
                let replaceOperator = displayOperand.textContent.split(" ");

                let displayOpSymbol = clickedOperator;
                if (clickedOperator === "*") displayOpSymbol = "×";
                if (clickedOperator === "/") displayOpSymbol = "÷";

                replaceOperator.splice(1, 1, displayOpSymbol);
                displayOperand.textContent = replaceOperator.join(" ");
                pendingOperator = clickedOperator;
                

            }
        };
    });
});

decimalButton.addEventListener('click', () => {
    if (displayNumber.textContent.includes(".")) {
        console.log('既に小数点があります。');
    } else {
        displayNumber.textContent += ".";
    }
});

equalButton.addEventListener('click', () => {
    if (equalJudgment) {
        console.log('既に計算結果が表示されています。')
    } else {
        if (operand === null) {
            console.log("数値が保持されていません。");
        } else {
            if (resetHistory) {
                historyDisplay.textContent = '';
                resetHistory = false;
            }

            const currentDisplay = displayNumber.textContent;
            const result = calculate(operand, pendingOperator, currentDisplay);

            let cycleDelete = historyDisplay.textContent.split('\n');
            let displayOpSymbol = pendingOperator;
            if (pendingOperator === "*") displayOpSymbol = "×";
            if (pendingOperator === "/") displayOpSymbol = "÷";

            if (cycleDelete.length > 15) {
                cycleDelete.splice(14, 1);
                historyDisplay.textContent = cycleDelete.join('\n');
            }

            historyContainer.style.display = "block";
            historyDisplay.textContent = previousOperand + " " + displayOpSymbol + " " + displayNumber.textContent + " = " + result + "\n" + historyDisplay.textContent;
            displayOperand.textContent = null;
            displayNumber.textContent = result;

            pendingOperator = null;
            shouldResetDisplay = true;
            equalJudgment = true;
        }
    }
})

resetButton.addEventListener('click', () => {
    historyDisplay.textContent = '';
    historyContainer.style.display = "none";
});