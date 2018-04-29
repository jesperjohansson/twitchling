const path = require('path')
const url = require('url')
const { BrowserWindow } = require('electron').remote
const ioHook = require('iohook')

const KEY = 3675

function inRectangle(point, rectangle) {
  if (point.x < rectangle.x || point.x > rectangle.x + rectangle.width) return false
  if (point.y < rectangle.y || point.y > rectangle.y + rectangle.height) return false
  return true
}

module.exports = class PlayerWindow {
  constructor() {
    this.browserWindow = new BrowserWindow({
      width: 480,
      height: 360,
      alwaysOnTop: true,
      transparent: true,
      acceptFirstMouse: true,
      hasShadow: false,
      titleBarStyle: 'customButtonsOnHover',
      frame: false,
      skipTaskbar: true,
    })

    this.setEnabled(false)
    this.events()
    this.browserWindow.loadURL(url.format({
      pathname: path.resolve(__dirname, '../', 'player.html'),
      protocol: 'file:',
      slashes: true,
    }))
    this.browserWindow.webContents.emit('')
  }

  events() {
    // prettier-ignore
    this.handleMouseMoveListener = this.handleMouseMove.bind(this)
    this.handleKeyDownListener = this.handleKeyDown.bind(this)
    this.handleKeyUpListener = this.handleKeyUp.bind(this)

    ioHook.addListener('keydown', this.handleKeyDownListener)
    ioHook.addListener('keyup', this.handleKeyUpListener)
    ioHook.addListener('mousemove', this.handleMouseMoveListener)
    ioHook.start()
  }

  handleKeyDown({ keycode }) {
    if (keycode === KEY) this.setEnabled(true)
  }

  handleKeyUp({ keycode }) {
    if (keycode === KEY) this.setEnabled(false)
  }

  handleMouseMove(e) {
    const pointerInBounds = inRectangle(e, this.browserWindow.getBounds())
    this.browserWindow.setOpacity(pointerInBounds && !this.isEnabled ? 0.25 : 1)
  }

  setEnabled(isEnabled) {
    if (this.isEnabled === isEnabled) return
    this.isEnabled = isEnabled
    this.browserWindow.webContents.send('playerWindowEnable', isEnabled)
    this.browserWindow.setIgnoreMouseEvents(!isEnabled)
  }

  destroy() {
    ioHook.removeListener('keydown', this.handleKeyDownListener)
    ioHook.removeListener('keyup', this.handleKeyUpListener)
    ioHook.removeListener('mousemove', this.handleMouseMoveListener)
    this.browserWindow.close()
  }
}
