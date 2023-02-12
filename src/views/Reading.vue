<template>
  <div class="page-kata pro-module">
    <div class="pro-module-hd clearfix">
      <h2>阅读：上传书籍 即可跟打阅读</h2>
    </div>
    <div class="pro-module-bd">
      <el-form :inline="true" class="form-content" label-width="100px">
        <el-form-item label="书籍上传">
          <el-upload drag action="#"
            accept=".txt"
            :auto-upload="false"
            :show-file-list="false"
            :on-change="uploadBook">
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将书籍拖到此处，或<em>点击上传</em></div>
            <div class="el-upload__tip" slot="tip">文本格式文件，UTF8编码即可（最大支持上传5本书）</div>
          </el-upload>
        </el-form-item>
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
              :disabled="isCriteriaDisabled"
              @change="handleHitSpeedChange"
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
          <el-form-item label="未达标『或』有错字时">
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
        <el-table border :data="books" stripe="stripe" class="achievements-table">
          <el-table-column prop="id" label="编号" min-width="80">
            <template slot-scope="prop">
              {{prop.row.id}}
            </template>
          </el-table-column>
          <el-table-column prop="title" label="书名" min-width="140" show-overflow-tooltip />
          <el-table-column prop="currentWords" label="进度/总字数" min-width="140">
            <template slot-scope="props">
              {{props.row.currentWords | numberWithCommas}}/{{props.row.totalWords | numberWithCommas}}
            </template>
          </el-table-column>
          <el-table-column prop="paragraphs" label="总段数" min-width="70">
            <template slot-scope="props">
              {{props.row.paragraphs | numberWithCommas}}
            </template>
          </el-table-column>
          <el-table-column prop="paragraphSize" label="每段字数" min-width="80"/>
          <el-table-column
            label="操作"
            width="190">
            <template slot-scope="prop">
              <el-button
                @click.native.prevent="showSettingDialog(prop.row.id)"
                type="text"
                size="mini">
                设置
              </el-button>
              <el-button
                @click.native.prevent="startReading(prop.row.id)"
                type="text"
                size="mini">
                阅读&跟打
              </el-button>
              <el-button
                @click.native.prevent="deleteBook(prop.row.id)"
                type="danger"
                size="mini">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
    </div>
    <el-dialog :visible.sync="showLoadDialog" title="设置" class="load-text">
      <el-form ref="form" label-width="100px">
        <el-form-item label="进度调整">
          <el-slider
            v-model="currentProgress"
            :min="0"
            :max="bookConf.totalWords"
            @change="handleProgressChange"
            show-input>
          </el-slider>
        </el-form-item>
        <el-form-item label="每段字数">
          <el-input-number
            size="small"
            :value="bookConf.paragraphSize"
            :min="5"
            :max="10000"
            :step="10"
            @change="handleParagraphSizeChange"
            class="form-field"
            ></el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showLoadDialog = false">取 消</el-button>
        <el-button type="primary" @click="saveSetting">确 定</el-button>
      </div>
    </el-dialog>
</div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { namespace } from 'vuex-class'
import { BookModel, KataState } from '@/store/types'
import { KataArticle } from '@/store/kata'
import { noop } from 'vue-class-component/lib/util'
import { Loading } from 'element-ui'
import xcapi from '@/api/xc.cool'
import db from '@/store/util/Database'

const article = namespace('article')
const kata = namespace('kata')
const reading = namespace('reading')

@Component
export default class Reading extends Vue {
  @article.Action('loadMatch')
  private loadMatch!: Function

  @kata.State('criteriaOpen')
  private criteriaOpen!: boolean

  @kata.State('criteriaHitSpeed')
  private criteriaHitSpeed!: number

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

  @kata.Getter('nextParagraph')
  private nextParagraph!: KataArticle

  @reading.Action('loadBooks')
  private loadBooks!: Function

  @reading.Action('deleteBookById')
  private deleteBookById!: Function

  @reading.Action('selectBook')
  private selectBook!: Function

  @reading.Action('updateBookConf')
  private updateBookConf!: Function

  @reading.Action('updateBooksByConf')
  private updateBooksByConf!: Function

  @reading.Mutation('saveBooksConfToDB')
  private saveBooksConfToDB!: Function

  @reading.Getter('books')
  private books!: BookModel[]

  @reading.Getter('bookConf')
  private bookConf!: BookModel

  private currentProgress = 1
  private showLoadDialog = false

  get isCriteriaDisabled (): boolean {
    return !this.criteriaOpen
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

  uploadBook (file: { raw: File }): void {
    if (this.books.length >= 5) {
      this.$message.error('最大只支持上传5本书籍')
      return
    }

    const loading = Loading.service({
      lock: true,
      text: '正在处理书籍，请耐心等待……',
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.7)'
    })
    const reader = new FileReader()
    reader.onload = () => {
      const result = (reader.result as string).replace(/\s/gm, '')
      const title = file.raw.name.replace('.txt', '')
      const totalWords = result.length
      const input = `${title}-${totalWords}`
      const id = xcapi.sha1Hmac(input)

      db.bookShelf.get(id).then(ret => {
        if (ret) {
          this.$message.error('该书籍已存在，不可重复导入')
        } else {
          const book = {
            id,
            title,
            totalWords,
            paragraphSize: 10,
            currentWords: 0,
            paragraphs: Math.ceil(result.length / 10)
          }
          const newBooks = this.books.concat(book)
          this.loadBooks(newBooks)

          db.bookShelf.put(newBooks, 'books')

          db.bookShelf.put({
            id,
            title,
            content: result
          }, id)
        }
        loading.close()
      }).catch((err) => {
        loading.close()
        this.$message.error('书籍导入出错，请重试')
        console.log('error', err)
      })
    }

    reader.readAsText(file.raw)
  }

  startReading (id: string) {
    if (!id) {
      return
    }

    this.selectBook(id)
    const conf = this.bookConf
    db.bookShelf.get(id).then(book => {
      if (book) {
        const b = book as BookModel
        const article: Partial<KataState> = {
          articleTitle: b.title,
          articleText: b.content,
          currentParagraphNo: Math.ceil((conf.currentWords + 1) / conf.paragraphSize),
          paragraphSize: conf.paragraphSize,
          isReading: true
        }

        this.loadArticle(article)
        this.loadMatch(this.nextParagraph)
        this.$router.push('/').catch(noop)
      }
    })
  }

  deleteBook (id: string) {
    this.deleteBookById(id)
  }

  showSettingDialog (id: string) {
    this.selectBook(id)
    this.currentProgress = this.bookConf.currentWords
    this.showLoadDialog = true
  }

  saveSetting (id: string) {
    this.showLoadDialog = false
    this.updateBooksByConf(id)
    this.saveBooksConfToDB()
  }

  handleProgressChange (progress: number) {
    this.updateBookConf({
      currentWords: progress
    })
  }

  handleParagraphSizeChange (size: number) {
    this.updateBookConf({
      paragraphSize: size
    })
  }

  created () {
    this.init()

    db.bookShelf.get('books').then(books => {
      this.loadBooks(books)
    })
  }

  destroyed () {
    // document.removeEventListener('keydown', this.handleShortCut)
  }
}
</script>
