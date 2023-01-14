<template>
  <div class="page-kata pro-module">
    <div class="pro-module-hd clearfix">
      <h2>{{dialogTitle}}</h2>
    </div>
    <div class="pro-module-bd">
    <el-input
        type="textarea"
        v-model="articleText"
        :autosize="{ minRows: 6, maxRows: 10 }"
        :disabled="isTextDisabled"
        placeholder="请输入内容"
      />
      <el-form :inline="true" :model="formContent" class="form-content">
        <el-form-item label="练习文本">
          <el-cascader
            size="small"
            :show-all-levels="false"
            expand-trigger="hover"
            :options="contentOptions"
            v-model="formContent.contentName"
            class="form-field"
          >
          </el-cascader>
        </el-form-item>
        <el-form-item label="总字数">
          <el-input v-model="formContent.contentLength" size="small" disabled class="form-field-mini" />
        </el-form-item>
        <el-form-item label="每段字数">
          <el-input-number
            size="small"
            v-model="formContent.paragraphSize"
            :min="1"
            :step="5"
            class="form-field"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="段数">
          <el-input v-model="formContent.paragraphCount" size="small" disabled class="form-field-mini"/>
        </el-form-item>
      </el-form>
      <el-divider />
      <el-form :inline="true" :model="formCriteria" class="form-content">
        <el-form-item label="开启指标">
          <el-switch v-model="formCriteria.open"></el-switch>
        </el-form-item>
        <el-form-item label="击键≥">
          <el-input-number
            size="small"
            v-model="formCriteria.hitSpeed"
            :min="0"
            :max="30"
            :step="0.5"
            :disabled="isCriteriaDisabled"
            class="form-field"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="键准≥">
          <el-input-number
            size="small"
            v-model="formCriteria.accuracy"
            :min="0"
            :max="100"
            :step="10"
            :disabled="isCriteriaDisabled"
            class="form-field"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="未达标时">
          <el-select v-model="formCriteria.action" size="small" placeholder="请选择类型" :disabled="isCriteriaDisabled" class="form-field">
            <el-option label="乱序" value="random"></el-option>
            <el-option label="重打" value="retry"></el-option>
            <el-option label="不处理" value="noop"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <el-divider />
      <div class="right">
        <el-button @click="handleCancel">取 消</el-button>
        <el-button :disabled="!hasArticleText" @click="handleRandom">全局乱序</el-button>
        <el-button :disabled="!hasArticleText" @click="startFullKata">发送全文</el-button>
        <el-button type="primary" :disabled="!hasArticleText" @click="startKata">发文</el-button>
      </div>
      </div>
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
import { contentList } from '../common/contentList'

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

  get isTextDisabled (): boolean {
    return this.formContent.contentName[1] !== 'freeText'
  }

  get isCriteriaDisabled (): boolean {
    return !this.formCriteria.open
  }

  get hasArticleText (): boolean {
    return this.articleText.length > 0
  }

  private groups: Array<{ value: number; label: string }> = []
  private group = ''
  private showLoadDialog = false
  private articleText = ''

  private dialogTitle = '发文：自由发文'
  private formContent = {
    contentName: ['free', 'freeText'],
    contentLength: 0,
    paragraphSize: 10,
    paragraphCount: 8
  }

  private formCriteria = {
    open: false,
    hitSpeed: 1,
    accuracy: 80,
    action: 'noop'
  }

  private contentOptions = [{
    value: 'free',
    label: '自由',
    children: [{
      value: 'freeText',
      label: '手动输入'
    }]
  }, {
    value: 'word',
    label: '单字',
    children: [{
      value: 'word001',
      label: '前五百'
    }, {
      value: 'word501',
      label: '中五百'
    }, {
      value: 'word1001',
      label: '后五百'
    }, {
      value: 'wordAll1500',
      label: '前1500'
    }]
  }]

  get triggerText (): string {
    return this.status === 'pause' ? '继续' : '暂停'
  }

  get triggerIcon (): string {
    return this.status === 'pause'
      ? 'el-icon-video-play'
      : 'el-icon-video-pause'
  }

  @Watch('authenticated')
  authChange (authenticated: boolean) {
    if (authenticated) {
      xcapi.groups().then((data) => {
        if (data) {
          this.groups = data.map((v) => {
            return { value: v.guid, label: v.name }
          })
        }
      })
    } else {
      this.groups = []
    }
  }

  @Watch('formContent.paragraphSize')
  paragraphSizeChange (size: number) {
    this.formContent.paragraphCount = Math.ceil(this.articleText.length / size)
  }

  @Watch('formContent.contentName')
  contentChange (names: (keyof typeof contentList)[]) {
    const name = names[1]

    if (name === 'freeText') {
      this.articleText = ''
      this.dialogTitle = '发文：自由发文'
      return
    }

    this.articleText = contentList[name].content
    this.dialogTitle = `发文：${contentList[name].title}`
  }

  @Watch('articleText')
  articleTextChange (articleText: string) {
    this.formContent.contentLength = articleText.length
    this.formContent.paragraphCount = Math.ceil(articleText.length / this.formContent.paragraphSize)
  }

  handleCancel () {
    this.$router.push('/home')
  }

  handleRandom () {
    // this.$router.push('/home')
  }

  startFullKata () {
    this.$router.push('/')
  }

  startKata () {
    this.$router.push('/')
  }

  created () {
    this.authChange(this.authenticated)

    // 监听快捷键
    document.addEventListener('keydown', this.handleShortCut)

    window.electronAPI &&
      window.electronAPI.handlePaste((evt: any, val: any) => {
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

    xcapi.matches(this.group).then(
      (match) => {
        if (!match) {
          return
        }

        this.loadMatch(match)
      },
      (error) => {
        this.$message.warning(error.message)
      }
    )
  }

  loadFromClipboard () {
    try {
      navigator.clipboard.readText().then((text) => {
        this.loadText(text)
      })
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
    // document.dispatchEvent(new KeyboardEvent('keydown', {key: 'F2'}))
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
      case 'F2':
        e.preventDefault()
        if (!this.showLoadDialog) {
          this.showLoadDialog = true
        }
        break
    }
  }
}
</script>

<style lang="scss">
.page-kata {
  margin: 20px;
  .form-field {
    width: 120px;
  }
  .form-field-mini {
    width: 60px;
  }
}
.form-content {
  margin-top: 20px;
}
</style>
