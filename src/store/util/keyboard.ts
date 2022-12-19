import { LooseObject } from '../types'

export interface KeyNode {
  /**
   * 显示文本
   */
  key: string;
  /**
   * 手指位置
   * 0 - 3: 左手，4: 拇指 5 - 8: 右手, 9：待定
   */
  finger: number;
  /**
   * 所在行
   */
  row: number;
  /**
   * 是否为功能键
   */
  fn?: boolean;
  /**
   * 坐标
   */
  coord?: Array<number>;
}

/**
 * 键盘布局
 */
export const keyboard = new Map<string, KeyNode>([
  ['Escape', { key: '⎋', fn: true, finger: 0, row: 0 }],
  ['F1', { key: '', fn: true, finger: 0, row: 0 }],
  ['F2', { key: '', fn: true, finger: 0, row: 0 }],
  ['F3', { key: '', fn: true, finger: 0, row: 0 }],
  ['F4', { key: '', fn: true, finger: 0, row: 0 }],
  ['F5', { key: '', fn: true, finger: 0, row: 0 }],
  ['F6', { key: '', fn: true, finger: 0, row: 0 }],
  ['F7', { key: '', fn: true, finger: 0, row: 0 }],
  ['F8', { key: '', fn: true, finger: 0, row: 0 }],
  ['F9', { key: '', fn: true, finger: 0, row: 0 }],
  ['F10', { key: '', fn: true, finger: 0, row: 0 }],
  ['F11', { key: '', fn: true, finger: 0, row: 0 }],
  ['F12', { key: '', fn: true, finger: 0, row: 0 }],
  ['PrintScreen', { key: '', fn: true, finger: 9, row: 0 }],
  ['ScrollLock', { key: '', fn: true, finger: 9, row: 0 }],
  ['Pause', { key: '⏸', fn: true, finger: 9, row: 0 }],
  ['Backquote', { key: '`', finger: 0, row: 1, coord: [35, 120] }],
  ['Digit1', { key: '1', finger: 0, row: 1, coord: [90, 120] }],
  ['Digit2', { key: '2', finger: 1, row: 1, coord: [144, 120] }],
  ['Digit3', { key: '3', finger: 2, row: 1, coord: [198, 120] }],
  ['Digit4', { key: '4', finger: 3, row: 1, coord: [253, 120] }],
  ['Digit5', { key: '5', finger: 3, row: 1, coord: [307, 120] }],
  ['Digit6', { key: '6', finger: 5, row: 1, coord: [361, 120] }],
  ['Digit7', { key: '7', finger: 5, row: 1, coord: [415, 120] }],
  ['Digit8', { key: '8', finger: 6, row: 1, coord: [469, 120] }],
  ['Digit9', { key: '9', finger: 7, row: 1, coord: [524, 120] }],
  ['Digit0', { key: '0', finger: 8, row: 1, coord: [579, 120] }],
  ['Minus', { key: '-', finger: 8, row: 1, coord: [630, 120] }],
  ['Equal', { key: '=', finger: 8, row: 1, coord: [685, 120] }],
  ['Backspace', { key: '⌫', fn: true, finger: 9, row: 1, coord: [751, 120] }],
  ['Insert', { key: '', fn: true, finger: 9, row: 1 }],
  ['Home', { key: '⇤', fn: true, finger: 9, row: 1 }],
  ['PageUp', { key: '«', fn: true, finger: 9, row: 1 }],
  ['Tab', { key: '⇆', fn: true, finger: 0, row: 2, coord: [50, 174] }],
  ['KeyQ', { key: 'q', finger: 0, row: 2, coord: [115, 174] }],
  ['KeyW', { key: 'w', finger: 1, row: 2, coord: [169, 174] }],
  ['KeyE', { key: 'e', finger: 2, row: 2, coord: [224, 174] }],
  ['KeyR', { key: 'r', finger: 3, row: 2, coord: [278, 174] }],
  ['KeyT', { key: 't', finger: 3, row: 2, coord: [332, 174] }],
  ['KeyY', { key: 'y', finger: 5, row: 2, coord: [386, 174] }],
  ['KeyU', { key: 'u', finger: 5, row: 2, coord: [440, 174] }],
  ['KeyI', { key: 'i', finger: 6, row: 2, coord: [494, 174] }],
  ['KeyO', { key: 'o', finger: 7, row: 2, coord: [548, 174] }],
  ['KeyP', { key: 'p', finger: 8, row: 2, coord: [602, 174] }],
  ['BracketLeft', { key: '[', finger: 8, row: 2, coord: [656, 174] }],
  ['BracketRight', { key: ']', finger: 8, row: 2, coord: [710, 174] }],
  ['Backslash', { key: '\\', finger: 8, row: 2, coord: [764, 174] }],
  ['Delete', { key: '⌦', fn: true, finger: 9, row: 2 }],
  ['End', { key: '⇥', fn: true, finger: 9, row: 2 }],
  ['PageDown', { key: '»', fn: true, finger: 9, row: 2 }],
  ['CapsLock', { key: '⇪', fn: true, finger: 0, row: 3, coord: [58, 225] }],
  ['KeyA', { key: 'a', finger: 0, row: 3, coord: [130, 225] }],
  ['KeyS', { key: 's', finger: 1, row: 3, coord: [184, 225] }],
  ['KeyD', { key: 'd', finger: 2, row: 3, coord: [238, 225] }],
  ['KeyF', { key: 'f', finger: 3, row: 3, coord: [292, 225] }],
  ['KeyG', { key: 'g', finger: 3, row: 3, coord: [346, 225] }],
  ['KeyH', { key: 'h', finger: 5, row: 3, coord: [400, 225] }],
  ['KeyJ', { key: 'j', finger: 5, row: 3, coord: [454, 225] }],
  ['KeyK', { key: 'k', finger: 6, row: 3, coord: [508, 225] }],
  ['KeyL', { key: 'l', finger: 7, row: 3, coord: [562, 225] }],
  ['Semicolon', { key: ';', finger: 8, row: 3, coord: [616, 225] }],
  ['Quote', { key: '\'', finger: 8, row: 3, coord: [670, 225] }],
  ['Enter', { key: '⏎', fn: true, finger: 8, row: 3, coord: [745, 225] }],
  ['ShiftLeft', { key: '⇧', fn: true, finger: 0, row: 4, coord: [69, 275] }],
  ['KeyZ', { key: 'z', finger: 0, row: 4, coord: [158, 275] }],
  ['KeyX', { key: 'x', finger: 1, row: 4, coord: [212, 275] }],
  ['KeyC', { key: 'c', finger: 2, row: 4, coord: [266, 275] }],
  ['KeyV', { key: 'v', finger: 3, row: 4, coord: [320, 275] }],
  ['KeyB', { key: 'b', finger: 3, row: 4, coord: [374, 275] }],
  ['KeyN', { key: 'n', finger: 5, row: 4, coord: [428, 275] }],
  ['KeyM', { key: 'm', finger: 5, row: 4, coord: [482, 275] }],
  ['Comma', { key: ',', finger: 6, row: 4, coord: [536, 275] }],
  ['Period', { key: '.', finger: 7, row: 4, coord: [590, 275] }],
  ['Slash', { key: '/', finger: 8, row: 4, coord: [644, 275] }],
  ['ShiftRight', { key: '⇧', fn: true, finger: 8, row: 4, coord: [730, 275] }],
  ['ArrowUp', { key: '↑', fn: true, finger: 9, row: 4 }],
  ['ControlLeft', { key: '⌃', fn: true, finger: 0, row: 5 }],
  ['AltLeft', { key: '⌥', fn: true, finger: 0, row: 5 }],
  ['MetaLeft', { key: '⌘', fn: true, finger: 0, row: 5 }],
  ['Space', { key: '␣', finger: 4, row: 5, coord: [380, 329] }],
  ['ControlRight', { key: '⌃', fn: true, finger: 8, row: 5 }],
  ['MetaRight', { key: '⌘', fn: true, finger: 8, row: 5 }],
  ['AltRight', { key: '⌥', fn: true, finger: 8, row: 5 }],
  ['ArrowLeft', { key: '←', fn: true, finger: 9, row: 5 }],
  ['ArrowDown', { key: '↓', fn: true, finger: 9, row: 0 }],
  ['ArrowRight', { key: '→', fn: true, finger: 9, row: 0 }]
])

export function emptyKeyCount (): LooseObject<number> {
  const count: LooseObject<number> = {}
  for (const key of keyboard.keys()) {
    count[key] = 0
  }
  return count
}
