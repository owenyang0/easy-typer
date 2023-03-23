<template>
  <div class="page-content page-kata pro-module">
    <div class="pro-module-hd clearfix">
      <h2>发文：{{dialogTitle}}</h2>
    </div>
    <div class="pro-module-bd">
    <el-input
        type="textarea"
        v-model="articleText"
        :autosize="{ minRows: 6, maxRows: 10 }"
        :disabled="isTextDisabled"
        placeholder="请输入内容"
        autofocus
      />
      <el-form :inline="true" :model="formContent" class="form-content">
        <el-form-item label="练习文本">
          <el-cascader
            size="small"
            :show-all-levels="false"
            expand-trigger="hover"
            :options="contentOptions"
            v-model="formContent.contentName"
            placeholder="请选择练习文本"
          >
          </el-cascader>
        </el-form-item>
        <el-form-item label="总字数">
          <el-input v-model="formContent.contentLength" size="small" disabled class="form-field-mini" />
        </el-form-item>
        <el-form-item label="每段字数">
          <el-input-number
            v-if="currentTextType === 1"
            size="small"
            v-model="formContent.paragraphSize"
            :min="1"
            :step="paragraphSizeStep"
            class="form-field"
          ></el-input-number>
          <el-input v-else value="动态" size="small" disabled class="form-field-mini" />
        </el-form-item>
        <el-form-item label="开始段数">
          <el-input-number
            size="small"
            v-model="formContent.currentParagraphNo"
            :min="1"
            :max="formContent.paragraphCount"
            class="form-field"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="总段数">
          <el-input v-model="formContent.paragraphCount" size="small" disabled class="form-field-mini"/>
        </el-form-item>
      </el-form>
      <el-divider />
      <el-form :inline="true" class="form-content">
        <el-form-item label="开启指标">
          <el-switch :value="criteriaOpen" @change="handleCriteriaOpenChange"></el-switch>
        </el-form-item>
        <el-form-item label="击键≥">
          <el-input-number
            size="small"
            :value="criteriaHitSpeed"
            :min="0"
            :max="30"
            :step="0.5"
            :disabled="isHitSpeedCriteriaDisabled"
            @change="handleHitSpeedChange"
            class="form-field"
          ></el-input-number>
          <el-tag v-if="isMobile" type="warning" size="mini" style="margin-left: 10px;">移动端无效</el-tag>
        </el-form-item>
        <el-form-item label="速度≥">
          <el-input-number
            size="small"
            :value="criteriaSpeed"
            :min="0"
            :max="500"
            :step="20"
            :disabled="isCriteriaDisabled"
            @change="handleSpeedChange"
            class="form-field"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="键准≥">
          <el-input-number
            size="small"
            :value="criteriaAccuracy"
            :min="0"
            :max="100"
            :step="1"
            :disabled="isCriteriaDisabled"
            @change="handleAccuracyChange"
            class="form-field"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="未达标时『或』有错字时">
          <el-select
            size="small"
            placeholder="请选择类型"
            :disabled="isCriteriaDisabled"
            class="form-field"
            :value="criteriaAction"
            @change="handleActionChange"
          >
            <el-option label="乱序" value="random"></el-option>
            <el-option label="重打" value="retry"></el-option>
            <el-option label="不处理" value="noop"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <el-divider />
      <div class="right">
        <el-button @click="handleCancel">取 消</el-button>
        <el-button :disabled="!hasArticleText" @click="handleShuffle">全局乱序</el-button>
        <el-button :disabled="!hasArticleText" @click="startFullKata">发送全文</el-button>
        <el-button type="primary" :disabled="!hasArticleText" @click="startKata">发文</el-button>
      </div>
      </div>
</div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { namespace } from 'vuex-class'
import { KataState } from '@/store/types'
import { KataArticle } from '@/store/kata'
import { shuffle, isMobile } from '@/store/util/common'
import { noop } from 'vue-class-component/lib/util'
import eapi from '@/api/easyTyper'

const article = namespace('article')
const kata = namespace('kata')

@Component({
  components: {
  }
})
export default class Home extends Vue {
  @article.Action('loadMatch')
  private loadMatch!: Function

  // @kata.State('currentParagraphNo')
  // private currentParagraphNo!: number

  @kata.State('criteriaOpen')
  private criteriaOpen!: boolean

  @kata.State('criteriaHitSpeed')
  private criteriaHitSpeed!: number

  @kata.State('criteriaSpeed')
  private criteriaSpeed!: number

  @kata.State('criteriaAccuracy')
  private criteriaAccuracy!: number

  @kata.State('criteriaAction')
  private criteriaAction!: string

  @kata.Action('init')
  private init!: Function

  @kata.Action('loadArticle')
  private loadArticle!: Function

  @kata.Action('updateCriteria')
  private updateCriteria!: Function

  @kata.Action('next')
  private next!: Function

  @kata.Action('getNextParagraph')
  private getNextParagraph!: Function

  @kata.Getter('nextParagraph')
  private nextParagraph!: KataArticle

