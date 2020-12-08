<template>
  <el-row :gutter="40" class="panel-group">
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div
        :class="dataType === 'new-clients' ? 'active' : ''"
        class="card-panel"
        @click="handleSetLineChartData('new-clients')"
      >
        <div class="card-panel-icon-wrapper icon-people">
          <img src="@/assets/customer.svg" alt="customer" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            Новых клиентов
          </div>
          <count-to
            :start-val="0"
            :end-val="numbers.newClients"
            :duration="2600"
            class="card-panel-num"
          />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div
        :class="dataType === 'new-orders' ? 'active' : ''"
        class="card-panel"
        @click="handleSetLineChartData('new-orders')"
      >
        <div class="card-panel-icon-wrapper icon-message">
          <img src="@/assets/order.svg" alt="order" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            Новых заявок
          </div>
          <count-to
            :start-val="0"
            :end-val="numbers.newOrders"
            :duration="3000"
            class="card-panel-num"
          />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div
        :class="dataType === 'done-orders' ? 'active' : ''"
        class="card-panel"
        @click="handleSetLineChartData('done-orders')"
      >
        <div class="card-panel-icon-wrapper icon-money">
          <img src="@/assets/sent.svg" alt="sent" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            Обработанных заявок
          </div>
          <count-to
            :start-val="0"
            :end-val="numbers.doneOrders"
            :duration="3200"
            class="card-panel-num"
          />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div
        :class="dataType === 'shoppings' ? 'active' : ''"
        class="card-panel"
        @click="handleSetLineChartData('shoppings')"
      >
        <div class="card-panel-icon-wrapper icon-shopping">
          <img src="@/assets/ruble.svg" alt="sent" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            Прибыль
          </div>
          <count-to :start-val="0" :end-val="13600" :duration="3600" class="card-panel-num" />
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import CountTo from 'vue-count-to'

export default {
  name: 'PanelGroup',

  components: {
    CountTo,
  },

  props: {
    dataType: {
      type: String,
      required: true,
    },

    numbers: {
      type: Object,
      required: true,
    },
  },

  methods: {
    handleSetLineChartData(type) {
      this.$emit('handleSetLineChartData', type)
    },
  },
}
</script>

<style lang="scss" scoped>
.panel-group {
  margin-top: 18px;
  .card-panel-col {
    margin-bottom: 32px;
  }
  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.05);
    border-color: rgba(0, 0, 0, 0.05);
    &.active {
      .icon-people {
        background: #40c9c6;
        img {
          filter: brightness(0) invert(1);
        }
      }
      .icon-message {
        background: #36a3f7;
        img {
          filter: brightness(0) invert(1);
        }
      }
      .icon-money {
        background: #f4516c;
        img {
          filter: brightness(0) invert(1);
        }
      }
      .icon-shopping {
        background: #34bfa3;
        img {
          filter: brightness(0) invert(1);
        }
      }
    }
    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }
      .icon-people {
        background: #40c9c6;
        img {
          filter: brightness(0) invert(1);
        }
      }
      .icon-message {
        background: #36a3f7;
        img {
          filter: brightness(0) invert(1);
        }
      }
      .icon-money {
        background: #f4516c;
        img {
          filter: brightness(0) invert(1);
        }
      }
      .icon-shopping {
        background: #34bfa3;
        img {
          filter: brightness(0) invert(1);
        }
      }
    }
    .icon-people {
      color: #40c9c6;
    }
    .icon-message {
      color: #36a3f7;
    }
    .icon-money {
      color: #f4516c;
    }
    .icon-shopping {
      color: #34bfa3;
    }
    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
      img {
        height: 50px;
        background-color: transparent;
      }
    }
    .card-panel-icon {
      float: left;
      font-size: 48px;
    }
    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 26px;
      margin-left: 0px;
      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }
      .card-panel-num {
        font-size: 20px;
      }
    }
  }
}
@media (max-width: 550px) {
  .card-panel-description {
    display: none;
  }
  .card-panel-icon-wrapper {
    float: none !important;
    width: 100%;
    height: 100%;
    margin: 0 !important;
    .svg-icon {
      display: block;
      margin: 14px auto !important;
      float: none !important;
    }
  }
}
</style>
