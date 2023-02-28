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

export function accuracyRank (accuracy: number) {
  if (accuracy >= 100) return '百准神仙'
  if (accuracy >= 99) return '键准大神'
  if (accuracy >= 97) return '键准大师'
  if (accuracy >= 95) return '键准高手'
  if (accuracy >= 92) return '键准熟手'
  return '键准新手'
}

export function fixIOSScrollIssue () {
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream
  if (!isIOS) {
    return
  }
  /* eslint-disable @typescript-eslint/no-non-null-assertion */
  const racingEl = document.querySelector('#racing-textarea')
  let currentInput: EventTarget | null = null // 当前聚焦的输入框
  const fixedEle = document.querySelector('body')

  // webview发生平移，则及时更新fixed元素的定位
  function handleScroll () {
    fixedEle!.style.position = 'fixed'
    fixedEle!.style.top = `${window.pageYOffset - 62}px`
  }

  // 滚动时收起软键盘
  function stopMove () {
    if (currentInput) {
      (currentInput as HTMLElement).blur()
      currentInput = null
      window.removeEventListener('touchmove', stopMove)
      window.removeEventListener('scroll', handleScroll)
      fixedEle!.style.top = '0px'
      fixedEle!.style.position = ''
    }
  }

  function handleFocusin (e: Event) {
    const el = e || window.event
    // 在本身有输入框处于聚焦状态软键盘出现时，点击聚焦另外的输入框
    if (currentInput) {
      currentInput = el.target
      return
    }
    // 添加滚动监听，为了软键盘出现 以及 从一个聚焦输入框聚焦到另外一个输入框时， 重新定位fixed元素（其实这里不用滚动事件监听变化也可以用setTimeout来更新定位）
    window.addEventListener('scroll', handleScroll)
    currentInput = el.target
    // 监听移动手势：
    // 1. 在软键盘出现后，如果想要滚动，则收起软键盘，解绑webview的滚动监听事件
    // 2. 在软键盘出现后，用户主动收起软键盘（如点击软键盘的收起/完成等按钮），此时用户没有做移动手势，那么就会在收起软键盘后只要做了移动手势，就仍然触发绑定事件，达到解绑滚动监听事件的目的，阻止监听到webview回弹效果导致的固定顶部元素发生位移。
    window.addEventListener('touchmove', stopMove)
  }

  racingEl!.addEventListener('focusin', handleFocusin)
}
