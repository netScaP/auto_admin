<template>
  <div class="app-container">
    <el-table
      v-loading="isLoading"
      :data="orderFeedbacks"
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
      <el-table-column align="center" label="Компания">
        <template slot-scope="scope">
          {{ scope.row.company ? scope.row.company.name : '' }}
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
import confirmUpdate from '@/mixins/confirmUpdate'
import VueStarRating from 'vue-star-rating'
import { mask } from 'vue-the-mask'

export default {
  name: 'OrderFeedbacks',

  directives: {
    mask,
  },

  components: {
    VueStarRating,
  },

  mixins: [confirmUpdate],

  data() {
    return {
      orderFeedbacks: [],
      statuses: {
        active: 'Активен',
        unactive: 'Не активен',
        banned: 'Заблокирован',
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
      const orderFeedbacksService = this.$apiClient.service('order-feedbacks')

      this.isLoading = true
      const query = {
        $limit: this.limit,
        $skip: this.page - 1 ? (this.page - 1) * this.limit : 0,
        orderId: this.$route.params.id,
        $sort: {
          createdAt: -1,
        },
      }

      const response = await orderFeedbacksService.find({
        query,
      })

      const { data, total } = response

      if (data.length === 0 && this.page > 1) {
        this.page -= 1
        return await this.fetchData()
      }

      this.orderFeedbacks = data
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
