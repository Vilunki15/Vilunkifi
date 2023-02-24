
document.addEventListener("DOMContentLoaded", function() {
    //Kiihtyvyys eventListenerit ja funktiokutsu:
    if (document.body.classList.contains("accelerationCalc")) {
        const accUnit = document.getElementById("accUnit");
        const accAccel = document.getElementById("accAccel");
        const accDistance = document.getElementById("accDistance");
        const accTargetSpeed = document.getElementById("accTargetSpeed");
        const accInputs = [accUnit, accAccel, accDistance, accTargetSpeed];
        const accInputList = nullToZero(accInputs);
        const accEventListener = () => {
            accelerationCalc(accInputList);
        }
        accInputList.forEach(item => {
            item.addEventListener("change", accEventListener);
        });
    }
    //kantaluku eventlistenerit ja funktiokutsu:
    if (document.body.classList.contains("baseNumCalc")) {
        const baseBinary = document.getElementById("baseBinary");
        const baseNumber = document.getElementById("baseNumber");
        const baseHex = document.getElementById("baseHex");
        const baseInputs = [baseBinary, baseNumber, baseHex];
        const baseInputList = nullToZero(baseInputs);
        const baseEventListener = () => {
            console.log('y toimi');
        }
        baseInputList.forEach((item) => {
            item.addEventListener("change", baseEventListener);
        });
    }
});

function accelerationCalc(accInputList) {
    //Otetaan accInputList arvoista valuet jotka lisätään uuteen
    //accValues listaan. Jos arvo on tyhjä sen tilalle laitetaan 0.
    //accValues arvot ovat yksikkö, kiihtyyvys, pituus, nopeus
    let accValues = [];
    accInputList.forEach(item => {
        if (item.value == '') {
            accValues.push(0);
        }
        else {
            accValues.push(item.value);
        }
    });
    //Muunnetaan string muotoiset numeroarvot int. 
    for (i = 1; i < 4; i++) {
        let parseValue = parseInt(accValues[i]);
        accValues[i] = parseValue;
    }
    //katsotaan yksikkö ja tarvittaessa muunnetaan se.
    //Luodaan myös boolean on yksikkö mm jolloin tarvitaan muunnokset
    let isUnitMM = accValues[0] == 'mm';
    if (isUnitMM) {
        for (i = 1; i < 4; i++) {
            accValues[i] = accValues[i] * 0.001;
        }
    }
    //console.log(isUnitMM);
    //console.log(accValues);
    //Tarkistetaan että vähintään 2 arvoa
    //jolloin voi laskea kiihdytys ja jarrutusmatkan.
    if (accValues[1] == 0 || accValues[3] == 0) {
        //Liian vähän arvoja
        accOutputTrueFalse.value = 'Syötä vähintään';
        accTargetSpeedDistance.value = 'kiihtyvyys ja';
        accLength.value = 'tavoitenopeus';
    }
    else if (accValues[1] != 0 && accValues[3] != 0 && accValues[2] == 0) {
        //kiihdytys ja jarrutusmatka laskettavissa
        accOutputTrueFalse.value = 'Syötä matka'; 
        accTargetSpeedDistance.value = 'Syötä matka';
        let accLengthValue = (accValues[3] * accValues[3]) / (2 * accValues[1]);
        if (isUnitMM) {
            accLengthValue = accLengthValue * 1000;
        }
        accLength.value = accLengthValue;
    }
    else if (accValues[1] != 0 && accValues[2] != 0 && accValues[3] != 0) {
        //kaikki arvot laskettavissa
        let accOutputBoolValue = (accValues[3] < Math.sqrt(2 * accValues[1] * (accValues[2] / 2)));
        let accTargetSpeedDistanceValue = accValues[2] - (2 * (accValues[3] * accValues[3]) / (2 * accValues[1]));
        let accLengthValue = (accValues[3] * accValues[3]) / (2 * accValues[1]);
        if (accOutputBoolValue) {
            var accOutputTrueFalseValue = 'Kyllä';
        }
        else {
            var accOutputTrueFalseValue = 'Ei';
        }
        if (isUnitMM) {
            accTargetSpeedDistanceValue = accTargetSpeedDistanceValue * 1000;
            accLengthValue = accLengthValue * 1000;
        }
        let accLengthValueParsed = parseDesimals(accLengthValue);
        let accTargetSpeedDistanceValueParsed = parseDesimals(accTargetSpeedDistanceValue);
        accOutputTrueFalse.value = accOutputTrueFalseValue; 
        accTargetSpeedDistance.value = accTargetSpeedDistanceValueParsed;
        accLength.value = accLengthValueParsed;
    }
    else {
        accOutputTrueFalse.value = 'error';
        accTargetSpeedDistance.value = 'error';
        accLength.value = 'error';
        console.log('Something went wrong!');
    }
    //Ehtii kiihtyä tarvitsee kaikki kolme arvoa
    //Matka halutussa nopeudessa tarvitsee kaikki kolme arvoa
    //Kiihdytysmatka (jerk 0) tarvitsee kiihtyyvyden ja halutun nopeuden
}
//function baseConverter(baseInputList) {
    //console.log('a toimii');
//}
function parseDesimals(parseValue) {
    return parseValue.toFixed(2);
}
function nullToZero(ptNullList) {
    //tarkistaa onko jokin arvo null, jos on laittaa sen tilalle 0
    //palauttaa uuden listan. 
    let checkedList = [];
    for (i = 0; i < ptNullList.length; i++) {
        if (ptNullList[i] == null) {
            checkedList.push(0);
        }
        else {
            checkedList.push(ptNullList[i]);
        }
    }
    return checkedList;
}