/**
 * Building a blockcahin that will use SHA256 as the way for decrptying
 * nd finding signatures. In order to have 256 working
 * @installatio of crypto js is needed
 * this command was used npm install --save crypto-js
**/
//TODO implement the proof of work algorithm
//TODO implement the mining and transactions of the blockchain

const SHA256 = require('crypto-js/sha256');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

/**
 *
**/
class Transaction{
    constructor(fromAddress, toAddress,amount){
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }

    calculateHash(){
        return SHA256(this.fromAddress + this.toAddress + this.amount).toString();
    }

    signTransaction(signingKey){
        if (signingKey.getPublic('hex') !== this.fromAddress){
            throw new Error('You cannot sign transaction for other wallet');
        }


        const hashTx = this.calculateHash();
        const sig = signingKey.sign(hashTx, 'based64');
        this.signature = sig.toDER('hex');
    }

    isValid(){
        if (this.fromAddress === null) return true;

        if (!this.signature || this.signature.length === 0){
            throw new Error('No signature in this transaction');
        }

        const publicKey = ec.keyFromPublic(this.fromAddress,'hex');
        return publicKey.verify(this.calculateHash(), this.signature);
    }
}

class Block {

    /** Building the Block
     * @index
     * @timestamp
     * @data
     * @transactions
     * @prev.hash
     * @hash- contain the calculation of the Hash using the helper method of calculateHash
     **/
    constructor(timestamp, transactions, previousHash = '') {
        // this.index = index;
        this.timestamp = timestamp;
        // this.data = data;
        this.transactions = transactions;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    /**
     *CalculateHashFunction will calculate the properties of the block
     @return SHA256 index, prev hash, timestamp, and a string of the data
     take into account the nonce
     */
    calculateHash(){
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
    }

//TODO change the way the proof of work is being used
    /**
     * Creating the mining portion of the block
     * starting the block with a certain amount of integer, take a substring of the Hash
     * set a difficulty and keep running until the hash equals the Hash
     */
    mineBlock(difficulty){
        while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")){
            this.nonce++;
            this.hash = this.calculateHash();
        }
        //Log the proof of work from the Hash
        console.log("Block Mined: " + this.hash);
    }


    hasValidTransaction(){
        for (const tx of this.transactions){
            if (!tx.isValid()){
                return false;
            }
        }
        return true;
    }
}

/** Creating the initial block in the blockchain
 *
 *
 *
**/
class blockChain{

    /**
     * Will contain the initializations of the blockchain and an array of blocks
     * initialize the block array with the genesisBlock
     * Added the difficulty of the mining to the blockchain**/
    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 2;
        this.pendingTransaction = [];
        this.miningReward = 100;
    }

    /**
     * Creating the initial block manually
     * Return a newblock, with index 0, custom date, and string data, prev.hash which does not exist
     *
     */
    createGenesisBlock() {
        return new Block( "10/31/2020", "inital Block(GenesisBlock)","0");
    }

    /**
     * Get latestBlock
     * return the latyest blcok in the chain, with the last element 'length-1'
     */
    getLatestBlock(){
        return this.chain[this.chain.length -1];
    }

    /**
     * AddBlock function
     * responsible for adding a new block to the chain, which sets the prev.hash to the new block
     * get the latest block. Additionally recalculate the hash, because the properties change in the block.
     *Added the mining portion of the block, and adding the difficulty from the constructor
     */

    // addBlock(newBlock {
    //
    // }

    minePendingTransactions(miningRewardAddress){
        const rewardTx = new Transaction(null,miningRewardAddress,this.miningReward);
        this.pendingTransaction.push(rewardTx);

        let block = new Block(Date.now(), this.pendingTransaction);
        block.mineBlock(this.difficulty);

        console.log('Block successfully mined!');
        this.chain.push(block);

        this.pendingTransaction =[];
    }

    addTransaction(transaction){

        if (!transaction.fromAddress || !transaction.toAddress){
            throw new Error('Transaction must include from and to address');
        }

        if (!transaction.isValid()){
            throw new Error('Cannot add invalid transaction to chain');
        }

        this.pendingTransaction.push(transaction);
    }

    getBalanceOfAddress(address){
        let balance = 0;

        for (const block of this.chain) {
            for (const trans of block.transactions) {
                if (trans.fromAddress === address) {
                    balance -= trans.amount;
                }

                if (trans.toAddress === address) {
                    balance += trans.amount;
                }
            }
        }

        return balance;
    }

    /**
     * Verification of the BlockChain
     * Return a boolean whether the block is T or F
     */
    validatingChain(){
        for (let i = 1; i < this.chain.length; i++){
            const currentBlock = this.chain[i];
            const prevBlock = this.chain[i-1];

            if (!currentBlock.hasValidTransaction()) return false;

            //checks is the blocks hash does not equal the previous hash
            if (currentBlock.hash !== currentBlock.calculateHash()) return false;

            // checking if the block points to the correct previous hash
            if (currentBlock.previousHash !== prevBlock.calculateHash()) return false;
        }
        return true;
    }
}

/**
 *
 * @type {blockChain}
 * @type {Transaction}
 */
module.exports.BlockChain = blockChain;
module.exports.Transaction = Transaction;
