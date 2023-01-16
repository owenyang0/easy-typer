<template>
  <div>
    <el-input id="racing-textarea" type="textarea" ref="textarea"
      @keydown.native="keydown"
      @keyup.native="keyup"
      @blur="pause"
      @input="accept(input)"
      @compositionstart.native="compositionStart"
      @compositionupdate.native="compositionUpdate"
      @compositionend.native="compositionEnd"
      :disabled="status !== 'typing' && status !== 'init'"
      placeholder="在这里输入赛文..."
      v-model="input">
    </el-input>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { namespace } from 'vuex-class'
import Clipboard from '@/store/util/Clipboard'

const racing = namespace('racing')
const setting = namespace('setting')
const kata = namespace('kata')

@Component
export default class Racing extends Vue {
  @racing.State('status')
  private status!: string

  @racing.Getter('result')
  private result!: string

  @racing.Action('typing')
  private typing!: Function

  @racing.Mutation('cleared')
  private cleared!: Function

  @racing.Action('accept')
  private accept!: Function

  @racing.Action('pause')
  private pause!: Function

  @racing.Action('phrase')
  private phrase!: Function

  @racing.Action('checkFinished')
  private checkFinished!: Function

  @setting.Getter('cloak')
  private cloak!: boolean

  @kata.State('mode')
  private mode!: number

  /**
   * 输入的内容
   */
  private input = ''
  /**
   * 正在打字的编码长度
   */
  private compositions = 0
  /**
   * 最后一次键入的文字
   */
  private last = ''

  @Watch('status')
  statusUpdate (status: string) {
    switch (status) {
      case 'init': {
        this.input = ''
        const textarea = document.getElementById('racing-textarea') as HTMLInputElement
        textarea.value = ''
        setTimeout(this.focus, 50)
        break
      }
      case 'typing':
        setTimeout(this.focus, 50)
        break
      case 'finished': {
        const text = this.result
        Clipboard.copy(text, () => {
          if (this.cloak) {
            console.log('当前处于潜水状态')
            return
          }
          window.electronAPI && window.electronAPI.setGrade('typing finished!')
        }, () => {
          this.$message.warning('你的浏览器不支持自动复制，需要手动操作')
        })
        this.$message.success(text)
        break
      }
    }
  }

  @Watch('mode')
  modeUpdate (mode: number) {
    if (mode === 2) {
      this.$message.warning('当前发文已结束~')
    }
  }

  compositionStart () {
    this.compositions = 0
  }

  compositionUpdate () {
    // 每次更新 +1
    this.compositions += 1
  }

  compositionEnd ({ data }: CompositionEvent) {
    this.last = data
    const length = data.length
    const { compositions } = this
    if (length === 0 && compositions > 1) {
      // 未上屏
      this.cleared(compositions)
    } else if (length > 1) {
      // 打词，也有可能是标点顶屏
      this.phrase(data)
    }
  }

  keydown (e: KeyboardEvent) {
    this.typing(e)
    this.last = ''

    if (e.isComposing && e.code === 'Backspace') {
      // 每次删除 -2，因为删除键也会触发 compositionupdate
      this.compositions -= 2
    }
  }

  keyup (e: KeyboardEvent) {
    if (!e.isComposing) {
      this.checkFinished(this.last)
    }
  }

  /**
   * 让输入框获取焦点
   */
  focus () {
    (this.$refs.textarea as HTMLElement).focus()
  }
}
</script>
