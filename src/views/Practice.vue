<template>
  <div id="practice">
    <el-container>
      <el-aside>
        <div class="indicator">
          <el-card class="time" shadow="never">
            <el-progress type="dashboard" :percentage="percentage" :width="200"/>
          </el-card>
          <el-card shadow="never">
            <el-row>
              <el-col :span="24" class="speed">{{ typeSpeed }}</el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <div class="hint-block">
                  <span class="number">{{ lastTypeSpeed.toFixed(2) }}</span>
                  <span class="desc"><el-button type="text">瞬速度</el-button></span>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="hint-block">
                  <span class="number">{{ lastHitSpeed.toFixed(2) }}</span>
                  <span class="desc"><el-button type="text">瞬击键</el-button></span>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="hint-block">
                  <span class="number">{{ hitSpeed }}</span>
                  <span class="desc"><el-button type="text">总击键</el-button></span>
                </div>
              </el-col>
            </el-row>
          </el-card>
          <el-card shadow="never">
            <div class="key-value">
              <span>已打</span>
              <span>{{ current }} / {{ phrases.length }}</span>
            </div>
            <div class="key-value">
              <span>已掌握</span>
              <span>{{ option.removed }} / {{ option.total }}</span>
            </div>
          </el-card>
          <el-card class="code-hint" shadow="never">
            <div v-for="word in wordsHint" :key="word.text">
              <span type="info">{{ word.text }}：</span>
              <span v-for="coding in word.codings" :key="coding.code">{{ coding.code + getSelectChar(coding.index, coding.length) }}</span>
            </div>
          </el-card>
        </div>
      </el-aside>
      <el-main>
        <el-row>
          <el-col :span="24" class="toolbar">
            <el-button-group>
              <el-button icon="el-icon-odometer" @click="reset">重置</el-button>
              <el-button icon="el-icon-refresh" @click="shuffleAndSave(true)">乱序</el-button>
              <el-button icon="el-icon-upload" @click="save">保存进度</el-button>
              <el-button icon="el-icon-set-up" @click="drawer = true">设置</el-button>
            </el-button-group>
          </el-col>
        </el-row>
        <el-row class="stage">
          <el-col class="phrase active" :span="6" :offset="3" v-if="phrases.length > current">{{ phrases[current].text }}</el-col>
          <el-col class="phrase" :span="6" v-if="phrases.length > current + 1">{{ phrases[current + 1].text }}</el-col>
          <el-col class="phrase" :span="6" v-if="phrases.length > current + 2">{{ phrases[current + 2].text }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="6" :offset="9">
            <input class="input el-input__inner"
              v-model="input" @input="checkInput"
              @keydown="keydown" @focus="start = Date.now()"
              @blur="start = -1"
              :placeholder="placeholder"
              :disabled="phrases.length <= 0"/>
          </el-col>
        </el-row>
      </el-main>
    </el-container>
    <el-drawer
      title="词库抽取"
      :visible.sync="drawer"
      :with-header="false">
      <el-form label-width="160px" label-suffix="：">
        <el-form-item label="编码长度">
          <div class="slider-container">
            <el-slider range v-model="option.codeRange" :max="4" :min="1" show-stops :format-tooltip="codeLengthFormatter"/>
          </div>
        </el-form-item>
        <el-form-item label="字词长度">
          <div class="slider-container">
            <el-slider range v-model="option.phraseRange" :max="20" :min="1" show-stops/>
          </div>
        </el-form-item>
        <el-form-item label="词条位置">
          <div class="slider-container">
            <el-slider range v-model="option.positionRange" :max="30" :min="1" show-stops/>
          </div>
        </el-form-item>
        <el-form-item label="乱序">
          <el-switch v-model="option.random"/>
        </el-form-item>
        <el-form-item label="自动移除">
          <el-switch v-model="option.autoRemove"/>
        </el-form-item>
        <el-form-item label="移除条件" v-if="option.autoRemove">
          <el-row>
            <el-col :span="4">
              击键大于
            </el-col>
            <el-col :span="6">
              <el-input v-model="option.targetHitSpeed" type="number"/>
            </el-col>
            <el-col :span="4">
              <el-select v-model="option.logic">
                <el-option value="and" label="且"/>
                <el-option value="or" label="或"/>
              </el-select>
            </el-col>
            <el-col :span="4">
              速度大于
            </el-col>
            <el-col :span="6">
              <el-input v-model="option.targetTypeSpeed" type="number"/>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item>
          <el-button @click="chooseFromCodings">确定</el-button>
        </el-form-item>
      </el-form>
    </el-drawer>
  </div>
</template>

<script lang="ts">
import { Phrase, Word } from '@/store/types'
import db from '@/store/util/Database'
import { TrieNode } from '@/store/util/TrieTree'
import { Component, Vue } from 'vue-property-decorator'
import { namespace, State } from 'vuex-class'

const codeLengthText = ['一简', '二简', '三简', '全码']
const OPTION_KEY = 'practice.option'
const PROGRESS_KEY = 'practice.progress'
const setting = namespace('setting')

const shuffle = (array: Array<Phrase>) => {
  let currentIndex = array.length
  let temporaryValue
  let randomIndex

  // While there remain elements to shuffle...
  while (currentIndex !== 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex--)

    // And swap it with the current element.
    temporaryValue = array[currentIndex]
    array[currentIndex] = array[randomIndex]
    array[randomIndex] = temporaryValue
  }
}

