<template>
  <div :class="className" :style="{ height: height, width: width }" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import { debounce } from '@/utils'

export default {
  props: {
    className: {
      type: String,
      default: 'chart',
    },
    width: {
      type: String,
      default: '100%',
    },
    height: {
      type: String,
      default: '400px',
    },
    autoResize: {
      type: Boolean,
      default: true,
    },
    chartData: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      chart: null,
      sidebarElm: null,
    }
  },
  watch: {
    chartData: {
      deep: true,
      handler() {
        this.chart.clear()
        // this.setOptions(val.quantities, val.dates)
        this.initChart()
      },
    },
  },
  mounted() {
    this.initChart()
    if (this.autoResize) {
      this.__resizeHandler = debounce(() => {
        if (this.chart) {
          this.chart.resize()
        }
      }, 100)
      window.addEventListener('resize', this.__resizeHandler)
    }

    // 监听侧边栏的变化
    this.sidebarElm = document.getElementsByClassName('sidebar-container')[0]
    this.sidebarElm && this.sidebarElm.addEventListener('transitionend', this.sidebarResizeHandler)
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    if (this.autoResize) {
      window.removeEventListener('resize', this.__resizeHandler)
    }

    this.sidebarElm &&
      this.sidebarElm.removeEventListener('transitionend', this.sidebarResizeHandler)

    this.chart.dispose()
    this.chart = null
  },
  methods: {
    sidebarResizeHandler(e) {
      if (e.propertyName === 'width') {
        this.__resizeHandler()
      }
    },
    setOptions(quantities, dates) {
      const keys = Object.keys(quantities)

      const colors = {
        'Новые заявки': '#409EFF',
        'Ответы сервисов': '#67C23A',
        Детейлинг: '#E6A23C',
        Ремонт: '#F56C6C',
        Запчасти: '#9A76B3',
        'Новые клиенты': '#DC3790',
        Активна: '#b6a2de',
        'Не обработана': '#5cc7c9',
        Закрыта: '#01142F',
        'В работе': '#B7D4FF',
        Обработана: '#00848C',
      }

      this.chart.setOption({
        xAxis: {
          data: dates,
          boundaryGap: false,
          axisTick: {
            show: false,
          },
        },
        grid: {
          left: 10,
          right: 10,
          bottom: 20,
          top: 30,
          containLabel: true,
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
          },
          padding: [5, 10],
        },
        yAxis: {
          axisTick: {
            show: false,
          },
        },
        legend: {
          data: keys,
        },
        series: keys.map((key, i) => ({
          name: key,
          itemStyle: {
            normal: {
              color: colors[key] ? colors[key] : '#4D8802',
              lineStyle: {
                color: colors[key] ? colors[key] : '#4D8802',
                width: 3,
              },
            },
          },
          smooth: true,
          type: 'line',
          symbol: 'circle',
          symbolSize: 7,
          data: quantities[key].data,
          animationDuration: 1800,
          animationEasing: 'cubicInOut',
        })),
      })

      this.chart.resize()
    },
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')
      this.setOptions(this.chartData.quantities, this.chartData.dates)
    },
  },
}
</script>
