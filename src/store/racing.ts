import xcapi from '@/api/xc.cool'
import { ActionTree, GetterTree, Module, MutationTree } from 'vuex'
import { Achievement, QuickTypingState, RacingState, Word } from './types'
import db from './util/Database'
import { keyboard } from './util/keyboard'

const statusMap = new Map<string, string>([
  ['init', '初始化'],
  ['wait', '等待开始'],
  ['pause', '暂停'],
  ['typing', '进行中'],
  ['finished', '结束']
])

const formatTime = (total: number, mill = 3): string => {
  if (total < 60) {
    return `${total.toFixed(mill)}`
  }

  const seconds = total % 60
  const minutes = (total - seconds) / 60
  return `${minutes.toFixed(0)}:${seconds.toFixed(mill)}`
}

const padLeft = (input: string, length: number): string => {
  if (input.length < length) {
    return padLeft('0' + input, length)
  }

  return input
}

const finished = (strategy: string, input: string, content: string, last: string): { finished: boolean; error: number } => {
  let finished = false
  let error = 0
  if (strategy === 'NO_ERROR') {
    finished = input === content
  } else {
    finished = input.length === content.length
    if (strategy === 'LAST_RIGHT') {
      if (last.length > 0) {
        finished = finished && content.endsWith(last)
      } else {
        finished = finished && content.charAt(content.length - 1) === input.charAt(input.length - 1)
      }
    }

    if (finished) {
      const inputs = input.split('')
      const targets = content.split('')

      for (let i = 0; i < inputs.length; i++) {
        if (inputs[i] !== targets[i]) {
          error++
        }
      }
    }
  }

  return { finished, error }
}

const state = new RacingState()

