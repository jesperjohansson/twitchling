const menubar = require('menubar')
const Store = require('./source/Store')

global.Store = Store

const mb = menubar({
  backgroundColor: '#302C33',
  alwaysOnTop: true,
})
mb.on('ready', () => mb.showWindow())
mb.on('after-create-window', () => {
  mb.window.openDevTools()
})
