<template>
  <div class="app-container">
    <div
      class="top-menu el-col el-col-24 el-col-xs-24 el-col-sm-24 el-col-md-24 tp-text--right mb-4"
    >
      <div class="filters">
        <el-input v-model="filters.$search" placeholder="Название" />
        <el-button @click="onFilterClick">
          Применить
        </el-button>
      </div>
      <div class="add-button" />
    </div>

    <el-table
      v-loading="isLoading"
      :data="orders"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="ID" width="95">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Название">
        <template slot-scope="scope">
          {{ scope.row.title }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Телефон клиента">
        <template slot-scope="scope">
          {{ scope.row.client ? scope.row.client.phone : '' }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Автомобиль">
        <template slot-scope="scope">
          <template v-if="scope.row.car && scope.row.car.info">
            {{ scope.row.car.info.car_mark ? scope.row.car.info.car_mark.name : '' }}
            {{ scope.row.car.info.car_model ? scope.row.car.info.car_model.name : '' }}
          </template>
        </template>
      </el-table-column>
      <el-table-column align="center" label="Тип" width="200">
        <template slot-scope="scope">
          {{ types[scope.row.type] }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Статус" width="200">
        <template slot-scope="scope">
          {{ statuses[scope.row.status] }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Рейтинг" width="160">
        <template slot-scope="scope">
          <vue-star-rating
            :rating="scope.row.assessment / 2"
            :read-only="true"
            :fixed-points="2"
            :increment="0.1"
            :star-size="20"
          />
        </template>
      </el-table-column>
      <el-table-column align="center" label="Дата создания" width="200">
        <template slot-scope="scope">
          {{ scope.row.createdAt | toDateFormat }}
        </template>
      </el-table-column>
      <el-table-column align="center" fixed="right" label="Действия" width="200">
        <template slot-scope="scope">
          <router-link
            :to="{ name: 'editOrder', params: { id: scope.row.id } }"
            tag="button"
            class="el-button el-button--default el-button--small"
          >
            <i class="el-icon-edit" />
          </router-link>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :current-page.sync="page"
      :page-size="limit"
      :total="total"
      :page-sizes="[10, 20, 50]"
      background
      layout="sizes, prev, pager, next, total"
      @size-change="handleSizeChange"
      @current-change="fetchData"
    />
  </div>
</template>

<script>
import VueStarRating from 'vue-star-rating'
import moment from 'moment'

export default {
  name: 'Orders',

  components: {
    VueStarRating,
  },

  filters: {
    toDateFormat(val) {
      return moment(val).isValid() ? moment(val).format('DD-MM-YY HH:mm') : '-'
    },
  },

  data() {
    return {
      orders: [],
      filters: {},
      statuses: {
        unhandled: 'В обработке',
        closed: 'Закрыт',
        active: 'Активен',
        work: 'В работе',
        done: 'Завершен',
      },
      types: {
        detailing: 'Детейлинг',
        repair: 'Ремонт',
        spare: 'Запчасти',
      },
      isLoading: true,
      total: 1,
      limit: 10,
      page: 1,
    }
  },

  mounted() {
    this.fetchData()
  },

  methods: {
    async fetchData() {
      const ordersService = this.$apiClient.service('orders')

      this.isLoading = true
      const query = {
        $limit: this.limit,
        $skip: this.page - 1 ? (this.page - 1) * this.limit : 0,
        clientId: this.$route.params.id,
        $sort: {
          createdAt: -1,
        },
      }

      const response = await ordersService.find({
        query,
      })

      const { data, total } = response

      if (data.length === 0 && this.page > 1) {
        this.page -= 1
        return await this.fetchData()
      }

      this.orders = data
      this.total = total

      this.isLoading = false
      return true
    },

    handleSizeChange(pageSize) {
      this.limit = pageSize
      this.fetchData()
    },

    onFilterClick() {
      this.page = 1
      this.fetchData()
    },

    viewOrder(data) {
      this.activeOrder = data
    },
  },
}
</script>
