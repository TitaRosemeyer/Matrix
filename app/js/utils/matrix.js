import { Number } from "core-js";
import { changeExt } from "upath";
import { networkInterfaces } from "os";
import { id } from "postcss-selector-parser";

//HTML-Elements
const variableNumberInput = document.getElementById('variableNumber');
const confirmButton = document.getElementById('confirmButton');
const solveButton = document.getElementById('solveButton');
const matrixTables = document.querySelectorAll('.matrixTable');
const realMatrixTable = document.getElementById('matrixTable');
const matrixTableHeader = document.getElementById('matrixTableHeader');
const randomButton = document.getElementById('randomFillButton');
const resetfinishedButtons = [randomButton, confirmButton];
const clickButtons = [confirmButton, randomButton, solveButton];
const animationspeedButtonsHelper = document.querySelectorAll('.animationButton'),
      animationspeedButtons = [];
animationspeedButtonsHelper.forEach(elem => {
    animationspeedButtons.push(elem)
});
const matrixCells = () => {
    return document.querySelectorAll('.matrixCell');
}
const matrixHeaders = () => {
    return document.querySelectorAll('.matrixHeader');
}

let isMatrixSolved = false;
let variableNumber = 2;
let beforeNumber = 2;
let animationspeed = 0;
let animationtime = 0;

//MatrixFunctions without HTML/CSS
const newmatrix = (length=3) => {
    if(length<=0){
        throw('Tried to create empty matrix');
    } else{ 
        let mymatrix = new Array(length);
        for (let i=0; i<length; i++){
            mymatrix[i] = new Array(length+1);
        }
        return mymatrix;
    }
}
const round = (zahl, nachkommastellen) => {
    var a = Math.pow(10, nachkommastellen);
    return (Math.round(zahl*a)/a);
}
const makeZero = (matrix, rowIndex, columnIndex) => {
    let i=rowIndex;
    let j= columnIndex;
    if(matrix[i][j]!=0){
        let factor = matrix[j][j]/matrix[i][j];
        matrix[i] = matrix[i].map(item=> factor*item);
        matrix[i] = matrix[i].map((item, index) => item - matrix[j][index]);
        matrix[i][j]=0;
    }
}
const solvematrix = (matrix) => {
    let l= matrix.length;
    for(let j=0; j<l-1; j++){
        for(let i=j+1; i<l; i++){
            makeZero(matrix, i, j);
        }
    }
    for(let j=l-1; j>=0; j--){
        if(matrix[j][j]!=0){
            let thedivider = matrix[j][j];
            matrix[j]=matrix[j].map(item => round(item/thedivider, 5));
            for(let i=j-1; i>=0; i--){
                makeZero(matrix, i, j);
            }
        }else{
            alert('Dieses Gleichungssystem hat keine eindeutige Loesung');
            for(let some = 0; some <l; some++){
                for(let another = 0; another<l+1;another++){
                    matrix[some][another] = '';
                }
            }
            break;
        }
    };
    solvedmatrix(matrix);
}
const celldiv = (now, before) => {
    let smaller = Math.min(now, before);
    let bigger = Math.max(now, before);
    let sum = 0;
    for(let i = smaller+1; i<=bigger; i++){
        sum+=i;
    }
    return 2*sum;
}
const setAnimationTime = (animationspeed) =>{
    switch (animationspeed) {
        case 1:
            animationtime = 1024;
            break;
        case 2:
            animationtime = 256;
            break;
        case 3:
            animationtime = 64;
            break;
        default: 
            animationtime = 0;
    }
}

