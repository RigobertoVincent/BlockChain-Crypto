const axios = require('axios');
const ipc = require('electron').ipcRenderer;
const store = require('../../dataStore');

const walletBalance = document.getElementById('wallet-balance');
const selectedCoin = document.getElementById('selected-coin');
const numberOfCoins = document.getElementById('number-of-coins');
const totalPrice = document.getElementById('total-price');
const purchaseCoinsButton = document.getElementById('purchase-coins');


document.addEventListener('DOMContentLoaded', function() {
    for (let i = 0; i < store.get('coin').length; i++) {
        let li = document.createElement('li');
        let textNode = document.createTextNode(`${store.get('coin')[i].nameOfCrypto} : ${store.get('coin')[i].amount}`);
        li.appendChild(textNode);
        document.getElementById('owned-coins').appendChild(li);
    }
});


purchaseCoinsButton.addEventListener('click', (event) => {
    axios.get(`https://min-api.cryptocompare.com/data/price?fsym=${selectedCoin.value}&tsyms=USD`)
    .then(res => {
        let currentCoinPrice = res.data.USD;
        let total = currentCoinPrice * numberOfCoins.value;
        totalPrice.innerHTML = "" + total;
    })
    .then(() => {
        // send owned coins update
        ipc.send('update-list', [selectedCoin.value, numberOfCoins.value]);

        // send wallet update
        ipc.send('update-wallet', totalPrice.innerHTML);        
    })
    .then(() => {
        // TODO: FIX, CLEARING WAY TOO FAST. NEEDS DELAY OR IMPLEMENT DIFFERENTLY
        // reset total price
        totalPrice.innerHTML = "" + 0;
    })
    .catch((err) => {
        console.error(err);
    })

    
    // reset total price
    

    // update pie chart
});


// receives updated wallet information
ipc.on('wallet', (event, updatedWallet) => {
    walletBalance.innerHTML = updatedWallet;
});

// receives update list information
ipc.on('list', (event, updatedList) => {
    let li = document.createElement('li');
    let index = updatedList.length - 1;
    let textNode = document.createTextNode(`${updatedList[index].nameOfCrypto} : ${updatedList[index].amount}`);
    li.appendChild(textNode);
    document.getElementById('owned-coins').appendChild(li);
});