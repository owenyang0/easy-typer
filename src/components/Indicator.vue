<template>
  <el-aside width="210px" class="indicator-container" v-show="showSidebar">
    <div class="indicator">
      <!-- <el-card class="time" shadow="never">
        <el-progress type="dashboard" :percentage="percentage" :width="100" :status="progressStatus"/>
        <span>{{ passTime }}</span>
      </el-card> -->
      <el-card shadow="never">
        <el-row>
          <el-col :span="24" class="speed">
            {{ typeSpeed }}
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <div class="hint-block">
              <span class="number">{{ hitSpeed }}</span>
              <span class="desc"><el-button type="text">击键</el-button></span>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="hint-block">
              <span class="number">{{ codeLength }}</span>
              <span class="desc"><el-button type="text" @click="showInputKeys">码长</el-button></span>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="hint-block">
              <span class="number">{{ idealCodeLength }}</span>
              <span class="desc"><el-button type="text" @click="showIdealCodes">理想</el-button></span>
            </div>
          </el-col>
        </el-row>
      </el-card>
      <el-card class="code-hint" v-if="status !== 'waiting' && status !== 'finished'" shadow="never">
        <div v-for="word in wordsHint" :key="word.text">
          <span type="info">{{ word.text }}：</span>
          <span v-for="coding in word.codings" :key="coding.code">{{ coding.code + getSelectChar(coding.index, coding.length) }}</span>
        </div>
      </el-card>
      <el-card shadow="never">
        <div class="indicator-action">
          <el-button size="mini" @click="handleRandomReading">随机跟打</el-button>
          <el-button size="mini" @click="handleTodayReading" type="primary">每日一文</el-button>
          <el-button size="mini" @click="handleTodayNews">每日新闻</el-button>
        </div>
        <div style="margin-top: 12px;">
          <el-button @click="handleReadingClick" size="mini" type="text">每日一读，沉浸经典</el-button>
        </div>
        <el-divider />
        <div class="key-value">
          <span>今日错/对</span>
          <span>{{ todayErrorWords | numberWithCommas}}/{{ (todayWords - todayErrorWords) | numberWithCommas }}</span>
        </div>
        <div class="key-value">
          <span>总字</span>
          <span>{{ totalWords | numberWithCommas}}</span>
        </div>
        <div class="key-value">
          <span>天数</span>
          <span>{{ consecutiveDays }}/{{ totalDays | numberWithCommas}}</span>
        </div>
        <div class="key-value">
          <span>退格</span>
          <span>{{ backspace }}</span>
        </div>
        <div class="key-value">
          <span>回车</span>
          <span>{{ enter }}</span>
        </div>
        <div class="key-value">
          <span>回改</span>
          <span>{{ replace }}</span>
        </div>
        <div class="key-value">
          <span>打词</span>
          <span>{{ phrase }}</span>
        </div>
        <div class="key-value">
          <span>选重</span>
          <span>{{ selective }}</span>
        </div>
        <div class="key-value">
          <span>均衡</span>
          <span>{{ leftHand }}/{{ rightHand }}</span>
        </div>
      </el-card>
      <el-card shadow="never">
        <div class="key-value indicator-cloak">
          <span>潜水</span>
          <span>
            <el-switch v-model="tempCloak" @change="toggleCloak(tempCloak)"/>
          </span>
        </div>
        <div class="key-value">
          <span>编码提示</span>
          <span>
            <el-switch v-model="tempHint" @change="toggleHint(tempHint)"/>
          </span>
        </div>
        <div class="key-value">
          <span>替换空格</span>
          <span>
            <el-switch v-model="tempReplaceSpace" @change="toggleReplaceSpace(tempReplaceSpace)"/>
          </span>
        </div>
        <div class="key-value">
          <span>符号替换|英->中</span>
          <span>
            <el-switch v-model="tempReplaceSymbol" @change="toggleReplaceSymbol(tempReplaceSymbol)"/>
          </span>
        </div>
        <div class="key-value">
          <span>暗黑模式</span>
          <span>
            <el-switch v-model="tempDarkMode" @change="toggleDarkMode(tempDarkMode)"/>
          </span>
        </div>
      </el-card>
      <el-card class="contribute" shadow="never">
        <p><a class="e-github-link" href="https://github.com/owenyang0/easy-typer" target="_blank">喜欢！点个赞</a></p>
        <p><i class="el-icon-info"/> <a href="/about">{{ versionText }}</a></p>
        <p><i class="el-icon-location"/> <a href="https://beian.miit.gov.cn/" target="_blank" class="slide">蜀ICP备2023002101号-1</a></p>
      </el-card>
      <el-drawer
        :title="drawer.title"
        :visible.sync="drawerVisiable"
        :with-header="false"
        size="100"
        direction="ttb">
        <p class="codes">{{ drawer.text }}</p>
      </el-drawer>
    </div>
  </el-aside>
