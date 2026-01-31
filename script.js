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

    input.focus();
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

    if (expression == null) {
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

        } else if (char == 'l') {
            if (expression.substring(i, i + 3) === 'log') {

                if (buffer.length > 0) {
                    tokens.push(buffer);
                    buffer = '';
                }

                tokens.push('log');
                i += 2;
                continue;
            } else if (expression.substring(i, i + 2) === 'ln') {

                if (buffer.length > 0) {
                    tokens.push(buffer);
                    buffer = '';
                }

                tokens.push('ln');
                i += 1;
                continue;
            }

        } else if (char == 's' || char == 't' || char == 'c' || char == 'm') {

            if (expression.substring(i, i + 5) === 'cosec') {

                if (buffer.length > 0) {
                    tokens.push(buffer);
                    buffer = '';
                }

                tokens.push('cosec');
                i += 4;
                continue;
            }

            let subString = expression.substring(i, i + 3);

            if (subString == 'sin' || subString == 'cos' || subString == 'tan' || subString == 'sec' || subString == 'cot' || subString == 'mod') {

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

            if (tokens[tokens.length - 1] == buffer && (char != '(' && char != ')') && char != '√') {
                return 'invalid'
            }
            if (i == 0 && operators.includes(expression[i])) {
                continue;
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


    while (tokens.includes('(')) {
        //(2 + 3) * (4 + 5)

        let start = -1;
        let end = -1;
        let count = 0;

        for (let i = 0; i < tokens.length; i++) {
            const element = tokens[i];
            if (element == '(') {
                if (count == 0) {
                    start = i;
                }
                count++;
            } else if (element == ')') {
                count--;
                if (count == 0) {
                    end = i;
                    break;
                }
            }

        }

        if (start === -1 || end === -1) {
            console.log(`srart ${start}   end ${end}`);

            return 'Syntax Error';
        }

        const innerTokens = tokens.slice(start + 1, end);
        const innerResult = evaluateTokens(innerTokens);
        console.log("Inner Result ", innerResult);

        tokens.splice(start, end - start + 1, innerResult.toString());

    }

    while (tokens.includes('sin') || tokens.includes('cos') || tokens.includes('tan') || tokens.includes('sec') || tokens.includes('cosec') || tokens.includes('cot')) {

        console.log(tokens);

        let rootIndex = -1;
        let func = '';

        if (tokens.includes('sin')) {
            rootIndex = tokens.lastIndexOf('sin');
            func = 'sin';
        }
        else if (tokens.includes('cos')) {
            rootIndex = tokens.lastIndexOf('cos');
            func = 'cos';
        }
        else if (tokens.includes('tan')) {
            rootIndex = tokens.lastIndexOf('tan');
            func = 'tan';
        }
        else if (tokens.includes('sec')) {
            rootIndex = tokens.lastIndexOf('sec');
            func = 'sec';
        }
        else if (tokens.includes('cosec')) {
            rootIndex = tokens.lastIndexOf('cosec');
            func = 'cosec';
        }
        else if (tokens.includes('cot')) {
            rootIndex = tokens.lastIndexOf('cot');
            func = 'cot';
        }

        let value = tokens[rootIndex + 1];

        if (value === undefined || isNaN(value)) {
            return 'Syntax Error';
        }

        let radian = (Number(value) * Math.PI) / 180;
        let res;

        const EPSILON = 1e-10;

        if (func === 'sin') {
            res = Math.sin(radian);
        }
        else if (func === 'cos') {
            res = Math.cos(radian);
        }
        else if (func === 'tan') {
            if (Math.abs(Math.cos(radian)) < EPSILON) return 'Undefined';
            res = Math.tan(radian);
        }
        else if (func === 'sec') {
            if (Math.abs(Math.cos(radian)) < EPSILON) return 'Undefined';
            res = 1 / Math.cos(radian);
        }
        else if (func === 'cosec') {
            if (Math.abs(Math.sin(radian)) < EPSILON) return 'Undefined';
            res = 1 / Math.sin(radian);
        }
        else if (func === 'cot') {
            if (Math.abs(Math.sin(radian)) < EPSILON) return 'Undefined';
            res = 1 / Math.tan(radian);
        }

        console.log(res);

        tokens.splice(rootIndex, 2, Number(res.toFixed(10)));
    }


    while (tokens.includes('√') || tokens.includes('log') || tokens.includes('ln') || tokens.includes('π') || tokens.includes('mod')) {
        console.log(tokens);

        if (tokens.includes('π')) {
            let piIndex = tokens.indexOf('π')
            tokens.splice(piIndex, 1, Math.PI.toString())
            continue;
        } else if (tokens.includes('mod')) {
            let modIndex = tokens.indexOf('mod')
            let left = parseFloat(tokens[modIndex - 1]);
            let right = parseFloat(tokens[modIndex + 1])
            let result = left % right;
            if (isNaN(result)) {
                return 'invalid'
            }

            tokens.splice(modIndex - 1, 3, result)
            continue;
        }

        let index = -1;
        let func = '';

        if (tokens.includes('√')) {
            index = tokens.indexOf('√');
            func = '√';
        } else if (tokens.includes('log')) {
            index = tokens.indexOf('log');
            func = 'log';
        } else if (tokens.includes('ln')) {
            index = tokens.indexOf('ln');
            func = 'ln';
        }

        if (tokens[index + 1] !== undefined) {
            let value = Number(tokens[index + 1]);
            let res = 0;

            if (isNaN(value)) return 'Syntax Error';

            if (func === '√') {
                if (value < 0) return 'Invalid';
                res = Math.sqrt(value);
            }
            else if (func === 'log') {
                if (value <= 0) return 'Invalid';
                res = Math.log10(value);
            }
            else if (func === 'ln') {
                if (value <= 0) return 'Invalid';
                res = Math.log(value);
            }

            tokens.splice(index, 2, res);
        } else {
            return 'Syntax Error';
        }

    }

    for (let i = 0; i < tokens.length; i++) {
        let token = tokens[i];
        if (token == '*' || token == '/') {
            let left = parseFloat(tokens[i - 1]);
            let right = parseFloat(tokens[i + 1]);
            let result = 0;


            if (token == 'mod') {
                result = left % right;
            } else if (token == '*') {
                result = left * right;
            } else if (token == '/') {
                if (right == 0) {
                    return "Cant divide by zero"
                }
                result = left / right;
            }

            if (isNaN(result)) {
                return "Invalid"
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

            if (isNaN(result)) {
                return "Invalid"
            }

            tokens.splice(i - 1, 3, result.toString());
            i--;
        }
    }

    if (tokens.length == 1) {
        return tokens[0];
    } else {
        input.value = 'Syntax Error';
        return;
    }
}

btns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        const value = btn.textContent?.trim();
        // console.log(value);

        if (value == 'C') {
            clearInput();
            return;
        }
        else if (value == 'Backspace') {
            handleBackspace();
            return;
        }
        else if (value == '=') {
            tokenization(input.value);
            return;
        }
        else if (operators.includes(input.value[input.value.length - 1]) && operators.includes(value)) {
            return;
        }
        else if (functions.includes(input.value.slice(-3)) && functions.includes(value)) {
            return;
        }
        input.value += value;

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
            console.log(result);
            input.value = result;
        }
        input.focus();
        console.log(tokens);


    } else {
        return;
    }

})


let memory = 0;

const memoryValueParagraph = document.querySelector('.m-val')

document.querySelectorAll('.m-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        console.log(e.target.innerText);
        const val = e.target.innerText?.trim();

        if (val == 'MC') {
            memory = 0;
        }
        else if (val == 'MR') {
            input.value += memory;
            memory = 0;
        } else {
            const calInput = Number(input.value)
            if (isNaN(calInput)) {
                alert("cant add Expression as Memory")
            } else {
                if (val == 'Mr+') {
                    memory += calInput;
                } else if (val == 'Mr-') {
                    memory -= calInput;
                }
            }
        }

        memoryValueParagraph.innerText = memory
        input.focus();
    })
})