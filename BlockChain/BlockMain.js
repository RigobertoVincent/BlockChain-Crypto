const EC = require('elliptic').ec;
const ec = new EC('secp256k1');
const {BlockChain, Transaction} = require('./BlockChain')
require('dotenv').config();

const myKey = ec.keyFromPrivate(process.env.Private_Key);
const myWalletAddress = myKey.getPublic('hex')

let coin = new BlockChain();
const tx1 = new Transaction(myWalletAddress, 'public key goes here', 10);
tx1.signTransaction(myKey);
coin.addTransaction(tx1);


console.log('\n Starting the miner...');
coin.minePendingTransactions(myWalletAddress);

coin.chain[1].transactions[0].amount = 1;
//
console.log('Balance of some is', coin.getBalanceOfAddress(myWalletAddress));
console.log('Is chain valid?', coin.validatingChain());

