export const wikiTypes = {
  national: 'national',
  world: 'world',
  songci: 'songci',
  shijing: 'shijing'
}

export const wikiTypeMap = {
  [wikiTypes.national]: {
    title: '国内新闻',
    api: '/api/r/news/national',
    type: wikiTypes.national,
    buttonStyle: 'primary'
  },
  [wikiTypes.world]: {
    title: '国际新闻',
    api: '/api/r/news/world',
    type: wikiTypes.world,
    buttonStyle: 'primary'
  },
  [wikiTypes.songci]: {
    title: '精选宋词',
    api: '/api/r/wikis/songci',
    type: wikiTypes.songci,
    buttonStyle: 'warning'
  },
  [wikiTypes.shijing]: {
    title: '诗经大全',
    api: '/api/r/wikis/shijing',
    type: wikiTypes.shijing,
    buttonStyle: 'warning'
  }
}
