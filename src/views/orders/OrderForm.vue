<template>
  <div class="app-container order-form">
    <el-form ref="ruleForm" :model="form" label-width="160px">
      <el-card>
        <div slot="header">
          <span>Информация о заявке</span>
        </div>
        <el-form-item prop="title" label="Название">
          <el-input v-model="form.title" :disabled="true" />
        </el-form-item>

        <el-form-item prop="type" label="Тип">
          <el-select v-model="form.type" :disabled="true" placeholder="Тип">
            <el-option v-for="(label, key) in types" :key="key" :label="label" :value="key" />
          </el-select>
        </el-form-item>

        <el-form-item prop="status" label="VIN">
          <el-select v-model="form.status" :disabled="true" placeholder="Статус">
            <el-option v-for="(label, key) in statuses" :key="key" :label="label" :value="key" />
          </el-select>
        </el-form-item>

        <el-form-item prop="description" label="Описание">
          <Markdown :input="form.description" :show-compiled-only="true" />
        </el-form-item>
      </el-card>

      <el-card v-if="form.car && form.car.info">
        <div slot="header">
          <span>Автомобиль</span>
        </div>

        <el-form-item prop="title" label="Название">
          <el-input v-model="form.title" :disabled="true" />
          <div v-if="form.car.photos" style="display: flex; justify-content: center; width: 150px;">
            <el-image
              :src="form.car.photos[0].path"
              :preview-src-list="form.car.photos.map(e => e.path)"
              style="height: 100%;"
            />
          </div>
        </el-form-item>

        <el-form-item label="">
          <p>
            <span>{{ form.car.info.car_mark ? form.car.info.car_mark.name : '' }} - </span>
            <span>{{ form.car.info.car_model ? form.car.info.car_model.name : '' }} -</span>
            <span>
              {{ form.car.info.car_generation ? form.car.info.car_generation.name : '' }}
              -
            </span>
            <span>{{ form.car.info.car_serie ? form.car.info.car_serie.name : '' }} -</span>
            <span>
              {{ form.car.info.car_modification ? form.car.info.car_modification.name : '' }}
              -
            </span>
            <span>
              {{ form.car.info.car_equipment ? form.car.info.car_equipment.name : '' }}
            </span>
          </p>
        </el-form-item>

        <el-table
          v-if="form.car.info.car_characteristic_values"
          :data="form.car.info.car_characteristic_values"
          height="310"
        >
          <el-table-column align="center" label="Название">
            <template slot-scope="scope">
              {{ scope.row.name }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="Значение">
            <template slot-scope="scope">
              {{ scope.row.value || '' }}
              {{ scope.row.unit || '' }}
            </template>
          </el-table-column>
        </el-table>
      </el-card>

      <el-card v-if="form.client">
        <div slot="header">
          <span>Информация о клиенте</span>
        </div>

        <el-form-item label="Название">
          <el-input v-model="form.client.name" :disabled="true" />
        </el-form-item>

        <el-form-item label="Номер телефона">
          <el-input
            v-mask="'+7 (###) ### ##-##'"
            v-model="form.client.phone"
            :disabled="true"
            placeholder="+7 999 999-99-99"
          />
        </el-form-item>

        <el-form-item label="E-mail">
          <el-input v-model="form.client.email" :disabled="true" placeholder="Почта" />
        </el-form-item>

        <el-form-item label="Рейтинг">
          <vue-star-rating
            :rating="form.client.assessment / 2"
            :read-only="true"
            :fixed-points="2"
            :increment="0.1"
            :star-size="20"
          />
        </el-form-item>
      </el-card>
    </el-form>

    <div class="tabs-container">
      <el-tabs v-model="activeTab">
        <el-tab-pane label="Предложения" name="responses">
          <response-list />
        </el-tab-pane>

        <el-tab-pane label="Отзывы" name="feedbacks">
          <feedback-list />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import { mask } from 'vue-the-mask'

import VueStarRating from 'vue-star-rating'
import Markdown from '@/components/Markdown'
import ResponseList from '@/views/orders/components/ResponseList'
import FeedbackList from '@/views/orders/components/FeedbackList'

export default {
  name: 'OrderForm',

  directives: {
    mask,
  },

  components: {
    VueStarRating,
    Markdown,
    ResponseList,
    FeedbackList,
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

      activeTab: 'responses', // responses | feedbacks
    }
  },

  mounted() {
    if (this.$route.params.id) {
      this.fetchData()
    }
  },

  methods: {
    async fetchData() {
      const orderService = this.$apiClient.service('orders')
      const res = await orderService.get(this.$route.params.id)

      this.form = res
    },

    async onCancel() {
      try {
        await this.confirmUpdate('Оменить изменения заказа?', 'Продолжайте редактирование заказа')
      } catch (err) {
        return false
      }

      this.$message({
        message: 'Заказ не изменен!',
        type: 'warning',
      })

      this.$router.push({ name: 'Orders' })
    },
  },
}
</script>

<style>
.order-form input:disabled {
  color: #606266 !important;
}
.tabs-container {
  width: 90%;
  margin-left: 5%;
  margin-top: 50px;
}
</style>
