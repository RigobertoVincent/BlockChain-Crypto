require('dotenv').config();

const graphCrypto = (crypto, coinFeed) => {
    const pubnub = new PubNub({
        publishKey: process.env.PUBLISH_KEY,
        subscribeKey: process.env.SUBSCRIBE_KEY
    });

    var xhr = new XMLHttpRequest();

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
            bindto: '#coinChart',
            data: eonData,
            axis: eonAxis
        }
    });


    if (xhr.readyState == 4 && xhr.status == 200) {
        let coin = crypto;
        let response = JSON.parse(xhr.responseText);

        console.log(response);

        pubnub.publish({
            channel: 'bitcoin-feed',
            message: {
                eon: {
                    // 'BitCoin': response.BTC.USD.toFixed(2)
                    'CryptoCoin': response.coin.USD.toFixed(2)
                }
            }
        });
    }
};

module.exports = graphCrypto;
    

// // Rigo's Pubnubs keys
// var xhr = new XMLHttpRequest();

// // EON Charts configuration
// var pointLimit = 15;
// var topPadding = 100;
// var bottomPadding = 100;
// var eonData = {labels: true, type: 'line'};
// var eonAxis = {
//     y: {padding: {top: topPadding, bottom: bottomPadding}},
//     x: {type: 'timeseries', tick: {format: '%H:%M:%S'}}
// };

// // Create the EON Chart for BitCoin and bind its div
// eon.chart({
//     channels: ['bitcoin-feed'],
//     history: true,
//     flow: true,
//     limit: pointLimit,
//     pubnub: pubnub,
//     generate: {
//         bindto: '#bitcoinChart',
//         data: eonData,
//         axis: eonAxis
//     }
// });

// // Create the Ether Chart for BitCoin and bind its div
// eon.chart({
//     channels: ['ether-feed'],
//     history: true,
//     flow: true,
//     limit: pointLimit,
//     pubnub: pubnub,
//     generate: {
//         bindto: '#etherChart',
//         data: eonData,
//         axis: eonAxis
//     }
// });

// // Create the LiteCoin Chart for BitCoin and bind its div
// eon.chart({
//     channels: ['litecoin-feed'],
//     history: true,
//     flow: true,
//     limit: pointLimit,
//     pubnub: pubnub,
//     generate: {
//         bindto: '#liteCoinChart',
//         data: eonData,
//         axis: eonAxis
//     }
// });

// function processRequest(e) {
//     if (xhr.readyState == 4 && xhr.status == 200) {
//         var response = JSON.parse(xhr.responseText);
//         console.log(response);

//         pubnub.publish({
//             channel: 'bitcoin-feed',
//             message: {
//                 eon: {
//                     'BitCoin': response.BTC.USD.toFixed(2)
//                 }
//             }
//         });

//         pubnub.publish({
//             channel: 'ether-feed',
//             message: {
//                 eon: {
//                     'Ether': response.ETH.USD.toFixed(2)
//                 }
//             }
//         });

//         pubnub.publish({
//             channel: 'litecoin-feed',
//             message: {
//                 eon: {
//                     'LiteCoin': response.LTC.USD.toFixed(2)
//                 }
//             }
//         });
//     }
// }

// function mainApp() {
//     setInterval(function () {
//         xhr.open('GET', 'https://min-api.cryptocompare.com/data/pricemulti?fsyms=BTC,ETH,LTC&tsyms=USD', true)
//         xhr.send();
//         xhr.onreadystatechange = processRequest;
//     }, 10000)
// };
// mainApp();