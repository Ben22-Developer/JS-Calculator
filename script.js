/*The logic in this is different from the normal one I just needed 
to find another approach of calculating without using common approaches
like the use of switch statements*/
const allDigitsParent = document.getElementById('lowerPart');
const digits = allDigitsParent.querySelectorAll('.digits');
const signs = allDigitsParent.querySelectorAll('.signs');
const start = allDigitsParent.querySelector('#start');
const question = document.getElementById('input');
const answer = document.getElementById('output');
const history = document.getElementById('history');
const backspace = document.getElementById('backspace');
const records = document.getElementById('records');
const no_record = records.querySelector('p');
let recordList = document.querySelectorAll('.aRecord');
const modeBtn = document.getElementById('mode');
const body = document.querySelector('body');



//functions
let takeUserInputsClick,takeUserInputsKeyboard,validateUserInputs_1,validateUserInputs_2,collecUserInputs,calculateUserInputs,percent_handle;
let recordFN,hideRecords,showRecords;

//variables
let dotCheck,percentCheck,anAnswer,inputs;
dotCheck = true;
percentCheck = true;
anAnswer = [];
inputs= [];



//this function is of when user triggers the calculator via a click

takeUserInputsClick = (digit_or_sign) => {
    //console.log(digit_or_sign.innerText);
    let testDigits,regexDigits;
    let testSymbols,regexSymbols;
    regexDigits = /[\d|\.|\%]/g;
    testDigits = regexDigits.test(digit_or_sign.target?.innerText);
    regexSymbols = /[\+\-\*\/\=]/g;
    testSymbols = regexSymbols.test(digit_or_sign.innerText);
    if (testDigits) {
        if (answer.innerText === '0') {
            if (digit_or_sign.target.innerText === '.') {
                answer.innerText += digit_or_sign.target.innerText;
                inputs.push(0,digit_or_sign.target.innerText);
            }
            else if (digit_or_sign.target.innerText !== '0') {
                answer.innerText = digit_or_sign.target.innerText;
                inputs.push(digit_or_sign.target.innerText);
            }
        }
        else if ((digit_or_sign.target.innerText !== '.' || dotCheck === true) && percentCheck === true) {
            answer.innerText += digit_or_sign.target.innerText;
            inputs.push(digit_or_sign.target.innerText);
        }
        if (digit_or_sign.target.innerText === '.') {
            dotCheck = false;
        }
        if (digit_or_sign.target.innerText === '%') {
            percentCheck = false;
            percent_handle();
        }

        console.log(inputs);
    } 
    if (testSymbols) {
        if ((/[\d](?=\%)/).test(answer.innerText) && digit_or_sign.innerText === '=') {
            answer.innerText = inputs;
        }
        //this if is neglagating sth like (12 =) input
        if ((anAnswer.length === 0) && (digit_or_sign.innerText === '=')) {} 
        else if ((anAnswer.length === 0) && (digit_or_sign.innerText !== '=')) {
            validateUserInputs_1(inputs,digit_or_sign.innerText);
        }
        else if ((anAnswer.length !== 0) && (inputs.length !== 0)) {
            regexDigits = /[\d]/g;
            const lastIndexCheck = regexDigits.test(anAnswer[anAnswer.length - 1]); 
            if (!lastIndexCheck) {
                validateUserInputs_1(inputs,digit_or_sign.innerText);
            }    
        }
        else if ((anAnswer.length !== 0) && (inputs.length === 0) && ((digit_or_sign.innerText !== '='))) {
            validateUserInputs_2(digit_or_sign.innerText);
        }
    }
}



//this function is of when user triggers the calculator via a click

takeUserInputsKeyboard = (e) => {
    let testDigits,regexDigits;
    let testSymbols,regexSymbols;
    regexDigits = /[\d|\.|\%]/g;
    testDigits = regexDigits.test(e.key);
    regexSymbols = /[\+\-\*\/\=]/g;
    testSymbols = regexSymbols.test(e.key);
    if (testDigits) {
        if (answer.innerText === '0') {
            if (e.key === '.') {
                answer.innerText += e.key;
                inputs.push(0,e.key);
            }
            else if (e.key !== '0') {
                answer.innerText = e.key;
                inputs.push(e.key);
            }
        }
        else if ((e.key !== '.' || dotCheck === true) && percentCheck === true) {
            answer.innerText += e.key;
            inputs.push(e.key);
        }
        if (e.key === '.') {
            dotCheck = false;
        }
        if (e.key === '%') {
            percentCheck = false;
            percent_handle();
        }

        console.log(inputs);
    } 
    if (testSymbols) {
        if ((/[\d](?=\%)/).test(answer.innerText) && e.key === '=') {
            answer.innerText = inputs;
        }
        //this if is neglagating sth like (12 =) input
        if ((anAnswer.length === 0) && (e.key === '=')) {} 
        else if ((anAnswer.length === 0) && (e.key !== '=')) {
            validateUserInputs_1(inputs,e.key);
        }
        else if ((anAnswer.length !== 0) && (inputs.length !== 0)) {
            regexDigits = /[\d]/g;
            const lastIndexCheck = regexDigits.test(anAnswer[anAnswer.length - 1]); 
            if (!lastIndexCheck) {
                validateUserInputs_1(inputs,e.key);
            }    
        }
        else if ((anAnswer.length !== 0) && (inputs.length === 0) && ((e.key !== '='))) {
            validateUserInputs_2(e.key);
        }
    }
    if (e.key === 'Backspace') {
        removeLastInput();
    }
}






