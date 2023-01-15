<template>
  <div class="history-indicator">
    <el-row :gutter="10">
      <el-col :xs="24" :sm="12" :lg="8" :md="8" :xl="6">
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
                  ><span class="down"><i class="el-icon-check"></i> </span>
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
      <el-col :xs="24" :sm="12" :lg="8" :md="8" :xl="6">
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
                  ><span class="down"><i class="el-icon-check"></i> </span>
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
                <span class="label">跟打总天数</span
                ><span class="number">{{ totalDays }}</span>
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
  private totalWords!: string

  @summary.Getter('totalErrorWords')
  private totalErrorWords!: string

  @summary.Getter('consecutiveDays')
  private consecutiveDays!: number

  @summary.Getter('totalDays')
  private totalDays!: number

  get version (): string | undefined {
    return process.env.VUE_APP_VERSION
  }
}
</script>

<style lang="scss">
.history-indicator {
  margin-bottom: 20px;

  .box-card {
    margin-bottom: 10px;
  }
}
</style>
