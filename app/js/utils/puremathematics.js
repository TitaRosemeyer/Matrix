
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
const printmatrix = (matrix) => {
    let text='';
    matrix.forEach(element => {
        element.forEach((zahl, index) => {
            text += zahl + ' ';
            if(index == element.length-2){
                text += '| ';
            }
        });
        text += '\n';
    });
    text += '\n';
    return text;
}
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