const getters: GetterTree<RacingState, QuickTypingState> = {
  statusText ({ status }): string {
    return statusMap.get(status) || '未知'
  },

  // 已输入文字数量
  typed ({ input }): number {
    return input.length
  },

  // 击键速度
  hitSpeed ({ keys }): string {
    const { time, start } = state
    const used = (start === 0 ? time : time + Date.now() - start) / 1000
    if (used < 0.005) {
      return (0).toFixed(2)
    }

    return (keys.length / used).toFixed(2)
  },

  // 打字速度
  typeSpeed (state): string {
    const { time, start } = state
    const used = (start === 0 ? time : time + Date.now() - start) / 1000
    // const used = getters.usedTime
    if (used < 0.005) {
      return (0).toFixed(2)
    }

    const { input, error } = state
    // 错一罚五
    // TODO typing时未实时计算
    return (Math.max(input.length - error * 5, 0) / used * 60).toFixed(2)
  },

  // 码长
  codeLength ({ keys, input }): string {
    return input.length > 0 ? (keys.length / input.length).toFixed(2) : '0.00'
  },

  // 理论码长
  idealCodeLength (state, getters, { article }): string {
    return article.shortest ? (article.shortest.distance / article.content.length).toFixed(2) : '0.00'
  },

  // 打词率
  phraseRate ({ phrase }, getters, { article }): string {
    return (phrase / article.content.length * 100).toFixed(2)
  },

  // 键准
  accuracy ({ keys, keyCount, replace, cleared }, getters): string {
    // 总键数
    const total = keys.length
    // 有效键数 = 总数 - 退格数 - (回改数 * 码长)
    const backspace = keyCount.Backspace || 0
    const correct = total - backspace - cleared - (replace * parseFloat(getters.codeLength))
    return (correct / total * 100).toFixed(2)
  },

  leftHand ({ keys }): number {
    return keys.map(v => keyboard.get(v)).filter(v => v && v.finger <= 3).length
  },

  rightHand ({ keys }): number {
    return keys.map(v => keyboard.get(v)).filter(v => v && v.finger >= 5 && v.finger <= 8).length
  },

  // 键法
  balance (state, getters): string {
    const { leftHand, rightHand } = getters
    const total = leftHand + rightHand
    const delta = Math.abs(leftHand - rightHand)

    return (100 - delta / total * 100).toFixed(2)
  },

  enterCount ({ keyCount }): number {
    return keyCount.Enter || 0
  },

  backspaceCount ({ keyCount }): number {
    return keyCount.Backspace || 0
  },

  // 用时
  usedTime ({ status, time, start }): number {
    if (status !== 'typing') {
      return time / 1000
    } else {
      return (time + Date.now() - start) / 1000
    }
  },

  // 计时显示
  passTime ({ status, time }): string {
    if (status !== 'typing' && time === 0) {
      return '--:--'
    }

    const total = time / 1000
    if (total < 60) {
      return `00:${padLeft(total.toFixed(0), 2)}`
    }

    const seconds = total % 60
    const minutes = (total - seconds) / 60
    return `${padLeft(minutes.toFixed(0), 2)}:${padLeft(seconds.toFixed(0), 2)}`
  },

  // 进度
  progress ({ input }, getters, { article }): number {
    return input.length / article.content.length
  },

  hash (state, getters, { article }): string {
    const { identity } = article
    const { typeSpeed, hitSpeed, codeLength } = getters
    const input = `${identity}-${typeSpeed}-${hitSpeed}-${codeLength}`
    return xcapi.sha1Hmac(input)
  },

  // 编码提示
  hint ({ input }, getters, { article }): Array<Word> | null {
    const { shortest } = article
    const length = input.length
    if (!shortest || length >= shortest.path.length) {
      return null
    }

    const { path, vertices } = shortest
    const result: Array<Word> = []
    for (let i = Math.min(10, article.content.length - length); i > 0; i--) {
      const start = length + i
      const alt = vertices[start].get(length)
      if (!alt) {
        continue
      }

      if (start === path[length]) {
        result.splice(0, 0, alt.value)
      } else {
        result.push(alt.value)
      }
    }

    return result
  },

  achievement (state, getters, { article }): Achievement {
    const result = new Achievement()
    Object.assign(result, {
      identity: article.identity || '1',
      title: article.title,
      typeSpeed: parseFloat(getters.typeSpeed),
      hitSpeed: parseFloat(getters.hitSpeed),
      codeLength: parseFloat(getters.codeLength),
      contentLength: article.content.length,
      error: state.error,
      usedTime: state.time,
      pauseCount: state.pauseCount,
      pauseTime: state.pauseTime,
      accuracy: parseFloat(getters.accuracy),
      balance: parseFloat(getters.balance),
      leftHand: getters.leftHand,
      rightHand: getters.rightHand,
      idealCodeLength: parseFloat(getters.idealCodeLength),
      phrase: state.phrase,
      phraseRate: parseFloat(getters.phraseRate),
      selective: state.selective,
      replace: state.replace,
      keys: state.keys.length,
      backspace: getters.backspaceCount,
      enter: getters.enterCount,
      retry: state.retry
    })

    return result
  },

  // 比赛结果
  result (state, getters, { article, setting }): string {
    const { inputMethod, inputMethodName, signature, signatureText } = setting
    const statistics: Map<string, string> = new Map([
      ['identity', `第${article.identity || 1}段`],
      ['typeSpeed', `速度${getters.typeSpeed}`],
      ['hitSpeed', `击键${getters.hitSpeed}`],
      ['codeLength', `码长${getters.codeLength}`],
      ['contentLength', `字数${article.content.length}`],
      ['error', `错字${state.error}`],
      ['usedTime', `用时${formatTime(getters.usedTime)}`],
      ['pauseTime', `暂停${state.pauseCount}次${formatTime(state.pauseTime / 1000)}秒`],
      ['accuracy', `键准${getters.accuracy}%`],
      ['balance', `键法${getters.balance}%`],
      ['leftHand', `左${getters.leftHand}`],
      ['rightHand', `右${getters.rightHand}`],
      ['idealCodeLength', `理论码长${getters.idealCodeLength}`],
      ['phrase', `打词${state.phrase}`],
      ['phraseRate', `打词率${getters.phraseRate}%`],
      ['selective', `选重${state.selective}`],
      ['replace', `回改${state.replace}`],
      ['keys', `键数${state.keys.length}`],
      ['backspace', `退格${getters.backspaceCount}`],
      ['enter', `回车${getters.enterCount}`],
      ['retry', `重打${state.retry}`],
      ['hash', `哈希${getters.hash}`],
      ['inputMethod', `输入法:${inputMethodName}`],
      ['signature', `个性签名:${signatureText}`],
      // ['version', `易v${process.env.VUE_APP_VERSION}`]
      ['version', `易跟打macOS版v${process.env.VUE_APP_VERSION}`]
    ])

    const options = setting.resultOptions.slice(0)
    if (inputMethod && inputMethodName) {
      options.push('inputMethod')
    }
    if (signature && signatureText) {
      options.push('signature')
    }
    const keys = new Set(options)
    const result: Array<string> = []
    statistics.forEach((value, key) => {
      if (keys.has(key)) {
        result.push(value)
      }
    })

    return result.join(' ')
  }
}

