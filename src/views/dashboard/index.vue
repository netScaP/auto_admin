<template>
  <div class="dashboard-container">
    <el-row class="top-menu">
      <el-col :offset="1">
        <span class="text-style">Информация по компании: </span>
        <AsyncSelect
          v-if="userType === 'admin'"
          :value="activeCompanyId"
          :multiple="false"
          service="companies"
          label="name"
          clearable
          placeholder="Компания"
          @value-changed="handleChangeCompany"
        />
      </el-col>
    </el-row>
    <div class="stats">
      <div class="line-charts">
        <el-row>
          <vue-element-loading :active="isLoading" spinner="bar-fade-scale" />
          <p class="center-text text-style">Динамика распределения завершенных заявок</p>
          <line-chart :chart-data="transformToLineChart()" />
        </el-row>
      </div>

      <br />
      <br />
      <br />
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>Статистика</span>
        </div>
        <el-row>
          <el-col :span="6">
            <pie-chart :chart-data="transformToPieChart(orderTypes)" />
          </el-col>

          <el-col :span="6">
            <pie-chart :chart-data="transformToPieChart(orderStatuses)" />
          </el-col>

          <el-col :span="6">
            <pie-chart :chart-data="transformToPieChart(orderCompanies)" />
          </el-col>
        </el-row>
      </el-card>

      <!-- <div class="common">
        <div class="pie">
          <p class="center-text text-style">Разбиение по количеству заказов</p>
          <p class="text-style sum-text">Количество заказов - {{ countSum(pieOrders.quantity.byPoints) }}</p>
          <pie-chart
            :chart-data="transformToPieChart(pieOrders.quantity.byPoints)" />
        </div>
      </div> -->
    </div>
  </div>
</template>

<script>
import StarRating from 'vue-star-rating'
import VueElementLoading from 'vue-element-loading'
import { mapGetters, mapActions } from 'vuex'
import moment from 'moment'

import ExcelExport from '@/components/ExcelExport'
import AsyncSelect from '@/components/AsyncSelect'

import LineChart from './components/LineChart'
import PieChart from './components/PieChart'

export default {
  name: 'Dashboard',

  components: {
    StarRating,
    VueElementLoading,
    ExcelExport,
    LineChart,
    PieChart,
    AsyncSelect,
  },

  data() {
    return {
      lineData: [],
      orderTypes: [],
      orderStatuses: [],
      orderCompanies: [],
      isLoading: true,
    }
  },

  computed: {
    ...mapGetters({
      activeCompanyId: 'companies/activeCompanyId',
      roles: 'user/roles',
      userType: 'user/userType',
      email: 'user/email',
    }),
  },

  mounted() {
    this.fetchData()

    if (this.userType == 'admin') {
      this.isAdmin = true
    }
  },

  methods: {
    ...mapActions({
      setCompanyId: 'companies/setCompanyId',
    }),

    async fetchData() {
      this.isLoading = true

      const query = {}
      if (this.activeCompanyId) {
        query.companyId = this.activeCompanyId
      }

      const lineResponse = await this.$apiClient.service('stats/line-chart').find({ query })
      this.lineData = lineResponse.line

      this.isLoading = false

      const pieResponse = await this.$apiClient.service('stats/pie-chart').find({ query })
      this.orderTypes = pieResponse.orderTypes
      this.orderStatuses = pieResponse.orderStatuses
      this.orderCompanies = pieResponse.orderCompanies
    },

    handleChangeCompany(companyId) {
      const val = companyId === '' ? undefined : companyId
      this.setCompanyId(val)
      this.fetchData()
    },

    transformToPieChart(arr) {
      const chartValues = {}
      const seriesArr = []
      const legendArr = []

      if (arr.length === 0) {
        chartValues.x = {
          name: 'Нет данных',
          total: 0,
        }
        seriesArr.push({ value: 0, name: 'Нет данных' })
        legendArr.push('Нет данных')
        return { seriesArr, legendArr }
      }

      arr.forEach(e => {
        const legendName = e.name
        legendArr.push(legendName)
        seriesArr.push({
          value: e.val,
          name: legendName,
        })
      })

      return { seriesArr, legendArr }
    },

    transformToLineChart() {
      // const companyName = this.getCompanyName()
      const quantities = {}
      for (const type in ['detailing', 'repair', 'spare']) {
        quantities[type] = { name: type, data: [] }
        quantities[type].data = this.lineData.reduce((sum, e) => (sum += +e[type] || 0), 0)
      }

      return {
        dates: this.lineData.map(e => e.date),
        quantities,
      }
    },

    countSum(arr) {
      return arr.reduce((acc, e) => (acc += +e.count), 0)
    },

    countDaysInMonth(selectedRange) {
      const currentDate = moment(selectedRange[0], 'DD-MM-YYYY')
      const endDate = selectedRange[1] !== '' ? moment(selectedRange[1]) : moment()

      const dates = {}
      dates[currentDate.format('DD-MM-YYYY')] = 0
      while (currentDate.add(1, 'days').diff(endDate) <= 0) {
        dates[currentDate.format('DD-MM-YYYY')] = 0
      }

      return dates
    },

    countHours() {
      const hours = {}
      for (let i = 1; i < 25; i++) {
        hours[i] = 0
      }
      return hours
    },

    getCompanyName() {
      return 'Сеть'
    },
  },
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.top-menu {
  margin-bottom: 30px;
}

.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}

.common,
.point-info {
  display: flex;
  flex-wrap: wrap;
  padding-left: 3%;
}
.pie {
  width: 30%;
  margin-right: 3%;
  display: flex;
  flex-direction: column;
}
.point-stats {
  margin-top: 30px;
}
.star-rating {
  align-self: center;
}

.sum-text {
  text-align: center;
  margin-top: 0px;
}
.center-text {
  text-align: center;
  margin-top: 40px;
}
.average-check {
  margin-top: 0px;
}

.text-style {
  color: rgba(0, 0, 0, 0.45);
  font-size: 16px;
  font-weight: bold;
}

.margin-left {
  margin-left: 15px;
}
</style>