//Neues Projekt: Visuelle Loesung einer Matrix
const solvedmatrix = (matrix) => {
    if (animationspeedButtons[0].classList.contains('deactivated')){
        animationspeedButtons[0].classList.replace('deactivated', 'buttontransition');
    }
    clickButtons.forEach((elem, index) => {
        elem.addEventListener('click', clickButtonsEvents[index]);
        elem.classList.replace('deactivated', 'buttontransition');
    });
    isMatrixSolved = true;
    addSolutions(matrix, matrixHeaders());
    displaymatrix(matrix, matrixCells());
}
const getRow = (matrixDisplayer, rowIndex, matrixLength) => {
    let rI = rowIndex;
    let mD = matrixDisplayer;
    let mL = matrixLength;
    let row = new Array(mL);
    let count = 0;
    for(let i=rI*(mL+1); i<(rI+1)*(mL+1); i++){
        row[count]=mD[i];
        count++;
    }
    return row;
}
const updateRow = (matrixDisplayer, rowIndex, matrix) => {
    getRow(matrixDisplayer, rowIndex, matrix.length).forEach((element, index) => {
        let matrixvalue = matrix[rowIndex][index];
        element.value=round(matrixvalue, 5);
    });
}
async function makeZeroVisual(matrix, rowIndex, columnIndex, matrixDisplayer, nowAnimationTime){
    let i=rowIndex;
    let j= columnIndex;
    let mD = matrixDisplayer;
    let thisRow = getRow(mD, i, matrix.length);
    let aT = nowAnimationTime;
    thisRow.forEach(elem => {
        elem.classList.add('changingStuff');
    });
    await sleep(aT);
    if(matrix[i][j]!=0){
        let factor = matrix[j][j]/matrix[i][j];
        matrix[i] = matrix[i].map(item=> factor*item);
        updateRow(mD, i, matrix);
        await sleep(aT);
        matrix[i] = matrix[i].map((item, index) => item - matrix[j][index]);
        matrix[i][j]=0;
        updateRow(mD, i, matrix);
        await sleep(aT);
    }
    thisRow.forEach(elem => {
        elem.classList.remove('changingStuff');
    });
    
}
const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}
async function solvematrixvisual(matrix) {
    let mC = matrixCells();
    let l= matrix.length;
    for(let j=0; j<l-1; j++){
        let thisRow = getRow(mC, j, l);
        thisRow.forEach(elem => {
            elem.classList.add('focusing');
        });
        await sleep(animationtime);
        for(let i=j+1; i<l; i++){
            let nowAnimationTime = animationtime;
            makeZeroVisual(matrix, i, j, mC, nowAnimationTime);
            await sleep(3*nowAnimationTime);
        }
        await sleep(animationtime);
        thisRow.forEach(elem => {
            elem.classList.remove('focusing');
        });
    }
    for(let j=l-1; j>=0; j--){
        if(matrix[j][j]!=0){
            let thisRow = getRow(mC, j, l);
            thisRow.forEach(elem => {
                elem.classList.add('changingStuff');
            });
            let thedivider = matrix[j][j];
            matrix[j][l]=matrix[j][l]/thedivider;
            matrix[j][j]=1;
            await sleep(animationtime);
            updateRow(mC, j, matrix);
            await sleep(animationtime);
            thisRow.forEach(elem => {
                elem.classList.replace('changingStuff', 'focusing');
            });
            for(let i=j-1; i>=0; i--){
                let nowAnimationTime = animationtime;
                makeZeroVisual(matrix, i, j, mC, nowAnimationTime);
                await sleep(3*nowAnimationTime);
            }
            thisRow.forEach(elem => {
                elem.classList.remove('focusing');
            });
        }else{
            alert('Dieses Gleichungssystem hat keine eindeutige Loesung');
            for(let some = 0; some <l; some++){
                for(let another = 0; another<l+1;another++){
                    matrix[some][another] = '';
                }
            }
            break;
        }
    }
    solvedmatrix(matrix);
}

