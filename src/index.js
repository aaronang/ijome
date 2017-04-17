import {app, BrowserWindow, globalShortcut, clipboard, ipcMain} from 'electron'
import robot from 'robotjs'
import path from 'path'
import url from 'url'

let win = null
let paste = false
let oldContent = null

function createWindow () {
  win = new BrowserWindow({
    width: 400, 
    height: 250, 
    frame: false,
    icon: path.join(__dirname, 'assets/images/icon.png')
  })

  win.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  win.on('closed', () => win = null)

  win.on('hide', () => {
    if (paste) {
      robot.keyTap("v", "command")
      paste = false
      setTimeout(() => clipboard.writeText(oldContent), 500)
    }
  })
}

ipcMain.on('finish', (e, emoji) => {
  paste = true
  oldContent = clipboard.readText()
  clipboard.writeText(emoji)
  app.hide()
})

ipcMain.on('escape', () => app.hide())

app.on('ready', () => {
  createWindow()

  const colon = globalShortcut.register('Super+;', () => app.focus())

  if (!colon) {
    console.error('registration failed')
  }
})

app.on('will-quit', () => globalShortcut.unregisterAll())

app.on('window-all-closed', () => app.quit())

app.on('activate', () => {
  if (win === null) {
    createWindow()
  }
})
