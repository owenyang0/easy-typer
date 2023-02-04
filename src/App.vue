<template>
  <div id="app">
    <el-progress
      type="line"
      :percentage="percentage"
      :width="100"
      :color="customColors"
      :stroke-width="4"
      :show-text="false"
      define-back-color="transparent"
    />
    <el-row class="menu-row">
      <el-col :span="24" class="menu-col">
        <el-menu
          :router="false"
          :default-active="pathname"
          @select="handleSelect"
          active-text-color="#eb9010"
          mode="horizontal"
        >
          <el-menu-item index="/">
            <i class="el-icon-medal-1"></i>
            <span slot="title">跟打</span>
          </el-menu-item>
          <el-submenu index="/func">
            <template slot="title"><i class="el-icon-s-data"></i>功能</template>
            <el-menu-item index="/kata">
              <i class="el-icon-date"></i>
              <span slot="title">发文（F2）</span>
            </el-menu-item>
            <el-menu-item index="/retry">
              <i class="el-icon-edit-outline"></i>
              <span slot="title">重打（F3）</span>
            </el-menu-item>
            <el-menu-item index="/random">
              <i class="el-icon-document"></i>
              <span slot="title">乱序（Ctrl+L）</span>
            </el-menu-item>
            <el-menu-item index="/next">
              <i class="el-icon-d-arrow-right"></i>
              <span slot="title">下一段（Ctrl+P）</span>
            </el-menu-item>
            <el-menu-item index="/practice">
              <i class="el-icon-aim"></i>
              <span slot="title">词库练习</span>
            </el-menu-item>
            <el-menu-item index="/setting">
              <i class="el-icon-setting"></i>
              <span slot="title">设置</span>
            </el-menu-item>
          </el-submenu>
          <el-submenu index="/stat">
            <template slot="title"><i class="el-icon-s-data"></i>统计</template>
            <el-menu-item index="/history">
              <i class="el-icon-data-line"></i>
              <span slot="title">跟打历史</span>
            </el-menu-item>
            <el-menu-item index="/summary">
              <i class="el-icon-s-data"></i>
              <span slot="title">键盘统计</span>
            </el-menu-item>
          </el-submenu>
          <el-submenu index="/help">
            <template slot="title"><i class="el-icon-warning"></i>帮助</template>
            <el-menu-item index="/help">
              <i class="el-icon-question"></i>
              <span slot="title">使用帮助</span>
            </el-menu-item>
            <el-menu-item index="/changelog">
              <i class="el-icon-time"></i>
              <span slot="title">版本记录</span>
            </el-menu-item>
            <el-menu-item index="/download">
              <i class="el-icon-download"></i>
              <span slot="title">程序下载</span>
            </el-menu-item>
            <el-menu-item index="/about">
              <i class="el-icon-warning"></i>
              <span slot="title">关于</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
        <!-- <div id="profile">
          <el-button v-if="!authenticated" type="text" @click="loginFormVisible = true">登录</el-button>
          <el-dialog title="用户登录" :visible.sync="loginFormVisible">
            <el-form :model="auth" label-width="80">
              <el-form-item label="用户名">
                <el-input v-model="auth.username" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="密码">
                <el-input v-model="auth.password" autocomplete="off" show-password></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="loginFormVisible = false">取 消</el-button>
              <el-button type="primary" @click="doLogin">确 定</el-button>
            </div>
          </el-dialog>
          <el-dropdown v-if="authenticated">
            <el-avatar :size="30" :src="loginUser.avatar"></el-avatar>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item icon="el-icon-lock" @click.native="doLogout">退出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div> -->
      </el-col>
    </el-row>
    <el-row class="content-row">
      <el-col :span="24">
        <router-view />
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { parseTrieNodeByCodinds, TrieNode } from './store/util/TrieTree'
import db from './store/util/Database'
import { Action, Mutation, namespace } from 'vuex-class'
import { LoginUser, LooseObject } from './store/types'
import xcapi from './api/xc.cool'
import { Route } from 'vue-router'
import punctuations from './store/util/punctuation'

const setting = namespace('setting')
const login = namespace('login')
const summary = namespace('summary')
const racing = namespace('racing')
const kata = namespace('kata')
const article = namespace('article')

@Component
export default class Setting extends Vue {
  @Action('updateCodings')
  private updateCodings!: Function

  @Action('setAppVersion')
  private setAppVersion!: Function

  @Action('summaryKeyCount')
  private summaryKeyCount!: Function

  @setting.Action('load')
  private loadSetting!: Function

  private pathname = location.pathname

  private loginFormVisible = false

  @login.State('user')
  private loginUser!: LoginUser | null

  @login.State('authenticated')
  private authenticated!: boolean

  @login.Action('login')
  private login!: Function

  @login.Action('logout')
  private logout!: Function

  @summary.Action('loaded')
  private wordCountLoaded!: Function

  @Mutation('updateAchievements')
  private updateAchievements!: Function

