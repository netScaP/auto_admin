export default {
  methods: {
    validateForm(formRef) {
      return new Promise((resolve, reject) => {
        if (!this.$refs[formRef]) {
          this.$message({
            message: 'Не найдена форма',
            type: 'error',
          })
          reject()
        }
        this.$refs[formRef].validate(isValid => {
          if (!isValid) {
            this.$message({
              message: 'Данные заполнены неверно',
              type: 'error',
            })
            reject(isValid)
          } else {
            resolve(isValid)
          }
        })
      })
    },
  },
}
