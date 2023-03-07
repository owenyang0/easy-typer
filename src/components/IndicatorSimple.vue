<template>
  <div class="history-indicator">
    <el-row :gutter="10">
      <el-col :xs="24" :sm="12" :lg="12">
        <el-card class="box-card">
          <div class="chartCard">
            <div class="chartTop">
              <div class="metaWrap">
                <div class="meta">
                  <span>今日跟打记录</span>
                  <span class="action">
                    <el-tooltip
                      effect="dark"
                      content="今日跟打记录指标展示"
                      placement="top"
                    >
                      <i class="el-icon-info"></i>
                    </el-tooltip>
                  </span>
                </div>
                <div class="total">
                  <span
                    >{{ todayWords | numberWithCommas }}<span class="total-label"> 字</span></span
                  >
                </div>
              </div>
            </div>
            <div class="content" style="height: 46px">
              <div class="contentFixed">
                <div class="trendItem" style="margin-right: 20px">
                  <span
                    >正确字数<span class="trendText">{{ (todayWords - todayErrorWords) | numberWithCommas }}</span></span
                  ><span class="down"><i class="el-icon-check"></i>(正确率{{ todayCorrectRatio }}%)</span>
                </div>
                <div class="trendItem" title="">
                  <span
                    >错误字数<span class="trendText">{{ todayErrorWords | numberWithCommas}}</span></span
                  ><span class="up"><i class="el-icon-close"></i></span>
                </div>
              </div>
            </div>
            <div class="footer">
              <div class="field">
                <span class="label">连续跟打天数</span
                ><span class="number">{{ consecutiveDays }}</span>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="12">
        <el-card class="box-card">
          <div class="chartCard">
            <div class="chartTop">
              <div class="metaWrap">
                <div class="meta">
                  <span>跟打总记录</span>
                  <span class="action">
                    <el-tooltip
                      effect="dark"
                      content="跟打总记录指标展示"
                      placement="top"
                    >
                      <i class="el-icon-info"></i>
                    </el-tooltip>
                  </span>
                </div>
                <div class="total">
                  <span
                    >{{ totalWords | numberWithCommas }}<span class="total-label"> 字</span></span
                  >
                </div>
              </div>
            </div>
            <div class="content" style="height: 46px">
              <div class="contentFixed">
                <div class="trendItem" style="margin-right: 20px">
                  <span
                    >正确字数<span class="trendText">{{ (totalWords - totalErrorWords) | numberWithCommas }}</span></span
                  ><span class="down"><i class="el-icon-check"></i>(正确率{{ totalCorrectRatio }}%)</span>
                </div>
                <div class="trendItem" title="">
                  <span
                    >错误字数<span class="trendText">{{ totalErrorWords | numberWithCommas }}</span></span
                  ><span class="up"><i class="el-icon-close"></i></span>
                </div>
              </div>
            </div>
            <div class="footer">
              <div class="field">
                <span class="label">跟打总天数</span><span class="number">{{ totalDays }}</span>
                <span class="label" style="margin-left: 20px;">日均跟打</span><span class="number">{{ totalDays ? (totalWords / totalDays).toFixed(2) : '-' }} 字</span>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { namespace } from 'vuex-class'

const summary = namespace('summary')

@Component
export default class Indicator extends Vue {
  @summary.Getter('todayWords')
  private todayWords!: number

  @summary.Getter('todayErrorWords')
  private todayErrorWords!: number

  @summary.Getter('totalWords')
  private totalWords!: number

  @summary.Getter('totalErrorWords')
  private totalErrorWords!: number

  @summary.Getter('consecutiveDays')
  private consecutiveDays!: number

  @summary.Getter('totalDays')
  private totalDays!: number

  get todayCorrectRatio (): string {
    return this.todayWords ? (((this.todayWords - this.todayErrorWords) / this.todayWords) * 100).toFixed(2) : '-'
  }

  get totalCorrectRatio (): string {
    return this.totalWords ? (((this.totalWords - this.totalErrorWords) / this.totalWords) * 100).toFixed(2) : '-'
  }
}
</script>

<style lang="scss">
.history-indicator {
  margin-bottom: 10px;

  .box-card {
    margin-bottom: 10px;
  }
}
</style>
