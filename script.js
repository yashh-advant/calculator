const input = document.getElementById('cal-input')
const btns = document.querySelectorAll('.btn')
input.focus();

let operatorsArray = []
const functions = ["sin", "cos", "tan", "√", "%"];
const operators = "*/+-.";


function clearInput() {
    input.value = '';
}

function handleBackspace() {
    let val = input.value;

    if (val.endsWith('sin') || val.endsWith('cos') || val.endsWith('tan')) {
        input.value = val.slice(0, -3)
    } else {
        input.value = val.slice(0, -1)
    }
}

function evaluateExpression(expression) {

    while (functions.some(fn => expression.includes(fn))) {
        
    }

    while (operators.split('').some(op => expression.includes(op))) {
        console.log("operator found");
        break;
    }


}

btns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        const value = btn.textContent;
        // console.log(value);

        if (value == 'C') {
            clearInput();
            return;
        }
        else if (value == 'Backspace') {
            handleBackspace();
            return;
        }
        else if (operators.includes(input.value[input.value.length - 1]) && operators.includes(value)) {
            console.log(`both value ${input.value[input.value.length - 1]} and ${value}`);
            return;

        }
        else if (functions.includes(input.value.slice(-3)) && functions.includes(value)) {
            return;
        }
        input.value += value;
    })
})



input.addEventListener('keyup', (keyPress) => {
    if (keyPress.key == 'Enter') {
        let expression = input.value
        console.log(expression);
        evaluateExpression(expression)


        // input.value = 0
    } else {
        return;
    }

})
