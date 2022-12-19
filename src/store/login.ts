import xcapi from '@/api/xc.cool'
import { ActionTree, Module, MutationTree } from 'vuex'
import { QuickTypingState, LoginState } from './types'

const state = new LoginState()

// const getters: GetterTree<LoginState, QuickTypingState> = {
// }

const mutations: MutationTree<LoginState> = {
  login (state, login: LoginState) {
    state.authenticated = true
    state.token = login.token
    state.user = login.user
  },

  logout (state) {
    state.authenticated = false
    state.token = ''
    state.user = null
  }
}

const actions: ActionTree<LoginState, QuickTypingState> = {
  login ({ commit }, data) {
    if (data) {
      xcapi.updateToken(data.token)
      commit('login', data)
    }
  },

  logout ({ commit }) {
    localStorage.removeItem('token')
    localStorage.removeItem('user')

    commit('logout')
  }
}

export const login: Module<LoginState, QuickTypingState> = {
  namespaced: true,
  state,
  // getters,
  mutations,
  actions
}
