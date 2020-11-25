<template>
  <div class="app-container">
    <el-form ref="ruleForm" :rules="rules" :model="form" label-width="160px">
      <el-row>
        <el-col :span="8">
          <el-form-item prop="name" label="Название">
            <el-input v-model="form.name" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="Адрес">
            <el-input v-model="form.address" placeholder="Адрес" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item prop="phone" label="Номер телефона">
            <el-input
              v-mask="'+7 (###) ### ##-##'"
              v-model="form.phone"
              placeholder="+7 999 999-99-99"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="email" label="E-mail">
            <el-input v-model="form.email" placeholder="Почта" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="Описание">
        <Markdown :input="form.description" @on-update="val => (form.description = val)" />
      </el-form-item>

      <el-form-item label="Время работы">
        <time-work :value="form.timeWork" @change="val => (form.timeWork = val)" />
      </el-form-item>

      <el-form-item label="Статус">
        <el-select v-model="form.status" placeholder="Статус">
          <el-option v-for="(label, key) in statuses" :key="key" :label="label" :value="key" />
        </el-select>
      </el-form-item>

      <el-form-item label="Местоположение">
        <google-map
          :coordinates="{ lat: form.lat, lng: form.lng }"
          style="width: 80%"
          @coordinates_changed="coordinatesChanged"
        />
      </el-form-item>

      <el-form-item v-if="!isEdit" prop="user" class="user-form" label="Пользователь">
        <el-col :span="7">
          <el-input v-model="form.user.email" placeholder="Email пользователя" />
        </el-col>
        <el-col v-if="!isEdit || isNewPassword" :span="7" :offset="1">
          <el-input v-model="form.user.password" placeholder="Пароль" />
        </el-col>
        <el-col v-if="!isEdit || isNewPassword" :span="2" :offset="1">
          <el-button type="primary" @click="generatePassword">
            Сгенерировать
          </el-button>
        </el-col>
        <el-col v-if="isEdit && !isNewPassword" :span="7" :offset="1">
          <el-button type="primary" @click="changePassword">
            Изменить пароль
          </el-button>
        </el-col>
      </el-form-item>
      <el-form-item>
        <el-button v-if="isEdit" type="primary" @click="onEdit">
          Изменить
        </el-button>
        <el-button v-if="!isEdit" type="primary" @click="onAdd">
          Cохранить
        </el-button>
        <el-button @click="onCancel">Отмена</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import validateForm from '@/mixins/validateForm'
import confirmUpdate from '@/mixins/confirmUpdate'
import Markdown from '@/components/Markdown'
import AsyncSelect from '@/components/AsyncSelect'
import GoogleMap from '@/components/GoogleMap'
import { mask } from 'vue-the-mask'

import TimeWork from './TimeWork'

export default {
  name: 'CompanyForm',

  components: {
    Markdown,
    AsyncSelect,
    GoogleMap,
    TimeWork,
  },

  directives: {
    mask,
  },

  mixins: [validateForm, confirmUpdate],

  data() {
    return {
      form: {
        name: '',
        email: '',
        phone: '',
        description: '',
        timeWork: [],
        lat: 55.333,
        lng: 55.333,
        // userId: ''
        user: {
          email: '',
          password: '',
        },
      },
      show: false,
      isEdit: false,
      statuses: {
        active: 'Активен',
        unactive: 'Не активен',
        banned: 'Заблокирова',
      },
      rules: {
        name: [{ required: true, message: 'Введите название компании', trigger: 'blur' }],
        phone: [{ required: true, message: 'Введите номер телефона', trigger: 'blur' }],
        email: [
          {
            validator: (rule, value, callback) => {
              if (value === '' || !this.validateEmail(value)) {
                callback(new Error('Введите email компании'))
              }

              callback()
            },
            required: true,
            trigger: 'blur',
          },
        ],
        user: [
          {
            validator: (rule, value, callback) => {
              if (value.email === '' || !this.validateEmail(value.email)) {
                callback(new Error('Введите email владельца компании'))
              }
              if (value.password === '' && (!this.isEdit || this.isNewPassword)) {
                callback(new Error('Введите пароль владельца компании'))
              }
              if (
                value.password &&
                value.password.length < 4 &&
                (!this.isEdit || this.isNewPassword)
              ) {
                callback(new Error('Пароль должен быть минимум из 4 символов'))
              }
              callback()
            },
            trigger: 'blur',
          },
          { required: true, trigger: 'blur' },
        ],
      },
      isNewPassword: false,
    }
  },

  mounted() {
    if (this.$route.params.id) {
      this.isEdit = true
      this.fetchData()
    }
  },

  methods: {
    async fetchData() {
      const companyService = this.$apiClient.service('companies')
      const res = await companyService.get(this.$route.params.id)

      if (!res.user) {
        res.user = {
          email: '',
          password: '',
        }
      }
      res.lat = res.lat || 53.333
      res.lng = res.lng || 53.333

      this.form = res
    },

    async onEdit() {
      try {
        await this.validateForm('ruleForm')
      } catch (err) {
        return false
      }

      try {
        await this.confirmUpdate('Сохранить изменения компании?', 'Компания не изменена')
      } catch (err) {
        return false
      }

      const companyService = this.$apiClient.service('companies')

      try {
        await companyService.patch(this.$route.params.id, {
          ...this.form,
        })
      } catch (err) {
        this.$message({
          message: err.message,
          type: 'error',
        })
        return false
      }

      this.$message({
        message: 'Компания изменена!',
        type: 'success',
      })

      this.$router.push({ name: 'Companies' })
    },

    async onAdd() {
      try {
        await this.validateForm('ruleForm')
      } catch (err) {
        return false
      }

      const companyService = this.$apiClient.service('companies')

      try {
        await companyService.create({
          ...this.form,
        })
      } catch (err) {
        this.$message({
          message: err.message,
          type: 'error',
        })
        return false
      }

      this.$message({
        message: 'Компания сохранена!',
        type: 'success',
      })

      this.$router.push({ name: 'Companies' })
    },

    async onCancel() {
      try {
        await this.confirmUpdate(
          'Оменить изменения компании?',
          'Продолжайте редактирование компании'
        )
      } catch (err) {
        return false
      }

      this.$message({
        message: 'Компания не изменена!',
        type: 'warning',
      })

      this.$router.push({ name: 'Companies' })
    },

    handleImageDataUrl(url) {
      this.imageUrl = url
    },

    toggleShow() {
      this.show = !this.show
    },

    generatePassword() {
      this.form.user.password = '' + Math.floor(Math.random() * 100000)
    },

    changePassword() {
      this.isNewPassword = true
      this.$set(this.form.user, 'password', null)
    },

    validateEmail(email) {
      const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ //eslint-disable-line
      return re.test(String(email).toLowerCase())
    },

    coordinatesChanged(marker) {
      this.form.lat = marker.lat
      this.form.lng = marker.lng
    },
  },
}
</script>

<style>
.line {
  text-align: center;
}
.user-form {
  margin-top: 70px;
}
</style>
