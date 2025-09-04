<template>
  <div id="home" class="page-content page-home no-bg">
    <el-container>
      <Indicator/>
      <el-main id="home-main" :style="styles">
        <div class="toolbar-wrapper">
          <el-row class="toolbar">
            <!-- <el-col :span="9" id="groups">
              <el-select v-model="group" placeholder="请选择" @change="onGroupChange">
                <el-option v-for="item in groups"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-col> -->
            <el-col :span="24">
              <!-- <div class="indicator-real">
                <span class="title">速度</span>
                <span class="val">125.32</span>
                <span class="title">击键</span>
                <span class="val">2.4</span>
                <span class="title">码长</span>
                <span class="val"><el-button type="text" size="mini">23 </el-button></span>
              </div> -->
              <el-button-group>
                <el-tooltip :content="indicatorTooltipText" placement="top">
                  <el-button size="mini" icon="el-icon-caret-right" @click="toggleSidebar" class="indicator-real" style="width: 220px;">速度<span class="val">{{ typeSpeed }}</span> | 击键<span class="val">{{ hitSpeed }}</span> | 码长<span class="val">{{ codeLength }}</span></el-button>
                </el-tooltip>
                <!-- <el-tooltip content="手动载文" placement="top">
                  <el-button size="mini" icon="el-icon-document" @click="showLoadDialog = true">手动</el-button>
                </el-tooltip> -->
                <!-- <el-tooltip content="剪贴板载文，可复制包含"段号+标题"的整段文本" placement="top">
                  <el-button size="mini" icon="el-icon-document" @click="loadFromClipboard">粘贴</el-button>
                </el-tooltip> -->
                <el-button size="mini" icon="el-icon-refresh" @click="retry">重打(F3)</el-button>
                <!-- <el-tooltip content="快速设置字号，字重，展示高度" placement="top">
                  <el-button size="mini" icon="el-icon-setting" v-popover:popoverStyle>样式</el-button>
                </el-tooltip> -->
                <!-- <el-tooltip content="乱序(Ctrl+L)" placement="top">
                  <el-button size="mini" icon="el-icon-edit-outline" @click="random()">乱序</el-button>
                </el-tooltip> -->
                <!-- <el-tooltip content="下一段(Ctrl+P)" placement="top">
                  <el-button size="mini" icon="el-icon-d-arrow-right" @click="next()">下段</el-button>
                </el-tooltip> -->
                <el-button size="mini" icon="el-icon-setting" v-popover:popoverStyle>样式</el-button>
                <el-tooltip content="继续发文 - 恢复历史跟打进度" placement="top">
                  <el-button size="mini" icon="el-icon-timer" @click="continueKataDialog">继续发文</el-button>
                </el-tooltip>
                <el-tooltip content="分享当前文章" placement="top">
                  <el-button size="mini" icon="el-icon-share" @click="shareArticle">分享文章</el-button>
                </el-tooltip>
                <el-dropdown size="mini" :icon="triggerIcon" :type="triggerType" @click="trigger" split-button
                  :trigger="triggerMethod"
                  hide-on-click
                  class="dropdown-operation"
                  @command="handleCommand"
                  :show-timeout="0">
                  <i :class="triggerIcon"></i><span>{{ triggerText }}</span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item icon="el-icon-document-copy" command="loadClipboard">粘贴 - 剪贴板载文</el-dropdown-item>
                    <el-dropdown-item icon="el-icon-document" command="loadText">手动载文</el-dropdown-item>
                    <el-dropdown-item icon="el-icon-refresh" command="retry" divided>重打(F3)</el-dropdown-item>
                    <el-dropdown-item icon="el-icon-edit-outline" command="random">乱序(Ctrl+L)</el-dropdown-item>
                    <el-dropdown-item icon="el-icon-back" command="prev">上一段(Ctrl+U)</el-dropdown-item>
                    <el-dropdown-item icon="el-icon-right" command="next">下一段(Ctrl+P)</el-dropdown-item>
                    <el-dropdown-item icon="el-icon-medal" command="dailyArticle" divided>每日一文</el-dropdown-item>
                    <el-dropdown-item icon="el-icon-tickets" command="randomArticle">随机文章</el-dropdown-item>
                    <template v-for="type in wikiTypeMap">
                      <el-dropdown-item :key="type.title" icon="el-icon-news" :command="`wikis:${type.type}`">{{type.title}}</el-dropdown-item>
                    </template>
                    <el-dropdown-item icon="el-icon-thumb" command="todayHistories">历史上的今天</el-dropdown-item>
                    <el-dropdown-item icon="el-icon-warning-outline" command="singleFront500" divided disabled>与发文共享指标</el-dropdown-item>
                    <el-dropdown-item icon="el-icon-trophy" command="singleFront500">前500 10字[乱]</el-dropdown-item>
                    <el-dropdown-item icon="el-icon-trophy" command="singleMiddle500">中500 10字[乱]</el-dropdown-item>
                    <el-dropdown-item icon="el-icon-trophy" command="singleEnd500">后500 10字[乱]</el-dropdown-item>
                    <el-dropdown-item icon="el-icon-coffee" command="letters">字母 50字</el-dropdown-item>
                    <el-dropdown-item icon="el-icon-ice-tea" command="lettersMix">字母大小写 50字</el-dropdown-item>
                    <el-dropdown-item icon="el-icon-ice-drink" command="numbers">数字 50字</el-dropdown-item>
                    <el-dropdown-item icon="el-icon-milk-tea" command="lettersAndNumbers">字母数字混 50字</el-dropdown-item>
                    <el-dropdown-item icon="el-icon-reading" command="yuedu" divided>每日一读，沉浸经典</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
                <!-- <el-button size="mini" :icon="triggerIcon" :type="triggerType" @click="trigger">{{ triggerText }}</el-button> -->
              </el-button-group>
              <el-popover
                  ref="popoverStyle"
                  placement="bottom"
                  width="300"
                  popper-class="article-set-popover"
                  @hide="handleSettingHide"
                  trigger="click">
                  <div class="article-settings">
                    <el-row>
                      <el-col :span="5" :offset="1">
                        <div class="article-settings_item">
                          <span class="label">字号</span>
                          <el-slider
                            v-model="tempFontSize"
                            @change="handleSliderChange"
                            vertical
                            :max="8"
                            :min="1"
                            :step="0.1"
                            :show-tooltip="false"
                            height="100px">
                          </el-slider>
                        </div>
                      </el-col>
                      <el-col :span="5" :offset="1">
                        <div class="article-settings_item">
                          <span class="label">字重</span>
                          <el-slider
                            v-model="tempFontWeight"
                            @change="handleSliderChange"
                            vertical
                            :max="900"
                            :min="100"
                            :step="100"
                            :show-tooltip="false"
                            height="100px">
                          </el-slider>
                        </div>
                      </el-col>
                      <el-col :span="5" :offset="1">
                        <div class="article-settings_item">
                          <span class="label">对照行高</span>
                          <el-slider
                            v-model="tempArticleRows"
                            @change="handleSliderChange"
                            vertical
                            :max="12"
                            :min="1"
                            :step="1"
                            :show-tooltip="false"
                            height="100px">
                          </el-slider>
                        </div>
                      </el-col>
                      <el-col :span="5" :offset="1">
                        <div class="article-settings_item">
                          <span class="label">跟打行高</span>
                          <el-slider
                            v-model="tempInputRows"
                            @change="handleSliderChange"
                            vertical
                            :max="4"
                            :min="1"
                            :step="1"
                            :show-tooltip="false"
                            height="100px">
                          </el-slider>
                        </div>
                      </el-col>
                    </el-row>
                  </div>
                </el-popover>
            </el-col>
          </el-row>
          <el-divider class="mini"/>
        </div>
        <div>
          <el-row>
            <el-col :span="24">
              <Article ref="article" />
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <Racing ref="racing" />
            </el-col>
          </el-row>
          <el-row style="margin-top: 20px;">
            <el-col :span="24">
              <Achievements />
            </el-col>
          </el-row>
        </div>
      </el-main>
    </el-container>

    <el-dialog :visible.sync="showKataHistoryDialog" title="继续发文 - 恢复历史跟打记录" class="dialog-kata">
      <el-empty v-if="historyList.length === 0" description="暂无记录"></el-empty>
      <el-timeline>
        <el-timeline-item
          v-for="history in historyList"
          :key="history.articleTitle"
          :icon="history.icon"
          :type="history.type"
          :color="history.color"
          :size="history.size"
          placement="top"
          :timestamp="history.timestamp">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>{{history.articleTitle}}</span>
              <el-button style="float: right; padding: 3px 0" type="text" @click="handleContinue(history.articleTitle)">继续发文</el-button>
            </div>
            <div class="kata-history-item oneline">
              <el-tag size="mini" type="primary">当前摘要</el-tag> {{ history.currentContent }}
            </div>
            <div class="kata-history-item">
              <el-row :gutter="20">
                <el-col :span="18">
                  <el-tag v-if="history.criteriaOpen" size="mini" type="success">指标开启</el-tag>
                  <el-tag v-else size="mini" type="warning">指标关闭</el-tag>
                  进度{{ history.currentParagraphNo }}/{{ history.paragraphCount }} |
                  击键≥{{ history.criteriaHitSpeed }} |
                  速度≥{{ history.criteriaSpeed }} |
                  键准≥{{ history.criteriaAccuracy }} |
                  达标次数≥{{ history.criteriaAchieved }}
                  <el-tag size="mini">『否则』 {{ getCriteriaActionText(history.criteriaAction) }}</el-tag>
                </el-col>
                <el-col :span="6">
                  <el-progress :percentage="Math.floor((history.currentParagraphNo / history.paragraphCount) * 100)"></el-progress>
                </el-col>
              </el-row>
            </div>
          </el-card>
        </el-timeline-item>
      </el-timeline>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="showKataHistoryDialog = false">关 闭</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="showLoadDialog" title="手动载文" class="load-text">
      <el-input type="textarea" v-model="articleText" :rows="8" placeholder="请输入内容"/>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showLoadDialog = false">取 消</el-button>
        <el-button type="primary" @click="manuallyLoadArticle">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import Indicator from '@/components/Indicator.vue'
