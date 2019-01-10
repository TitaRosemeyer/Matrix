const matheButton = document.querySelector('.mathe button');
const matheButtons = document.querySelectorAll('.mathe button');
const redBox = document.querySelector('.redBox');
let redBoxComputedStyle = window.getComputedStyle(redBox),
    breite = redBoxComputedStyle.getPropertyValue('width');
const redboxbegin = breite;
const meter = document.querySelector('.meter');
let meterComputedStyle = window.getComputedStyle(meter),
    laenge = meterComputedStyle.getPropertyValue('width');
const meterlaenge = laenge;
const resetButton = document.querySelector('.overgame button');
const target = document.querySelector('.target');

const ggt = (a,b) => {
    while(b>0){
        let h=a%b;
        a=b;
        b=h;
    }
    return a;
}
const kgv = (a,b) => {
    return a*b/ggt(a,b);
}

const matheButtonOnClick = (event) => {
    ergebnis();
    console.log('mathe button click');
    
}

const ergebnis = () => {
    let a=Number(document.getElementById("zahl1").value);
    let b=Number(document.getElementById("zahl2").value);
    if(isNaN(a) || isNaN(b) ){
        document.getElementById("sumergebnis").innerHTML="!";
        document.getElementById("produktergebnis").innerHTML="!";
        document.getElementById("potenzergebnis").innerHTML="!";
        document.getElementById("kgvergebnis").innerHTML="!";
        throw "Please enter two numbers";
    }
    document.getElementById("sumergebnis").innerHTML=a+b;
    document.getElementById("produktergebnis").innerHTML=a*b;
    let h=a**b;
    if(h>9999){
        h = h.toExponential(3);
    }
    document.getElementById("potenzergebnis").innerHTML=h;
    document.getElementById("kgvergebnis").innerHTML=kgv(a,b);
};

const redBoxOnClick =(event) => {
    console.log("redBox clicked");
    stop();
}
const stop = () => {
    let computedStyle = window.getComputedStyle(redBox),
        width = computedStyle.getPropertyValue('width');
    redBox.classList.remove("redBoxTransition");
    redBox.style.width=width;
    console.log(width);
    let targetpoint = parseFloat(target.style.left)+6.8;
    console.log(targetpoint);
    score(targetpoint-100, parseFloat(width)-100);
}
const score = (ideal, actual) => {
    let fp = Math.abs(1-actual/ideal)*100;
    console.log(fp);
    let points;
    if(fp<5){
        points = 10;
    } else if (fp < 15){
        points = 5;
    } else if(fp < 30){
        points = 1;
    } else{
        points=0;
    }
    console.log(points);
}
const newgame = () => {
    let percent= Math.random();
    let max = parseFloat(meterlaenge)-parseFloat(redboxbegin);
    target.style.left=(percent*max + 100 - 6.8) +"px";
    redBox.classList.add("redBoxTransition");
}

const resetButtonOnClick = (event) => {
    redBox.style.width= redboxbegin;
    redBox.classList.add("redBoxTransition");
    newgame();
}
newgame();
matheButton.addEventListener('click', matheButtonOnClick);
redBox.addEventListener('click', redBoxOnClick);
resetButton.addEventListener('click',resetButtonOnClick)
