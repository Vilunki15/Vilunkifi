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
    
    if (previousList == null) {
        printList(currentList); //tulostaa nykyisen listan
        console.log('if')
        for (i = 0; i < 3; i++) {
            if (currentList[i] != 0) {
                calculate(i);
            }
        }

    }
    else {
        printList(previousList) //tulostaa edellisen listan
        console.log('else')
        printList(currentList) //tulostaa nykyisen listan
    }
    function calculate(i) {
        switch (i) {
            case 0:
                //2 kanta
                let baseTwo = currentList[0];
                let baseTen;
                let baseHex;
                break;
            case 1:
                //10 kanta
                break;
            case 2:
                //16 kanta
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
    return parseValue.toFixed(2);
}
function printList(list) {
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
    let floatList = [];
    for (i = 0; i < list.length; i++) {
        if (index.includes(i)) {
            floatList.push(list[i]);
        }
        else {
            floatList.push(parseFloat(list[i]));
        }
    }
    return floatList;
}