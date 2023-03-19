
import { ActionTree, GetterTree, Module, MutationTree } from 'vuex'
import { QuickTypingState, SummaryState } from './types'
import db from './util/Database'
import { Message } from 'element-ui'

const state = new SummaryState()

const getters: GetterTree<SummaryState, QuickTypingState> = {
  todayWords: state => state.todayWords,
  totalWords: state => state.totalWords,
  todayErrorWords: state => state.todayErrorWords,
  totalErrorWords: state => state.totalErrorWords,
  consecutiveDays: state => state.consecutiveDays,
  totalDays: state => state.totalDays
}

const mutations: MutationTree<SummaryState> = {
  newDay: (state, today: Date) => {
    state.todayWords = 0
    state.todayErrorWords = 0
    state.consecutiveDays += 1
    state.totalDays += 1
    state.date = today.getDate()
    state.saved = today.toLocaleDateString()
  },

  words: (state, delta: number) => {
    state.todayWords += delta
    state.totalWords += delta
  },

  errorWords: (state, errorWords: number) => {
    state.todayErrorWords += errorWords
    state.totalErrorWords += errorWords
  },

  loaded: (state, payload: SummaryState) => {
    Object.assign(state, payload)
    state.loaded = true
  },

  saveDate: (state) => {
    state.saved = new Date().toLocaleDateString()
  }
}

const actions: ActionTree<SummaryState, QuickTypingState> = {
  typeWords: ({ commit, state }, { delta, errorWords }) => {
    if (delta <= 0) {
      return
    }

    const now = new Date()
    if (now.getDate() !== state.date) {
      // 新一天
      commit('newDay', now)
    }
    commit('words', delta)
    commit('errorWords', errorWords)
  },

  loaded: ({ commit }, data: SummaryState) => {
    const today = new Date()
    const yesterday = new Date()
    yesterday.setDate(today.getDate() - 1)
    if (data.saved !== today.toLocaleDateString() && data.saved !== yesterday.toLocaleDateString()) {
      data.consecutiveDays = 0
    }
    commit('loaded', data)
  },

  saveWordCount: ({ commit, state }) => {
    if (!state.loaded) {
      console.log('历史数据未正确加载，请刷新再试')
      Message.warning({
        message: '历史数据未正确加载，请刷新再试'
      })
      return
    }
    const data = {}
    // Object.assign(data, state, { saved: '2021/4/22', date: 22 })
    Object.assign(data, state)
    delete data.loaded
    db.summary.put(data, 'wordCount')
    commit('saveDate')
  }
}

export const summary: Module<SummaryState, QuickTypingState> = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
