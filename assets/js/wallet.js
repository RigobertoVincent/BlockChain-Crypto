const axios = require('axios');
const { text } = require('express');
const ipc = require('electron').ipcRenderer;

const walletBalance = document.getElementById('wallet-balance');
const selectedCoin = document.getElementById('selected-coin');
const numberOfCoins = document.getElementById('number-of-coins');
const totalPrice = document.getElementById('total-price');
const purchaseCoinsButton = document.getElementById('purchase-coins');

const ownedCoins = document.getElementById('owned-coins');

purchaseCoinsButton.addEventListener('click', (event) => {
    axios.get(`https://min-api.cryptocompare.com/data/price?fsym=${selectedCoin.value}&tsyms=USD`)
    .then(res => {
        let currentCoinPrice = res.data.USD;
        let total = currentCoinPrice * numberOfCoins.value;
        totalPrice.innerHTML = "" + total;
    })
    .catch((err) => {
        console.error(err);
    })

    console.log(selectedCoin.value);
    ipc.send('update-wallet', selectedCoin.value);
    
    
    // reset total price
    

    // once purchased, add new coins to ownedCoins


    // change wallet balance


    // update pie chart
});


// receives updated wallet information
ipc.on('wallet', (event, updatedWallet) => {
    console.log(updatedWallet);
    let node = document.createElement('li');
    let textNode = document.createTextNode(updatedWallet.todos[0].toString());
    node.appendChild(textNode);
    ownedCoins.appendChild(node);
})