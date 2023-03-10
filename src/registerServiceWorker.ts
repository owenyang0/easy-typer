/* eslint-disable no-console */

import { Notification } from 'element-ui'
import { register } from 'register-service-worker'

if (process.env.NODE_ENV === 'production') {
  register(`${process.env.BASE_URL}service-worker.js`, {
    ready () {
      console.log(
        'App is being served from cache by a service worker.\n' +
        'For more details, visit https://goo.gl/AFskqB'
      )
    },
    registered (registration) {
      console.log('Service worker has been registered.')
      setInterval(() => {
        registration.update()
        console.log('Service worker has updated.')
      }, 1000 * 60 * 60) // e.g. hourly checks
    },
    cached () {
      console.log('Content has been cached for offline use.')
    },
    updatefound () {
      Notification.info('发现新版本，正在下载...')
    },
    updated () {
      Notification.info('新版本下载完成，若想马上使用，可关闭所有标签后『重开』浏览器即可使用最新版本')
    },
    offline () {
      console.log('No internet connection found. App is running in offline mode.')
    },
    error (error) {
      console.error('Error during service worker registration:', error)
    }
  })
}
