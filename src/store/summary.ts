
import { ActionTree, GetterTree, Module, MutationTree } from 'vuex'
import { QuickTypingState, SummaryState } from './types'
import db from './util/Database'

const state = new SummaryState()

const getters: GetterTree<SummaryState, QuickTypingState> = {
  todayWords: state => state.todayWords,
  totalWords: state => state.totalWords,
  consecutiveDays: state => state.consecutiveDays,
  totalDays: state => state.totalDays
}

const mutations: MutationTree<SummaryState> = {
  newDay: (state, today: Date) => {
    state.todayWords = 0
    state.consecutiveDays += 1
    state.totalDays += 1
    state.date = today.getDate()
    state.saved = today.toLocaleDateString()
  },

  words: (state, delta: number) => {
    state.todayWords += delta
    state.totalWords += delta
  },

  loaded: (state, payload: SummaryState) => {
    Object.assign(state, payload)
  },

  saveDate: (state) => {
    state.saved = new Date().toLocaleDateString()
  }
}

const actions: ActionTree<SummaryState, QuickTypingState> = {
  typeWords: ({ commit, state }, delta: number) => {
    if (delta <= 0) {
      return
    }

    const now = new Date()
    if (now.getDate() !== state.date) {
      // 新一天
      commit('newDay', now)
    }
    commit('words', delta)
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
    const data = {}
    // Object.assign(data, state, { saved: '2021/4/22', date: 22 })
    Object.assign(data, state)
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
