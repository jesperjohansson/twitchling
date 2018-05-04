const { createWindowsInstaller } = require('electron-winstaller')

createWindowsInstaller({
  appDirectory: './dist/Twitchling-win32-x64',
  outputDirectory: './dist/',
  setupIcon: './twitchling.ico',
  authors: 'Jesper Johansson',
  exe: 'Twitchling.exe',
  noMsi: true,
  noDelta: true,
})
  .then(() => console.log('Finished building'))
  .catch(err => console.log('Build failed:', err.message))
