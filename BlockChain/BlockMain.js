/**
 * Building a blockcahin that will use SHA256 as the way for decrptying
 * nd finding signatures. In order to have 256 working
 * @installatio of crypto js is needed
 * this command was used npm install --save crypto-js
**/
//TODO implement the proof of work algorithm
//TODO implement the mining and transactions of the blockchain

const SHA256 = require('crypto-js/sha256');

class Block {

    /** Building the Block
     * @index
     * @timestamp
     * @data
     * @prev.hash
     * @hash- contain the calculation of the Hash using the helper method of calculateHash
     **/
    constructor(index, timestamp, data, previousHash = '') {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
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
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).string();
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
    }

    /**
     * Creating the initial block manually
     * Return a newblock, with index 0, custom date, and string data, prev.hash which does not exist
     *
     */
    createGenesisBlock() {
        return new Block(0, "10/31/2020", "inital Block(GenesisBlock)","0");
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
    addBlock(newBlock){
        newBlock.previousHash = this.getLatestBlock().hash;
        // newBlock.hash = newBlock.calculateHash();
        newBlock.mineBlock(this.difficulty);
        this.chain.push(newBlock);
    }

    /**
     * Verification of the BlockChain
     * Return a boolean whether the block is T or F
     */
    validatingChain(){
        for (let i = 1; i < this.chain.length; i++){
            const currentBlock = this.chain[i];
            const prevBlock = this.chain[i-1];

            //checks is the blocks hash does not equal the previous hash
            if (currentBlock.hash !== currentBlock.calculateHash())return false;

            // checking if the block points to the correct previous hash
            if (currentBlock.previousHash !== prevBlock.hash) return false;
        }
        return true;
    }
}

/**
 *
 * @type {blockChain}
 */
let coin = new blockChain();
//Mining the blocks
console.log('Mining Block 1:..');
coin.addBlock(new Block(1,"11/1/2020", {amount: 10}));
//Mining the blocks
console.log('Mining Block 2:..');
coin.addBlock(new Block(2,"11/2/2020", {amount: 20}));

//Checking if the blockchain Valid
console.log('Is Block Valid' + coin.validatingChain());
//manipulating the block to check it's output
coin.chain[1].data = { amount: 100};
coin.chain[1].hash = coin.chain[1].calculateHash();

//outputting the chain on console
console.log(JSON.stringify(coin,null,10));
