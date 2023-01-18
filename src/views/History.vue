<template>
  <div class="history-page">
    <el-container direction="vertical">
      <IndicatorSimple />
      <el-row class="record-chart">
        <el-card>
          <div id="record-chart"></div>
          </el-card>
      </el-row>
      <Achievements />
    </el-container>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import IndicatorSimple from '@/components/IndicatorSimple.vue'
import Achievements from '@/components/Achievements.vue'
import { namespace } from 'vuex-class'

import * as echarts from 'echarts/core'
import { BarChart, BarSeriesOption, LineChart, LineSeriesOption } from 'echarts/charts'
import { TitleComponent, TitleComponentOption, TooltipComponent, TooltipComponentOption, GridComponent, GridComponentOption, DataZoomComponent, LegendComponent, ToolboxComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import db from '@/store/util/Database'

type ECOption = echarts.ComposeOption<BarSeriesOption | TitleComponentOption | GridComponentOption | TooltipComponentOption | LineSeriesOption>
echarts.use([TitleComponent, TooltipComponent, BarChart, GridComponent, CanvasRenderer, LineChart, DataZoomComponent, LegendComponent, ToolboxComponent])

const record = namespace('record')

@Component({
  components: {
    IndicatorSimple,
    Achievements
  }
})
export default class History extends Vue {
  @record.State('dates')
  private dates!: string[]

  @record.State('speeds')
  private speeds!: string[]

  @record.State('hitSpeeds')
  private hitSpeeds!: string[]

  @record.State('codeLengthList')
  private codeLengthList!: string[]

  @record.Action('loaded')
  private recordLoaded!: Function

  created () {
    console.log('cr')
    db.achievement.toArray().then(achievements => {
      this.recordLoaded(achievements)
    }, (error) => {
      console.log(error)
    })
  }

  destroyed () {
    console.log('des')
  }

  mounted () {
    console.log('mou')
    // setTimeout(() => {
    //   this.buildCharts()
    // }, 1000)
  }

  @Watch('dates')
  datesChange () {
    console.log('change')
    this.buildCharts()
  }

  buildCharts () {
    const recordOption: ECOption = {
      title: {
        text: '跟打历史记录',
        subtext: `当有有效数${this.dates.length}条（移除字数小于5或码长为1的数据）`,
        left: 'left'
      },
      toolbox: {
        feature: {
          dataZoom: {
            yAxisIndex: 'none'
          },
          restore: {},
          saveAsImage: {}
        }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      xAxis: {
        type: 'category',
        data: this.dates
      },
      legend: {
        left: 'center',
        data: ['速度(字/分)', '码长', '击键(次/秒)']
      },
      yAxis: [
        {
          type: 'value',
          // name: '速度(字/分)',
          position: 'left',
          alignTicks: true,
          axisLine: {
            show: true
          },
          axisLabel: {
            formatter: '{value}'
          }
        },
        {
          type: 'value',
          name: '码长',
          position: 'right',
          alignTicks: true,
          offset: 0,
          axisLine: {
            show: true
          },
          axisLabel: {
            formatter: '{value}'
          }
        },
        {
          type: 'value',
          name: '击键',
          position: 'right',
          alignTicks: true,
          offset: 40,
          axisLine: {
            show: true
          },
          axisLabel: {
            formatter: '{value}'
          }
        }
      ],
      dataZoom: [
        {
          type: 'inside',
          start: 90,
          end: 100
        },
        {
          start: 90,
          end: 100
        }
      ],
      series: [
        {
          name: '速度(字/分)',
          type: 'line',
          symbol: 'none',
          sampling: 'lttb',
          itemStyle: {
            color: '#F56C6C'
          },
          // areaStyle: {
          //   color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          //     {
          //       offset: 0,
          //       color: 'rgb(255, 158, 68)'
          //     },
          //     {
          //       offset: 1,
          //       color: 'rgb(255, 70, 131)'
          //     }
          //   ])
          // },
          data: this.speeds
        }, {
          name: '码长',
          yAxisIndex: 1,
          type: 'bar',
          sampling: 'lttb',
          itemStyle: {
            color: '#148EBB'
          },
          data: this.codeLengthList
        }, {
          name: '击键(次/秒)',
          yAxisIndex: 2,
          type: 'line',
          symbol: 'none',
          sampling: 'lttb',
          itemStyle: {
            color: '#D98E15'
          },
          data: this.hitSpeeds
        }
      ]
    }
    const recordChart = echarts.init(document.getElementById('record-chart') as HTMLElement)
    recordChart.setOption(recordOption)
  }
}
</script>

<style lang="scss">
  .history-page {
    padding: 20px;
  }
</style>
