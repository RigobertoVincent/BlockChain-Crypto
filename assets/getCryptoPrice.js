const axios = require('axios')

const name = document.getElementById('name');
const img = document.getElementById('image');
const price = document.getElementById('price');
const topTenCrypto = ['BTC', 'ETH', 'LINK', 'BCH', 'LTC', 'XRP', 'TRX', 'EOS', 'BNB', 'BSV'];
const imageArray = [];

//TODO : GET IMAGES ARRAY
//       SHOW ALL 10 CURRENCIES (CURRENTLY ONLY SHOWS ONE)
//       ADD CSSS

(function getTopTenCryptos() {
    for (const coin of topTenCrypto) {
        axios.get(`https://min-api.cryptocompare.com/data/price?fsym=${coin}&tsyms=USD`)
        .then(res => {
           console.log(res);
           name.innerHTML = coin;
           price.innerHTML = res.data.USD;
        })
        .catch(err => {
            console.error(err);
        })
    }
})()