const mutations: MutationTree<RacingState> = {
  init (state): void {
    Object.assign(state, new RacingState())
    state.status = 'init'
  },

  start (state): void {
    state.status = 'typing'
    state.start = Date.now()
    state.time = 0
  },

  finish (state, payload): void {
    state.error = payload.error
    state.status = 'finished'
    state.time += Date.now() - state.start
    state.start = 0
    state.timer = 0
  },

  pause (state): void {
    const now = Date.now()
    state.status = 'pause'
    state.time += now - state.start
    state.start = now
    state.pauseCount++
  },

  resume (state): void {
    const now = Date.now()
    state.status = 'typing'
    state.pauseTime += now - state.start
    state.start = now
  },

  // 重打
  retry (state): void {
    const retry = state.retry + 1
    Object.assign(state, new RacingState())
    state.status = 'init'
    state.retry = retry
    state.timer = 0
  },

  typing (state, { e, altSelectKey }: { e: KeyboardEvent; altSelectKey: string }): void {
    const { code } = e
    const { keyCount, keys } = state
    const count = keyCount[code]
    keyCount[code] = (count || 0) + 1
    keys.push(code)

    // 判断选重
    if (e.isComposing && altSelectKey.indexOf(e.key) >= 0) {
      state.selective++
    }

    // 刷新时间
    state.time += 0.000000001
  },

  accept (state, input: string): void {
    state.input = input
  },

  replace (state, count: number): void {
    state.replace += count
  },

  cleared (state, count: number): void {
    state.cleared += count
  },

  phrase (state, count: number): void {
    state.phrase += count
  },

  elapse (state, time): void {
    state.time += time
    state.start += time
  },

  timer (state, id): void {
    state.timer = id
  },

  idealKeys (state, idealKeys): void {
    state.idealKeys = idealKeys
  }
}

const actions: ActionTree<RacingState, QuickTypingState> = {
  init ({ commit, state }): void {
    if (state.timer) {
      clearInterval(state.timer)
    }

    commit('init')
  },

  retry ({ commit, state }) {
    if (state.timer) {
      clearInterval(state.timer)
    }

    if (state.status !== 'init') {
      commit('retry')
    }
  },

  pause ({ commit, state }) {
    if (state.status === 'typing') {
      commit('pause')
    }
  },

  resume ({ commit, state }) {
    if (state.status === 'pause') {
      commit('resume')
    }
  },

  typing ({ commit, state, rootState }, e) {
    if (state.status === 'init' && state.timer === 0) {
      const interval = 1000
      const id = setInterval(() => {
        if (state.status === 'typing') {
          commit('elapse', interval)
        }
      }, interval)
      commit('timer', id)
      commit('start')
    }

    const { altSelectKey } = rootState.setting
    commit('typing', { e, altSelectKey })
  },

  accept ({ commit, state, rootState }, input: string): void {
    if (input.length === 0 && rootState.setting.retryWhenEmpty) {
      this.dispatch('racing/retry')
      return
    }

    if (state.input !== input) {
      const delta = input.length - state.input.length
      this.dispatch('summary/typeWords', delta, { root: true })
      if (delta < 0) {
        // 字数变少，回改
        commit('replace', -delta)
      }
    }

    commit('accept', input)
  },

  phrase ({ commit, rootState }, text: string) {
    const { punctuations } = rootState.setting
    let length = text.length
    const last = text.charAt(length - 1)
    if (punctuations.has(last)) {
      length -= 1
    }
    if (length > 1) {
      commit('phrase', length)
    }
  },

  checkFinished ({ commit, state, rootState, getters }, last) {
    const { article, setting } = rootState
    const { input } = state

    const finishState = finished(setting.finishStrategy, input, article.content, last)
    if (finishState.finished) {
      clearInterval(state.timer)
      commit('finish', finishState)
      setTimeout(() => {
        // TODO move to summary module
        this.dispatch('summaryKeyCount', state.keyCount)
        this.dispatch('summary/saveWordCount')
        const achievement = getters.achievement
        this.dispatch('addAchievements', achievement, { root: true })
        db.achievement.add(achievement)
      })
    }
  },

  setIdealKeys ({ commit }, idealKeys: string): void {
    commit('idealKeys', idealKeys)
  }
}

export const racing: Module<RacingState, QuickTypingState> = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
