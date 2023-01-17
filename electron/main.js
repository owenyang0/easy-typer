// main.js

// Modules to control application life and create native browser window
const { app, globalShortcut, ipcMain, BrowserWindow, clipboard, Notification } = require('electron')
const path = require('path')

const applescript = require('applescript')

// Very basic AppleScript command. Returns the song name of each
// currently selected track in iTunes as an 'Array' of 'String's.
// do shell script "/usr/local/opt/cliclick c:." 

const clickShell = `do shell script "${__dirname}/bin/cliclick c:."`
const retrivingScript = `tell application "QQ" to activate --QQ
tell application "System Events"
  tell process "QQ"
    ${clickShell}
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
    key code 36
end tell
`

function showNotification (body = '', title = '木易跟打器') {
  new Notification({ title, body }).show()
}
const isProduction = app.isPackaged
let mainWindow
const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    show: false,
    width: 940,
    height: 820,
    backgroundColor:"#1c1f24",
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      devTools: !isProduction,
      // nodeIntegration: true,
      // contextIsolation: false,
    }
  })

  if (process.platform === 'darwin') {
    app.dock.setIcon(path.join(__dirname, '../public/img/icons/logo-large.png'))
  }

  ipcMain.on('set-grade', (event, msg) => {
    console.log(msg)
    applescript.execString(sendingScript, (err) => {
      if (err) {
        // Something went wrong!
        console.error('sendingScript err', err)
        showNotification(err.message || 'Fail', '发送成绩失败')
      }
      app.focus({ steal: true })
    })
  })

  // 加载 index.html
  // mainWindow.loadFile('docs/index.html')
  // mainWindow.loadURL('http://127.0.0.1:8080')
  mainWindow.loadURL('https://typer.owenyang.top')
  // mainWindow.loadURL('https://owenyang0.github.io/easy-typer/')

  // 在此示例中，将仅创建具有 `about:blank` url 的窗口。
  // 其他 url 将被阻止。
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url) {
      return {
        action: 'allow',
        overrideBrowserWindowOptions: {
          width: 900,
          height: 800,
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


  mainWindow.on('ready-to-show', function () {
    mainWindow.show()
  })

  return mainWindow
}

function hasWindow() {
  return BrowserWindow.getAllWindows().length !== 0
}

// 这段程序将会在 Electron 结束初始化
// 和创建浏览器窗口的时候调用
// 部分 API 在 ready 事件触发后才能使用。
app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (!hasWindow()) {
      createWindow()
    }
  })

  // 注册一个'F4' 快捷键监听器
  const ret = globalShortcut.register('F4', () => {
    console.log('F4 is pressed')

    applescript.execString(retrivingScript, (err) => {
      app.focus({ steal: true })

      const errmsg = '暂时无法获取QQ赛文！！！请参考『帮助-关于-快速开始』完成初始设置：在『系统偏好设置-安全性与隐私-辅助功能』中，允许『木易跟打器』控制电脑；2.按下F4快捷键直接载文，即刻开始你的跟打之旅~'
      if (err) {
        showNotification(err.message, '获取文本失败')
      }

      if (!hasWindow()) {
        const win = createWindow()

        win.on('show', function () {
          win.webContents.send('update-paste', err ? errmsg : clipboard.readText())
        })

        return
      }

      if (err) {
        mainWindow.webContents.send('update-paste', errmsg)
        return
      }
      
      mainWindow.webContents.send('update-paste', clipboard.readText())
    })
  })
  // // 注册一个'F2' 快捷键监听器
  // globalShortcut.register('F2', () => {
  //   console.log('F2 is pressed')
  //   applescript.execString(sendingScript, (err) => {
  //     if (err) {
  //       // Something went wrong!
  //       console.log('sendingScript err', err)
  //     }
  //     console.log('sendingScript done')

  //     app.focus({ steal: true })
  //   })
  // })

  if (!ret) {
    console.log('registration failed')
  }

  // 检查快捷键是否注册成功
  console.log('is F4 registered: ' + globalShortcut.isRegistered('F4'))

  mainWindow.on('closed', _ => {
    console.log('closed')
    mainWindow = null
  })
})

// 除了 macOS 外，当所有窗口都被关闭的时候退出程序。 There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  console.log('window-all-closed')
  ipcMain.removeAllListeners()

  if (process.platform !== 'darwin') app.quit()
})

app.on('will-quit', () => {
  // // 注销快捷键
  // globalShortcut.unregister('F1')

  // 注销所有快捷键
  globalShortcut.unregisterAll()
})

if (isProduction) {
  app.on('browser-window-focus', function () {
    globalShortcut.register('CommandOrControl+R', () => {
      console.log('CommandOrControl+R is pressed: Shortcut Disabled')
    })
    globalShortcut.register('CommandOrControl+Shift+R', () => {
      console.log('CommandOrControl+Shift+R is pressed: Shortcut Disabled')
    })
    globalShortcut.register('F5', () => {
      console.log('F5 is pressed: Shortcut Disabled')
    })
  })

  app.on('browser-window-blur', function () {
    globalShortcut.unregister('CommandOrControl+R')
    globalShortcut.unregister('CommandOrControl+Shift+R')
    globalShortcut.unregister('F5')
  })
}
