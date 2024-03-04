import { ActionTree, GetterTree, Module, MutationTree } from 'vuex'
import { InterfaceStyle, QuickTypingState, SettingState } from './types'
import db from './util/Database'

const state = new SettingState()

const getters: GetterTree<SettingState, QuickTypingState> = {
  state (): SettingState {
    return state
  },

  hint (): boolean {
    return state.hint
  },

  cloak (): boolean {
    return state.cloak
  },

  darkMode (): boolean {
    return state.darkMode
  },

  replaceSpace (): boolean {
    return state.replaceSpace
  },

  replaceSymbol (): boolean {
    return state.replaceSymbol
  },

  offClipboard (): boolean {
    return state.offClipboard
  },

  styles (): InterfaceStyle {
    const { pending, typed, correct, error, hintColor, code1, code2, code3, code4, fontFamily, fontSize, fontWeight, articleRows, inputRows, darkTyped, darkCorrect, darkPending } = state
    return {
      '--pending': pending,
      '--dark-pending': darkPending,
      '--typed': typed,
      '--dark-typed': darkTyped,
      '--correct': correct,
      '--dark-correct': darkCorrect,
      '--error': error,
      '--hint': hintColor,
      '--code1': code1,
      '--code2': code2,
      '--code3': code3,
      '--code4': code4,
      '--racing-font': fontFamily,
      '--font-size': fontSize,
      '--font-weight': fontWeight,
      '--article-rows': articleRows,
      '--input-rows': inputRows
    }
  },

  getSelectChar (): Function {
    return (index: number, length: number): string => {
      // index < 0 表示无须选重
      // 四码首选暂时设置为无须选重
      if (index < 0 || (length === 4 && index === 0)) {
        return ''
      }

      const { selective, pageSize, nextPage } = state
      let alt = index
      let page = ''
      while (alt >= pageSize) {
        page += nextPage
        alt -= pageSize
      }
      return page + selective[alt]
    }
  }
}

const mutations: MutationTree<SettingState> = {
  update (state, setting) {
    if (setting) {
      // TODO: 有问题，不再主动配置
      // 用于主动更新配置
      // if (!setting.lastUpdatedTime || setting.lastUpdatedTime < state.lastUpdatedTime) {
      // setting.fontFamily = '"霞鹜文楷 GB","霞鹜文楷 GB 屏幕阅读版","霞鹜文楷 GB 屏幕阅读版 常规","PingFang SC","思源黑体 CN","思源黑体", "Microsoft YaHei","Source Han Sans SC","Noto Sans CJK SC","WenQuanYi Micro Hei",sans-serif'
      // setting.typed = '#606266'
      // setting.darkTyped = '#909399'
      // setting.correct = '#e5e5e5'
      // setting.darkCorrect = '#3d444f'
      // }
      Object.assign(state, setting, {
        lastUpdatedTime: Date.now()
      })
    }
  },

  loaded (state) {
    state.loaded = true
  },

  toggleHint (state, hint) {
    state.hint = hint
  },

  toggleCloak (state, cloak) {
    state.cloak = cloak
    db.configs.put(state, 'setting')
  },

  toggleDarkMode (state, darkMode) {
    state.darkMode = darkMode
    db.configs.put(state, 'setting')
  },

  toggleSidebar (state, showSidebar) {
    state.showSidebar = showSidebar
    db.configs.put(state, 'setting')
  },

  toggleClipboard (state, offClipboard) {
    state.offClipboard = offClipboard
    db.configs.put(state, 'setting')
  },

  saveToDB (state) {
    db.configs.put(state, 'setting').then(() => {
      console.log('db settings saved')
    })
  },

  toggleReplaceSpace (state, replaceSpace) {
    state.replaceSpace = replaceSpace
  },

  toggleReplaceSymbol (state, replaceSymbol) {
    state.replaceSymbol = replaceSymbol
  }
}

const actions: ActionTree<SettingState, QuickTypingState> = {
  load ({ commit }, setting) {
    if (setting) {
      commit('update', setting)
      commit('loaded')
    }
  }
}

export const setting: Module<SettingState, QuickTypingState> = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
