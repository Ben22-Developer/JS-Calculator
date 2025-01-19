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
//Functions declaration
let takeInputs,toCalculate,lastIndexCheck,inputsCollection;
let showRecords,hideRecords,recordFN,removeLastInput,fromRecords,handling_answer_b4_eval;

//other variables
let anAnswer,/*inputBool,*/inputs,wasInRecordBool,enteredB4;
anAnswer = [];
//inputBool = true;
inputs = [];
wasInRecordBool = false;
enteredB4 = false; //checking if the user enters a sign before a nbr

takeInputs = digit => {
    if (wasInRecordBool) {
        fromRecords();
    }
  //  if (inputBool) {
        answer.innerText = toCalculate(digit.target.innerText);
    //}
}

toCalculate = input => {
    let test,dotCheck,regex;
    regex = /\d+|\./g;
    test = regex.test(input);
    //to be true when user was interacting with historical records
    if (wasInRecordBool) {
        fromRecords();
        return;
    }
    //to be true when there's an inputted nbr
    if (test) {
        if (inputs[0] === 'error') {
            question.innerText = 0;
            inputs = [];
            return 0;
        }
        enteredB4 = false;
        dotCheck = /\./g;
        test = dotCheck.test(inputs.join(''));
        if (test === true && input === '.') {
            return inputs.join('');
        }
        inputs.push(input);
        return inputs.join('');
    }

    //to be true when there's an inputted sign not a number
    else {
        test = lastIndexCheck(inputs[inputs.length - 1]);
        //to be true when there's a sign included in the inputs array and the answer is provided
        if (anAnswer.length !== 0 && test === true)  {   
            if (input === '%') {
                inputs[inputs.length - 1] = inputs[inputs.length - 1] / 100;
            }
            question.innerText += `${inputs.join('')} = `;
            inputsCollection();
            handling_answer_b4_eval();
            let solution = eval(anAnswer.join(''));
            if (solution === Infinity) {
                solution = 'error';
            }
            answer.innerText = solution;
            recordFN(question.innerText,answer.innerText);
            anAnswer = [];
            inputs.push(answer.innerText);
        }

        //to be true when there's no sign included in the inputs array
        else {
            
            //when user enters a sign before a number
            if (enteredB4 === true) {
                enteredB4 = false;
               for (let loop = 0; loop < anAnswer.length; loop++) {
                if (anAnswer[loop] === input) {
                    enteredB4 = true;
                }
               }
            }

            //when on last index there's a nbr 
            if (test && input !== '=') {    
                inputs.push(input);
                inputsCollection();
                answer.innerText = 0;
                question.innerText = anAnswer.join('');
                console.log(`in ${test}\nanswer array: ${anAnswer}\nlast index`);
            }

            //when on last index there's not a nbr 
            else if (!test && input !== '=') {    
            regex = /\d+/g;
            test = regex.test(anAnswer[anAnswer.length - 1]);
            if (!test) {
                anAnswer.pop();
            }
            inputs.push(input); 
            inputsCollection();
            answer.innerText = 0;
            question.innerText = anAnswer.join('');
            }
            if (!question.innerText) {
                question.innerText = 0;
            }
        }
    }
}

//to put the user inputs in an answer array which will provide an answer
inputsCollection = () => {
    console.log(`inputs: ${inputs}\nanswer: ${anAnswer}`);
    if (inputs[0] === 'error') {
        answer.innerText = 0;
        inputs = [];
        return;
    }
    const lastIndex = lastIndexCheck(inputs[inputs.length - 1]);
    if (lastIndex === false && enteredB4 === false && inputs[inputs.length - 1] !== '=' && inputs.length === 1 && anAnswer.length === 0) {
        anAnswer.push(0);
        enteredB4 = true;
    }
    anAnswer = [...anAnswer,...inputs];
    
    if (anAnswer[anAnswer.length - 1] === '%') {
        anAnswer.pop();
        anAnswer[anAnswer.length - 1] = anAnswer[anAnswer.length - 1] / 100;
    }
    inputs = [];
}

lastIndexCheck = (sign) => {
    const regex = /(\d+|\.|\%)+/g;
    return regex.test(sign) ? true:false;
}

handling_answer_b4_eval = () => {
    let index,test,loop;
    index = 0;
    test = false;
    console.log(`in handling 1: ${anAnswer}`);

    for (loop = anAnswer.length-1; loop>=0 ; loop--) {
        if (anAnswer[loop] === '-') {
            index = loop;
            break;
        }
    }
    test = anAnswer[index-1] === anAnswer[index] ? true:false;
    if (test) {
        anAnswer[index-1] = '+';
        for (loop = index; loop < anAnswer.length; loop++) {
            anAnswer[loop] = anAnswer[loop+1];

        }
        anAnswer.length--;
    }
    console.log(`in handling 2: ${anAnswer}`);
}

digits.forEach(digit => {
    digit.addEventListener('click',takeInputs);
});

signs.forEach(sign => {
    sign.addEventListener('click', () => {
        if (sign.innerText === '+/-') {
            answer.innerText = answer.innerText * -1;
            const regex = /[-]/g;
            const test = regex.test(answer.innerText);
            if (test) {
                inputs.unshift('-');
            }
            else {
                inputs.shift();
            }
        }
        else {
            toCalculate(sign.innerText);
        }
    });
})

start.addEventListener('mousedown', () => {
    question.innerText = 0;
    answer.innerText = 0;
    anAnswer = [];
    inputs = [];
})

recordFN = (question,answer) => {
    if (!no_record.matches('.hidden')) {
        no_record.setAttribute('class','hidden');
    }
    const aRecord = document.createElement('li');
    aRecord.setAttribute('class','aRecord');
    aRecord.innerHTML = `<span class="question">${question}</span><span class="answer">${answer}</span>`;
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

fromRecords = () => {
    question.innerText = 0;
    answer.innerText = 0;
    inputs = [];
    wasInRecordBool = false;
}

removeLastInput = () => {
    inputs.pop();
    if (inputs.length === 0) {
        answer.innerText = 0;
    }
    else {
    answer.innerText = inputs.join('');
    }
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
