import moment from 'moment'
moment.locale('ru')

export default [
  {
    name: 'today',
    value: [moment().startOf('day')._d, moment().endOf('day')._d],
  },
  {
    name: 'yesterday',
    value: [
      moment()
        .subtract(1, 'days')
        .startOf('day')._d,
      moment()
        .subtract(1, 'days')
        .endOf('day')._d,
    ],
  },
  {
    name: 'week',
    value: [moment().startOf('week')._d, moment().endOf('week')._d],
  },
  {
    name: 'month',
    value: [moment().startOf('month')._d, moment().endOf('month')._d],
  },
  {
    name: 'year',
    value: [moment().startOf('year')._d, moment().endOf('year')._d],
  },
]
