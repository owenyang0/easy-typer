const File = require('./File')
const config = require('./config')

const articleConfig = config.articleSet

const options = []
const promises = articleConfig.map(conf => {
  return File.read(`/articleSet/${conf.name}.txt`.replace(' ', '\ ')).then(content => {
    const ret = {
      title: conf.name,
      content
    }

    const finalVal = `article${conf.value}`
    return File.create(`../public/static/kata/${finalVal}.json`, JSON.stringify(ret, null, 2)).then(data => {
      options.push({ "value": finalVal, "label": conf.name, "isRemote": true })
    }).catch(err => {
      console.log(err)
    })
  })
})

Promise.all(promises).then((ret) => {
  const retOptions = articleConfig.map(c => options.find(o => o.label === c.name))
  console.log(JSON.stringify(retOptions, null, 2))
})