validateUserInputs_1 = (inputs,key) => {
    if (typeof(inputs) === 'object') {
        inputs = inputs.join('');
    }

    //the following regex are validating the decimal numbers
    if ((!dotCheck) && ((/-?\.\d+([0]+)$/g).test(answer.innerText))) {
        if (/\d+(?=\.[0]+$)/g.test(answer.innerText)) {
            inputs = inputs.match(/\d+(?=\.[0]+$)/g);
        }
        else {
            inputs = inputs.match(/-?\d+\.[0-9]+[1-9]+(?=[0]+)/g);
        }
    }
    if (/^0[0]*\.*0$/.test(inputs) || (!inputs)) {
        inputs = [];
        inputs.push(0);
    }
    collecUserInputs(inputs,key);
    dotCheck = true;
    percentCheck = true;
}
validateUserInputs_2 = (sign) => {
    anAnswer.pop();
    anAnswer.push(sign);
    question.innerText = `${anAnswer[0]}${anAnswer[1]}`;
}

collecUserInputs = (input,sign) => {
    anAnswer.push(input,sign);
    console.log(`answer ${anAnswer}`);
    if (anAnswer.length === 4) {
        let solution;
        solution = calculateUserInputs(anAnswer[0],anAnswer[1],anAnswer[2]);
        inputs = [];
        recordFN(anAnswer[0],anAnswer[1],anAnswer[2],solution);
        if (anAnswer[3] === '=') {
        if (solution == 'Infinity' || solution == '-Infinity' || solution == 'NaN') {
            solution = 'error';
        }
        question.innerText += `${anAnswer[2]}${anAnswer[3]}`;
        answer.innerText = solution;
        inputs.push(solution);
        anAnswer = [];
        }
        else {
            for (let loop = 0; loop<3; loop++) {
                anAnswer.shift(anAnswer[0]);
            }
            anAnswer.unshift(solution);
            console.log(anAnswer);
            question.innerText = `${anAnswer[0]}${anAnswer[1]}`;
            answer.innerText = '0';
        }
    }
    else {
        answer.innerText = '0';
        question.innerText = `${anAnswer[0]}${anAnswer[1]}`;
        inputs = [];
    }
}

calculateUserInputs = (number_1,operation,number_2) => {
    number_1 = parseFloat(number_1);
    number_2 = parseFloat(number_2);
    switch(operation) {
        case '+':
            return number_1 + number_2;
        break;
        case '-':
            return number_1 - number_2;
        break;
        case '*':
            return number_1 * number_2;
        break;
        case '/':
            return number_1 / number_2;
        break;
        default:
            return 'error';
        break;
    }
}

percent_handle = () => {
    if (typeof(inputs) === 'object') {
        inputs.pop();
        inputs = inputs.join('');
    }
    inputs = inputs/100;
    answer.innerText = inputs;
}





digits.forEach(digit => {
    digit.addEventListener('click',takeUserInputsClick);
});

signs.forEach(sign => {
    sign.addEventListener('click', () => {
        if (sign.innerText === '+/-') {
            if (typeof(inputs) === 'object' && inputs.length > 1) {
                if (inputs[0] === '-') {
                    inputs.shift('-');
                    answer.innerText = `${answer.innerText * -1}`;
                }
                else if (inputs[0] !== '-') {
                    inputs.unshift('-');
                    answer.innerText = `-${answer.innerText}`;
                }
                console.log(inputs);
            }
            else {
                inputs[0] = inputs[0] * -1;
                answer.innerText = inputs;
            }
            if (typeof(inputs) === 'number') {
                inputs = inputs * -1;
                answer.innerText = inputs;
            }
        }
        else {
            takeUserInputsClick(sign);
        }
    });
})

start.addEventListener('mousedown', () => {
    question.innerText = 0;
    answer.innerText = 0;
    anAnswer = [];
    inputs = [];
})

recordFN = (number_1,operation,number_2,solution) => {
    if (!no_record.matches('.hidden')) {
        no_record.setAttribute('class','hidden');
    }
    const aRecord = document.createElement('li');
    aRecord.setAttribute('class','aRecord');
    aRecord.innerHTML = `<span class="question_answer">${number_1} ${operation} ${number_2} = ${solution}</span>`;
    records.append(aRecord);
    recordList = records.querySelectorAll('.aRecord');
}

hideRecords = (e) => {
    records.setAttribute('class','hidden');
    document.removeEventListener('mousedown',hideRecords);
}

showRecords = () => {
    records.removeAttribute('class','hidden');
    recordList.forEach (aRecord => {
      aRecord.addEventListener('mousedown', () => {
        wasInRecordBool = true;
        question.innerText = `${aRecord.children[0].innerText}`;
        answer.innerText = `${aRecord.children[1].innerText}`;
      })  
    })
    document.addEventListener('mousedown',hideRecords);
}



removeLastInput = () => {
    if (typeof(inputs) === 'object') {
        const get = inputs.pop();
        if (get === '.') {
            dotCheck = true;
        }
        if (inputs.length === 0) {
            answer.innerText = 0;
            question.innerText = 0;           
        }
        else {
        answer.innerText = inputs.join('');
        }
    }
    else {
        inputs = [];
        answer.innerText = 0;
        question.innerText = 0;
    }
    percentCheck = true;
    dotCheck = true;
}

history.addEventListener('click',showRecords);
backspace.addEventListener('click',removeLastInput);
modeBtn.addEventListener('click', () => {
    if (body.matches('.light_mode')) {
        body.removeAttribute('class','light_mode');
        modeBtn.innerText = 'Dark Mode';
        modeBtn.style.backgroundColor = '#ffffff';
        modeBtn.style.color = '#000000';    
    }
    else {
        body.setAttribute('class','light_mode');
        modeBtn.innerText = 'Light Mode';
        modeBtn.style.backgroundColor = '#000000';
        modeBtn.style.color = '#ffffff';
    }
})
document.addEventListener('keydown',takeUserInputsKeyboard);