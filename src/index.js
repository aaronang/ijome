import {app, BrowserWindow, globalShortcut, clipboard, ipcMain} from 'electron'
import robot from 'robotjs'
import path from 'path'
import url from 'url'


let win

function createWindow () {
  win = new BrowserWindow({
    width: 400, 
    height: 250, 
    frame: false,
    icon: path.join(__dirname, 'images/icon.png')
  })

  win.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  win.on('closed', () => {
    win = null
  })
}

let paste = false

ipcMain.on('finish', (e, emoji) => {
  paste = true
  clipboard.writeText(emoji)
  app.hide()
})

ipcMain.on('escape', () => app.hide())

app.on('ready', () => {
  createWindow()

  win.on('hide', () => {
    if (paste) {
      robot.keyTap("v", "command")
      paste = false
    }
  })

  const colon = globalShortcut.register('Super+;', () => app.focus())

  if (!colon) {
    console.error('registration failed')
  }
})

app.on('will-quit', () => globalShortcut.unregisterAll())

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