class PracticeOption {
  /**
   * 码长范围
   */
  codeRange = [1, 2]
  /**
   * 词语长度范围
   */
  phraseRange = [2, 10]
  /**
   * 词条位置范围
   */
  positionRange = [1, 3]
  /**
   * 是否乱序
   */
  random = true
  /**
   * 总数
   */
  total = 0
  /**
   * 已掌握
   */
  removed = 0
  /**
   * 是否自动移除已掌握的词语
   */
  autoRemove = false
  /**
   * 目标逻辑
   */
  logic = 'and'
  /**
   * 目标击键速度
   */
  targetHitSpeed = 5
  /**
   * 目标速度
   */
  targetTypeSpeed = 0
}

@Component
export default class Practice extends Vue {
  private option = new PracticeOption()

  private phrases: Array<Phrase> = []

  @State('codings')
  private codings!: TrieNode

  @setting.Getter('getSelectChar')
  private getSelectChar!: Function

  private drawer = false

  private input = ''

  /**
   * 已打个数
   */
  private typed = 0
  /**
   * 开始时间
   */
  private start = -1
  /**
   * 总用时
   */
  private usedTime = 0
  /**
   * 已打字数
   */
  private typedWordCount = 0
  /**
   * 总击键数
   */
  private keyCount = 0
  /**
   * 上次速度
   */
  private lastTypeSpeed = 0
  /**
   * 上次击键
   */
  private lastHitSpeed = 0
  /**
   * 上次键数
   */
  private lastKeyCount = 0

  get percentage (): number {
    const total = this.phrases.length
    if (total < 1) {
      return 0
    }

    return parseFloat((this.current / total * 100).toFixed(2))
  }

  get current (): number {
    const { removed } = this.option
    return this.typed - removed
  }

  get wordsHint (): Array<Word> {
    const { current, phrases } = this
    const phrase = phrases[current]
    if (!phrase) {
      return []
    }

    return [new Word(current, phrase.text, '', false, '', phrase.codings)]
  }

  get placeholder (): string {
    const { current, phrases } = this
    return phrases && phrases[current] && phrases[current].codings[0].code
  }

  get typeSpeed (): string {
    return (this.typedWordCount / (this.usedTime || 1) * 1000 * 60).toFixed(2)
  }

  get hitSpeed (): string {
    return (this.keyCount / (this.usedTime || 1) * 1000).toFixed(2)
  }

  chooseFromCodings () {
    if (this.codings && this.codings.children) {
      this.phrases = []

      this.filter(this.codings)
      this.option.total = this.phrases.length
      this.option.removed = 0
      this.shuffleAndSave(this.option.random)
    } else {
      this.$alert('词库练习需要先导入码表文件', '提示', { type: 'error' })
    }

    this.drawer = false
  }

  shuffleAndSave (random: boolean) {
    const { phrases } = this

    if (random) {
      shuffle(phrases)
      phrases.splice(0, 0)
    }

    this.reset()
    this.save()
  }

  save () {
    localStorage.setItem(OPTION_KEY, JSON.stringify(this.option))
    localStorage.setItem(PROGRESS_KEY, this.typed.toFixed(0))
    db.configs.put(this.phrases, 'practice')
  }

  codeLengthFormatter (value: number): string {
    return codeLengthText[value - 1]
  }

  checkCodeLength (length: number) {
    const [min, max] = this.option.codeRange
    return length >= min && length <= max
  }

