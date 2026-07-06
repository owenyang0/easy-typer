import { createLocalVue, shallowMount } from '@vue/test-utils'
import Vuex from 'vuex'
import Words from '@/components/Words.vue'
import { Word } from '@/store/types'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('Words.vue', () => {
  it('renders a break opportunity after each word segment', () => {
    const store = new Vuex.Store({
      modules: {
        setting: {
          namespaced: true,
          state: {
            hint: false,
            punctuationAutoSelectHint: '顶',
            hintOptions: [],
            disableSingleHint: false
          }
        }
      }
    })

    const wrapper = shallowMount(Words, {
      localVue,
      store,
      propsData: {
        word: new Word(0, '天地', 'correct')
      }
    })

    expect(wrapper.text()).toBe('天地')
    expect(wrapper.find('wbr.word-break-opportunity').exists()).toBe(true)
  })
})
