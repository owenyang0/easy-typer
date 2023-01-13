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
                    >{{ todayWords }}<span class="total-label">字</span></span
                  >
                </div>
              </div>
            </div>
            <div class="content" style="height: 46px">
              <div class="contentFixed">
                <div class="trendItem" style="margin-right: 20px">
                  <span
                    >正确字数<span class="trendText">{{
                      todayWords - todayErrorWords
                    }}</span></span
                  ><span class="down"><i class="el-icon-check"></i> </span>
                </div>
                <div class="trendItem" title="">
                  <span
                    >错误字数<span class="trendText">{{
                      todayErrorWords
                    }}</span></span
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
                    >{{ totalWords }}<span class="total-label">字</span></span
                  >
                </div>
              </div>
            </div>
            <div class="content" style="height: 46px">
              <div class="contentFixed">
                <div class="trendItem" style="margin-right: 20px">
                  <span
                    >正确字数<span class="trendText">{{
                      totalWords - totalErrorWords
                    }}</span></span
                  ><span class="down"><i class="el-icon-check"></i> </span>
                </div>
                <div class="trendItem" title="">
                  <span
                    >错误字数<span class="trendText">{{
                      totalErrorWords
                    }}</span></span
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

.chartCard .total {
  color: rgba(229, 224, 216, 0.85);
}
.chartCard {
  position: relative;
}

.chartCard .chartTop {
  position: relative;
  width: 100%;
  overflow: hidden;
}

.chartCard .chartTopMargin___24rCR {
  margin-bottom: 12px;
}

.chartCard .chartTopHasMargin___3AQNY {
  margin-bottom: 20px;
}

.chartCard .metaWrap {
  float: left;
}

.chartCard .avatar___FoC4K {
  position: relative;
  top: 4px;
  float: left;
  margin-right: 20px;
}

.chartCard .avatar___FoC4K img {
  border-radius: 100%;
}

.chartCard .meta {
  height: 22px;
  // color: rgba(0,0,0,.45);
  color: rgba(229, 224, 216, 0.45);
  font-size: 14px;
  line-height: 22px;
}

.chartCard .action {
  position: absolute;
  top: 4px;
  right: 0;
  line-height: 1;
  cursor: pointer;
}

.chartCard .total {
  height: 38px;
  margin-top: 4px;
  margin-bottom: 0;
  overflow: hidden;
  // color: rgba(0,0,0,.85);
  font-size: 30px;
  line-height: 38px;
  white-space: nowrap;
  text-overflow: ellipsis;
  word-break: break-all;
}

.total-label {
  font-size: 16px;
}

.chartCard .content {
  position: relative;
  width: 100%;
  margin-bottom: 12px;
}

.chartCard .contentFixed {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
}

.chartCard .footer {
  margin-top: 8px;
  padding-top: 9px;
  border-top: 1px solid #f0f0f0;
}

.chartCard .footer {
  border-top-color: rgb(62, 65, 65);
}

.chartCard .footer > * {
  position: relative;
}

.chartCard .footerMargin___38Y2F {
  margin-top: 20px;
}

.trendItem {
  display: inline-block;
  font-size: 14px;
  line-height: 22px;
}

.trendItem .down,
.trendItem .up {
  position: relative;
  // top: -1px;
  margin-left: 4px;
}

.trendItem .down span,
.trendItem .up span {
  font-size: 12px;
  transform: scale(0.83);
}

.trendItem .up {
  color: #f5222d;
}

.trendItem .down {
  // top: -1px;
  color: #52c41a;
}

.trendItem.trendItemGrey___1ksIM .down,
.trendItem.trendItemGrey___1ksIM .up {
  color: rgba(0, 0, 0, 0.85);
}

.trendItem.reverseColor___1BPCV .up {
  color: #52c41a;
}

.trendItem.reverseColor___1BPCV .down {
  color: #f5222d;
}

.field {
  margin: 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.field .label,
.field .number {
  font-size: 14px;
  line-height: 22px;
}

.field .number {
  margin-left: 8px;
  color: rgba(229, 224, 216, 0.85);
}

.trendText {
  margin-left: 8px;
  color: rgba(229, 224, 216, 0.85);
}
</style>
