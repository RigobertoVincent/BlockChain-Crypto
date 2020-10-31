const axios = require('axios')

const price = document.querySelector('h1')
const priceETH = document.getElementById('priceETH');
const priceLTC = document.getElementById('priceLTC');

const targetPrice = document.getElementById('targetPrice');
const targetPriceETH = document.getElementById('targetPriceETH');
const targetPriceLTC = document.getElementById('targetPriceLTC');

// TODO: make this render new list every time its called
const getCryptoPrice = crypto => {
    axios.get(`https://min-api.cryptocompare.com/data/pricemulti?fsyms=${crypto}&tsyms=USD`)
        .then(res => {
            const currency = res.data.crypto.USD;
            price.innerHTML = `$ ${cryptos.toLocaleString('en')}` //replacing the h1 with the current BTC price

            //creating the notification
            if(targetPrice.innerHTML != '' && targetPriceVal < currency) {
                // const myNotification = new window.Notification(notification.title, notification);
                notifier.notify({
                    title: `${crypto} Alert`,
                    message: `${crypto} just beat your target price!`,
                    icon: path.join(__dirname, '../assets/icons/btc.png'),
                    sound: true,
                    wait: false
                });
            }
        })
        .catch(err => {
            console.error(err);
        })
}

module.exports = getCryptoPrice;