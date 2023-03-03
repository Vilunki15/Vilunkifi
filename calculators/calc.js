document.addEventListener("DOMContentLoaded", function() {
    //Kiihtyvyys eventListenerit ja funktiokutsu:
    if (document.body.classList.contains("accelerationCalc")) {
        const accUnit = document.getElementById("accUnit");
        const accAccel = document.getElementById("accAccel");
        const accDistance = document.getElementById("accDistance");
        const accTargetSpeed = document.getElementById("accTargetSpeed");
        const accInputList = [accUnit, accAccel, accDistance, accTargetSpeed];
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
        const baseInputList = [baseBinary, baseNumber, baseHex];
        let changeCount = 0;
        let previousList;
        let currentList;
        const baseEventListener = () => {
            if (changeCount === 0) {
                const firstList = parseList(baseInputList);
                baseConverter(firstList, null);
                previousList = [...firstList];
            } else {
                currentList = parseList(baseInputList);
                baseConverter(currentList, previousList);
                previousList = parseList(baseInputList);
            }
            changeCount++;
        }
        baseInputList.forEach((item) => {
            item.addEventListener("change", baseEventListener);
        });
        
    }
});
function accelerationCalc(accInputList) {
    //parsitaan listasta null:it pois ja otetaan valuet
    //accValues arvot ovat yksikkö, kiihtyyvys, pituus, nopeus
    let accValues = parseList(accInputList);
    //Muunnetaan string muotoiset numeroarvot float.
    let ignoreIndex = [0];
    accValues = stringToFloatList(accValues, ignoreIndex);
    /** 
    for (i = 1; i < 4; i++) {
        let parseValue = parseFloat(accValues[i]);
        accValues[i] = parseValue;
    }
    */
    //katsotaan yksikkö ja tarvittaessa muunnetaan se.
    //Luodaan myös boolean on yksikkö mm jolloin tarvitaan muunnokset
    let isUnitMM = accValues[0] == 'mm';
    if (isUnitMM) { 
        for (i = 1; i < 4; i++) {
            accValues[i] = accValues[i] * 0.001;
        }
    }
    //luodaan yksikköpääte
    let unitString;
    if (isUnitMM) {
        unitString = ' mm';
    }
    else {
        unitString = ' m'
    }
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
        let accLengthValueParsed = parseDesimals(accLengthValue);
        accLength.value = accLengthValueParsed + unitString;
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
        accTargetSpeedDistance.value = accTargetSpeedDistanceValueParsed + unitString;
        accLength.value = accLengthValueParsed + unitString;
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
function baseConverter(currentList, previousList) {
    //ottaa argumenteiksi kaksi listaa. Ensimmäisella kerralla prevlist on aina null
    //muilla kerroilla vertailee listan eroja ja laskee sen arvon kohdan joka on muuttunut
    //alla on ensin muuttuneen kohdan valinta jonka jälkeen tulee laskufunktio
    //funktiota kutsutaan aina kun lista muuttuu
    if (previousList == null) {
        //käynnistys
        for (i = 0; i < 3; i++) {
            if (currentList[i] != 0) {
                calculate(i);
            }
        }

    }
    else {
        //muut käyttökerrat
        let diffIndex = currentList.findIndex((value, index) => {
            return value !== previousList[index];
        })
        if (diffIndex == -1) {
            console.log('Something went wrong :(');
        }
        else {
            calculate(diffIndex);
        }
    }
    //funktiota kutsutaan aina kun lista muuttuu ja argumenttinä on muuttunut indeksi
    //ensin on lambda-funktiot jotka tulostaa arvot ja sen jälkeen itse muuntimet
    //muuntimet muuntava ensisijaisesti 10 kanta lukuun
    //jonka jälkeen muunnetaan muihin arvoihin.
    //toString metodi ei toimi valmiiksi string muotoisilla "numeroilla", 
    //joten siksi parsitaan
    function calculate(i) {
        const printBinary = (bin) => {
            baseBinary.value = bin;
        }
        const printNumber = (num) => {
            baseNumber.value = num;
        }
        const printHex = (hex) => {
            baseHex.value = hex;
        }
        switch (i) {
            case 0:
                //2 kanta
                let firstCaseBin = currentList[0];
                let firstCaseTen = parseInt(firstCaseBin, 2)
                let firstCaseHex = firstCaseTen.toString(16)
                printNumber(firstCaseTen);
                printHex(firstCaseHex);
                break;
            case 1:
                //10 kanta
                let secondCaseTen = currentList[1];
                secondCaseTen = parseInt(secondCaseTen);
                let secondCaseBin = secondCaseTen.toString(2);
                let secondCaseHex = secondCaseTen.toString(16);
                printBinary(secondCaseBin);
                printHex(secondCaseHex);
                break;
            case 2:
                //16 kanta
                let thirdCaseHex = currentList[2];
                let thirdCaseTen = parseInt(thirdCaseHex, 16);
                thirdCaseTen = parseInt(thirdCaseTen);
                let thirdCaseBin = thirdCaseTen.toString(2);
                printBinary(thirdCaseBin);
                printNumber(thirdCaseTen);
                break;
            default:
                console.log('Something went wrong :(');
                break;
        }
    }
}
function parseList(parsingList) {
    //ottaa sisään listan jossa dom event listenerit
    //ottaa .value metodilla arvot
    //jotka palautetaan listana.
    let outputList = [];
    let runTimeValue;
    for (i = 0; i < parsingList.length; i++) {
        runTimeValue = parsingList[i].value;
        if (runTimeValue == null || runTimeValue == '') {
            outputList.push(0);
        }
        else {
            outputList.push(runTimeValue)
        }
    }
    return outputList;
}
function parseDesimals(parseValue) {
    //parsii ylimääräiset desimaalit pois
    return parseValue.toFixed(2);
}
function printList(list) {
    //tulostaa konsoliin listan arvot
    list.forEach((item) => {
        if (item.value != null) {
            console.log(item.value);
        }
        else {
            console.log(item);
        }
    })
}
function stringToFloatList(list, index) {
    //ottaa list listasta string numerot jotka muunnetaan
    //floatiksi lukuunottamatta index ignorelistaa
    //kirjaimet muuttuvat NaN
    let floatList = [];
    if (index != null) {
        for (i = 0; i < list.length; i++) {
            if (index.includes(i)) {
                floatList.push(list[i]);
            }
            else {
                floatList.push(parseFloat(list[i]));
            }
        }
    }
    else {
        for (i = 0; i < list.length; i++) {
            floatList.push(parseFloat(list[i]));
        }
    }
    return floatList;
}