  get isTextDisabled (): boolean {
    return this.formContent.contentName[1] !== 'freeText'
  }

  get isCriteriaDisabled (): boolean {
    return !this.criteriaOpen
  }

  get isHitSpeedCriteriaDisabled (): boolean {
    return this.isCriteriaDisabled || isMobile()
  }

  get isMobile (): boolean {
    return isMobile()
  }

  get hasArticleText (): boolean {
    return this.articleText.length > 0
  }

  get currentTextType (): number {
    return this.articleText.indexOf('\n') !== -1 ? 2 : 1
  }

  get paragraphSizeStep (): number {
    const isSingleMode = ['tiger', 'word'].indexOf(this.formContent.contentName[0]) !== -1
    return isSingleMode ? 5 : 100
  }

  private articleText = ''
  // private articleText = contentList.word001.content

  private dialogTitle = '自由发文'
  private formContent = {
    contentName: [],
    contentLength: 0,
    currentParagraphNo: 1,
    paragraphSize: isMobile() ? 5 : 10,
    paragraphCount: 1
  }

  // private formCriteria = {
  //   open: false,
  //   hitSpeed: 1,
  //   accuracy: 80,
  //   action: 'noop'
  // }

  private contentOptions: Array<{ value: string; id: number; label: string; isRemote?: boolean; children: Array<{
id: number; value: string; label: string; isRemote?: boolean;
}>; }> = [{
  value: 'free',
  label: '自由',
  id: 1,
  children: [{
    id: -1,
    value: 'freeText',
    label: '手动输入'
  }]
}, {
  value: 'tiger',
  label: '虎码',
  id: 2,
  children: []
}, {
  value: 'word',
  label: '单字',
  id: 3,
  children: []
}]

  @Watch('formContent.paragraphSize')
  paragraphSizeChange (size: number) {
    if (this.currentTextType !== 2) {
      this.formContent.paragraphCount = Math.ceil(this.articleText.length / size)
    }
  }

  @Watch('formContent.contentName')
  contentChange (names: string[]) {
    const rootName = names[0]
    const name = names[1]

    if (name === 'freeText') {
      this.articleText = ''
      this.dialogTitle = '自由发文'
      return
    }

    const subOption = this.contentOptions.find(o => o.value === rootName)
    const current = subOption?.children.find(s => s.value === name)

    eapi.getKataOptionById(current?.id || -1)
      .then(ret => {
        this.articleText = ret.content
        this.dialogTitle = `${ret.title}`
      }).catch(() => {
        this.$message({
          message: '内容获取失败，请刷新重试！',
          type: 'error'
        })
      })
  }

  @Watch('articleText')
  articleTextChange (articleText: string) {
    const { contentName } = this.formContent
    this.formContent.contentLength = articleText.length

    if (['tiger', 'word'].indexOf(contentName[0]) !== -1) {
      this.formContent.paragraphSize = this.formContent.paragraphSize > 100 ? 10 : this.formContent.paragraphSize
    } else {
      this.formContent.paragraphSize = Math.min(500, articleText.length)
    }

    if (this.currentTextType === 2) {
      this.formContent.paragraphCount = articleText.trim().split('\n').length
    } else {
      this.formContent.paragraphCount = Math.ceil(articleText.length / this.formContent.paragraphSize)
    }
  }

  handleCriteriaOpenChange (criteriaOpen: boolean) {
    this.updateCriteria({
      criteriaOpen
    })
  }

  handleHitSpeedChange (criteriaHitSpeed: number) {
    this.updateCriteria({
      criteriaHitSpeed
    })
  }

  handleSpeedChange (criteriaSpeed: number) {
    this.updateCriteria({
      criteriaSpeed
    })
  }

  handleAccuracyChange (criteriaAccuracy: number) {
    this.updateCriteria({
      criteriaAccuracy
    })
  }

  handleActionChange (criteriaAction: string) {
    this.updateCriteria({
      criteriaAction
    })
  }

  handleCancel () {
    this.$router.push('/').catch(noop)
  }

  handleShuffle () {
    this.articleText = shuffle(this.articleText.split('')).join('')
  }

  startFullKata () {
    this.startKata(this.articleText.length)
  }

  startKata (paragraphSize = 0) {
    const article: Partial<KataState> = {
      articleTitle: this.dialogTitle,
      articleText: this.articleText.trim().split('\n').filter(a => !!a).join(this.currentTextType === 2 ? '\n' : ''),
      textType: this.currentTextType,
      currentParagraphNo: this.formContent.currentParagraphNo,
      paragraphSize: paragraphSize > 0 ? paragraphSize : this.formContent.paragraphSize
    }

    this.loadArticle(article)
    this.loadMatch(this.nextParagraph)

    this.$router.push('/').catch(noop)
  }

  created () {
    this.init()

    eapi.getKataList()
      .then(options => {
        this.contentOptions = options
      })
  }

  destroyed () {
    // document.removeEventListener('keydown', this.handleShortCut)
  }
}
</script>

<style lang="scss">
.form-content {
  margin-top: 20px;
}
</style>
