const { ipcRenderer } = require('electron')
const isDev = require('electron-is-dev')
//const ipc = require('node-ipc')
const uuid = require('uuid')


//const remote = require("electron").remote;
//const OSC = require('osc-js')
//var osc = new OSC({ plugin:  new OSC.WebsocketClientPlugin() });
//const mainWindow = remote.getCurrentWindow();
//window.$ = window.jQuery = require('jquery');

/*
let resolveSocketPromise
let socketPromise = new Promise(resolve => {
  resolveSocketPromise = resolve
})

window.IS_DEV = isDev

window.getServerSocket = () => {
  return socketPromise
}

ipcRenderer.on('set-socket', (event, { name }) => {
  resolveSocketPromise(name)
})
*/

window.uuid = uuid


window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  } 
  
  for (const type of ['chrome', 'node', 'electron']) {
    replaceText(`${type}-version`, process.versions[type])
  }
})

