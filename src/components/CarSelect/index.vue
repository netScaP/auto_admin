<template>
  <div class="car-select">
    <el-dropdown :hide-on-click="false" trigger="click">
      <el-button type="primary">
        <span v-if="carInfo">
          <template v-if="Object.keys(carInfo).length === 0">
            Автомобиль
          </template>
          <template v-if="carInfo.car_mark">{{ carInfo.car_mark.name }}</template>
          <template v-if="carInfo.car_model">{{ carInfo.car_model.name }}</template>
          <template v-if="carInfo.car_generation">{{ carInfo.car_generation.name }}</template>
          <template v-if="carInfo.car_serie">{{ carInfo.car_serie.name }}</template>
          <template v-if="carInfo.car_modification">{{ carInfo.car_modification.name }}</template>
          <template v-if="carInfo.car_equipment">{{ carInfo.car_equipment.name }}</template>
        </span>
        <i class="el-icon-arrow-down el-icon--right" />
      </el-button>

      <el-dropdown-menu slot="dropdown" class="car-select__dropdown">
        <el-dropdown-item>
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
        </el-dropdown-item>

        <el-dropdown-item v-if="query.id_car_mark">
          <AsyncSelect
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
        </el-dropdown-item>

        <el-dropdown-item v-if="query.id_car_model">
          <AsyncSelect
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
        </el-dropdown-item>

        <el-dropdown-item v-if="query.id_car_generation && query.id_car_model">
          <AsyncSelect
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
        </el-dropdown-item>

        <el-dropdown-item v-if="query.id_car_serie && query.id_car_model">
          <AsyncSelect
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
        </el-dropdown-item>

        <el-dropdown-item v-if="query.id_car_modification">
          <AsyncSelect
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
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
import AsyncSelect from '../AsyncSelect'

export default {
  name: 'CarSelect',

  components: {
    AsyncSelect,
  },

  props: {
    query: {
      type: Object,
      default: () => ({}),
    },
  },

  data() {
    return {
      carInfo: {},
    }
  },

  watch: {
    query: {
      async handler(newQuery) {
        this.carInfo = await this.$apiClient.service('car/info').find({ query: newQuery })
      },
      deep: true,
    },
  },

  methods: {
    onSetField(field, val) {
      console.log({ ...this.query, [field]: val })
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

      this.$emit('updated', newQuery)
    },
  },
}
</script>

<style lang="scss">
.car-select {
  .el-button {
    width: 100%;
  }
  .el-dropdown {
    min-width: 300px;
  }
  &__dropdown {
    min-width: 300px;
  }
}
</style>
