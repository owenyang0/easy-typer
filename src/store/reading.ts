import Vue from 'vue'
import { ActionTree, GetterTree, Module, MutationTree } from 'vuex'
import { BookModel, QuickTypingState, ReadingState } from './types'
import db from './util/Database'
import eapi from '@/api/easyTyper'

const state = new ReadingState()

const getters: GetterTree<ReadingState, QuickTypingState> = {
  books (): any[] {
    return state.books
  },
  bookConf () {
    return state.bookConf
  }
}

const mutations: MutationTree<ReadingState> = {
  updateBookConf (state, conf: BookModel) {
    if (conf) {
      state.bookConf = Object.assign({}, state.bookConf, conf)
    }
  },

  loadBooks (state, books) {
    state.books = books
  },

  updateProgress (state, words) {
    state.bookConf.currentWords += words
    if (state.bookConf.currentWords > state.bookConf.totalWords) {
      state.bookConf.currentWords = state.bookConf.totalWords
    }
    state.books = state.books.map(book => {
      return {
        ...book,
        currentWords: book.id === state.bookConf.id ? state.bookConf.currentWords : book.currentWords
      }
    })
  },

  saveBooksConfToDB (state) {
    db.bookShelf.put(state.books, 'books').then(() => {
      console.log('db bookShelf - book saved')
    })
  }
}

const actions: ActionTree<ReadingState, QuickTypingState> = {
  loadBooks ({ commit }, books) {
    if (books) {
      commit('loadBooks', books)
    }
  },
  selectBook ({ commit, state }, id: string) {
    const bookConf = state.books.find(book => book.id === id)
    commit('updateBookConf', bookConf)
  },

  updateProgress ({ commit }, words: number) {
    commit('updateProgress', words)
    commit('saveBooksConfToDB')
  },

  updateBookConf ({ commit }, conf) {
    commit('updateBookConf', conf)
  },

  updateBooksByConf ({ commit, state }, id: string) {
    const books = state.books.map(book => {
      return book.id === state.bookConf.id
        ? {
          ...state.bookConf
        }
        : book
    })

    commit('loadBooks', books)
  },
  deleteBookById ({ commit, state }, id: string) {
    const books = state.books.filter(book => book.id !== id)
    commit('loadBooks', books)

    db.bookShelf.delete(id)
    db.bookShelf.put(books, 'books')
  },

  async shareArticle ({ state }, id: string): Promise<string> {
    const book = state.books.find(book => book.id === id)
    if (!book) {
      throw new Error('书籍不存在')
    }

    const bookData = await db.bookShelf.get(id) as BookModel & { content?: string }
    if (!bookData || !bookData.content) {
      throw new Error('书籍内容不存在')
    }

    const content = bookData.content
    const hash = eapi.sha1Hmac(`${content}-${book.id}`)
    const signature = `-----第${book.id}段-${content.length}Z-${hash}V--xc.sw`

    return `${book.title}\n${content}\n${signature}`
  }
}

export const reading: Module<ReadingState, QuickTypingState> = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
