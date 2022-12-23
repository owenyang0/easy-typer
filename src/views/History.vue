<template>
  <div id="home">
    <el-container>
      <el-aside width="200px">
        <Indicator/>
      </el-aside>
      <el-main id="home-main" :style="styles">
        <div>
          <el-row>
            <el-col :span="24">
              <Achievements/>
            </el-col>
          </el-row>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import Indicator from '@/components/Indicator.vue'
import Article from '@/components/Article.vue'
import Racing from '@/components/Racing.vue'
import Achievements from '@/components/Achievements.vue'
import { namespace } from 'vuex-class'
import xcapi from '@/api/xc.cool'
import { InterfaceStyle } from '@/store/types'

const article = namespace('article')
const racing = namespace('racing')
const login = namespace('login')
const setting = namespace('setting')

@Component({
  components: {
    Article,
    Indicator,
    Racing,
    Achievements
  }
})
export default class Home extends Vue {
  @racing.State('status')
  private status!: string

  @racing.Action('pause')
  private pause!: Function

  @racing.Action('resume')
  private resume!: Function

  @racing.Action('retry')
  private retry!: Function

  @article.Action('loadText')
  private loadText!: Function

  @article.Action('loadMatch')
  private loadMatch!: Function

  @login.State('authenticated')
  private authenticated!: boolean

  @setting.Getter('styles')
  private styles!: InterfaceStyle

  private groups: Array<{ value: number; label: string }> = []
  private group = ''
  private showLoadDialog = false
  private articleText = ''

  get triggerText (): string {
    return this.status === 'pause' ? '继续' : '暂停'
  }

  get triggerIcon (): string {
    return this.status === 'pause' ? 'el-icon-video-play' : 'el-icon-video-pause'
  }

  @Watch('authenticated')
  authChange (authenticated: boolean) {
    if (authenticated) {
      xcapi.groups().then(data => {
        if (data) {
          this.groups = data.map(v => {
            return { value: v.guid, label: v.name }
          })
        }
      })
    } else {
      this.groups = []
    }
  }

  manuallyLoadArticle () {
    this.showLoadDialog = false
    if (this.articleText) {
      this.loadText(this.articleText)
      this.articleText = ''
    }
  }

  created () {
    this.authChange(this.authenticated)

    // 监听快捷键
    document.addEventListener('keydown', this.handleShortCut)

    window.electronAPI && window.electronAPI.handlePaste((evt: any, val: any) => {
      if (val) {
        try {
          this.loadText(val)
        } catch (error) {
          this.$message.error(error.message)
        }
      }
    })
    // 监听粘贴事件
    document.addEventListener('paste', this.paste)

    // 切换页面自动暂停
    window.addEventListener('blur', () => this.pause())
  }

  destroyed () {
    document.removeEventListener('keydown', this.handleShortCut)
    document.removeEventListener('paste', this.paste)
  }

  /**
   * 粘贴监听
   */
  paste (e: ClipboardEvent) {
    if (this.showLoadDialog) {
      // 手动载文时禁用
      return
    }

    e.preventDefault()
    const { clipboardData } = e
    if (clipboardData) {
      const pasteContent = clipboardData.getData('text/plain')
      if (pasteContent) {
        try {
          this.loadText(pasteContent)
        } catch (error) {
          this.$message.error(error.message)
        }
      }
    }
  }

  onGroupChange () {
    if (!this.group) {
      return
    }

    xcapi.matches(this.group).then(match => {
      if (!match) {
        return
      }

      this.loadMatch(match)
    }, error => {
      this.$message.warning(error.message)
    })
  }

  loadFromClipboard () {
    try {
      navigator.clipboard.readText().then(text => { this.loadText(text) })
    } catch (err) {
      console.error('Failed to read clipboard contents: ', err)
    }
  }

  trigger () {
    if (this.status === 'pause') {
      this.resume()
    } else {
      this.pause()
    }
  }

  handleShortCut (e: KeyboardEvent) {
    switch (e.key) {
      case 'F3':
        e.preventDefault()
        // 重打
        this.retry()
        break
      case 'Escape':
        e.preventDefault()
        // 暂停
        this.pause()
        break
      case 'Enter':
        e.preventDefault()
        // 恢复
        this.resume()
        break
    }
  }
}
</script>
