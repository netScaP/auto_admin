<template>
  <div class="configs">
    <Config v-for="(value, index) in configs" :key="value" @remove="() => removeConfig(index)" />
    <div class="auto">
      <el-button type="success" round @click="addConfig">Добавить конфиг</el-button>
    </div>
  </div>
</template>

<script>
import Config from '@/views/auto-configs/Config'

export default {
  name: 'CarSelect',

  components: {
    Config,
  },

  data() {
    return {
      configs: [5],
    }
  },

  methods: {
    addConfig() {
      this.configs.push(this.configs[this.configs.length - 1] + 1)
    },

    removeConfig(index) {
      if (this.configs.length < 2) {
        return false
      }

      this.configs.splice(index, 1)
    },
  },
}
</script>

<style lang="scss" scoped>
.configs {
  display: flex;
  flex-wrap: wrap;
  padding: 30px;
}
</style>
