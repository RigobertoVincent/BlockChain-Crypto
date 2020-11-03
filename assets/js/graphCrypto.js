require('dotenv').config();

const searchCoin = document.getElementById('searchCoin');
const searchCrypto = document.getElementById('search-crypto').innerHTML;

searchCoin.addEventListener('click', (event) => {
    event.preventDefault();
    graphCrypto(searchCrypto, 'bitcoin-feed');
});

const xhr = new XMLHttpRequest();
const pubnub = new PubNub({
    publishKey: process.env.PUBLISH_KEY,
    subscribeKey: process.env.SUBSCRIBE_KEY
});

const graphCrypto = (crypto, coinFeed) => {
    // EON Charts configuration
    let pointLimit = 15;
    let topPadding = 100;
    let bottomPadding = 100;
    let eonData = {labels: true, type: 'line'};
    let eonAxis = {
        y: {padding: {top: topPadding, bottom: bottomPadding}},
        x: {type: 'timeseries', tick: {format: '%H:%M:%S'}}
    }

    eon.chart({
        channels: [`${coinFeed}`],
        history: true,
        flow: true,
        limit: pointLimit,
        pubnub: pubnub,
        generate: {
            size: {
                height: 340,
                width: 840
            },
            bindto: '#chart',
            data: eonData,
            axis: eonAxis
        }
    });

    mainLoop(crypto);
};   

function processRequest() {
    if (xhr.readyState == 4 && xhr.status == 200) {
        let coin = crypto;
        let response = JSON.parse(xhr.responseText);

        pubnub.publish({
            channel: 'bitcoin-feed',
            message: {
                eon: {
                    'BitCoin': response.BTC.USD.toFixed(2)
                }
            }
        });
    } 
}

function mainLoop(coin) {
    setInterval(function () {
                xhr.open('GET', `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${coin}&tsyms=USD`, true)
                xhr.send();
                xhr.onreadystatechange = processRequest;
    }, 10000)
}