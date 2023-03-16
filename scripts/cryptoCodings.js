const CryptoJS = require('crypto-js')
const path = require('path')
const File = require('./File')

File.read('/codings/codingsXHRaw.txt').then(content => {
  console.log('content', content.slice(0, 100))
  const ciphertext = CryptoJS.AES.encrypt(content, 'U2FsdGVkX19wPZQjUTQ0').toString()

  return File.create('../public/static/codingsXH.txt', ciphertext).then(() => {
    console.log('密文写入成功')
  }).catch(err => {
    console.log(err)
  })
})

// File.read('../public/static/codingsXH.txt').then(content => {
//   console.log('content==', content.slice(0, 100))
//   const bytes = CryptoJS.AES.decrypt(content, 'U2FsdGVkX19wPZQjUTQ0')
//   const originalText = bytes.toString(CryptoJS.enc.Utf8)
//   console.log(originalText.slice(0, 100)) // 'my message'
// })
