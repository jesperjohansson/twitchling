const Store = require('electron').remote.getGlobal('Store')
const PlayerWindow = require('./PlayerWindow')

// TODO: Keybindings, opacity settings

module.exports = new class Prompt {
  constructor() {
    this.dom()
    this.events()
  }

  dom() {
    this.input = document.querySelector('input')
    this.button = document.querySelector('button')
  }

  events() {
    this.button.addEventListener('click', this.handleButtonClick.bind(this))
  }

  handleButtonClick() {
    if (this.playerWindow) return
    Store.playerURL = this.input.value
    this.playerWindow = new PlayerWindow()
  }
}()
