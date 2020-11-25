<template>
  <div class="app-container">
    <el-table
      v-loading="isLoading"
      :data="ordersResponses"
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
      <el-table-column align="center" label="Описание">
        <template slot-scope="scope">
          {{ scope.row.description }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Цена">
        <template slot-scope="scope">
          {{ scope.row.priceFrom }} {{ scope.row.priceTo ? ' - ' + scope.row.priceTo : '' }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Срок">
        <template slot-scope="scope">
          {{ scope.row.date | toDateFormat }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Статус" width="200">
        <template slot-scope="scope">
          {{ statuses[scope.row.status] }}
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
import moment from 'moment'

export default {
  name: 'OrderResponses',

  filters: {
    toDateFormat(val) {
      return moment(val).isValid() ? moment(val).format('DD-MM-YY') : '-'
    },
  },

  data() {
    return {
      ordersResponses: [],
      statuses: {
        active: 'Активен',
        spam: 'Спам',
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
      const ordersResponsesService = this.$apiClient.service('order-response')

      this.isLoading = true
      const query = {
        $limit: this.limit,
        $skip: this.page - 1 ? (this.page - 1) * this.limit : 0,
        orderId: this.$route.params.id,
        $sort: {
          createdAt: -1,
        },
      }

      const response = await ordersResponsesService.find({
        query,
      })

      const { data, total } = response

      if (data.length === 0 && this.page > 1) {
        this.page -= 1
        return await this.fetchData()
      }

      this.ordersResponses = data
      this.total = total

      this.isLoading = false
      return true
    },

    handleSizeChange(pageSize) {
      this.limit = pageSize
      this.fetchData()
    },
  },
}
</script>
