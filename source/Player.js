const { ipcRenderer } = require('electron')
const Store = require('electron').remote.getGlobal('Store')

module.exports = new class Player {
  constructor() {
    const webView = document.createElement('webview')
    webView.classList.add('webView')
    webView.setAttribute('src', Store.playerURL)
    document.body.appendChild(webView)
    ipcRenderer.on('playerWindowEnable', (_, isEnabled) =>
      document.body.classList.toggle('-active', isEnabled))
  }
}()
