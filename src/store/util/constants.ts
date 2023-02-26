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
  ['typing', 'danger']
])

export const statusMapIcon = new Map<string, string>([
  ['init', 'el-icon-time'],
  ['wait', 'el-icon-time'],
  ['finished', 'el-icon-success'],
  ['pause', 'el-icon-video-play'],
  ['typing', 'el-icon-loading']
])
