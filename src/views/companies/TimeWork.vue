<template>
  <div class="time-work">
    <div v-for="(item, i) in value" :key="i" class="time-work-element">
      <el-select
        :value="item.day"
        placeholder="День недели"
        @change="val => onSelectNewDay(i, val)"
      >
        <el-option v-for="day in days" :key="day" :label="day" :value="day" />
      </el-select>

      <el-time-select
        :picker-options="{
          start: '00:00',
          step: '00:15',
          end: '23:45',
        }"
        :value="item.time ? item.time.from : ''"
        class="time-input"
        placeholder="Дата открытия"
        @input="val => onTimeChange(i, 'from', val)"
      />
      <el-time-select
        :picker-options="{
          start: '00:00',
          step: '00:15',
          end: '23:45',
        }"
        :value="item.time ? item.time.to : ''"
        class="time-input"
        placeholder="Дата закрытия"
        @input="val => onTimeChange(i, 'to', val)"
      />

      <el-button type="danger" @click="() => removeDay(i)">
        Удалить
      </el-button>
    </div>

    <el-button @click="addDay">
      Добавить
    </el-button>
  </div>
</template>

<script>
export default {
  name: 'TimeWork',

  props: {
    value: {
      type: Array,
      default: () => [],
    },
  },

  data() {
    return {
      days: ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'],
    }
  },

  methods: {
    onSelectNewDay(i, val) {
      const updatedValue = [...this.value]
      updatedValue[i].day = val

      this.$emit('change', updatedValue)
    },

    onTimeChange(i, field, val) {
      console.log(val)
      const updatedValue = [...this.value]
      updatedValue[i].time[field] = val

      this.$emit('change', updatedValue)
    },

    addDay() {
      const updatedValue = [...this.value]
      updatedValue.push({ day: '', time: { from: '08:00', to: '20:00' } })

      this.$emit('change', updatedValue)
    },

    removeDay(index) {
      const updatedValue = [...this.value]
      updatedValue.splice(index, 1)

      this.$emit('change', updatedValue)
    },
  },
}
</script>

<style rel="stylesheet/scss" lang="scss">
.time-work {
  &-element {
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 10px;

    .el-select {
      width: 250px;
      margin-right: 20px;
    }
    .time-input {
      width: 150px;
      margin-right: 20px;
    }
  }
}
</style>
