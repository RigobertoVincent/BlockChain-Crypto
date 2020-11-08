const ctx = document.getElementById('pie-chart');
const store = require('../../dataStore');
const listOfCryptos = store.get('coin');

// TODO : COUNT ALL OF THE DATA INSIDE OF ELECTRON STORE AND THEN LOAD
// BTC ETH LINK BCH LTC
// nameOfCrypto, amount
let BTC = 0;
let ETH = 0; 
let LINK = 0
let BCH = 0;
let LTC = 0;
for (let i = 0; i < listOfCryptos.length; i++) {
    if (listOfCryptos[i].nameOfCrypto == 'BTC') {
        BTC += Number(listOfCryptos[i].amount);
    } else if (listOfCryptos[i].nameOfCrypto == 'ETH') {
        ETH += Number(listOfCryptos[i].amount);
    } else if  (listOfCryptos[i].nameOfCrypto == 'LINK') {
        LINK += Number(listOfCryptos[i].amount);
    } else if (listOfCryptos[i].nameOfCrypto == 'BCH') {
        BCH += Number(listOfCryptos[i].amount);
    } else {
        LTC += Number(listOfCryptos[i].amount);
    }
}


let dataOptions = {
    datasets: [{
        data: [BTC, ETH, LINK, BCH, LTC],
        backgroundColor: ["rgb(255, 99, 132)","rgb(54, 162, 235)","rgb(255, 205, 86)", "rgb(54, 235, 69)", "rgb(252, 81, 227)"]
    }],

    // These labels appear in the legend and in the tooltips when hovering different arcs
    labels: [
        'BTC',
        'ETH',
        'LINK',
        'BCH',
        'LTC'
    ],
};

let options = {
    // no options for now
}

const myDoughnutChart = new Chart(ctx, {
    type: 'doughnut',
    data: dataOptions,
    options: options
});


