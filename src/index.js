import {app, BrowserWindow, globalShortcut, clipboard} from 'electron'
import robot from 'robotjs'
import path from 'path'
import url from 'url'

let win

function createWindow () {
  win = new BrowserWindow({width: 800, height: 600, frame: false})

  win.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  win.on('closed', () => {
    win = null
  })
}

app.on('ready', () => {
  createWindow()

  win.on('hide', () => {
    robot.keyTap("v", "command")
  })

  const colon = globalShortcut.register('Super+;', () => {
    app.focus()
  })

  if (!colon) {
    console.log('registration failed')
  }
})

app.on('focus', () => {
  clipboard.writeText("✨")
})

app.on('will-quit', () => {
  globalShortcut.unregisterAll()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (win === null) {
    createWindow()
  }
})
