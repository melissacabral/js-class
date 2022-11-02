/*
Calculator Interface
=============
Prerequisites:
* Dom Manipulation
* event listeners on lists of elements
*/
//get all the elements we need
const calculatorDisplay = document.querySelector('.calculator-display h1');
const inputBtns = document.querySelectorAll('button');
const clearBtn = document.getElementById('clear-btn');


//starting values
let firstValue = 0;
let operatorValue = '';
let awaitingNextValue = false;


//what do do if a number is pressed 
//(one of two things will happen - new value or update existing)
function numberValue( number ){
	 if(awaitingNextValue){
        calculatorDisplay.textContent = number;
        awaitingNextValue = false;
    }
    else{
    //Checks to see if the current display value is 0, if so, replace with the number entered. If the display value is not 0, add the number entered to the display value
    const displayValue = calculatorDisplay.textContent;
    calculatorDisplay.textContent = displayValue === '0' ? number : displayValue + number;
    }
}
//what to do if decimal is pressed
function addDecimal(){
	console.log('decimal pressed')
	//check if there's already a decimal in the output before adding the decimal
	if(! calculatorDisplay.textContent.includes('.')){
		calculatorDisplay.textContent = `${calculatorDisplay.textContent}.`;
	}
}

//calculate first and second values with operator. this is an object with each possible operator
//arrow functions keep it concise
const calculate = {
    '/' : (firstNumber, secondNumber) => firstNumber / secondNumber,
    '*' : (firstNumber, secondNumber) => firstNumber * secondNumber,
    '+' : (firstNumber, secondNumber) => firstNumber + secondNumber,
    '-' : (firstNumber, secondNumber) => firstNumber - secondNumber,
    '=' : (firstNumber, secondNumber) => secondNumber,
};
//what do do if operator is pressed
function useOperator(operator){
    const currentValue = Number(calculatorDisplay.textContent);
    //Prevents multiple operator presses (replaces previous operator)
    if(operatorValue && awaitingNextValue) {
        operatorValue = operator;
        return;
    };
    //Assign first value if no value
    if(!firstValue){
        firstValue = currentValue;
    }
    else{
        const calculation = calculate[operatorValue](firstValue, currentValue);
        calculatorDisplay.textContent = calculation;
        firstValue = calculation;
    }
    //Next value, store the operator
    awaitingNextValue = true;
    operatorValue = operator;
}


//what to do if clear is pressed

//event listeners on all buttons (except clear)
inputBtns.forEach((inputBtn) => {
	//check the type of button - no class means number button
	if( inputBtn.classList.length === 0 ){
		inputBtn.addEventListener('click', () => numberValue(inputBtn.value));
	}else if( inputBtn.classList.contains('decimal') ){
		inputBtn.addEventListener('click', () => addDecimal() );
	}else if( inputBtn.classList.contains('operator') ){
		inputBtn.addEventListener('click', () => useOperator(inputBtn.value));
	}
});

clearBtn.addEventListener( 'click', resetAll );

function resetAll(){
	calculatorDisplay.textContent = 0;
	firstValue = 0;
	operatorValue = '';
	awaitingNextValue = false;
}



//bonus: attach the keyboard number buttons to our calculator