const File = require('./File');
const config = require('./config')

const singleConfig = config.singleConfig

const options = []
const promises = singleConfig.map(conf => {
  return File.read(`/single/${conf.name}.txt`).then(content => {
    const ret = {
      title: conf.name,
      content
    }

    const finalVal = `single${conf.value}`
    return File.create(`../public/static/kata/${finalVal}.json`, JSON.stringify(ret, null, 2)).then(data => {
      options.push({ "value": finalVal, "label": conf.name, "isRemote": true })
    }).catch(err => {
      console.log(err)
    })
  })
})

Promise.all(promises).then((ret) => {
  const retOptions = singleConfig.map(c => options.find(o => o.label === c.name))
  console.log(JSON.stringify(retOptions, null, 2))
})
