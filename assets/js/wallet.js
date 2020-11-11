const axios = require('axios');
const ipc = require('electron').ipcRenderer;
const store = require('../../dataStore');

const walletBalance = document.getElementById('wallet-balance');
const selectedCoin = document.getElementById('selected-coin');
const numberOfCoins = document.getElementById('number-of-coins');
const totalPrice = document.getElementById('total-price');
const purchaseCoinsButton = document.getElementById('purchase-coins');


document.addEventListener('DOMContentLoaded', function() {  
    // update updated coins cards
    let data = store.get('coin');
    let updatedCoins = {
        'BTC': 0,
        'ETH': 0,
        'LINK': 0,
        'BCH': 0,
        'LTC': 0
    };

    for (let i = 0; i < data.length; i++) {
        if (data[i].nameOfCrypto == 'BTC') {
            updatedCoins.BTC = Number(data[i].amount);

        } else if (data[i].nameOfCrypto == 'ETH') {
            updatedCoins.ETH = Number(data[i].amount);

        } else if (data[i].nameOfCrypto == 'LINK') {
            updatedCoins.LINK = Number(data[i].amount);

        } else if (data[i].nameOfCrypto == 'BCH') {
            updatedCoins.BCH = Number(data[i].amount);

        } else {
            updatedCoins.LTC = Number(data[i].amount);
        }
    }

    for (const key in updatedCoins) {
        let li = document.createElement('li');
        let textNode = document.createTextNode(`${key} : ${updatedCoins[key]}`);
        li.appendChild(textNode);
        document.getElementById('owned-coins').appendChild(li);
    }

    // load balance
    if (!store.get('wallet')) {
        walletBalance.innerHTML = 0;
    } else {
        walletBalance.innerHTML = store.get('wallet').toFixed(2);
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
    .catch((err) => {
        console.error(err);
    })
});


// receives updated wallet information
ipc.on('wallet', (event, updatedWallet) => {
    walletBalance.innerHTML = updatedWallet;
});

// receives update list information
ipc.on('list', (event, updatedList) => {
   let updatedCoins = {
        'BTC': 0,
        'ETH': 0,
        'LINK': 0,
        'BCH': 0,
        'LTC': 0
    };

    for (let i = 0; i < updatedList.length; i++) {
        if (updatedList[i].nameOfCrypto == 'BTC') {
            updatedCoins.BTC = Number(updatedList[i].amount);

        } else if (updatedList[i].nameOfCrypto == 'ETH') {
            updatedCoins.ETH = Number(updatedList[i].amount);

        } else if (updatedList[i].nameOfCrypto == 'LINK') {
            updatedCoins.LINK = Number(updatedList[i].amount);

        } else if (updatedList[i].nameOfCrypto == 'BCH') {
            updatedCoins.BCH = Number(updatedList[i].amount);

        } else {
            updatedCoins.LTC = Number(updatedList[i].amount);
        }
    }

    let ul = document.getElementById('owned-coins');
    let li = ul.getElementsByTagName('li');
    
    for (let i = 0; i < Object.values(updatedCoins).length; i++) {
        li[i].innerHTML = `${Object.keys(updatedCoins)[i]} : ${Object.values(updatedCoins)[i]}`;
    }
});