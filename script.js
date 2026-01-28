const input = document.getElementById('cal-input')
// console.log(input);
input.focus();


input.addEventListener('keyup', (keyPress) => {
    if (keyPress.key == 'Enter') {
        let inputString = input.value
        console.log(inputString);
        
        // input.value = 0
    } else {
        return;
    }

})
