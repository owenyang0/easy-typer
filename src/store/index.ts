import Vue from 'vue'
import Vuex, { StoreOptions } from 'vuex'
import { article } from './article'
import { racing } from './racing'
import { setting } from './setting'
import { login } from './login'
import { summary } from './summary'
import { kata } from './kata'
import { reading } from './reading'
import { record } from './record'
import { LooseObject, QuickTypingState } from './types'
import db from './util/Database'
import { TrieNode } from './util/TrieTree'

Vue.use(Vuex)

const state: QuickTypingState = new QuickTypingState()

const store: StoreOptions<QuickTypingState> = {
  state,
  modules: {
    article,
    racing,
    setting,
    login,
    summary,
    kata,
    reading,
    record
  },
  getters: {
    version (state) {
      const webVersion = process.env.VUE_APP_WEB_VERSION
      return state.appVersion ? `macOS版v${state.appVersion}${webVersion}` : `web${webVersion}`
    }
  },
  mutations: {
    codings (state, codings: TrieNode) {
      state.codings = codings
    },

    overallKeyCount (state, keyCount: LooseObject<number>) {
      const { overallKeyCount } = state
      for (const key in keyCount) {
        overallKeyCount[key] += keyCount[key]
      }
    },

    updateAchievements (state, achievements): void {
      state.achievements = achievements
    },

    addAchievements (state, achievement): void {
      state.achievements.unshift(achievement)
    },

    updateTotalAchievements (state, total): void {
      state.totalAchievements = total
    },

    increaseTotalAchievements (state) {
      state.totalAchievements += 1
    },

    appVersion (state, appVersion: string) {
      state.appVersion = appVersion
    }
  },

  actions: {
    updateCodings ({ commit }, codings: TrieNode) {
      commit('codings', codings)
    },
    summaryKeyCount ({ commit, state }, keyCount: LooseObject<number>) {
      commit('overallKeyCount', keyCount)

      db.summary.put(state.overallKeyCount, 'keyCount')
    },
    addAchievements ({ commit }, achievement) {
      commit('addAchievements', achievement)
      commit('increaseTotalAchievements')
    },
    setAppVersion ({ commit }, appVersion: string) {
      commit('appVersion', appVersion)
    }
  }
}

export default new Vuex.Store(store)
