const File = require('./File')
const config = require('./configSet')

const { set0, set1, set2, set3, set4 } = config

// TODO:

function parsing (list, dir, optionId) {
  const txtList = list
  const dirName = dir || 'articleSet1'

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

    const sql = retOptions.reduce((pre, curr) => pre + `(${optionId}, '${curr.value}', '${curr.label}', ${curr.isRemote ? 1 : 0}),\n`, 'INSERT INTO kata_options_child (option_id, value, label, isRemote) VALUES\n').replace(/,\n$/, '')
    File.create(`/sqls/${dirName}.sql`, sql)
    console.log(JSON.stringify(retOptions, null, 2))
  })
}

parsing(set0, 'articleSet0', 4)
parsing(set1, 'articleSet1', 5)
parsing(set2, 'articleSet2', 6)
parsing(set3, 'articleSet3', 7)
parsing(set4, 'articleSet4', 8)
