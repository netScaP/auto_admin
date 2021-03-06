<template>
  <v-select
    :value="address"
    v-bind="bind"
    :label="label"
    :reduce="reduce"
    :options="addresses"
    :fetch-data="fetchAddresses"
    :taggable="taggable"
    :clearable="clearable"
    :disabled="disabled"
    :infinite-loading="false"
    :placeholder="placeholder"
    @search="resetAddresses"
    @input="addressChanged"
  />
</template>

<script>
export default {
  name: 'AddressSelect',

  props: {
    service: {
      type: String,
      required: true,
    },
    taggable: {
      type: Boolean,
      default: false,
    },
    label: {
      type: String,
      required: true,
    },
    placeholder: {
      type: String,
      default: '',
    },
    value: {
      type: Array | Number,
      default: () => [],
    },
    bind: {
      type: Object,
      default: () => ({}),
    },
    reduce: {
      type: Function,
      default: val => val.id,
    },
    baseQuery: {
      type: Object,
      default: () => ({}),
    },
    clearable: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      address: {},
      addresses: [],
      addressSearch: '',
    }
  },

  watch: {
    value: {
      handler(val) {
        this.address = val
      },
      deep: true,
      immediate: true,
    },
    baseQuery: {
      handler() {
        this.fetchAddresses()
      },
      deep: true,
    },
  },

  methods: {
    async fetchAddresses() {
      const query = {
        ...this.baseQuery,
        $limit: -1,
      }
      if (this.addressSearch) {
        query.$search = this.addressSearch
      }
      const response = await this.$apiClient.service(this.service).find({
        query,
      })
      if (Array.isArray(response)) {
        this.addresses = response
      } else {
        this.addresses = response.data
      }
    },

    resetAddresses(search) {
      this.addressSearch = search
      this.addresses = []
      this.fetchAddresses()
    },

    addressChanged(address) {
      this.address = address
      this.$emit('value-changed', this.address)
    },
  },
}
</script>

<style></style>
