<template>
  <div class="app-container client-form">
    <el-form ref="ruleForm" :model="form" label-width="160px">
      <el-row>
        <el-col :span="8">
          <el-form-item prop="name" label="Название">
            <el-input v-model="form.name" :disabled="true" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="Адрес">
            <el-input v-model="form.address" :disabled="true" placeholder="Адрес" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item prop="phone" label="Номер телефона">
            <el-input
              v-mask="'+7 (###) ### ##-##'"
              v-model="form.phone"
              :disabled="true"
              placeholder="+7 999 999-99-99"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="email" label="E-mail">
            <el-input v-model="form.email" :disabled="true" placeholder="Почта" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="8">
          <el-form-item prop="assessment" label="Рейтинг">
            <vue-star-rating
              :rating="form.assessment / 2"
              :read-only="true"
              :fixed-points="2"
              :increment="0.1"
              :star-size="20"
            />
          </el-form-item>
        </el-col>

        <el-col :span="8">
          <el-form-item label="Статус">
            <el-select v-model="form.status" placeholder="Статус">
              <el-option v-for="(label, key) in statuses" :key="key" :label="label" :value="key" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <div class="tabs-container">
      <el-tabs v-model="activeTab">
        <el-tab-pane label="Автомобили" name="cars">
          <car-list />
        </el-tab-pane>

        <el-tab-pane label="Заказы" name="orders">
          <order-list />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import { mask } from 'vue-the-mask'

import VueStarRating from 'vue-star-rating'
import CarList from '@/views/clients/components/CarList'
import OrderList from '@/views/clients/components/OrderList'

export default {
  name: 'ClientForm',

  directives: {
    mask,
  },

  components: {
    VueStarRating,
    CarList,
    OrderList,
  },

  data() {
    return {
      form: {
        name: '',
        email: '',
        phone: '',
        description: '',
      },
      statuses: {
        active: 'Активен',
        unactive: 'Не активен',
        banned: 'Заблокирова',
      },

      activeTab: 'cars', // cars | orders
    }
  },

  mounted() {
    if (this.$route.params.id) {
      this.fetchData()
    }
  },

  methods: {
    async fetchData() {
      const clientService = this.$apiClient.service('clients')
      const res = await clientService.get(this.$route.params.id)

      this.form = res
    },

    async onCancel() {
      try {
        await this.confirmUpdate('Оменить изменения клиента?', 'Продолжайте редактирование клиента')
      } catch (err) {
        return false
      }

      this.$message({
        message: 'Клиент не изменен!',
        type: 'warning',
      })

      this.$router.push({ name: 'Clients' })
    },
  },
}
</script>

<style>
.client-form input:disabled {
  color: #606266 !important;
}
.tabs-container {
  width: 90%;
  margin-left: 5%;
  margin-top: 50px;
}
</style>
