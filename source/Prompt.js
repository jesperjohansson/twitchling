const Store = require('electron').remote.getGlobal('Store')
const PlayerWindow = require('./PlayerWindow')

// TODO: Keybindings, opacity settings

const playerUrl = 'https://player.twitch.tv'
const userRegExp = /(\w+)/
const directoryRegExp = /twitch\.tv\/(\w+)/
const playerRegExp = /channel=(\w+)/

const getStreamUrl = (input = '') =>
  new Promise((resolve, reject) => {
    const playerMatch = input.match(playerRegExp)
    const directoryMatch = input.match(directoryRegExp)
    const userMatch = input.match(userRegExp)
    const match = playerMatch || directoryMatch || userMatch
    if (!match) {
      reject(new Error('Invalid channel link or name provided'))
      return
    }

    const [, channel] = match
    const channelPlayerUrl = `${playerUrl}/?channel=${channel}`
    fetch(channelPlayerUrl)
      .then(() => resolve(channelPlayerUrl))
      .catch(() => reject(new Error('Could not find channel')))
  })

module.exports = new class Prompt {
  constructor() {
    this.dom()
    this.events()
  }

  dom() {
    this.form = document.querySelector('form')
    this.input = document.querySelector('input')
    this.error = document.querySelector('.error')
  }

  events() {
    this.form.addEventListener('submit', this.handleFormSubmit.bind(this))
  }

  handleFormSubmit(e) {
    e.preventDefault()
    this.error.classList.toggle('-visible', false)
    getStreamUrl(this.input.value)
      .then((channelPlayerUrl) => {
        Store.playerURL = channelPlayerUrl
        this.playerWindow = new PlayerWindow()
      })
      .catch(err => this.displayError(err))
  }

  displayError(message) {
    this.error.textContent = message
    this.error.classList.toggle('-visible', true)
  }
}()
