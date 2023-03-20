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
                <el-tooltip content="剪贴板载文，可复制包含“段号+标题”的整段文本" placement="top">
                  <el-button size="mini" icon="el-icon-document" @click="loadFromClipboard">粘贴</el-button>
                </el-tooltip>
                <!-- <el-button size="mini" icon="el-icon-refresh" @click="retry">重打(F3)</el-button> -->
                <!-- <el-tooltip content="快速设置字号，字重，展示高度" placement="top">
                  <el-button size="mini" icon="el-icon-setting" v-popover:popoverStyle>样式</el-button>
                </el-tooltip> -->
                <!-- <el-tooltip content="乱序(Ctrl+L)" placement="top">
                  <el-button size="mini" icon="el-icon-edit-outline" @click="random()">乱序</el-button>
                </el-tooltip> -->
                <!-- <el-tooltip content="下一段(Ctrl+P)" placement="top">
                  <el-button size="mini" icon="el-icon-d-arrow-right" @click="next()">下段</el-button>
                </el-tooltip> -->
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
                <el-button size="mini" icon="el-icon-setting" v-popover:popoverStyle>样式</el-button>
                <!-- <el-button size="mini" :icon="triggerIcon" :type="triggerType" @click="trigger">{{ triggerText }}</el-button> -->
              </el-button-group>
              <el-dropdown size="mini" :icon="triggerIcon" :type="triggerType" @click="trigger" split-button
                :trigger="triggerMethod"
                hide-on-click
                class="dropdown-operation"
                @command="handleCommand"
                :show-timeout="0">
                <i :class="triggerIcon"></i><span>{{ triggerText }}</span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item icon="el-icon-document" command="loadText">手动载文</el-dropdown-item>
                    <el-dropdown-item icon="el-icon-refresh" command="retry" divided>重打(F3)</el-dropdown-item>
                    <el-dropdown-item icon="el-icon-edit-outline" command="random">乱序(Ctrl+L)</el-dropdown-item>
                    <el-dropdown-item icon="el-icon-right" command="next">下一段(Ctrl+P)</el-dropdown-item>
                    <!-- <el-dropdown-item icon="el-icon-tickets" command="todayArticle" divided>每日一文</el-dropdown-item> -->
                    <!-- <el-dropdown-item icon="el-icon-s-data" command="todayNews">今日新闻</el-dropdown-item> -->
                  </el-dropdown-menu>
                </el-dropdown>
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
import eapi from '@/api/easyTyper'
import { InterfaceStyle } from '@/store/types'
import { noop } from 'vue-class-component/lib/util'
import { statusMapIcon, statusMapText, statusMapType } from '../store/util/constants'
import { isMobile } from '@/store/util/common'

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

  @kata.Action('next')
  private next!: Function

  private groups: Array<{ value: number; label: string }> = []
  private group = ''
  private showLoadDialog = false
  private articleText = ''

  private tempArticleRows = 4
  private tempInputRows = 1
  private tempFontSize = 2.4
  private tempFontWeight = 400
  private hasUpdated = false

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

  handleCommand (command: string) {
    console.log(command)
    switch (command) {
      case 'loadText':
        this.showLoadDialog = true
        break
      case 'retry':
        this.retry()
        break
      case 'next':
        this.next()
        break
      case 'random':
        this.random()
        break
      // case 'todayArticle':
      //   this.random()
      //   break
      default:
        break
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
      window.electronAPI.handlePaste((evt: any, val: any) => {
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
      case 'F2':
        e.preventDefault()
        if (this.hasTipWarning || this.status === 'typing') {
          return
        }
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
        break
      case 'p': // 下一段
        if (e.ctrlKey) {
          e.preventDefault()
          this.next()
        }
        break
      case 'l': // 乱序
        if (e.ctrlKey) {
          e.preventDefault()
          this.random()
        }
        break
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
</style>
