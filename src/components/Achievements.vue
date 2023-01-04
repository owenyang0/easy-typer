<template>
  <div>
    <el-table :data="achievements" stripe="stripe" style="width:100%;" class="achievements-table" :cell-class-name="tableCellClassName">
      <el-table-column prop="title" type="expand" label="成绩">
        <template slot-scope="props">
          第{{ props.row.identity }}段 速度{{ props.row.typeSpeed }} 击键{{ props.row.hitSpeed }} 码长{{ props.row.codeLength }} 字数{{ props.row.contentLength }} 错字{{ props.row.error }}
          用时{{ formatTime(props.row.usedTime) }}秒 暂停{{ props.row.pauseCount }}次{{ formatTime(props.row.pauseTime) }}秒 键准{{ props.row.accuracy }}% 键法{{ props.row.balance }}% 左{{ props.row.leftHand }}
          右{{ props.row.rightHand }} 理论码长{{ props.row.idealCodeLength }} 打词{{ props.row.phrase }} 打词率{{ props.row.phraseRate }}% 选重{{ props.row.selective }} 回改{{ props.row.replace }}
          键数{{ props.row.keys }} 退格{{ props.row.backspace }} 回车{{ props.row.enter }} 第{{ props.row.retry }}次跟打
        </template>
      </el-table-column>
      <el-table-column prop="typeSpeed" label="速度" width="70"/>
      <el-table-column prop="title" label="标题" :formatter="titleFormatter"/>
      <el-table-column prop="contentLength" label="字数" width="60"/>
      <el-table-column prop="hitSpeed" label="击键" width="60"/>
      <el-table-column prop="codeLength" label="码长" width="60"/>
      <el-table-column prop="accuracy" label="键准(%)" width="80"/>
      <el-table-column prop="phraseRate" label="打词率(%)" width="90"/>
      <el-table-column prop="replace" label="回改" width="60"/>
      <el-table-column prop="finishedTime" label="结束时间" :formatter="timeFormatter" width="160"/>
    </el-table>
    <div class="pagination-wrapper">
      <el-pagination
        background
        layout="total, prev, pager, next"
        @current-change="handleCurrentChange"
        :total="totalAchievement">
      </el-pagination>
    </div>
  </div>
</template>

<script lang="ts">
import { Achievement } from '@/store/types'
import { Component, Vue } from 'vue-property-decorator'
import { Mutation, State } from 'vuex-class'
import db from '../store/util/Database'

const PAGE_SIZE = 10
const SPEED_GAP = 30 // 速度阶梯，每30新增一个颜色

@Component
export default class Achievements extends Vue {
  @State('achievements')
  private achievements!: Array<Achievement>

  @State('totalAchievements')
  totalAchievement!: number

  @Mutation('updateAchievements')
  private updateAchievements!: Function

  titleFormatter (row: Achievement, column: number, value: string) {
    // return (value || '未知').slice(0, 16)
    return value || '未知'
  }

  tableCellClassName ({ row, column, rowIndex, columnIndex }: any) {
    if (column.property === 'typeSpeed') {
      const rawLevel = Math.floor(row.typeSpeed / SPEED_GAP)
      const level = rawLevel > 6 ? 6 : rawLevel // 速度等级为 6+ 时按 6 处理

      return `speed-lv-${level}`
    }

    if (column.property === 'accuracy') {
      if (row.accuracy === 100) {
        return 'accuracy-lv-perfect'
      }

      if (row.accuracy < 90) {
        return 'accuracy-lv-warn'
      }
    }

    return ''
  }

  timeFormatter (row: Achievement, column: number, value: number) {
    return new Date(value).toLocaleString()
  }

  formatTime (total: number, mill = 3): string {
    total = total / 1000
    if (total < 60) {
      return `${total.toFixed(mill)}`
    }

    const seconds = total % 60
    const minutes = (total - seconds) / 60
    return `${minutes.toFixed(0)}:${seconds.toFixed(mill)}`
  }

  handleCurrentChange (currentPage: number) {
    const offset = (currentPage - 1) * PAGE_SIZE
    db.achievement.reverse().offset(offset).limit(10).toArray().then(achievements => {
      this.updateAchievements(achievements)
    }, (error) => {
      console.log(error)
    })
  }
}
</script>
