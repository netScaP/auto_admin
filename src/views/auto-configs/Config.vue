<template>
  <div class="auto">
    <el-card class="car-card">
      <div slot="header" class="clearfix">
        <span style="float: left;">Заявок по авто - {{ carInfo.ordersCount }}</span>
        <el-button
          style="float: right; padding: 2px;"
          type="danger"
          icon="el-icon-close"
          circle
          @click="onRemove"
        />
      </div>

      <div class="selects">
        <div>
          <AsyncSelect
            :value="query.id_car_mark"
            :reduce="val => val.id_car_mark"
            :multiple="false"
            :base-query="{ service: 'car-mark' }"
            service="car/search"
            label="name"
            clearable
            placeholder="Марка"
            @value-changed="val => onSetField('id_car_mark', val)"
          />
        </div>

        <div>
          <AsyncSelect
            :disabled="!query.id_car_mark"
            :value="query.id_car_model"
            :reduce="val => val.id_car_model"
            :multiple="false"
            :base-query="{ service: 'car-model', id_car_mark: query.id_car_mark }"
            service="car/search"
            label="name"
            clearable
            placeholder="Модель"
            @value-changed="val => onSetField('id_car_model', val)"
          />
        </div>

        <div>
          <AsyncSelect
            :disabled="!query.id_car_model"
            :value="query.id_car_generation"
            :reduce="val => val.id_car_generation"
            :multiple="false"
            :base-query="{ service: 'car-generation', id_car_model: query.id_car_model }"
            service="car/search"
            label="name"
            clearable
            placeholder="Поколение"
            @value-changed="val => onSetField('id_car_generation', val)"
          />
        </div>

        <div>
          <AsyncSelect
            :disabled="!query.id_car_generation || !query.id_car_model"
            :value="query.id_car_serie"
            :reduce="val => val.id_car_serie"
            :multiple="false"
            :base-query="{
              service: 'car-serie',
              id_car_generation: query.id_car_generation,
              id_car_model: query.id_car_model,
            }"
            service="car/search"
            label="name"
            clearable
            placeholder="Серия"
            @value-changed="val => onSetField('id_car_serie', val)"
          />
        </div>

        <div>
          <AsyncSelect
            :disabled="!query.id_car_serie || !query.id_car_model"
            :value="query.id_car_modification"
            :reduce="val => val.id_car_modification"
            :multiple="false"
            :base-query="{
              service: 'car-modification',
              id_car_serie: query.id_car_serie,
              id_car_model: query.id_car_model,
            }"
            service="car/search"
            label="name"
            clearable
            placeholder="Модификация"
            @value-changed="val => onSetField('id_car_modification', val)"
          />
        </div>

        <div>
          <AsyncSelect
            :disabled="!query.id_car_modification"
            :value="query.id_car_equipment"
            :reduce="val => val.id_car_equipment"
            :multiple="false"
            :clearable="true"
            :base-query="{
              service: 'car-equipment',
              id_car_modification: query.id_car_modification,
            }"
            service="car/search"
            label="name"
            placeholder="Комплектация"
            @value-changed="val => onSetField('id_car_equipment', val)"
          />
        </div>
      </div>

      <div>
        <el-table :data="carInfo.car_characteristic_values" border fit highlight-current-row>
          <el-table-column align="center" label="Название">
            <template slot-scope="scope">
              {{ scope.row.name }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="Значение">
            <template slot-scope="scope">
              {{ scope.row.value }}
              <span> </span>
              {{ scope.row.unit || '' }}
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
  </div>
</template>

<script>
import AsyncSelect from '@/components/AsyncSelect'

export default {
  name: 'CarConfig',

  components: {
    AsyncSelect,
  },

  data() {
    return {
      query: {},
      carInfo: {},
    }
  },

  methods: {
    async fetchData() {
      this.carInfo = await this.$apiClient.service('car/info').find({ query: this.query })
    },

    onSetField(field, val) {
      let newQuery = { ...this.query, [field]: val }

      const fields = [
        'id_car_mark',
        'id_car_model',
        'id_car_generation',
        'id_car_serie',
        'id_car_modification',
        'id_car_equipment',
      ]
      const fieldIndex = fields.findIndex(f => f === field)

      if (fieldIndex > -1) {
        newQuery = fields.slice(0, fieldIndex).reduce(
          (obj, f) => {
            obj[f] = this.query[f]
            return obj
          },
          { [field]: val }
        )
      }

      if (!val) {
        delete newQuery[field]
      }

      if (field === 'id_car_modification' || field === 'id_car_equipment') {
        this.fetchData()
      }

      this.query = { ...newQuery }
    },

    onRemove() {
      this.$emit('remove')
    },
  },
}
</script>

<style lang="scss">
.auto {
  margin: 20px;
}
.car-card {
  width: 600px;
  height: 600px;
  overflow-y: auto;

  text-align: center;

  .selects {
    & > div {
      margin-bottom: 20px;
    }
  }
}
</style>
