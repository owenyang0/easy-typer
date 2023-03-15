
import dayjs from 'dayjs'
import { ActionTree, GetterTree, Module, MutationTree } from 'vuex'
import { Achievement, QuickTypingState, RecordState } from './types'

const state = new RecordState()

const getters: GetterTree<RecordState, QuickTypingState> = {
  dates: state => state.dates,
  speeds: state => state.speeds
}

const mutations: MutationTree<RecordState> = {
  loaded: (state, payload: RecordState) => {
    Object.assign(state, payload)
  }
}

const actions: ActionTree<RecordState, QuickTypingState> = {
  loaded: ({ commit }, list: Achievement[]) => {
    const chineseRecords = list.filter(l => l.codeLength > 1.1 && l.contentLength >= 5)
    const sum = (records: Achievement[]) => records.reduce((pre, curr) => pre + curr.usedTime, 0)
    const payload = {
      dates: chineseRecords.map(l => new Date(l.finishedTime).toLocaleString()),
      speeds: chineseRecords.map(l => l.typeSpeed),
      hitSpeeds: chineseRecords.map(l => l.hitSpeed),
      codeLengthList: chineseRecords.map(l => l.codeLength),
      total: list.length,
      todayDuration: sum(chineseRecords.filter(r => dayjs(r.finishedTime).isSame(dayjs(), 'day'))),
      totalDuration: sum(chineseRecords)
    }
    commit('loaded', payload)
  }
}

export const record: Module<RecordState, QuickTypingState> = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
