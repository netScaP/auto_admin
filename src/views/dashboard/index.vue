<template>
  <div class="dashboard-container">
    <panel-group
      :data-type="dataType"
      :numbers="numbers"
      @handleSetLineChartData="val => (dataType = val)"
    />

    <div class="top-menu">
      <div class="dates">
        <div class="dates__buttons mr-4">
          <button
            v-for="(date, index) in dates"
            :key="index"
            :class="{ 'active-date': activeDate.name === date.name }"
            @click="setActiveDate(date)"
          >
            {{ dateNames[date.name] }}
          </button>
        </div>
        <div class="dates__calendar">
          <el-date-picker
            v-model="activeDate.value"
            :class="{ 'active-date': activeDate.name === 'custom' }"
            type="daterange"
            range-separator="-"
            start-placeholder="от"
            end-placeholder="по"
            @input="value => setActiveDate({ name: 'custom', value })"
          />
        </div>
      </div>
      <!-- <div>
        <span class="text-style">Дата: </span>
        <el-date-picker
          v-model="dateRange"
          type="datetimerange"
          range-separator="до"
          start-placeholder="Начало"
          end-placeholder="Конец"
        >
        </el-date-picker>
      </div> -->
      <div>
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
      </div>
    </div>
    <div class="stats">
      <div class="line-charts">
        <el-row>
          <vue-element-loading :active="isLoading" spinner="bar-fade-scale" />
          <!-- <p class="center-text text-style">Динамика распределения завершенных заявок</p> -->
          <line-chart :chart-data="transformedLineData" />
        </el-row>
      </div>

      <br />
      <br />
      <br />
      <!-- <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>Статистика</span>
        </div>
      </el-card> -->
      <el-row>
        <el-col :span="6" :offset="2">
          <el-card>
            <p class="center-text text-style">Типы заявок</p>
            <pie-chart :chart-data="transformToPieChart(orderTypes)" />
          </el-card>
        </el-col>

        <el-col :span="6" :offset="1">
          <el-card>
            <p class="center-text text-style">Статусы заявок</p>
            <pie-chart :chart-data="transformToPieChart(orderStatuses)" />
          </el-card>
        </el-col>

        <el-col :span="6" :offset="1">
          <el-card>
            <p class="center-text text-style">Распределение заявок по компаниям</p>
            <pie-chart :chart-data="transformToPieChart(orderCompanies)" />
          </el-card>
        </el-col>
      </el-row>

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

import LineChart from '@/views/dashboard/components/LineChart'
import PieChart from '@/views/dashboard/components/PieChart'
import PanelGroup from '@/views/dashboard/components/PanelGroup'
import initialDates from '@/views/dashboard/initialDates'

export default {
  name: 'Dashboard',

  components: {
    StarRating,
    VueElementLoading,
    ExcelExport,
    LineChart,
    PieChart,
    AsyncSelect,
    PanelGroup,
  },

  data() {
    return {
      dataType: 'new-clients',
      dates: initialDates,
      dateNames: {
        today: 'Сегодня',
        yesterday: 'Вчера',
        week: 'Неделя',
        month: 'Месяц',
        year: 'Год',
      },
      activeDate: initialDates[0],
      lineData: [],
      orderTypes: [],
      orderStatuses: [],
      orderCompanies: [],
      translates: {
        newOrders: 'Новые заявки',
        responses: 'Ответы сервисов',
        detailing: 'Детейлинг',
        repair: 'Ремонт',
        spare: 'Запчасти',
        newClients: 'Новые клиенты',
        active: 'Активна',
        unhandled: 'Не обработана',
        closed: 'Закрыта',
        work: 'В работе',
        done: 'Обработана',
      },
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

    transformedLineData() {
      const quantities = {}
      if (this.dataType === 'new-orders') {
        for (const type of ['newOrders', 'responses']) {
          const translate = this.translates[type]
          quantities[translate] = { name: translate, data: [] }
          quantities[translate].data = this.lineData.map(e => e[type])
        }
      } else if (this.dataType === 'done-orders') {
        for (const type of ['detailing', 'repair', 'spare']) {
          const translate = this.translates[type]
          quantities[translate] = { name: translate, data: [] }
          quantities[translate].data = this.lineData.map(e => e[type]) // this.lineData.reduce((sum, e) => (sum += +e[type] || 0), 0)
        }
      } else if (this.dataType === 'new-clients') {
        for (const type of ['newOrders', 'newClients']) {
          const translate = this.translates[type]
          quantities[translate] = { name: translate, data: [] }
          quantities[translate].data = this.lineData.map(e => e[type])
        }
      }

      return {
        dates: this.lineData.map(e => e.date),
        quantities,
      }
    },

    numbers() {
      return this.lineData.reduce(
        (obj, val) => {
          obj.newClients += val.newClients ? +val.newClients : 0
          obj.newOrders += val.newOrders ? +val.newOrders : 0
          obj.doneOrders += val.doneOrders ? +val.doneOrders : 0

          return obj
        },
        { newClients: 0, newOrders: 0, doneOrders: 0 }
      )
    },
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

      if (this.activeDate && Array.isArray(this.activeDate.value)) {
        query.createdAt = {
          $gte: this.activeDate.value[0],
          $lte: this.activeDate.value[1],
        }
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
        const legendName = this.translates[e.name] ? this.translates[e.name] : e.name
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
      for (const type of ['detailing', 'repair', 'spare']) {
        quantities[type] = { name: type, data: [] }
        quantities[type].data = this.lineData.map(e => e[type]) // this.lineData.reduce((sum, e) => (sum += +e[type] || 0), 0)
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

    setActiveDate(date) {
      if (this.activeDate === date) return false

      this.activeDate = date
      this.fetchData()
    },
  },
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
$text: '#fff';
$border: '#000';
$orange: 'orange';

.top-menu {
  margin-bottom: 30px;
  display: flex;
  // flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  .v-select {
    width: 300px;
  }
  & > div {
    display: flex;
    align-items: center;
    margin-right: 100px;
    & > span {
      margin-right: 10px;
    }
  }

  .dates {
    display: flex;
    align-items: center;

    &__buttons button {
      color: rgba(0, 0, 0, 0.45);
      cursor: pointer;
      padding: 7px 16px;
      font-weight: bold;
      background: white;
      border: 1px solid rgba(0, 0, 0, 0.45);
      border-left: none;
      transition: all 0.3s ease;
      outline: none;

      &:first-child {
        border-left: 1px solid rgba(0, 0, 0, 0.45);
        border-top-left-radius: 3px;
        border-bottom-left-radius: 3px;
      }
      &:last-child {
        border-top-right-radius: 3px;
        border-bottom-right-radius: 3px;
      }
      &:hover {
        background: rgba(0, 0, 0, 0.45);
        color: white;
      }
    }

    &__calendar {
      margin-left: 10px;
      .el-date-editor {
        height: 35px;
        border: 1px solid rgba(0, 0, 0, 0.45);
        padding-right: 0;
        width: 260px;

        &,
        input {
          cursor: pointer;
        }
        .el-input__icon {
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }
    }
    .active-date {
      color: white;
      background: rgba(0, 0, 0, 0.45);
    }
  }
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