import Article from '@/components/Article.vue'
import Racing from '@/components/Racing.vue'
import Achievements from '@/components/Achievements.vue'
import { Action, namespace, State } from 'vuex-class'
import { Loading } from 'element-ui'
import eapi from '@/api/easyTyper'
import { InterfaceStyle } from '@/store/types'
import { noop } from 'vue-class-component/lib/util'
import { statusMapIcon, statusMapText, statusMapType } from '../store/util/constants'
import { criteriaActionText, isMobile } from '@/store/util/common'
import { kataHistory, KataHistoryState } from '@/store/util/KataHistory'
import { KataArticle } from '@/store/kata'
import { wikiTypeMap } from '@/api/constant'

const article = namespace('article')
const racing = namespace('racing')
const login = namespace('login')
const setting = namespace('setting')
const kata = namespace('kata')

@Component({
  components: {
    Article,
    Indicator,
    Racing,
    Achievements
  }
})
export default class Home extends Vue {
  @Action('setAppVersion')
  private setAppVersion!: Function

  @State('appVersion')
  private appVersion!: string

  @racing.Getter('typeSpeed')
  private typeSpeed!: string

  @racing.Getter('hitSpeed')
  private hitSpeed!: string

  @racing.Getter('codeLength')
  private codeLength!: string

