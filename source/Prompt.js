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
      .then(() => resolve({ channelPlayerUrl, channel }))
      .catch(() => reject(new Error('Could not find channel')))
  })

module.exports = new class Prompt {
  constructor() {
    this.dom()
    this.events()
    this.playerWindows = []
  }

  dom() {
    this.form = document.querySelector('form')
    this.input = document.querySelector('input')
    this.error = document.querySelector('.error')
    this.list = document.querySelector('.list')
  }

  events() {
    this.form.addEventListener('submit', this.handleFormSubmit.bind(this))
    this.list.addEventListener('click', this.handleListClick.bind(this))
  }

  handleFormSubmit(e) {
    e.preventDefault()
    this.error.classList.toggle('-visible', false)
    getStreamUrl(this.input.value)
      .then(({ channelPlayerUrl, channel }) => {
        this.addPlayerWindow(channelPlayerUrl, channel)
      })
      .catch(err => this.displayError(err))
  }

  displayError(message) {
    this.error.textContent = message
    this.error.classList.toggle('-visible', true)
  }

  handleListClick(e) {
    if (!e || !e.target || !e.target.dataset || !e.target.matches('button')) {
      return
    }
    this.playerWindows = this.playerWindows.filter((playerWindowObj) => {
      const isPlayerWindowObj = e.target.dataset.id === playerWindowObj.id
      if (isPlayerWindowObj) playerWindowObj.playerWindow.destroy()
      return !isPlayerWindowObj
    })
    this.updateList()
  }

  addPlayerWindow(channelPlayerUrl, channel) {
    Store.playerURL = channelPlayerUrl
    this.playerWindows.push({
      id: Date.now().toString(),
      title: channel,
      playerWindow: new PlayerWindow(),
    })
    this.updateList()
  }

  updateList() {
    while (this.list.firstChild) this.list.removeChild(this.list.firstChild)
    this.playerWindows.forEach((playerWindowObj) => {
      const listItem = document.createElement('li')
      const title = document.createElement('span')
      const button = document.createElement('button')
      title.textContent = playerWindowObj.title
      button.textContent = 'x'
      button.dataset.id = playerWindowObj.id
      listItem.appendChild(title)
      listItem.appendChild(button)
      this.list.appendChild(listItem)
    })
    this.list.classList.toggle('-visible', this.playerWindows.length)
  }
}()
