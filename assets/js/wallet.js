const axios = require('axios');
const ipc = require('electron').ipcRenderer;
const store = require('../../dataStore');

const walletBalance = document.getElementById('wallet-balance');
const selectedCoin = document.getElementById('selected-coin');
const numberOfCoins = document.getElementById('number-of-coins');
const totalPrice = document.getElementById('total-price');
const purchaseCoinsButton = document.getElementById('purchase-coins');


document.addEventListener('DOMContentLoaded', function() {
    // create new array of coins
    let updatedCoins = {
        'BTC': 0,
        'ETH': 0,
        'LINK': 0,
        'BCH': 0,
        'LTC': 0
    };

    // loop through the store coins 
    let storeData = store.get('coin')
    for (let i = 0; i < storeData.length; i++) {
        if (storeData[i].nameOfCrypto == 'BTC') {
            updatedCoins.BTC = storeData[i].amount;

        } else if (storeData[i].nameOfCrypto == 'ETH') {
            updatedCoins.ETH = storeData[i].amount;

        } else if (storeData[i].nameOfCrypto == 'LINK') {
            updatedCoins.LINK = storeData[i].amount;

        } else if (storeData[i].nameOfCrypto == 'BCH') {
            updatedCoins.BCH = storeData[i].amount;

        } else {
            updatedCoins.LTC = storeData[i].amount;
        }
    }

    console.log(updatedCoins);

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
// ipc.on('list', (event, updatedList) => {
//     let li = document.createElement('li');
//     let index = updatedList.length - 1;
//     let textNode = document.createTextNode(`${updatedList[index].nameOfCrypto} : ${updatedList[index].amount}`);
//     li.appendChild(textNode);
//     document.getElementById('owned-coins').appendChild(li);
// });