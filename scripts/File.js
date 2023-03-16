'use strict'

const path = require('path')
const fs = require('fs')
const ABSPATH = path.dirname(require.main.filename)

class Files {
  static read(finalPath, encoding = 'utf8') {
    return new Promise((resolve, reject) => {
      let readStream = fs.createReadStream(path.join(ABSPATH, finalPath), encoding)
      let data = ''

      readStream
        .on('data', (chunk) => {
          data += chunk
        })
        .on('end', () => {
          resolve(data)
        })
        .on('error', (err) => {
          reject(err)
        })
    })
  }

  static create(finalPath, contents) {
    return new Promise((resolve, reject) => {
      fs.writeFile(path.join(ABSPATH, finalPath), contents, (err, data) => {
        if (!err) {
          resolve(data)
        } else {
          reject(err)
        }
      })
    })
  }

  static remove(path) {
    return new Promise((resolve, reject) => {
      fs.unlink(ABSPATH + path, (err) => {
        if (!err) {
          resolve(path)
        } else {
          reject(err)
        }
      })
    })
  }

  static exists(path) {
    return new Promise((resolve, reject) => {
      fs.access(ABSPATH + path, fs.constants.F_OK, (err) => {
        if (!err) {
          resolve(true)
        } else {
          reject(err)
        }
      })
    })
  }
}

module.exports = Files
