/**
 * fork from clipboard.js: https://clipboardjs.com/
 */
export default class Clipboard {
  private static createFake (text: string, command: string, onSuccess: Function, onError: Function) {
    const placeholder = document.createElement('textarea')
    placeholder.setAttribute('style', 'position: absoluteoverflow: hiddenwidth: 0height: 0top: 0left: 0')
    placeholder.innerText = text
    document.body.appendChild(placeholder)
    placeholder.select()
    try {
      document.execCommand(command)
      placeholder.remove()
    } catch (err) {
      onError(err)
    }
    onSuccess()
  }

  static copy (text: string, onSuccess: Function | undefined, onError: Function | undefined) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        onSuccess && onSuccess()
        return text
      }, (e) => {
        onError && onError(e)
      })
    } else {
      this.createFake(text, 'copy', () => {
        onSuccess && onSuccess()
      }, (e: Error) => {
        onError && onError(e)
      })
    }
  }
}
