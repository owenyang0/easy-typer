// main.js

// Modules to control application life and create native browser window
const { app, globalShortcut, ipcMain, BrowserWindow, clipboard } = require('electron')
const path = require('path')

const applescript = require('applescript')

// Very basic AppleScript command. Returns the song name of each
// currently selected track in iTunes as an 'Array' of 'String's.
const retrivingScript = `tell application "QQ" to activate --QQ
tell application "System Events"
  tell process "QQ"
    do shell script "cliclick c:."   
    keystroke "a" using command down
    keystroke "c" using command down
    delay 0.1
  end tell
end tell
`

const sendingScript = `
tell application "QQ" to activate
tell application "System Events" to tell application process "QQ"
    keystroke tab
    keystroke "a" using command down
    click menu item "粘贴" of menu "编辑" of menu bar item "编辑" of menu bar 1
    delay 0.1
end tell
`
// key code 36

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
      // nodeIntegration: true,
      // contextIsolation: false,
    }
  })

  ipcMain.on('set-grade', (event, msg) => {
    console.log(msg)
    applescript.execString(sendingScript, (err) => {
      if (err) {
        // Something went wrong!
        console.log('sendingScript err', err)
      }
      console.log('sendingScript done')

      app.focus({ steal: true })
    })
  })

  // 加载 index.html
  // mainWindow.loadFile('index.html')
  mainWindow.loadURL('http://127.0.0.1:8080')

  // 在此示例中，将仅创建具有 `about:blank` url 的窗口。
  // 其他 url 将被阻止。
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url) {
      return {
        action: 'allow',
        overrideBrowserWindowOptions: {
        //   frame: false,
        //   fullscreenable: false,
        //   backgroundColor: 'black',
          webPreferences: {
            preload: path.join(__dirname, 'preload.js')
          }
        }
      }
    }
    // return { action: 'deny' }
  })

  // 打开开发工具
  // mainWindow.webContents.openDevTools()

  return mainWindow
}

// 这段程序将会在 Electron 结束初始化
// 和创建浏览器窗口的时候调用
// 部分 API 在 ready 事件触发后才能使用。
app.whenReady().then(() => {
  const win = createWindow()

  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })

  // 注册一个'F1' 快捷键监听器
  const ret = globalShortcut.register('F4', () => {
    console.log('F4 is pressed')
    applescript.execString(retrivingScript, (err) => {
      if (err) {
        // Something went wrong!
        console.log('err', err)
      }

      win.webContents.send('paste', clipboard.readText())

      app.focus({ steal: true })
    })
  })
  // 注册一个'F1' 快捷键监听器
  globalShortcut.register('F2', () => {
    console.log('F2 is pressed')
    applescript.execString(sendingScript, (err) => {
      if (err) {
        // Something went wrong!
        console.log('sendingScript err', err)
      }
      console.log('sendingScript done')

      app.focus({ steal: true })
    })
  })

  if (!ret) {
    console.log('registration failed')
  }

  // 检查快捷键是否注册成功
  console.log(globalShortcut.isRegistered('F1'))
})

// 除了 macOS 外，当所有窗口都被关闭的时候退出程序。 There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

app.on('will-quit', () => {
  // 注销快捷键
  globalShortcut.unregister('F1')

  // 注销所有快捷键
  globalShortcut.unregisterAll()
})

// In this file you can include the rest of your app's specific main process
// code. 也可以拆分成几个文件，然后用 require 导入。
