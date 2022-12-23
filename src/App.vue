<template>
  <div id="app">
    <el-row>
      <el-col :span="24">
        <el-menu
          :router="true"
          :default-active="pathname"
          active-text-color="#409EFF"
          mode="horizontal">
          <el-submenu index="0">
            <template slot="title"><i class="el-icon-s-home"></i>功能</template>
            <el-menu-item index="/">
              <i class="el-icon-medal-1"></i>
              <span slot="title">赛文跟打</span>
            </el-menu-item>
            <el-menu-item index="/practice">
              <i class="el-icon-aim"></i>
              <span slot="title">词库练习</span>
            </el-menu-item>
          </el-submenu>
          <el-submenu index="/stat">
            <template slot="title"><i class="el-icon-s-data"></i>跟打统计</template>
            <el-menu-item index="/history">
              <i class="el-icon-data-line"></i>
              <span slot="title">跟打历史</span>
            </el-menu-item>
            <el-menu-item index="/summary">
              <i class="el-icon-s-data"></i>
              <span slot="title">键盘统计</span>
            </el-menu-item>
          </el-submenu>
          <el-menu-item index="/setting">
            <i class="el-icon-setting"></i>
            <span slot="title">设置</span>
          </el-menu-item>
          <el-menu-item index="/changelog">
            <i class="el-icon-time"></i>
            <span slot="title">版本历史</span>
          </el-menu-item>
          <el-menu-item index="/about">
            <i class="el-icon-question"></i>
            <span slot="title">关于</span>
          </el-menu-item>
        </el-menu>
        <div id="profile">
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
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <router-view/>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { TrieNode } from './store/util/TrieTree'
import db from './store/util/Database'
import { Action, Mutation, namespace } from 'vuex-class'
import { LoginUser, LooseObject } from './store/types'
import xcapi from './api/xc.cool'

const setting = namespace('setting')
const login = namespace('login')
const summary = namespace('summary')

@Component
export default class Setting extends Vue {
  @Action('updateCodings')
  private updateCodings!: Function

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

<style lang="scss" src="./assets/styles/main.scss"></style>
