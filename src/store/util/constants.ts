export const statusMapText = new Map<string, string>([
  ['init', '准备中'],
  ['wait', '准备中'],
  ['finished', '已结束'],
  ['pause', '继续(Enter)'],
  ['typing', '暂停(Esc)']
])

export const statusMapType = new Map<string, string>([
  ['init', 'success'],
  ['wait', 'success'],
  ['finished', 'primary'],
  ['pause', 'warning'],
  ['typing', 'success']
])

export const statusMapIcon = new Map<string, string>([
  ['init', 'el-icon-time'],
  ['wait', 'el-icon-time'],
  ['finished', 'el-icon-success'],
  ['pause', 'el-icon-video-play'],
  ['typing', 'el-icon-loading']
])

export const symbol2CH = {
  comma: [
    { reg: /,/g, replacement: '，' },
    { reg: /\./g, replacement: '。' }
  ],
  questionmark: [
    { reg: /\?/g, replacement: '？' },
    { reg: /!/g, replacement: '！' }
  ],
  colon: [
    { reg: /;/g, replacement: '；' },
    { reg: /:/g, replacement: '：' }
  ],
  bracket: [
    { reg: /\(/g, replacement: '（' },
    { reg: /\)/g, replacement: '）' }
  ],
  squareBracket: [
    { reg: /\[/g, replacement: '【' },
    { reg: /\]/g, replacement: '】' }
  ],
  quot: [
    { reg: /"(.*?)"/g, replacement: '“$1”' },
    { reg: /'(.*?)'/g, replacement: '‘$1’' }
  ],
  connector: [
    { reg: /-/g, replacement: '—' },
    { reg: /⋯/g, replacement: '…' },
    { reg: /\.\.\./g, replacement: '…' }
  ],
  book: [
    { reg: /</g, replacement: '《' },
    { reg: />/g, replacement: '》' }
  ],
  backslash: [
    { reg: /\\/g, replacement: '、' }
  ]
}

export const symbolsRegs = Object.entries(symbol2CH).map(([, vals]) => vals).reduce((pre, curr) => pre.concat(curr))