  @racing.State('status')
  private status!: string

  @racing.State('start')
  private pauseStartTime!: number

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

  @article.Action('random')
  private random!: Function

  @article.Action('loadDailyArticle')
  private loadDailyArticle!: Function

  @article.Action('loadRandomArticle')
  private loadRandomArticle!: Function

  @article.Action('loadWikiByType')
  private loadWikiByType!: Function

  @article.Action('loadTodayHistories')
  private loadTodayHistories!: Function

  @article.Action('loadLettersAndNumers')
  private loadLettersAndNumers!: Function

  @article.Action('loadSingleFront500')
  private loadSingleFront500!: Function

  @article.Action('loadSingleMiddle500')
  private loadSingleMiddle500!: Function

  @article.Action('loadSingleEnd500')
  private loadSingleEnd500!: Function

  @article.State('title')
  private articleTitle!: string

  @article.State('content')
  private articleContent!: string

  @article.State('identity')
  private articleIdentity!: string | number

  @login.State('authenticated')
  private authenticated!: boolean

  @setting.Getter('styles')
  private styles!: InterfaceStyle

  @setting.State('showSidebar')
  private showSidebar!: boolean

  @setting.Mutation('toggleSidebar')
  private toggleRawSidebar!: Function

  @setting.State('articleRows')
  private articleRows!: number

