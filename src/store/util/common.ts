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
  const colorMode = !initial ? mode : localStorage.getItem('colorMode') as string
  html.setAttribute('class', colorMode)
}

export const isNative = !!window.electronAPI
