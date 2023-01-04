<template>
  <el-aside width="180px" class="aside-history">
    <div class="indicator">
      <el-card shadow="never">
        <div class="key-value">
          <span>今日字数</span>
          <span>{{ todayWords }}</span>
        </div>
        <div class="key-value">
          <span>总字数</span>
          <span>{{ totalWords }}</span>
        </div>
        <div class="key-value">
          <span>连续天数</span>
          <span>{{ consecutiveDays }}</span>
        </div>
        <div class="key-value">
          <span>总天数</span>
          <span>{{ consecutiveDays }}</span>
        </div>
      </el-card>
    </div>
  </el-aside>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { namespace } from 'vuex-class'

const summary = namespace('summary')

@Component
export default class Indicator extends Vue {
  @summary.Getter('todayWords')
  private todayWords!: number

  @summary.Getter('totalWords')
  private totalWords!: string

  @summary.Getter('consecutiveDays')
  private consecutiveDays!: number

  @summary.Getter('totalDays')
  private totalDays!: number

  get version (): string | undefined {
    return process.env.VUE_APP_VERSION
  }
}
</script>