  @setting.State('inputRows')
  private inputRows!: number

  @setting.State('fontWeight')
  private fontWeight!: number

  @setting.State('fontSize')
  private fontSize!: string

  @setting.Mutation('update')
  private updateSettings!: Function

  @setting.Mutation('saveToDB')
  private saveToDB!: Function

  @kata.State('mode')
  private mode!: number

  @kata.State('hasTipWarning')
  private hasTipWarning!: boolean

  @kata.Action('updateTipWarning')
  private updateTipWarning!: Function

  @kata.Action('init')
  private init!: Function

  @kata.Action('load')
  private loadKata!: Function

  @kata.Getter('nextParagraph')
  private nextParagraph!: KataArticle

  @kata.Action('prev')
  private prev!: Function

  @kata.Action('next')
  private next!: Function

  private groups: Array<{ value: number; label: string }> = []
  private group = ''
  showLoadDialog = false

  showKataHistoryDialog = false
  historyList: KataHistoryState[] = []
  private articleText = ''

  private tempArticleRows = 4
  private tempInputRows = 1
  private tempFontSize = 2.4
  private tempFontWeight = 400
  private hasUpdated = false
  private wikiTypeMap = wikiTypeMap

  commandHandlers: { [key: string]: () => void } = {
    loadClipboard: () => this.loadFromClipboard(),
    retry: () => this.retry(),
    prev: () => this.prev(),
    next: () => this.next(),
    random: () => this.random(),
    randomArticle: () => this.loadRandomArticle(),
    dailyArticle: () => this.loadDailyArticle(),
    singleFront500: () => this.loadSingleFront500(),
    singleMiddle500: () => this.loadSingleMiddle500(),
    singleEnd500: () => this.loadSingleEnd500(),
    todayHistories: () => this.loadTodayHistories('simple'),
    letters: () => this.loadLettersAndNumers('letters'),
    numbers: () => this.loadLettersAndNumers('numbers'),
    lettersMix: () => this.loadLettersAndNumers('lettersMix'),
    lettersAndNumbers: () => this.loadLettersAndNumers('lettersAndNumbers'),
    yuedu: () => window.open('https://yuedu.owenyang.top', '_blank')
  }

  get triggerText (): string {
    return statusMapText.get(this.status) || '暂停(Esc)'
  }

  get indicatorTooltipText (): string {
    return `点击${this.showSidebar ? '隐藏' : '展示'}侧边栏`
  }

  get triggerMethod (): string {
    return isMobile() ? 'click' : 'hover'
  }

  get triggerIcon (): string {
    return statusMapIcon.get(this.status) || 'el-icon-success'
  }

  get triggerType (): string {
    return statusMapType.get(this.status) || 'primary'
  }

