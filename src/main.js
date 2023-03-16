const result = document.querySelector('.result')
const buttons = document.querySelectorAll('.buttons')
const operatorPrecedence = {
    addSubtract: {
        value: 1
    },
    multiplyDivide: {
        value: 2
    },
    power: {
        value: 3
    }
}
const acceptedNumInputs = [
    '1', '2', '3', '4',
    '5', '6', '7', '8',
    '9', '0', '.'
]
const acceptedOpInputs = [
    '+', '-',
    '/', '*', '^'
]
const acceptedfunctions = [
    'sin', 'cos', 'tan',
    'log'
]
const parenthesis = [
    '(', ')'
]

let token = []
let output = []
let operatorStack = []
let finalAnswer = 0
let postfixStack = []

function refreshPage() {
    location.reload()
    setTimeout(() => {
        result.value = "Shutting down..."
    }, 2000)

}

// to check if string is a number
function isNumeric(num) {
    return !isNaN(num)
}

// some calculator functions 
function clearInput() {
    result.value = ``
    token = []
}

function deleteChar() {
    let array = result.value.split('')
    array.pop()
    result.value = array.join('')
}

function collectToken() {
    token = []

    let userInput = result.value // 9*2+1
    let formedToken = ''
    let funcCount = 0

    // add to length of array since I am reformatting the formed token to and empty string
    for (let i = 0; i < userInput.length; i++) {
        if (acceptedfunctions.includes(userInput.slice(i, i + 3))) {
            funcCount += 2
        }
    }

    // to push all tokens as elements to a single array
    for (let i = 0; i < userInput.length + funcCount + 2; i++) {

        if (acceptedNumInputs.includes(userInput[i])) {
            formedToken += userInput[i]
        } else if (acceptedfunctions.includes(userInput.slice(i, i + 3))) {
            token.push(`${userInput.slice(i, i + 3)}`)
            i += 2
            formedToken = ''
        } else {
            token.push(formedToken)
            token.push(userInput[i])
            formedToken = ''
        }
    }

    // this will show that token has empty and undefined elements
    console.log(token)
        // help filter the empty and undefined elements
    token = token.filter(element => element);
    // displays the new filtered set of token
    console.log(token)
}

function solveEquation(op1, op2, perform) {
    switch (perform) {
        case '+':
            return Number(op1) + Number(op2)
        case '-':
            return Number(op1) - Number(op2)
        case '*':
            return Number(op1) * Number(op2)
        case '/':
            return Number(op1) / Number(op2)
        case '^':
            return Math.pow(op1, op2)
    }
}

function solveFunction(op1, perform) {
    switch (perform) {
        case 'sin':
            return Math.sin(Number(op1))
        case 'cos':
            return Math.cos(Number(op1))
        case 'tan':
            return Math.tan(Number(op1))
        case 'log':
            return Math.log(Number(op1))
    }
}

function evaluatePostfix() {
    index = 0

    while (index < output.length) {
        let currentElement = output[index]

        if (isNumeric(currentElement)) {
            postfixStack.push(currentElement)
        } else if (acceptedfunctions.includes(currentElement)) {
            let operand1 = postfixStack.pop()
            let answer = solveFunction(operand1, currentElement)
            postfixStack.push(answer)
        } else {
            let operand1 = postfixStack.pop()
            let operand2 = postfixStack.pop()
            let answer = solveEquation(operand2, operand1, currentElement)
            postfixStack.push(answer)
        }
        index++
    }
    finalAnswer = postfixStack.pop()
    result.value = finalAnswer
    console.log(finalAnswer)
}

// main calculator logic
function toRPN() {

    //collects all token from user input
    collectToken()

    let tokenLength = token.length
    let count = 0

    while (count !== tokenLength) {
        let currentToken = token[count]

        if (isNumeric(currentToken)) {
            output.push(currentToken)
        } else if (acceptedfunctions.includes(currentToken)) {
            operatorStack.push(currentToken)
        } else if (acceptedOpInputs.includes(currentToken)) {

            let o2 = operatorStack[operatorStack.length - 1]
            let o1 = currentToken

            let o2Hierarchy = 0
            let o1Hierarchy = 0

            // to determine the precedence of the operator
            switch (o2) {
                case '+':
                case '-':
                    o2Hierarchy = operatorPrecedence.addSubtract.value
                    break
                case '/':
                case '*':
                    o2Hierarchy = operatorPrecedence.multiplyDivide.value
                    break
                case '^':
                    o2Hierarchy = operatorPrecedence.power.value
            }

            switch (o1) {
                case '+':
                case '-':
                    o1Hierarchy = operatorPrecedence.addSubtract.value
                    break
                case '/':
                case '*':
                    o1Hierarchy = operatorPrecedence.multiplyDivide.value
                    break
                case '^':
                    o1Hierarchy = operatorPrecedence.power.value
            }

            while (operatorStack.length && o2Hierarchy >= o1Hierarchy) {
                output.push(operatorStack.pop())
            }

            operatorStack.push(o1)

        } else if (currentToken === '(') {
            operatorStack.push(currentToken)
        } else if (currentToken === ')') {
            while (operatorStack[operatorStack.length - 1] !== '(') {
                if (operatorStack.length !== 0) { output.push(operatorStack.pop()) }
            }
            if (operatorStack[operatorStack.length - 1] === '(') {
                operatorStack.pop();
            }
            if (operatorStack.includes(operatorStack[operatorStack.length - 1])) {
                output.push(operatorStack.pop())
            }
        }
        count++
    }

    while (operatorStack.length !== 0) {
        if (operatorStack[operatorStack.length - 1] !== '(') {
            output.push(operatorStack.pop())
        }

    }

    console.log(output)

    //to solve the postfix expression

    evaluatePostfix()
    console.log(output)
}


// creates the button simulation 
for (let i = 1; i < buttons.length; i++) {

    let currentButton = buttons[i - 1]
    let buttonValue = currentButton.innerText

    if (buttonValue !== 'ans' &&
        buttonValue !== 'del' &&
        buttonValue !== 'Answer' &&
        buttonValue !== 'clear' &&
        buttonValue !== 'off') {
        currentButton.addEventListener('click', () => {
            result.value += currentButton.innerText;
        })
    }
}