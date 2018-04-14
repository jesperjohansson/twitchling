const path = require('path')
const url = require('url')
const electron = require('electron')
const Store = require('./source/Store')

const { app, BrowserWindow } = electron
let mainWindow

global.Store = Store

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 550,
    height: 300,
  })

  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true,
  }))

  // mainWindow.webContents.openDevTools() // DEV

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', createWindow)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
app.on('activate', () => {
  if (mainWindow === null) createWindow()
})
