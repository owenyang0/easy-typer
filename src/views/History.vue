<template>
  <div class="page-history">
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

  @record.State('total')
  private total!: number

  @record.Action('loaded')
  private recordLoaded!: Function

  created () {
    db.achievement.toArray().then(achievements => {
      this.recordLoaded(achievements)
    }, (error) => {
      console.log(error)
    })
  }

  @Watch('dates')
  datesChange () {
    this.buildCharts()
  }

  buildCharts () {
    const recordOption: ECOption = {
      title: {
        text: '??????????????????',
        subtext: `????????????${this.dates.length}/${this.total}?????????????????????5???????????????1.1????????????`,
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
        data: ['??????(???/???)', '??????', '??????(???/???)']
      },
      yAxis: [
        {
          type: 'value',
          // name: '??????(???/???)',
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
          name: '??????',
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
          name: '??????',
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
          name: '??????(???/???)',
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
          name: '??????',
          yAxisIndex: 1,
          type: 'bar',
          sampling: 'lttb',
          itemStyle: {
            color: '#148EBB'
          },
          data: this.codeLengthList
        }, {
          name: '??????(???/???)',
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
