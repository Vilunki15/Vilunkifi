
document.addEventListener("DOMContentLoaded", function() {
    
    
    
    //Kiihtyvyys eventListenerit ja funktiokutsu:
    const accUnit = document.getElementById("accUnit");
    const accAccel = document.getElementById("accAccel");
    const accDistance = document.getElementById("accDistance");
    const accTargetSpeed = document.getElementById("accTargetSpeed");
    const accEventListener = () => {
        accelerationCalc(accInputList);
    }
    const accInputList = [accUnit, accAccel, accDistance, accTargetSpeed];
    accInputList.forEach(item => {
        item.addEventListener("change", accEventListener);
    });
    //Kiihtyvyys tulokset:
    const accOutputTrueFalse = document.getElementById("accOutputTrueFalse");
    const accTargetSpeedDistance = document.getElementById("accTargetSpeedDistance");
    const accLength = document.getElementById("accLength");
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
    console.log(isUnitMM);
    console.log(accValues);
    //Tarkistetaan että vähintään 2 arvoa
    //jolloin voi laskea kiihdytys ja jarrutusmatkan.
    if (accValues[1] == 0 || accValues[3] == 0) {
        //Liian vähän arvoja
        accOutputTrueFalse.value = 'Syötä vähintään' 
        accTargetSpeedDistance.value = 'kiihtyvyys ja'
        accLength.value = 'tavoitenopeus'
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
        let accLengthValue = (accValues[3] * accValues[3]) / (2 * accValues[1]);
        let accOutputTrueFalseValue = (accValues[3] < Math.sqrt(2 * accValues[1] * (accValues[2] / 2)));
        let 
        
        
        accOutputTrueFalse.value = '2' 
        accTargetSpeedDistance.value = 'kiihtyvyys ja'
        accLength.value = 'tavoitenopeus'

    }
    else {
        accOutputTrueFalse.value = 'error' 
        accTargetSpeedDistance.value = 'error'
        accLength.value = 'error'
        console.log('Something went wrong!')
    }
    //Ehtii kiihtyä tarvitsee kaikki kolme arvoa
    //Matka halutussa nopeudessa tarvitsee kaikki kolme arvoa
    //Kiihdytysmatka (jerk 0) tarvitsee kiihtyyvyden ja halutun nopeuden
}