  checkTextLength (length: number) {
    const [min, max] = this.option.phraseRange
    return length >= min && length <= max
  }

  checkTextUnicode (text: string) {
    const unicode = text.charCodeAt(0)
    return unicode >= 0x4E00 && unicode <= 0x9FEF
  }

  checkPosition (position: number) {
    const [min, max] = this.option.positionRange
    return position >= min && position <= max
  }

  filter (node: TrieNode) {
    const { value, children } = node
    if (value) {
      const { text, codings } = value
      if (this.checkTextUnicode(text) && this.checkTextLength(text.length)) {
        const matched = codings.slice()
          .filter(v => this.checkCodeLength(v.code.length) && this.checkPosition(v.index + 1))
          .sort((a, b) => a.code.length - b.code.length)
        if (matched.length > 0) {
          this.phrases.push(value)
        }
      }
    }
    if (children) {
      children.forEach(v => this.filter(v))
    }
  }

  checkInput () {
    const { current, phrases, option } = this
    if (phrases[current].text === this.input) {
      const now = Date.now()
      const passTime = now - this.start
      const count = this.input.length

      this.removePhraseByTarget(count, passTime / 1000)

      this.input = ''
      this.start = now
      this.usedTime += passTime
      this.typedWordCount += count
      this.lastKeyCount = 0
      this.typed++
    }

    if (this.current >= phrases.length) {
      this.$confirm('词语已全部打完，是否重新开始？', '提示').then(() => {
        this.shuffleAndSave(option.random)
        this.start = Date.now()
      }).catch(() => {
        // do nothing
      })
    }
  }

  /**
   * 移除符合速度标准的词语
   */
  removePhraseByTarget (count: number, passTimeSecond: number) {
    this.lastTypeSpeed = count / passTimeSecond * 60
    this.lastHitSpeed = this.lastKeyCount / passTimeSecond

    if (this.option.autoRemove) {
      const { targetHitSpeed, targetTypeSpeed, logic } = this.option
      const hitSpeedExceed = this.lastHitSpeed > targetHitSpeed
      const typeSpeedExceed = this.lastTypeSpeed > targetTypeSpeed
      if (logic === 'and' ? hitSpeedExceed && typeSpeedExceed : hitSpeedExceed || typeSpeedExceed) {
        const phrase = this.phrases.splice(this.current, 1)
        this.$notify.success({ title: '提示', message: `词语/字 “${phrase[0].text}” 已掌握，已从练习队列中移除`, duration: 1500, position: 'bottom-right' })
        // 符合条件，移除该词语
        this.option.removed++
        this.save()
      }
    }
  }

  /**
   * 按键统计
   */
  keydown () {
    this.keyCount++
    this.lastKeyCount++
  }

  /**
   * 重置
   */
  reset () {
    this.typed = this.option.removed
    this.usedTime = 0
    this.keyCount = 0
    this.typedWordCount = 0
    this.lastTypeSpeed = 0
    this.lastHitSpeed = 0
    this.lastKeyCount = 0
    this.start = -1
    this.input = ''
  }

  mounted () {
    const json = localStorage.getItem(OPTION_KEY)
    if (json) {
      Object.assign(this.option, JSON.parse(json))
    }

    const typed = localStorage.getItem(PROGRESS_KEY)
    if (typed) {
      this.typed = parseInt(typed)
    }

    db.configs.get('practice').then(phrases => {
      if (phrases) {
        this.phrases = phrases as Array<Phrase>
      } else {
        // this.drawer = true
      }
    })
  }

  beforeDestroy () {
    this.save()
  }
}
</script>
<style lang="scss">
#practice {
  .toolbar {
    text-align: right;
  }

  .slider-container {
    padding-right: 10px;
  }
  .stage {
    font-size: 4rem;
    color: #dfdfdf;
    margin: 10rem auto;
    .phrase {
      border-right: 1px dashed #ccc;
      text-align: center;
      height: 20rem;
      span {
        transform: translateY(50%);
      }
      &.active {
        color: var(--normal-color);
      }
      &:last-child {
        border: none;
      }
    }
  }
  .input.el-input__inner {
    margin-bottom: 1rem;
    height: 5rem;
    font-size: 4rem;
    color: var(--normal-color);
    width: 40rem;
    margin-left: 50%;
    transform: translateX(-50%);
    text-align: center;
  }
}
</style>