  @Mutation('updateTotalAchievements')
  private updateTotalAchievements!: Function

  private auth = {
    username: '',
    password: ''
  }

  @racing.Action('retry')
  private retry!: Function

  @racing.Getter('progress')
  private progress!: number

  @kata.State('mode')
  private mode!: number

  @kata.State('hasTipWarning')
  private hasTipWarning!: boolean

  @kata.Action('updateTipWarning')
  private updateTipWarning!: Function

  @article.Action('random')
  private random!: Function

  @article.Action('init')
  private init!: Function

  @kata.Action('next')
  private next!: Function

  get percentage (): number {
    const percentage = Math.min(this.progress || 0, 1) * 100
    return parseFloat(percentage.toFixed(2))
  }

  customColors = [
    { color: '#f56c6c', percentage: 20 },
    { color: '#ff804b', percentage: 40 },
    { color: '#5cb87a', percentage: 60 },
    { color: '#1989fa', percentage: 80 },
    { color: '#015a4f', percentage: 100 }
  ]

  handleSelect (key: string, keyPath: string[]) {
    if (key === '/kata') {
      if (this.hasTipWarning) {
        return
      }
      if (this.mode === 1) {
        this.updateTipWarning(true)

        this.$confirm('正在发文，是否结束发文？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.updateTipWarning(false)

          this.$router.push(key).catch(err => err)
        }).catch(() => {
          this.updateTipWarning(false)
        })
      } else {
        this.$router.push(key).catch(err => err)
      }

      return
    }

    if (key === '/random') {
      this.random()
      return
    }

    if (key === '/next') {
      this.next()
      return
    }

    if (key === '/retry') {
      this.retry()
      return
    }

    this.$router.push(key).catch(err => err)
  }

  doLogin () {
    xcapi.login(this.auth).then(data => {
      const { token, user } = data
      localStorage.token = token
      localStorage.user = JSON.stringify(user)

      this.login(data)
      this.loginFormVisible = false
    }, error => {
      this.$message.error(error.message)
    })
  }

  doLogout () {
    xcapi.logout().then(() => {
      this.logout()
      this.$message.success('注销成功')
    }, error => {
      this.$message.error(error.message)
    })
  }

  created () {
    this.$router.beforeEach((to: Route, from: Route, next) => {
      this.pathname = to.fullPath
      next()
    })

    const hasHash = location.hash.replace('#', '')
    if (hasHash) {
      this.pathname = hasHash
      this.$router.push(hasHash)
    }

    if (window.electronAPI && window.electronAPI.getAppVersion) {
      window.electronAPI && window.electronAPI.getAppVersion((evt: any, appVersion: string) => {
        this.setAppVersion(appVersion)
      })
    }

    if (localStorage.user && localStorage.token) {
      const { token, user } = localStorage
      this.login({ token, user: JSON.parse(user) })
    }

    // 读取配置
    db.configs.get('setting').then(setting => {
      if (setting) {
        this.loadSetting(setting)
        console.log('Settings loaded')
      }
    })
    // 读取数据库中的码表
    db.configs.get('codings').then(root => {
      if (root) {
        const node = TrieNode.convert(root as TrieNode)
        this.updateCodings(node)
        console.log('Trie tree loaded')
        // this.init()
      } else {
        // 首次默认加载虎码表
        console.log('initial codings')
        fetch('/static/codings.txt')
          .then(res => res.text())
          .then(ret => {
            const trie = parseTrieNodeByCodinds(ret)
            // 将中文标点加入词库
            for (const [key, value] of punctuations) {
              trie.put(key, value, -1)
            }
            // 将同一个字的多个编码排序
            trie.sort()

            db.configs.put(trie.root, 'codings').then(() => {
              this.updateCodings(trie.root)
              this.$notify({
                title: '词提加载成功',
                message: '默认『虎码』编码提示加载成功，如需其他编码提示请在 ”功能“-”设置“-”码表设置“ 更新即可',
                type: 'success',
                duration: 0
              })
              // this.init()
            })
          })
      }
    })
    // 读取按键统计信息
    db.summary.get('keyCount').then(keyCount => {
      if (keyCount) {
        delete keyCount.id
        this.summaryKeyCount(keyCount as LooseObject<number>)
        console.log('Key count summary loaded')
      }
    })
    // 读取字数统计
    db.summary.get('wordCount').then(wordCount => {
      if (wordCount) {
        console.log('Word count loaded')
        this.wordCountLoaded(wordCount)
      }
    })

    db.achievement.count().then(count => {
      this.updateTotalAchievements(count)
    })

    // 读取比赛成绩
    db.achievement.reverse().limit(10).toArray().then(achievements => {
      this.updateAchievements(achievements)
    }, (error) => {
      console.log(error)
    })
  }
}
</script>

<style scoped>
  .menu-row {
    overflow-x: auto;
    overflow-y: hidden;
  }
  .menu-col {
    min-width: 500px;
  }
</style>
