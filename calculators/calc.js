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
    //akun energia:
    if (document.body.classList.contains("batteryEnergyCalc")) {
        const battEnergyUnit = document.getElementById("battEnergyUnit");
        const battCurrentUnit = document.getElementById("battCurrentUnit");
        const battVoltageUnit = document.getElementById("battVoltageUnit");
        const battEnergy = document.getElementById("battEnergy");
        const battCurrent = document.getElementById("battCurrent");
        const battVoltage = document.getElementById("battVoltage");
        const battInputList = [battEnergyUnit, battCurrentUnit, battVoltageUnit, battEnergy, battCurrent, battVoltage];
        let changeCount = 0;
        let previousList;
        let currentList;
        const battEventListener = () => {
            if (changeCount === 0) {
                const firstList = parseList(battInputList);
                battEnergyCalc(firstList, null);
                previousList = [...firstList];
                //console.log(1)
            }
            else {
                currentList = parseList(battInputList)
                battEnergyCalc(currentList, previousList);
                previousList = parseList(battInputList);
                //console.log(2)
            }
            changeCount++;
        }
        battInputList.forEach((item) => {
            item.addEventListener("change", battEventListener);
        })
    }
});
function accelerationCalc(accInputList) {
    //parsitaan listasta null:it pois ja otetaan valuet
    //accValues arvot ovat yksikk??, kiihtyyvys, pituus, nopeus
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
    //katsotaan yksikk?? ja tarvittaessa muunnetaan se.
    //Luodaan my??s boolean on yksikk?? mm jolloin tarvitaan muunnokset
    let isUnitMM = accValues[0] == 'mm';
    if (isUnitMM) { 
        for (i = 1; i < 4; i++) {
            accValues[i] = accValues[i] * 0.001;
        }
    }
    //luodaan yksikk??p????te
    let unitString;
    if (isUnitMM) {
        unitString = ' mm';
    }
    else {
        unitString = ' m'
    }
    //Tarkistetaan ett?? v??hint????n 2 arvoa
    //jolloin voi laskea kiihdytys ja jarrutusmatkan.
    if (accValues[1] == 0 || accValues[3] == 0) {
        //Liian v??h??n arvoja
        accOutputTrueFalse.value = 'Sy??t?? v??hint????n';
        accTargetSpeedDistance.value = 'kiihtyvyys ja';
        accLength.value = 'tavoitenopeus';
    }
    else if (accValues[1] != 0 && accValues[3] != 0 && accValues[2] == 0) {
        //kiihdytys ja jarrutusmatka laskettavissa
        accOutputTrueFalse.value = 'Sy??t?? matka'; 
        accTargetSpeedDistance.value = 'Sy??t?? matka';
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
            var accOutputTrueFalseValue = 'Kyll??';
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
    //Ehtii kiihty?? tarvitsee kaikki kolme arvoa
    //Matka halutussa nopeudessa tarvitsee kaikki kolme arvoa
    //Kiihdytysmatka (jerk 0) tarvitsee kiihtyyvyden ja halutun nopeuden
}
function baseConverter(currentList, previousList) {
    //ottaa argumenteiksi kaksi listaa. Ensimm??isella kerralla prevlist on aina null
    //muilla kerroilla vertailee listan eroja ja laskee sen arvon kohdan joka on muuttunut
    //alla on ensin muuttuneen kohdan valinta jonka j??lkeen tulee laskufunktio
    //funktiota kutsutaan aina kun lista muuttuu
    if (previousList == null) {
        //k??ynnistys
        for (i = 0; i < 3; i++) {
            if (currentList[i] != 0) {
                calculate(i);
            }
        }
    }
    else {
        //muut k??ytt??kerrat
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
    //funktiota kutsutaan aina kun lista muuttuu ja argumenttin?? on muuttunut indeksi
    //ensin on lambda-funktiot jotka tulostaa arvot ja sen j??lkeen itse muuntimet
    //muuntimet muuntava ensisijaisesti 10 kanta lukuun
    //jonka j??lkeen muunnetaan muihin arvoihin.
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
function battEnergyCalc(currentList, previousList) {
    //kummastakin listasta seurataan numereesia, eli kolmea viimeist?? arvoa
    //luodaan booleanit onko numereeniset arvot jotain muuta kuin 0
    //tarkistetaan my??s onko prevlist null, koska ensimm??isell?? ajokerralla se on
    //t??m??n j??lkeen tulee ehtorakenne mink?? eka lohko ajetaan kun numerot muuttuu ekan kerran
    //ja toinen lohko ajetaan kun numerot ovat muuttuneet n kertaa kun n != 0
    let isCurrentListNonZero = currentList[3] == 0 && currentList[4] == 0 && currentList[5] == 0;
    let isPreviousListNonZero;
    if (previousList != null) {
        isPreviousListNonZero = previousList[3] == 0 && previousList[4] == 0 && previousList[5] == 0;
    }
    //muutetaan vastakohdaksi
    isCurrentListNonZero = !isCurrentListNonZero;
    //ajokertalohkot:
    if (isCurrentListNonZero) {
        if (isPreviousListNonZero) {
            //eka ajokerta, lasketaan ainut != 0 arvon perusteella
            console.log('eka')
            for (i = 3; i > 6; i++) {
                if (currentList[i] != 0) {
                    calculate(i);
                }
            }
        }
        else {
            //tarkistetaan onko eka vai muu ajokerta. sen j??lkeen lasketaan muuttuneen indexin perusteella
            if (previousList == null) {
                console.log('eka')
                for (i = 3; i < 6; i++) {
                    if (currentList[i] != 0) {
                        calculate(i);
                    }
                }
            }
            else {
                let diffIndex = currentList.findIndex((value, index) => {
                    return value !== previousList[index];
                })
                if (diffIndex == -1) {
                    console.log('Something went wrong :(');
                }
                else {
                    calculate(diffIndex);
                }
                console.log('muut')
            }
        }
    }
    function calculate(i) {
        //laskufunktio ottaa argumentiksi i siemenarvoindexin
        //eli tulokset lasketaan i indexist??
        console.log(i);
        switch (i) {
            case 3:
                break;
            case 4:
                break;
            case 5:
                break;
            
        }
    }
}
function parseList(parsingList) {
    //ottaa sis????n listan jossa dom event listenerit
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
    //parsii ylim????r??iset desimaalit pois
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