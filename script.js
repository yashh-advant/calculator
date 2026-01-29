const calMode = document.getElementById('cal-mode');

calMode.addEventListener('change', (e) => {
    const mode = e.target.value;
    if (mode === 'scientific') {
        document.querySelectorAll('.scify-btn').forEach(btn => {
            btn.classList.remove('hidden');
        });

        document.getElementById('clear-input').classList.remove('col-span-2');
    } else if (mode === 'basic') {
        document.querySelectorAll('.scify-btn').forEach(btn => {
            btn.classList.add('hidden');
        });

        document.getElementById('clear-input').classList.add('col-span-2');
    }
});


const input = document.getElementById('cal-input')
const btns = document.querySelectorAll('.btn')
input.focus();

// const functions = ["sin", "cos", "tan", "√", "%"];
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

    if(expression == null || operators.includes(expression[0])){
        return 'invalid'
    }

    for (let i = 0; i < expression.length; i++) {
        let char = expression[i];
        if((char <= '9' && char >= '0') || char == '.'){
            if(buffer.includes('.') && char == '.'){
                return 'invalid'
            }else{
                buffer += char;
            }
        }else{
            if(buffer.length > 0){
                tokens.push(buffer)
                buffer = ''
            }

            buffer+= char;

            if(tokens[tokens.length -1] == buffer){
                return 'invalid'
            }

            tokens.push(buffer)
            buffer = ''
        }


    }
    if(buffer.length > 0 ){
        tokens.push(buffer)
    }

    if(operators.includes(tokens[tokens.length -1])){
        return 'invalid'
    }


    return tokens;

}

function evaluateTokens(tokens){
    for(let i = 0; i < tokens.length; i++){
        let token = tokens[i];
        if(token == '*' || token == '/'){
            let left = parseFloat(tokens[i -1]);
            let right = parseFloat(tokens[i +1]);
            let result = 0;

            if(token == '*'){
                result = left * right;
            }else if(token == '/'){
                result = left / right;
            }

            tokens.splice(i -1, 3, result.toString());
            i--;
        }
    }

    for(let i = 0; i < tokens.length; i++){
        let token = tokens[i];
        if(token == '+' || token == '-'){
            let left = parseFloat(tokens[i -1]);
            let right = parseFloat(tokens[i +1]);
            let result = 0;

            if(token == '+'){
                result = left + right;
            }else if(token == '-'){
                result = left - right;
            }

            tokens.splice(i -1, 3, result.toString());
            i--;
        }
    }

    if(tokens.length == 1){
        input.value = tokens[0];
    }else{
        input.value = 'Sytrax Error';
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
        const tokens = tokenization(expression)

        if (tokens === 'invalid') {
            input.value = 'Sytrax Error';
            return;
        }else{
            evaluateTokens(tokens);
        }

        console.log(tokens);


    } else {
        return;
    }

})
