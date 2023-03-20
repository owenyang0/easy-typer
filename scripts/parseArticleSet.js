const File = require('./File')
const config = require('./configSet')

const { set0, set1, set2, set3, set4 } = config

// TODO:
const txtList = set4
const dirName = 'articleSet4'

const options = []
const promises = txtList.map(name => {
  // eslint-disable-next-line no-useless-escape
  return File.read(`/${dirName}/${name}`.replace(' ', '\ ')).then(content => {
    const title = name.replace('.txt', '')
    const ret = {
      title: title,
      content
    }

    const finalVal = `${dirName}-${name.split(' ')[0]}`
    return File.create(`../public/static/kata/${finalVal}.json`, JSON.stringify(ret, null, 2)).then(data => {
      options.push({ value: finalVal, label: title, isRemote: true })
    }).catch(err => {
      console.log(err)
    })
  })
})

Promise.all(promises).then((ret) => {
  const retOptions = options.sort((a, b) => a.label > b.label ? 1 : -1)
  // txtList.map(name => options.find(o => o.label === name))
  console.log(JSON.stringify(retOptions, null, 2))
})
