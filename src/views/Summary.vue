<template>
  <div id="summary">
    <el-row>
      <el-col :span="24">
        <el-card>
          <div id="keyboard"></div>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="8">
        <el-card>
          <div id="balance-chart"></div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card>
          <div id="rows-chart"></div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card>
          <div id="mixed-fingers-chart"></div>
        </el-card>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-card>
          <div id="fingers-chart"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import h337 from 'heatmap.js'
import { keyboard } from '@/store/util/keyboard'
import { LooseObject } from '@/store/types'
import { State } from 'vuex-class'

import * as echarts from 'echarts/core'
import { BarChart, BarSeriesOption, PieChart, PieSeriesOption } from 'echarts/charts'
import { TitleComponent, TitleComponentOption, TooltipComponent, TooltipComponentOption, GridComponent, GridComponentOption } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'

type ECOption = echarts.ComposeOption<BarSeriesOption | PieSeriesOption | TitleComponentOption | GridComponentOption | TooltipComponentOption>
echarts.use([TitleComponent, TooltipComponent, GridComponent, BarChart, PieChart, CanvasRenderer])

type DataPoints = Array<{ x: number; y: number; value: number }>

type StatisticData = {
  hands: PieSeriesOption['data'];
  fingers: Array<number>;
  rows: Array<number>;
}

interface HeatmapData {
  min: number;
  max: number;
  data: DataPoints;
}

const getHeatmapData = (keyCount: LooseObject<number>): HeatmapData => {
  const min = 0
  let max = 0
  const data: DataPoints = []
  for (const key in keyCount) {
    if (key === 'Space' || key === 'Backspace') {
      continue
    }

    const node = keyboard.get(key)
    if (node && node.coord) {
      const [x, y] = node.coord
      const value = keyCount[key]
      if (max < value) {
        max = value
      }
      data.push({ x, y, value })
    }
  }

  if (max === 0) {
    return { min: 0, max: 0, data: [] }
  } else {
    return { min, max, data }
  }
}

@Component
export default class Summary extends Vue {
  @State('overallKeyCount')
  private keyCount!: LooseObject<number>

  get statisticData (): StatisticData {
    const hands = [
      { name: '右手', value: 0 },
      { name: '左手', value: 0 }
    ]
    const rows: Array<number> = new Array(4).fill(0)
    const fingers: Array<number> = new Array(9).fill(0)

    for (const key in this.keyCount) {
      const node = keyboard.get(key)
      if (!node) {
        continue
      }

      const { finger, row } = node
      const value = this.keyCount[key]
      if (row > 0 && row < 5) {
        rows[4 - row] += value
      }
      if (finger < 9) {
        fingers[finger] += value
      }
      if (finger <= 3) {
        hands[1].value += value
      } else if (finger >= 5 && finger <= 8) {
        hands[0].value += value
      }
    }

    return { rows, hands, fingers }
  }

  @Watch('keyCount.KeyE')
  keyCountChange () {
    this.buildCharts()
  }

  mounted () {
    this.buildCharts()
  }

  buildCharts () {
    const { hands, rows, fingers } = this.statisticData

    const config = {
      container: document.getElementById('keyboard')
    }
    const heatmap = h337.create(config)
    const data = getHeatmapData(this.keyCount)
    heatmap.setData(data)

    const balanceOption: ECOption = {
      title: {
        text: '左右手均衡情况',
        left: 'center'
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)'
      },
      series: [
        {
          type: 'pie',
          name: '均衡度',
          selectedMode: 'single',
          label: { position: 'inner', formatter: '{b}: {d}%' },
          labelLine: {
            show: false
          },
          data: hands
        }
      ]
    }
    const balanceChart = echarts.init(document.getElementById('balance-chart') as HTMLElement)
    balanceChart.setOption(balanceOption)

    const rowsOption: ECOption = {
      title: {
        text: '不同位置按键使用率',
        left: 'center'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      xAxis: {
        type: 'value'
      },
      yAxis: {
        type: 'category',
        data: ['下排', '中排', '上排', '数字'],
        axisTick: {
          alignWithLabel: true
        }
      },
      series: [
        {
          type: 'bar',
          data: rows,
          label: {
            show: true
          }
        }
      ]
    }
    const rowsChart = echarts.init(document.getElementById('rows-chart') as HTMLElement)
    rowsChart.setOption(rowsOption)

    const mixedFingersOption = {
      title: {
        text: '手指使用率',
        left: 'center'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      xAxis: {
        type: 'value'
      },
      yAxis: {
        type: 'category',
        data: ['小指', '无名指', '中指', '食指'],
        axisTick: {
          alignWithLabel: true
        }
      },
      series: [
        {
          type: 'bar',
          stack: 'total',
          name: '左手',
          data: fingers.slice(0, 4),
          label: {
            show: true
          }
        },
        {
          type: 'bar',
          stack: 'total',
          name: '右手',
          data: fingers.slice(5).reverse(),
          label: {
            show: true
          }
        }
      ]
    }
    const mixedFingersChart = echarts.init(document.getElementById('mixed-fingers-chart') as HTMLElement)
    mixedFingersChart.setOption(mixedFingersOption)

    const fingersOption: ECOption = {
      title: {
        text: '手指使用率（分区）',
        left: 'center'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      xAxis: {
        type: 'category',
        data: ['小指(左)', '无名指', '中指', '食指', '拇指', '食指', '中指', '无名指', '小指(右)'],
        axisTick: {
          alignWithLabel: true
        }
      },
      yAxis: { type: 'value' },
      series: [
        {
          type: 'bar',
          data: fingers,
          label: {
            show: true
          }
        }
      ]
    }
    const fingersChart = echarts.init(document.getElementById('fingers-chart') as HTMLElement)
    fingersChart.setOption(fingersOption)
  }
}
</script>