</template>

<script lang="ts">
import { initColorMode, replaceTextSpace } from '@/store/util/common'
import { keyboard } from '@/store/util/keyboard'
import { Component, Vue, Watch } from 'vue-property-decorator'
import { Getter, namespace, State } from 'vuex-class'
import eapi from '@/api/easyTyper'
import { KataArticle } from '@/store/kata'
import { KataState } from '@/store/types'

const racing = namespace('racing')
const setting = namespace('setting')
const summary = namespace('summary')
const article = namespace('article')
const kata = namespace('kata')

@Component
export default class Indicator extends Vue {
  @Getter('version')
  private version!: string

  @State('appVersion')
  private appVersion!: string

  @racing.State('status')
  private status!: string

  @racing.Getter('typeSpeed')
  private typeSpeed!: string

  @racing.Getter('hitSpeed')
  private hitSpeed!: string

  @racing.Getter('codeLength')
  private codeLength!: string

  @racing.Getter('idealCodeLength')
  private idealCodeLength!: string

  @racing.Getter('hint')
  private wordsHint!: Array<string>

  @racing.Getter('passTime')
  private passTime!: string

  @racing.State('phrase')
  private phrase!: number

  @racing.State('selective')
  private selective!: number

  @racing.Getter('enterCount')
  private enter!: number

  @racing.Getter('backspaceCount')
  private backspace!: string

  @racing.State('keyCount')
  private keyCount!: Map<string, number>

  @racing.State('replace')
  private replace!: number

  @racing.Getter('leftHand')
  private leftHand!: number

  @racing.Getter('rightHand')
  private rightHand!: number

  @racing.Getter('progress')
  private progress!: number

  @racing.State('keys')
  private keys!: Array<string>

  @racing.State('idealKeys')
  private idealKeys!: string

  @setting.State('showSidebar')
  private showSidebar!: boolean

  @setting.Getter('hint')
  private hint!: boolean

  @setting.Getter('cloak')
  private cloak!: boolean

  // @setting.Getter('darkMode')
  // private darkMode!: boolean

  @setting.Getter('replaceSpace')
  private replaceSpace!: boolean

  @setting.Getter('replaceSymbol')
  private replaceSymbol!: boolean

  @setting.Getter('getSelectChar')
  private getSelectChar!: Function

  @setting.Mutation('toggleCloak')
  private toggleCloak!: Function

  // @setting.Mutation('toggleDarkMode')
  // private toggleDarkMode!: Function

  @setting.Mutation('toggleHint')
  private toggleHint!: Function

  @setting.Mutation('toggleReplaceSpace')
  private toggleReplaceSpace!: Function

  @setting.Mutation('toggleReplaceSymbol')
  private toggleReplaceSymbol!: Function

  @summary.Getter('todayWords')
  private todayWords!: number

  @summary.Getter('todayErrorWords')
  private todayErrorWords!: number

  @summary.Getter('totalWords')
  private totalWords!: string

  @summary.Getter('totalErrorWords')
  private totalErrorWords!: string

  @summary.Getter('consecutiveDays')
  private consecutiveDays!: number

  @summary.Getter('totalDays')
  private totalDays!: number

  @article.Action('loadMatch')
  private loadMatch!: Function

  @article.State('identity')
  private identity!: string

  @kata.Action('loadArticle')
  private loadArticle!: Function

  @kata.Getter('nextParagraph')
  private nextParagraph!: KataArticle

  private tempCloak = false

  private tempHint = false

  private tempReplaceSpace = true
  private tempReplaceSymbol = true

  private tempDarkMode = false

  private drawerVisiable = false

  private drawer = { title: '', text: '' }

  get percentage (): number {
    const percentage = Math.min(this.progress || 0, 1) * 100
    return parseFloat(percentage.toFixed(2))
  }

  get progressStatus (): string | null {
    return this.status === 'finished' ? 'success' : null
  }

