export function shuffle (arr: string[]) {
  let m = arr.length
  while (m > 1) {
    const index = Math.floor(Math.random() * m--)
    ;[arr[m], arr[index]] = [arr[index], arr[m]]
  }
  return arr
}

export function shuffleText (text: string) {
  const arr = text.split('')
  let m = arr.length
  while (m > 1) {
    const index = Math.floor(Math.random() * m--)
    ;[arr[m], arr[index]] = [arr[index], arr[m]]
  }
  return arr.join('')
}

export function initColorMode (mode = '', initial = false) {
  const html = document.getElementsByTagName('html')[0]
  const colorMode = !initial ? mode : (localStorage.getItem('colorMode') as string || '')
  html.setAttribute('class', colorMode)
}

export const isNative = !!window.electronAPI

export function initEnv () {
  const html = document.getElementsByTagName('html')[0]
  isNative && html.setAttribute('data-is-native', '')
  window.__typer = {
    env: isNative ? 'native' : 'web'
  }
}

export function loadFonts () {
  if ('fonts' in document) {
    if (sessionStorage.fontsLoadedFoft) {
      document.body.className += ' fonts-loaded'
      return
    }

    Promise.all([
      document.fonts.load('400 1em LXGWWenKai')
      // document.fonts.load('100 1em LXGWWenKai'),
      // document.fonts.load('700 1em LXGWWenKai')
    ]).then(function () {
      document.body.className += ' fonts-loaded'
      sessionStorage.fontsLoadedFoft = true
    })
  }
}
