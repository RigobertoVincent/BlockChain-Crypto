const {app, BrowserWindow, Menu} = require('electron');
const { clear } = require('./dataStore');
const shell = require('electron').shell
const ipc = require('electron').ipcMain;

const DataStore = require('./dataStore');

const userData = DataStore;



// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;

function createWindow () {
    // Create the browser window.
    win = new BrowserWindow({
        width: 800, 
        height: 600,
        enableRemoteModule: true
    })

    // and load the index.html of the app.
    win.loadFile('index.html')

    // Open the DevTools.
    win.webContents.openDevTools()

    // Emitted when the window is closed.
    win.on('closed', () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        win = null
    })


    // receives message and sends updated wallet value
    ipc.on('update-wallet', (event, coin) => {
        const currWalletTotal = userData.get('wallet');
        const newWalletTotal = Number(currWalletTotal) + Number(coin);
        userData.set('wallet', newWalletTotal);
        win.send('wallet', userData.get('wallet'));
    });

    // receives message and sends updated list of crypto coins
    ipc.on('update-list', (event, coinName) => {
        [nameOfCrypto, amount] = [...coinName];
        let obj = { 
            nameOfCrypto : nameOfCrypto,
            amount: amount
        }
        const data = userData.get('coin');
        const newData = [...(data || []), obj]
        userData.set('coin', newData)
        win.send('list', userData.get('coin'));
    });

    


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
