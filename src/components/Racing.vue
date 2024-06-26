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
      :disabled="isDisabled"
      :placeholder="placeholderText"
      v-model="input">
    </el-input>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { namespace } from 'vuex-class'
import Clipboard from '@/store/util/Clipboard'
import { fixMobileScrollIssue } from '@/store/util/common'
import { ElNotificationOptions } from 'element-ui/types/notification'
import dayjs from 'dayjs'

const functionCodes = ['Backspace', 'Enter', 'Control', 'Alt', 'Meta', 'Shift', 'CapsLock']

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

  @setting.Getter('offClipboard')
  private offClipboard!: boolean

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

  get isDisabled (): boolean {
    return this.status !== 'typing' && this.status !== 'init'
  }

  get placeholderText (): string {
    return this.isDisabled ? '请先载入练习文本...' : '在这里输入赛文...'
  }

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
        if (this.offClipboard) {
          return
        }
        Clipboard.copy(text, () => {
          if (this.cloak) {
            // console.log('当前处于潜水状态')
            return
          }
          if (window.electronAPI) {
            window.electronAPI.setGrade('typing finished!')
          }
        }, () => {
          this.$message.warning('你的浏览器不支持自动复制，请手动操作！')

          const timestamp = localStorage.getItem('clipboard_err_tip_ts')
          if (timestamp && dayjs(+timestamp).isSame(dayjs(), 'day')) {
            return
          }
          this.$nextTick(() => {
            this.$notify({
              type: 'info',
              title: '你的浏览器不支持自动复制！',
              message: '『推荐』使用谷歌(PC全平台)、Safari(iOS/Mac)、Edge(安卓)等现代浏览器；『不建议』直接在QQ、微信等程序中直接打开！',
              duration: 3000
            } as ElNotificationOptions)
          })
          localStorage.setItem('clipboard_err_tip_ts', `${Date.now()}`)
          // TODO: fireFox不支持
          // const permissionName = 'clipboard-write' as PermissionName
          // navigator.permissions.query({ name: permissionName })
          //   .then((permissionStatus) => {
          //     console.log('clipboard permission state is ', permissionStatus.state)
          //     if (permissionStatus.state === 'denied') {
          //       this.$message.warning('当前浏览器复制权限被禁用，请检查设置')
          //     }
          //   })
        })
        break
      }
    }
  }

  @Watch('mode')
  modeUpdate (mode: number) {
    if (mode === 2) {
      // this.$message.warning('当前发文已结束~')
      this.$notify.info('当前发文已结束~')
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
    if (functionCodes.includes(e.key) && this.status === 'init') {
      return
    }
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

  mounted () {
    fixMobileScrollIssue()
  }

  /**
   * 让输入框获取焦点
   */
  focus () {
    const textLength = (this.$refs.textarea as HTMLTextAreaElement).textLength
    if (textLength > 0) {
      ;((this.$refs.textarea as Vue).$refs.textarea as HTMLTextAreaElement).setSelectionRange(textLength, textLength)
    }
    ;(this.$refs.textarea as HTMLElement).focus()
  }
}
</script>
