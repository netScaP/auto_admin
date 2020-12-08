<template>
  <div class="app-container">
    <el-table
      v-loading="isLoading"
      :data="cars"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-table :data="props.row.info.car_characteristic_values" height="400">
            <el-table-column align="center" label="Название">
              <template slot-scope="innerScope">
                {{ innerScope.row.name }}
              </template>
            </el-table-column>
            <el-table-column align="center" label="Значение">
              <template slot-scope="innerScope">
                {{ innerScope.row.value || '' }}
                {{ innerScope.row.unit || '' }}
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>

      <el-table-column align="center" label="ID" width="75">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Фото" width="150">
        <template slot-scope="scope">
          <el-image
            :src="scope.row.photos[0].path"
            :preview-src-list="scope.row.photos.map(e => e.path)"
            style="height: 100%;"
          />
          <!-- <el-carousel v-if="scope.row.photos" height="150px">
            <el-carousel-item v-for="item in scope.row.photos" :key="item.id">
            </el-carousel-item>
          </el-carousel> -->
        </template>
      </el-table-column>
      <el-table-column align="center" label="Название" min-width="100">
        <template slot-scope="scope">
          {{ scope.row.title }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Марка" width="200">
        <template slot-scope="scope">
          {{ scope.row.info && scope.row.info.car_mark ? scope.row.info.car_mark.name : '' }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Модель" width="200">
        <template slot-scope="scope">
          {{ scope.row.info && scope.row.info.car_model ? scope.row.info.car_model.name : '' }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Поколение" width="150">
        <template slot-scope="scope">
          {{
            scope.row.info && scope.row.info.car_generation
              ? scope.row.info.car_generation.name
              : ''
          }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Серия" width="150">
        <template slot-scope="scope">
          {{ scope.row.info && scope.row.info.car_serie ? scope.row.info.car_serie.name : '' }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Модификация" width="150">
        <template slot-scope="scope">
          {{
            scope.row.info && scope.row.info.car_modification
              ? scope.row.info.car_modification.name
              : ''
          }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Комплектация" width="150">
        <template slot-scope="scope">
          {{
            scope.row.info && scope.row.info.car_equipment ? scope.row.info.car_equipment.name : ''
          }}
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
import { mask } from 'vue-the-mask'

export default {
  name: 'Cars',

  directives: {
    mask,
  },

  mixins: [confirmUpdate],

  data() {
    return {
      cars: [],
      activeCar: {},
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
      const carsService = this.$apiClient.service('cars')

      this.isLoading = true
      const query = {
        $limit: this.limit,
        $skip: this.page - 1 ? (this.page - 1) * this.limit : 0,
        clientId: this.$route.params.id,
      }

      const response = await carsService.find({
        query,
      })

      const { data, total } = response

      if (data.length === 0 && this.page > 1) {
        this.page -= 1
        return await this.fetchData()
      }

      this.cars = data
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
  },
}
</script>
