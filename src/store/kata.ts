
import { ActionTree, GetterTree, Module, MutationTree } from 'vuex'
import { QuickTypingState, KataState } from './types'
import { shuffle } from './util/common'

export interface KataArticle {
  content: string;
  title: string;
}

const state = new KataState()

const getters: GetterTree<KataState, QuickTypingState> = {
  currentMatch: state => state.articleTitle,
  paragraphCount: state => Math.ceil(state.articleText.length / state.paragraphSize),
  nextParagraph: (state, getters) => {
    return {
      title: `${state.articleTitle}(${state.currentParagraphNo}/${getters.paragraphCount})`,
      number: state.currentParagraphNo,
      content: state.currentContent
    }
  }
}

const mutations: MutationTree<KataState> = {
  init: (state) => {
    state.mode = 0
  },

  article: (state, article: KataState) => {
    const startIndex = (article.currentParagraphNo - 1) * article.paragraphSize

    state.articleText = article.articleText
    state.articleTitle = article.articleTitle
    state.currentParagraphNo = article.currentParagraphNo
    state.paragraphSize = article.paragraphSize
    state.currentContent = state.articleText.slice(startIndex, startIndex + article.paragraphSize)

    state.mode = 1
  },

  next: (state, canNext: boolean) => {
    state.currentParagraphNo += 1
    const startIndex = (state.currentParagraphNo - 1) * state.paragraphSize

    state.currentContent = state.articleText.slice(startIndex, startIndex + state.paragraphSize)
  },

  random: (state) => {
    state.currentContent = shuffle(state.currentContent.split('')).join('')
  },

  mode: (state, newMode: number) => {
    state.mode = newMode
  },

  updateCriteria: (state, criteria) => {
    if (criteria) {
      Object.assign(state, criteria)
    }
  },

  updateTipWarning: (state, isShow: boolean) => {
    state.hasTipWarning = isShow
  }
}

const actions: ActionTree<KataState, QuickTypingState> = {
  init ({ commit }): void {
    commit('init')
  },
  loadArticle ({ commit, state, getters }, article: KataState): void {
    commit('article', article)
    // this.dispatch('article/loadMatch', getters.nextParagraph)
  },
  updateCriteria ({ commit, state, getters }, criteria): void {
    if (criteria) {
      commit('updateCriteria', criteria)
    }
  },
  updateTipWarning ({ commit }, isShow: boolean): void {
    commit('updateTipWarning', isShow)
  },
  next ({ commit, state, getters }): void {
    if (state.mode === 1) {
      const mode = state.currentParagraphNo >= getters.paragraphCount ? 2 : 1
      commit('mode', mode)

      if (mode === 1) { // 2 已结束
        commit('next')
        this.dispatch('article/loadMatch', getters.nextParagraph)
      }
    }
  },
  random ({ commit, getters }): void {
    commit('random')
    this.dispatch('article/loadMatch', getters.nextParagraph)
  }
}

export const kata: Module<KataState, QuickTypingState> = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
