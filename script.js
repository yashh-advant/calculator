const calMode = document.getElementById('cal-mode');

calMode.addEventListener('change', (e) => {
    const mode = e.target.value;
    if (mode === 'scientific') {
        document.querySelectorAll('.scify-btn').forEach(btn => {
            btn.classList.remove('hidden');
        });

        document.getElementById('backspace').classList.remove('col-span-2');
    } else if (mode === 'basic') {
        document.querySelectorAll('.scify-btn').forEach(btn => {
            btn.classList.add('hidden');
        });
    }
});


const input = document.getElementById('cal-input')
const btns = document.querySelectorAll('.btn')
input.focus();

const functions = ["sin", "cos", "tan", "√", "%"];
const operators = "*/+-.";


function clearInput() {
    input.value = '';
    input.focus();
}

function handleBackspace() {
    let val = input.value;

    if (val.endsWith('sin') || val.endsWith('cos') || val.endsWith('tan')) {
        input.value = val.slice(0, -3)
    } else {
        input.value = val.slice(0, -1)
    }
    input.focus();
}

function tokenization(expression) {
    let tokens = [];
    let buffer = '';

    if (expression.length == 0) {
        return 'invalid'
    }

    if (expression == null || operators.includes(expression[0])) {
        return 'invalid'
    }



    for (let i = 0; i < expression.length; i++) {
        let char = expression[i];

        if (char == ' ') {
            continue;
        }

        if ((char <= '9' && char >= '0') || char == '.') {

            if (buffer.includes('.') && char == '.') {
                return 'invalid'
            } else {
                buffer += char;
            }

        } else if (char == 's' || char == 't' || char == 'c') {

            if (expression.substring(i, i + 3) == 'sin' || expression.substring(i, i + 3) == 'cos' || expression.substring(i, i + 3) == 'tan') {


                if (buffer.length > 0) {
                    tokens.push(buffer)
                    buffer = ''
                }

                tokens.push(expression?.substring(i, i + 3))

                i += 2;
                continue;
            }

            return 'invalid'



        } else {
            if (buffer.length > 0) {
                tokens.push(buffer)
                buffer = ''
            }

            buffer += char;

            if (tokens[tokens.length - 1] == buffer && (char != '(' && char != ')')) {
                return 'invalid'
            }

            tokens.push(buffer)
            buffer = ''
        }


    }

    if (buffer.length > 0) {
        tokens.push(buffer)
    }

    if (operators.includes(tokens[tokens.length - 1])) {
        return 'invalid'
    }


    return tokens;

}

function evaluateTokens(tokens) {

    // sin(2.5 + 3) + cos(4 * (1.5 + 0.5)) - √(9 / 0.25) + tan(30)

    // ['sin', '(', '2.5', '+', '3', ')', '+', 'cos', '(', '4', '*', '(', '1.5', '+', '0.5', ')', ')', '-', '√', '(', '9', '/', '0.25', ')', '+', 'tan', '(', '30', ')']

    while (tokens.includes('sin') || tokens.includes('cos') || tokens.includes('tan')) {

        let opIndex = -1;
        let funName = '';

        if (tokens.includes('sin')) {
            opIndex = tokens.indexOf('sin');
            funName = 'sin';
        } else if (tokens.includes('cos')) {
            opIndex = tokens.indexOf('cos');
            funName = 'cos';
        } else {
            opIndex = tokens.indexOf('tan');
            funName = 'tan';
        }

        let start = -1;
        let end = -1;
        let count = 0;

        for (let i = opIndex + 1; i < tokens.length; i++) {
            if (tokens[i] === '(') {
                if (count === 0) start = i;
                count++;
            }
            else if (tokens[i] === ')') {
                count--;
                if (count === 0) {
                    end = i;
                    break;
                }
            }
        }

        if (start === opIndex || end === opIndex) {
            return 'Syntax Error';
        }

        let res = evaluateTokens(tokens.slice(start + 1, end));

        if (res === undefined || isNaN(res)) {
            return 'Syntax Error';
        }

        let radians = (res * Math.PI) / 180;
        let funcResult = 0;

        if (funName === 'sin') {
            funcResult = Math.sin(radians);
        } else if (funName === 'cos') {
            funcResult = Math.cos(radians);
        } else {
            if (res % 180 === 90) {
                return 'Undefined';
            }
            funcResult = Math.tan(radians);
        }

        funcResult = Number(funcResult.toFixed(10));

        tokens.splice(start - 1, end - start + 2, funcResult);
    }


    while (tokens.includes('√')) {
        const rootIndex = tokens.indexOf('√')

        let start = -1;
        let end = -1;

        if (tokens[rootIndex + 1] === '(') {
            let count = 0;

            for (let i = rootIndex + 1; i < tokens.length; i++) {
                if (tokens[i] === '(') {
                    if (count === 0) start = i;
                    count++;
                }
                else if (tokens[i] === ')') {
                    count--;
                    if (count === 0) {
                        end = i;
                        break;
                    }
                }
            }

            if (start === -1 || end === -1) {
                return 'Syntax Error';
            }

            var res = evaluateTokens(tokens.slice(start + 1, end));

            tokens.splice(rootIndex, end - rootIndex + 1, Math.sqrt(res));
        }

        else {
            const nextToken = tokens[rootIndex + 1];

            const funcResult = Math.sqrt(Number(nextToken));
            console.log(funcResult);

            if (isNaN(funcResult)) {
                return 'Syntax Error'
            }

            tokens.splice(rootIndex, 2, funcResult);
        }

    }

    for (let i = 0; i < tokens.length; i++) {
        let token = tokens[i];
        if (token == '*' || token == '/') {
            let left = parseFloat(tokens[i - 1]);
            let right = parseFloat(tokens[i + 1]);
            let result = 0;

            if (token == '*') {
                result = left * right;
            } else if (token == '/') {
                if (right == 0) {
                    return "Cant divide by zero"
                }
                result = left / right;
            }

            tokens.splice(i - 1, 3, result.toString());
            i--;
        }
    }

    for (let i = 0; i < tokens.length; i++) {
        let token = tokens[i];
        if (token == '+' || token == '-') {
            let left = parseFloat(tokens[i - 1]);
            let right = parseFloat(tokens[i + 1]);
            let result = 0;

            if (token == '+') {
                result = left + right;
            } else if (token == '-') {
                result = left - right;
            }

            tokens.splice(i - 1, 3, result.toString());
            i--;
        }
    }

    if (tokens.length == 1) {
        return tokens[0];
    } else {
        input.value = 'Sytrax Error';
        return;
    }
}

btns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        const value = btn.textContent;
        // console.log(value);

        if (value.trim() == 'C') {
            clearInput();
            return;
        }
        else if (value.trim() == 'Backspace') {
            handleBackspace();
            return;
        }
        else if (value.trim() == '=') {
            tokenization(input.value);
            return;
        }
        else if (operators.includes(input.value[input.value.length - 1]) && operators.includes(value)) {
            return;
        }
        else if (functions.includes(input.value.slice(-3)) && functions.includes(value)) {
            return;
        }
        input.value += value.trim();

        input.focus();
    })
})



input.addEventListener('keyup', (keyPress) => {
    if (keyPress.key == 'Enter') {
        let expression = input.value
        // console.log(expression);
        const tokens = tokenization(expression?.toLowerCase())
        console.log(tokens);

        if (tokens === 'invalid') {
            input.value = 'Sytrax Error';
            return;
        } else {
            const result = evaluateTokens(tokens);

            if (result) {
                console.log(result);
                input.value = result;
            }
        }

        console.log(tokens);


    } else {
        return;
    }

})
