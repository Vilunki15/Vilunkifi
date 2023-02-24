
document.addEventListener("DOMContentLoaded", function() {
    
    
    
    //Kiihtyvyys eventListenerit:
    const accUnit = document.getElementById("accUnit");
    const accInput1 = document.getElementById("accInput1");
    const accInput2 = document.getElementById("accInput2");
    const accInput3 = document.getElementById("accInput3");
    const accEventListener = () => {
        accelerationCalc(accInputList);
    }
    const accInputList = [accUnit, accInput1, accInput2, accInput3];
    accInputList.forEach(item => {
        item.addEventListener("change", accEventListener);
    });
});

function accelerationCalc(accInputList) {
    //Otetaan accInputList arvoista valuet jotka lisätään uuteen
    //accValues listaan. Jos arvo on tyhjä sen tilalle laitetaan 0.
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
    if (accValues[0] == 'mm') {
        for (i = 1; i < 4; i++) {
            accValues[i] = accValues[i] * 0.001;
        }
    }
    console.log(accValues);
    if (accValues[1] == 0) {
        
    }
}