//MatrixFunctions with HTML/CSS
const displaymatrix = (matrix, elementList) => {
    let count = 0;
    matrix.forEach(row => {
        row.forEach(cell =>{
            if (cell === ''){
                elementList[count].value=cell;
                count++;
            } else {
                let roundcell = round(cell, 5);
                if(roundcell !== 0){
                    elementList[count].classList.add('finished');
                }
                elementList[count].value=roundcell;
                count++;
            }
        });
    });
}
const changeColumnNumber = (newNumber) => {
    let text ='';
    for(let i=0; i<=newNumber; i++){
        text +=' auto';
    }
    for(let i=0; i<matrixTables.length; i++){
        matrixTables[i].style.gridTemplateColumns = text;
    }
}
const addCells = (beforeNumber, nowNumber, headerElement, matrixTableElement) => {
    let cellDiv = celldiv(nowNumber, beforeNumber);
    for(let i=beforeNumber+1; i<= nowNumber; i++ ){
        let numberCell = headerElement.lastChild;
        let newHeader = document.createElement('div');
        newHeader.className='matrixHeader cell';
        newHeader.innerHTML='x'+i;
        headerElement.insertBefore(newHeader, numberCell.previousSibling);
    }
    for(let i=0; i<cellDiv; i++){
        let newCell = document.createElement('input');
        newCell.className='matrixCell cell';
        matrixTableElement.appendChild(newCell);
    }
}
const removeCells = (beforeNumber, nowNumber, headerElement, matrixTableElement) => {
    let cellDiv = celldiv(nowNumber, beforeNumber);
    for(let i=nowNumber; i< beforeNumber; i++){
        let headCells = headerElement.childNodes;
        headerElement.removeChild(headCells[headCells.length-3]);
    }
    for(let i=0; i< cellDiv; i++){
        matrixTableElement.removeChild(matrixTableElement.lastChild);
    }      

}
const changeMatrixTable = (nowNumber, beforeNumber) => {
    changeColumnNumber(nowNumber);
    let cellDiv = celldiv(nowNumber, beforeNumber);
    if(nowNumber>beforeNumber){
        addCells(beforeNumber, nowNumber, matrixTableHeader, realMatrixTable);
    } else {  
        removeCells(beforeNumber, nowNumber, matrixTableHeader, realMatrixTable);
    }
}
const isAllNumbers = (elementList) => {
    let allnumbers = true;
    for(let i=0; i< elementList.length; i++){
        if(!elementList[i].value || isNaN(elementList[i].value)){
            elementList[i].classList.add('notANumber');
            allnumbers = false;
        } else {
            elementList[i].classList.remove('notANumber');
        }
    }
    return allnumbers;
}
const fillMatrix = (matrix, elementList) => {
    let length = matrix.length,
        count = 0;
    for(let i=0; i<length; i++){
        for(let j=0; j<=length; j++){
            matrix[i][j] = elementList[count].value;
            count++;
        }
    }
}
const addSolutions = (matrix, elementList) => {
    elementList.forEach((element, index) => {
        if(index<matrix.length){
            element.classList.add('hoverForToolTip');
            let solution = String(round(matrix[index][matrix.length], 5));
            element.setAttribute('data-number', solution);
        }
    });
}
const removeSolutions = (elementList) => {
    elementList.forEach(element => {
        element.classList.remove('hoverForToolTip');
    });
}

//EventFunctions
const variableNumberOnInput = (event) =>{
    variableNumber = parseInt(event.target.value) ;
}
const confirmButtonOnClick = (event) => {
    if(variableNumber>20){
        alert('Hoechstens 20 Variabeln. Du schaffst eh nicht mehr.');
    } else if(beforeNumber!=variableNumber){
        changeMatrixTable(variableNumber, beforeNumber);
        beforeNumber = variableNumber;
    } 
}
const solveButtonOnClick = (event) => {
    clickButtons.forEach((elem, index) => {
        elem.classList.replace('buttontransition', 'deactivated');
        elem.removeEventListener('click', clickButtonsEvents[index]);
    });
    removeSolutions(matrixHeaders())
    let mC = matrixCells();
    if(isAllNumbers(mC)){
        isMatrixSolved = false;
        let matrixToSolve = newmatrix(variableNumber);
        fillMatrix(matrixToSolve, mC);
        if(animationspeed>0){
            animationspeedButtons[0].classList.replace('buttontransition', 'deactivated');
            solvematrixvisual(matrixToSolve);
        } else {
            solvematrix(matrixToSolve);
        }
    } else {
        clickButtons.forEach((elem, index) => {
            elem.classList.replace('deactivated', 'buttontransition');
            elem.addEventListener('click', clickButtonsEvents[index]);
        });
        alert("Please enter a number in every cell of the matrix!");
    }
}
const randomButtonOnClick = (event) => {
    matrixCells().forEach(element => {
        element.value = Math.floor(Math.random()*1000);
    });
}
const resetfinished = (event) => {
    matrixCells().forEach(elem => {
        elem.classList.remove('finished');
    });
}
const animationspeedButtonsOnClick = (event) => {
    let index = animationspeedButtons.indexOf(event.target);
    if (isMatrixSolved || index !== 0){
        animationspeedButtons.forEach(elem => {
            if(elem != event.target){
                elem.classList.remove('selected');
            } else {
                elem.classList.add('selected');
            }
        });
        animationspeed =  index;
        setAnimationTime(animationspeed);
    } 
}

//EventListeners
variableNumberInput.addEventListener('input', variableNumberOnInput);
confirmButton.addEventListener('click', confirmButtonOnClick);
solveButton.addEventListener('click', solveButtonOnClick);
randomButton.addEventListener('click', randomButtonOnClick);
resetfinishedButtons.forEach(elem => {
    elem.addEventListener('click', resetfinished);
});
animationspeedButtons.forEach(elem => {
    elem.addEventListener('click', animationspeedButtonsOnClick)
});

variableNumberInput.value = '2';

const clickButtonsEvents = [confirmButtonOnClick, randomButtonOnClick, solveButtonOnClick];