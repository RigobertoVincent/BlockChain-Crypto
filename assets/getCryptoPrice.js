const axios = require('axios')

const name = document.getElementById('name');
const img = document.getElementById('image');
const price = document.getElementById('price');
const topTenCrypto = ['BTC', 'ETH', 'LINK', 'BCH', 'LTC', 'XRP', 'TRX', 'EOS', 'BNB', 'BSV'];
const imageArray = [];

(function getTopTenCryptos() {
    for (const coin of topTenCrypto) {
        axios.get(`https://min-api.cryptocompare.com/data/price?fsym=${coin}&tsyms=USD`)
        .then(res => {
            let node = document.createElement("li");
            let nameNode = document.createTextNode(`Coin: ${coin} Price: ${res.data.USD}`);
            node.appendChild(nameNode);
            document.getElementById('coins').appendChild(node);
        })
        .catch(err => {
            console.error(err);
        })
    }
})()