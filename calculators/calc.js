
document.addEventListener("DOMContentLoaded", function() {
    
    
    
    //Kiihtyvyys eventListenerit:
    const accUnit = document.getElementById("accUnit");
    const accInput1 = document.getElementById("accInput1");
    const accInput2 = document.getElementById("accInput2");
    const accInput3 = document.getElementById("accInput3");
    const accEventListener = () => {
        accelerationCalc(accList);
    }
    const accList = [accUnit, accInput1, accInput2, accInput3];
    accList.forEach(item => {
        item.addEventListener("change", accEventListener);
    });
});

function accelerationCalc(accList) {
    let values = [];
    accList.forEach(item => {
        if (item.value == '') {
            values.push(0);
        }
        else {
            values.push(item.value);
        }
    });
    //console.log(values);
    for (i = 1; i < 4; i++) {
        let parseValue = parseInt(values[i]);
        values[i] = parseValue;
    }
    if (values[0] == 'm') {
        values.forEach(item => {

        })
    }
    console.log(values);
}