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
        let battInputList = [battEnergyUnit, battCurrentUnit, battVoltageUnit, battEnergy, battCurrent, battVoltage];
        //siirretään napin paikkaa toiseen flexboxiin mobiililla allaolevalla koodilla
        const moveButtonFrom = document.getElementById("moveButtonFrom");
        if (window.innerWidth < 768) {
            moveButtonFrom.remove();
            document.getElementById("moveButtonTo").innerHTML = '<button id="calculateButton">Laske</button>';
        }
        //laske ja reset nappien event listenerit
        //alla myös lambdat funktiokutsuille
        const battCallBackReset = () => {
            battEnergyCalc(battInputList, 0)
        }
        const battCallBackCalc = () => {
            //console.log(battEnergy.value)
            //printList(battInputList);
            battEnergyCalc(battInputList, 1)
        }
        const calculateButton = document.getElementById("calculateButton");
        calculateButton.addEventListener("click", battCallBackCalc);
        const resetButton = document.getElementById("resetButton");
        resetButton.addEventListener("click", battCallBackReset);
    }
    if (document.body.classList.contains("resistorCodeCalc")) {
        let lista = ['Tyhjä', 'Musta', 'Ruskea', 'Punainen', 'Oranssi', 'Keltainen', 'Vihreä', 'Sininen', 'Violetti', 'Harmaa', 'Valkoinen', 'Kulta', 'Hopea'];
        lista.forEach((item) => {
            console.log('<option value="'+ item +'">'+ item +'</option>')
        })
        console.log("toimii")
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
/** 
function battEnergyCalc(currentList, previousList) {
    //turhaa koodia, suunnitelmat muuttui!
    //kummastakin listasta seurataan numereesia, eli kolmea viimeistä arvoa
    //luodaan booleanit onko numereeniset arvot jotain muuta kuin 0
    //tarkistetaan myös onko prevlist null, koska ensimmäisellä ajokerralla se on
    //tämän jälkeen tulee ehtorakenne minkä eka lohko ajetaan kun numerot muuttuu ekan kerran
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
            //tarkistetaan onko eka vai muu ajokerta. sen jälkeen lasketaan muuttuneen indexin perusteella
            if (previousList == null) {
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
            }
        }
    }
    function calculate(i) {
        //laskufunktio ottaa argumentiksi i siemenarvoindexin
        //eli tulokset lasketaan i indexistä
        //luodaan myös lambdafunktiot jotka tulostavat arvot
        const printBattEnergy = (e) => {
            battEnergy.value = e;
        }
        const printBattCurrent = (a) => {
            battCurrent.value = a;
        }
        const printBattVoltage = (v) => {
            battVoltage.value = v;
        }
        switch (i) {
            case 3:
                console.log('e')
                //Wh = V * Ah

                break;
            case 4:
                console.log('a')
                //Ah = Wh / V

                break;
            case 5:
                console.log('v')
                //V = Wh / Ah
                break;
        }
    }
}
*/
function battEnergyCalc(inputList, mode) {
    const ignore = [0, 1, 2]
    inputList = parseList(inputList);
    inputList = stringToFloatList(inputList, ignore);
    let battEnergyUnit;
    let battCurrentUnit;
    let battVoltageUnit;
    let unitList = []; //i0 = e, i1 =  A, i2 = v
    if (inputList[0] == 'wh') {
        battEnergyUnit = 'wh';
        unitList.push(1);
    }
    else if (inputList[0] == 'mwh') {
        inputList[3] = inputList[3] * 1000;
        battEnergyUnit = 'mwh';
        unitList.push(1000);
    }
    else {
        inputList[3] = inputList[3] / 1000;
        battEnergyUnit = 'kwh';
        unitList.push(0.001);
    }
    if (inputList[1] == 'ah') {
        battCurrentUnit = 'Ah';
        unitList.push(1);
    }
    else if (inputList[1] == 'mah') {
        inputList[4] = inputList[4] * 1000;
        battCurrentUnit = 'mAh';
        unitList.push(1000);
    }
    else {
        inputList[4] = inputList[4] / 1000;
        battCurrentUnit = 'kAh';
        unitList.push(0.001);
    }
    if (inputList[2] == 'v') {
        battVoltageUnit = 'V';
        unitList.push(1);
    }
    else if (inputList[2] == 'mv') {
        inputList[5] = inputList[5] * 1000;
        battVoltageUnit = 'mV';
        unitList.push(1000);
    }
    else {
        inputList[5] = inputList[5] / 1000;
        battVoltageUnit = 'kV';
        unitList.push(0.001);
    }
    //alla tulostus lambdat jotka tulostaa halutun luvun domiin
    const printBattEnergy = (e) => {
        battEnergy.value = e + battEnergyUnit;
    }
    const printBattCurrent = (a) => {
        battCurrent.value = a + battCurrentUnit;
    }
    const printBattVoltage = (v) => {
        battVoltage.value = v + battVoltageUnit;
    }
    const reset = () => {
        battEnergy.value = 0;
        battCurrent.value = 0;
        battVoltage.value = 0;
    }
    switch (mode) {
        //mode 0 tai 1 tarkoittaa reset vai laske tilaa
        //Alla myös tarkistus että lukuja jotka eivät ole 0 on 2kpl
        case 0:
            //reset
            reset();
            break;
        case 1:
            //laske
            let zeros = 0;
            let floats = 0;
            for (i = 3; i < 6; i++) {
                if (inputList[i] === 0) {
                    zeros++;
                }
                else {
                    floats++;
                } 
            }
            if (zeros === 3 || floats === 3 || floats === 1) {
                //error
                alert('Syötä kaksi arvoa!');
                reset();
            }
            else {
                if (inputList[5] == 0) {
                    //V
                    let vOut = inputList[3] / inputList[4];
                    vOut = parseDesimals(vOut);
                    vOut = vOut * unitList[2];
                    printBattVoltage(vOut);
                }
                else if (inputList[4] == 0) {
                    //ah
                    let ahOut = inputList[3] / inputList[5];
                    ahOut = parseDesimals(ahOut);
                    ahOut = ahOut * unitList[1];
                    printBattCurrent(ahOut);
                }
                else if (inputList[3] == 0) {
                    //wh
                    let whOut = inputList[4] * inputList[5];
                    whOut = parseDesimals(whOut);
                    whOut = whOut * unitList[0];
                    printBattEnergy(whOut);
                }
            }
            printList(unitList);
            break;
        default:
            console.log('Something went wrong :( !');
            break;
    }
    //Wh = V * Ah 
    //V = Wh / Ah 
    //Ah = Wh / V 
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