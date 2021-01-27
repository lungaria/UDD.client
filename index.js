require = require('esm')(module)
let electron = require('electron')
let { app, BrowserWindow } = require('electron')
let { fork } = require('child_process')
let isDev = require('electron-is-dev')

let clientWin
let serverWin
let serverProcess

//const config_ip='192.168.1.52'
//const config_port=5000
const config_ip='10.30.84.63'
const config_port=9912

function createWindow() {
  clientWin = new BrowserWindow({
    width: 1920,
    height: 1080,
    autoHideMenuBar: true,
    fullscreen: true,
    webPreferences: {
      nodeIntegration: true,
      preload: __dirname + '/client-preload.js'
    }
  })

  clientWin.loadFile('client-index.html')

  clientWin.webContents.on('did-finish-load', () => {
    //clientWin.webContents.send('set-socket', {
    //  name: socketName
    //})
    clientWin.webContents.send('ip', config_ip.toString())
    clientWin.webContents.send('port', config_port.toString())
  })
}


app.on('ready', async () => {
  createWindow()
})

/*app.on('before-quit', () => {
  if (serverProcess) {
    serverProcess.kill()
    serverProcess = null
  }
})*/
