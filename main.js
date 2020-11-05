
const {app, BrowserWindow, Menu} = require('electron')
const shell = require('electron').shell


const ipc = require('electron').ipcMain //inter process communication, allowing communication between those windows or processes

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

function createWindow () {
    // Create the browser window.
    win = new BrowserWindow({width: 800, height: 600})

    // and load the index.html of the app.
    win.loadFile('src/index.html')

    // Open the DevTools.
    win.webContents.openDevTools()

    // Emitted when the window is closed.
    win.on('closed', () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        win = null
    })

    //creating the menu bar
    const {app, Menu} = require('electron')

    const isMac = process.platform === 'darwin'

    const template = [
        // { role: 'appMenu' }
        ...(isMac ? [{
            label: app.name,
            submenu: [
                {role: 'about'},
                {type: 'separator'},
                {role: 'services'},
                {type: 'separator'},
                {role: 'hide'},
                {role: 'hideothers'},
                {role: 'unhide'},
                {type: 'separator'},
                {role: 'quit'}
            ]
        }] : []),
        //Coin Menu
        {
            label: 'CoinMenu',
            submenu: [
                { label: 'Adjust Notification Value'},
                { label: 'CoinMarketCap',
                    click() { shell.openExternal('https://coinmarketcap.com/'); } //make it open the website in the default browser
                },
            ]
        },
        // { role: 'fileMenu' }
        {
            label: 'File',
            submenu: [
                isMac ? {role: 'close'} : {role: 'quit'}
            ]
        },
        // { role: 'editMenu' }
        {
            label: 'Edit',
            submenu: [
                {role: 'undo'},
                {role: 'redo'},
                {type: 'separator'},
                {role: 'cut'},
                {role: 'copy'},
                {role: 'paste'},
                ...(isMac ? [
                    {role: 'pasteAndMatchStyle'},
                    {role: 'delete'},
                    {role: 'selectAll'},
                    {type: 'separator'},
                    {
                        label: 'Speech',
                        submenu: [
                            {role: 'startspeaking'},
                            {role: 'stopspeaking'}
                        ]
                    }
                ] : [
                    {role: 'delete'},
                    {type: 'separator'},
                    {role: 'selectAll'}
                ])
            ]
        },
        // { role: 'viewMenu' }
        {
            label: 'View',
            submenu: [
                {role: 'reload'},
                {role: 'forcereload'},
                {role: 'toggledevtools'},
                {type: 'separator'},
                {role: 'resetzoom'},
                {role: 'zoomin'},
                {role: 'zoomout'},
                {type: 'separator'},
                {role: 'togglefullscreen'}
            ]
        },
        // { role: 'windowMenu' }
        {
            label: 'Window',
            submenu: [
                {role: 'minimize'},
                {role: 'zoom'},
                ...(isMac ? [
                    {type: 'separator'},
                    {role: 'front'},
                    {type: 'separator'},
                    {role: 'window'}
                ] : [
                    {role: 'close'}
                ])
            ]
        },
        {
            role: 'help',
            submenu: [
                {
                    label: 'Learn More',
                    click: async () => {
                        const {shell} = require('electron')
                        await shell.openExternal('https://electronjs.org')
                    }
                }
            ]
        },
        {
            label: 'Developer',
            submenu: [
                {
                    label: 'Toggle Developer Tools',
                    accelerator: process === 'darwin' ? 'Alt+Command+I' :
                        'Ctrl+Shift+I',
                    click(){
                        win.webContents.toggleDevTools()
                    }

                }
            ]
        }
    ]

    const menu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(menu)
    // const menu = Menu.buildFromTemplate([
    //     {
    //         label: 'Menu',
    //         submenu: [
    //             { label: 'Adjust Notification Value'},
    //             {
    //                 label: 'CoinMarketCap',
    //                 click(){
    //                     shell.openExternal('https://coinmarketcap.com/'); //make it open the website in the default browser
    //                 }
    //             },
    //             {
    //                 type: 'separator',
    //             },
    //             {
    //                 label: 'Exit',
    //                 click(){
    //                     app.quit(); //closing the application when the user clicks the Exit submenu
    //                 }
    //             },
    //         ]
    //     },
    //     {
    //         label: 'Info',
    //     }
    // ])
    // Menu.setApplicationMenu(menu); //in order to make the menu work
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
        createWindow()
    }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

//in a nutshell, ipc main will catch the message that's sent from the add.html and then it's going to send that back to the index.html so it can be displayed at the tag with id targetPrice
ipc.on('update-notify-value', (event, arg) => {
    //sending to index.html window
    win.webContents.send('targetPriceVal', arg) //defining the name of the message as 'targetPriceVal' and binding it to the response which is whatever is entered into the text field in the add.html file. So. it's gonna send that value to 'win', which is currently bound to the index.html when we create the browser window
})

try {
    require('electron-reloader')(module)
} catch (_) {}

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