  get versionText (): string {
    return this.appVersion ? `版本 ${this.version}` : `木易跟打器 ${this.version}`
  }

  @Watch('hint')
  hintChange (hint: boolean) {
    if (this.tempHint !== hint) {
      this.tempHint = hint
    }
  }

  @Watch('cloak')
  cloakChange (cloak: boolean) {
    if (this.tempCloak !== cloak) {
      this.tempCloak = cloak
    }
  }

  @Watch('replaceSpace')
  replaceSpaceChange (replaceSpace: boolean) {
    if (this.tempReplaceSpace !== replaceSpace) {
      this.tempReplaceSpace = replaceSpace
    }
  }

  @Watch('replaceSymbol')
  replaceSymbolChange (replaceSymbol: boolean) {
    if (this.tempReplaceSymbol !== replaceSymbol) {
      this.tempReplaceSymbol = replaceSymbol
    }
  }

  toggleDarkMode (isDarkMode: boolean) {
    this.tempDarkMode = isDarkMode
    const newMode = isDarkMode ? 'dark' : ''
    initColorMode(newMode)
    localStorage.setItem('colorMode', newMode)
  }

  showIdealCodes () {
    Object.assign(this.drawer, {
      title: '输入编码',
      text: this.idealKeys
    })
    this.drawerVisiable = true
  }

  showInputKeys () {
    Object.assign(this.drawer, {
      title: '输入编码',
      text: this.keys.map(v => keyboard.get(v)).map(v => (v && v.key) || '❓').join('')
    })
    this.drawerVisiable = true
  }

  handleRandomReading () {
    fetch('/api/r/articles/random')
      .then(res => res.json())
      .then(ret => {
        if (ret.code === 0) {
          const id = ret.data.id
          if (id === this.identity) {
            this.$message.warning('您点得太快啦，等会再试啦~')
            return
          }
          const match = {
            title: `《${ret.data.title}》- ${ret.data.author}`,
            content: replaceTextSpace(ret.data.content),
            number: ret.data.id
          }
          this.loadMatch(match)
        } else {
          this.$message.warning(`获取文章失败：${ret.msg}`)
        }
      }).catch(err => {
        this.$message.warning(`获取文章失败：${err.message}`)
      })
  }

  handleTodayReading () {
    fetch('/api/r/articles/today')
      .then(res => res.json())
      .then(ret => {
        if (ret.code === 0) {
          const id = ret.data.id
          if (id === this.identity) {
            this.$message.warning('您点得太快啦，等会再试啦~')
            return
          }
          const match = {
            title: `《${ret.data.title}》- ${ret.data.author}`,
            content: replaceTextSpace(ret.data.content),
            number: ret.data.id
          }
          this.loadMatch(match)
        } else {
          this.$message.warning(`获取文章失败：${ret.msg}`)
        }
      }).catch(err => {
        this.$message.warning(`获取文章失败：${err.message}`)
      })
  }

  handleTodayNews () {
    eapi.getTodayNews().then(data => {
      const id = data.id
      if (id === this.identity) {
        this.$message.warning('您点得太快啦，等会再试啦~')
        return
      }

      const article: Partial<KataState> = {
        articleTitle: `《${data.title}》`,
        articleText: data.contentList.join('\n'),
        textType: 2,
        currentParagraphNo: 1,
        paragraphSize: data.contentList.length
      }

      this.loadArticle(article)
      this.loadMatch(this.nextParagraph)
    }).catch(err => {
      this.$message.warning(`${err.message}`)
    })
  }

  handleReadingClick () {
    window.open('http://yuedu.owenyang.top/', '_blank')
  }

  created () {
    this.cloakChange(this.cloak)
    this.hintChange(this.hint)
    this.replaceSpaceChange(this.replaceSpace)
    this.replaceSymbolChange(this.replaceSymbol)

    this.tempDarkMode = localStorage.getItem('colorMode') as string === 'dark'
  }
}
</script>

<style lang="scss">
  .dark .indicator-action,
  .indicator-action {
    width: 170px;
    margin-left: -5px;

    .el-button {
      margin-bottom: 10px;
    }

    .el-button + .el-button:nth-child(odd) {
      margin-left: 0;
    }
  }
  .dark .indicator-action .el-button--mini,
  .indicator-action .el-button--mini {
    padding: 7px 12px;
  }
</style>