  @Watch('authenticated')
  authChange (authenticated: boolean) {
    if (authenticated) {
      eapi.groups().then((data) => {
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

  manuallyLoadArticle () {
    this.showLoadDialog = false
    if (this.articleText) {
      this.loadText(this.articleText)
      this.articleText = ''
    }
  }

  @Watch('articleRows')
  rawArticleRowsChange (rows: number) {
    this.tempArticleRows = +rows
  }

  @Watch('tempArticleRows')
  articleRowsChange (rows: number) {
    this.updateSettings({
      articleRows: rows
    })
  }

  @Watch('inputRows')
  rawInputRowsChange (rows: number) {
    this.tempInputRows = +rows
  }

  @Watch('tempInputRows')
  inputRowsChange (rows: number) {
    this.updateSettings({
      inputRows: rows
    })
  }

  @Watch('fontWeight')
  rawFontWeightChange (weight: number) {
    this.tempFontWeight = +weight
  }

  @Watch('tempFontWeight')
  fontWeightChange (weight: number) {
    this.updateSettings({
      fontWeight: weight
    })
  }

  @Watch('fontSize')
  rawFontSizeChange (size: string) {
    this.tempFontSize = parseFloat(size)
  }

  @Watch('tempFontSize')
  fontSizeChange (size: number) {
    this.updateSettings({
      fontSize: `${size}rem`
    })
  }

  handleSliderChange () {
    this.hasUpdated = true
  }

  handleSettingHide () {
    if (this.hasUpdated) {
      this.saveToDB()
      this.hasUpdated = false
    }
  }

  async continueKataDialog () {
    this.showKataHistoryDialog = true
    this.historyList = await kataHistory.loadHistoryList()
  }

  async handleContinue (title: string) {
    const kataState = await kataHistory.loadHistoryByTitle(title)
    this.showKataHistoryDialog = false

    if (kataState) {
      this.loadKata(kataState)
      this.loadMatch(this.nextParagraph)
      kataHistory.insertOrUpdateHistory(kataState)
    }
  }

  getCriteriaActionText (action: (keyof (typeof criteriaActionText))) {
    return criteriaActionText[action]
  }

  handleCommand (command: string): void {
    if (command.startsWith('wikis:')) {
      const type = command.split(':')[1]
      this.loadWikiByType(type)
      return
    }

    if (command === 'loadText') {
      this.showLoadDialog = true
      return
    }

    const handler = this.commandHandlers[command]
    if (handler) {
      handler()
    }
  }

  created () {
    this.rawArticleRowsChange(this.articleRows)
    this.rawInputRowsChange(this.inputRows)
    this.rawFontWeightChange(this.fontWeight)
    this.rawFontSizeChange(this.fontSize)

    // this.authChange(this.authenticated)

    // 监听快捷键
    document.addEventListener('keydown', this.handleShortCut)

    window.electronAPI &&
      window.electronAPI.handlePaste((evt: Event, val: string) => {
        if (!this.appVersion) {
          this.setAppVersion('0.2.4') // 上一版本号
        }

        this.checkBeforeLoad().then(() => {
          try {
            this.loadText(val)
            this.$router.push('/').catch(noop)
          } catch (error) {
            this.$message.error(error.message)
          }
        }).catch(() => {
          console.log('err')
        })
      })
    // 监听粘贴事件
    document.addEventListener('paste', this.paste)

    // 切换页面自动暂停
    window.addEventListener('blur', () => this.pause())
  }

  destroyed () {
    document.removeEventListener('keydown', this.handleShortCut)
    document.removeEventListener('paste', this.paste)

    window.electronAPI && window.electronAPI.removePasteHanlder()
  }

  // loadFromPaste (e: ClipboardEvent) {
  //   e.preventDefault()
  //   const { clipboardData } = e
  //   if (clipboardData) {
  //     const pasteContent = clipboardData.getData('text/plain')
  //     if (pasteContent) {
  //       try {
  //         this.loadText(pasteContent)
  //       } catch (error) {
  //         this.$message.error(error.message)
  //       }
  //     }
  //   }
  // }

  checkBeforeLoad () {
    return new Promise((resolve, reject) => {
      if (this.mode === 1) {
        // 手动载文时禁用
        return this.$confirm('当前正在发文中, 请先结束发文后再试', '是否结束当前发文？', {
          confirmButtonText: '结束发文',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.init()
          resolve('OK')
        }).catch(() => {
          reject(new Error('failed'))
        })
      } else {
        resolve('OK')
      }
    })
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
    this.checkBeforeLoad().then(() => {
      // this.init()
      this.loadFromClipboard()
    }).catch(() => {
      console.log('cancel')
    })
    // if (this.showLoadDialog || this.mode === 1) {
    //   // 手动载文时禁用
    //   this.$confirm('当前正在发文中, 请先结束发文后再试', '是否结束当前发文？', {
    //     confirmButtonText: '结束发文',
    //     cancelButtonText: '取消',
    //     type: 'warning'
    //   }).then(() => {
    //     this.init()
    //     this.loadFromClipboard()
    //   }).catch(() => {
    //     console.log('cancel')
    //   })
    //   return
    // }
  }

  onGroupChange () {
    if (!this.group) {
      return
    }

    eapi.matches(this.group).then(
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
    this.checkBeforeLoad().then(() => {
      // this.init()
      try {
        navigator.clipboard.readText().then((text) => {
          this.loadText(text)
        })
      } catch (err) {
        console.error('Failed to read clipboard contents: ', err)
      }
    }).catch(() => {
      console.log('cancel')
    })
  }

  async shareArticle () {
    try {
      if (!this.articleContent) {
        this.$message.warning('当前没有文章内容可以分享')
        return
      }

      // Show a simple loading message instead of full-screen overlay
      const loadingMessage = this.$message({
        message: '正在准备分享内容...',
        iconClass: 'el-icon-loading',
        duration: 0
      })

      // Generate share text with current article content
      const hash = eapi.sha1Hmac(`${this.articleContent}-${this.articleIdentity}`)
      const signature = `-----第${this.articleIdentity}段-共${this.articleContent.length}字-哈希${hash}--易跟打web发文`
      const articleText = `${this.articleTitle || '未知标题'}\n${this.articleContent}\n${signature}`

      // Copy to clipboard
      const textarea = document.createElement('textarea')
      textarea.value = articleText
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)

      // Close the loading message and show success
      loadingMessage.close()
      this.$message.success('文章已复制到剪贴板，可以粘贴分享了！')
    } catch (error) {
      this.$message.error('分享文章失败：' + (error as Error).message)
    }
  }

  trigger () {
    if (!['pause', 'typing'].includes(this.status)) {
      console.log(this.status, 'returned')
      return
    }
    if (this.status === 'pause') {
      if (Date.now() - this.pauseStartTime > 500) { // 暂停超过500ms才能恢复
        this.resume()
      }
    } else {
      this.pause()
    }
  }

  toggleSidebar () {
    this.toggleRawSidebar(!this.showSidebar)
  }

  handleShortCut (e: KeyboardEvent): void {
    const { key, ctrlKey } = e
    switch (key) {
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
        this.routeToKataShortcut()
        break
      case 'u':
        if (ctrlKey) {
          e.preventDefault()
          // 上一段
          this.prev()
        }
        break
      case 'p':
        if (ctrlKey) {
          e.preventDefault()
          // 下一段
          this.next()
        }
        break
      case 'l':
        if (ctrlKey) {
          e.preventDefault()
          // 乱序
          this.random()
        }
        break
    }
  }

  routeToKataShortcut (): void {
    if (this.hasTipWarning || this.status === 'typing') return
    if (this.mode === 1) {
      this.updateTipWarning(true)
      this.$confirm('正在发文中，是否结束当前发文？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.updateTipWarning(false)
        this.$router.push('/kata').catch(noop)
      }).catch(() => {
        this.updateTipWarning(false)
      })
    } else {
      this.$router.push('/kata').catch(noop)
    }
  }
}
</script>
<style lang="scss">
  .indicator-real {
    display: inline-block;
    .val {
      font-weight: 500;
      // font-size: 14px;
      color: #ff804b;
    }
  }

  .kata-history-item {
    margin-bottom: 18px;

    &.oneline {
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
  }

  .dialog-kata .el-dialog {
    width: 90%;
    max-width: 900px;
  }
</style>
