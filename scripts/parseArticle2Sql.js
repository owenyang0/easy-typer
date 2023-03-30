const File = require('./File')
const config = require('./configSet')

const { set0, set1, set2, set3, set4, drivingLicense1 } = config

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
      options.push({ value: finalVal, label: title, isRemote: true, content })
      return options
      // return File.create(`/kata/${finalVal}.json`, JSON.stringify(ret, null, 2)).then(data => {
      //   options.push({ value: finalVal, label: title, isRemote: true, content })
      // }).catch(err => {
      //   console.log(err)
      // })
    })
  })

  Promise.all(promises).then((ret) => {
    const retOptions = options.sort((a, b) => a.label > b.label ? 1 : -1)

    const sql = retOptions.reduce((pre, curr) => pre + `(${optionId}, '${curr.value}', '${curr.label}', "${curr.content}", ${curr.isRemote ? 1 : 0}),\n`, 'INSERT INTO kata_options_child (option_id, value, label, content, isRemote) VALUES\n').replace(/,\n$/, '')
    File.create(`/sqls/${dirName}.sql`, sql)
  })
}

parsing(set0, 'articleSet0', 4)
parsing(set1, 'articleSet1', 5)
parsing(set2, 'articleSet2', 6)
parsing(set3, 'articleSet3', 7)
parsing(set4, 'articleSet4', 8)
parsing(drivingLicense1, 'drivingLicense1', 9)

// 单字
const options = [{
  value: 'tiger',
  label: '虎码',
  children: [
    { value: 'tigerSimp2F500', label: '虎码二简 前500[完结版]', isRemote: true },
    { value: 'tigerSimp2Other', label: '虎码二简 其他[完结版]', isRemote: true },
    { value: 'tigerCertainly632', label: '虎码必拆字632[完结版]', isRemote: true },
    { value: 'tigerCode3', label: '虎码三码字根字', isRemote: true },
    { value: 'tigerYNM4500', label: '虎码要你命4500', isRemote: true },
    { value: 'singleMo500', label: '魔500', isRemote: true }
  ]
},
{
  value: 'word',
  label: '单字',
  children: [
    { value: 'singleFront500', label: '前500 1-500', isRemote: true },
    { value: 'singleMiddle500', label: '中500 501-1000', isRemote: true },
    { value: 'singleEnd500', label: '后500 1001-1500', isRemote: true },
    { value: 'singleFront1500', label: '前1500 1-1500', isRemote: true },
    { value: 'singleHuang500', label: '黄500 1501-2000', isRemote: true },
    { value: 'singleXuan500', label: '玄500 2001-2500', isRemote: true },
    { value: 'singleDi500', label: '地500 2501-3000', isRemote: true },
    { value: 'singleTian500', label: '天500 3001-3500', isRemote: true },
    { value: 'singleEnd2000', label: '后2000 1501-3500', isRemote: true },
    { value: 'singleAll3500', label: '全3500 1-3500', isRemote: true },
    {
      value: 'singleWang500',
      label: '王500 3501-4000',
      isRemote: true
    },
    {
      value: 'singleGrand500',
      label: '皇500 4001-4500',
      isRemote: true
    },
    {
      value: 'singleEmpire500',
      label: '帝500 4501-5000',
      isRemote: true
    }
  ]
}]

function parsingSingle (list, filename, optionId) {
  const options = []
  const promises = list.map(l => {
    // eslint-disable-next-line no-useless-escape
    return File.read(`/kata/${l.value}.json`).then(content => {
      const json = JSON.parse(content)

      options.push({ value: l.value, label: json.title, isRemote: true, content: json.content })
    })
  })

  Promise.all(promises).then((ret) => {
    const retOptions = list.map(l => options.find(o => o.value === l.value))

    const sql = retOptions.reduce((pre, curr) => pre + `(${optionId}, '${curr.value}', '${curr.label}', '${curr.content}', ${curr.isRemote ? 1 : 0}),\n`, 'INSERT INTO kata_options_child (option_id, value, label, content, isRemote) VALUES\n').replace(/,\n$/, '')
    File.create(`/sqls/${filename}.sql`, sql)
  })
}

parsingSingle(options[0].children, '01tiger', 2)
parsingSingle(options[1].children, '02single', 3)
