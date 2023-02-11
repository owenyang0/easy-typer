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

const SPEED_GAP = 30
const rankLevel = {
  lv1: '菜鸟',
  lv2: '新手',
  lv3: '熟手',
  lv4: '高手',
  lv5: '大师',
  lv6: '大神',
  lv7: '王者',
  lv8: '传奇'
}
export function speedRank (speed: number) {
  // 小于30菜鸟 30-60新手 60-90熟手 90-120高手 120-150大师 150-180大神 180-210王者 大于210传奇
  const rawLevel = Math.ceil(speed / SPEED_GAP)
  const level = rawLevel > 8 ? 8 : rawLevel
  const rank = `lv${level}` as keyof typeof rankLevel

  return rankLevel[rank]
}
