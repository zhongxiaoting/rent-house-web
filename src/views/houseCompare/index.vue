<template>
  <div class="body">
    <div>
      <div class="container">
        <div @click="callBack">
          <i class="el-icon-back"></i>
          <span>返回</span>
        </div>
      </div>
      <div class="container">
        <div class="sign-box">
          <div
              v-for="item in labelList"
              :key="item.key"
              class="sign-item"
          >
            <div :class="`sign ${item.className}`"></div>
            <span>{{ item.name}}</span>
          </div>
        </div>
        <div id="main" class="chart"></div>
        <div
          v-for="item in houseNameList"
          :key="`house-${item.index}`"
        >
          <span>{{item.index}}.{{ item.house }} </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {getHouseListByJobId} from "@/api/public";
import * as echarts from 'echarts/core';
import { GridComponent, TooltipComponent } from 'echarts/components';
import { BarChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([GridComponent, BarChart, CanvasRenderer, TooltipComponent]);
export default {
  name: "house-compare",
  data() {
    return {
      jobId: '',
      houseNameList: [],

      labelList: [
        {
          key: 'price',
          name: '距离(单位：M)',
          className: 'first',
        },
        {
          key: 'dist',
          name: '租金',
          className: 'second',
        }
      ],

      option: {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        xAxis: {
          type: 'category',
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          axisTick: {
            alignWithLabel: true
          }
        },
        yAxis: [
          {
            type: 'value'
          }
        ],
        axisPointer: {
          type: 'shadow'
        },
        series: [
          {
            data: [120, 200, 150, 80, 70, 110, 130],
            type: 'bar',
            showBackground: true,
            backgroundStyle: {
              color: 'rgba(180, 180, 180, 0.2)'
            }
          }
        ]
      }
    }
  },
  methods: {
    initHouseList() {
      return getHouseListByJobId({jobId: this.jobId, page: 1}).then(res => {
        let {object_list} = res
        const houseKeyList = Object.keys(object_list)
        let jobToHouseDistList = houseKeyList.map(item => Number(parseFloat(item).toFixed(3) *1000))
        let housePriceList = []
        let houseNameList = []
        houseKeyList.forEach((item, index) => {
          const {price, house} = object_list[item]
          housePriceList.push(Number(price))
          houseNameList.push({
            index: index + 1,
            house
          })
        })
        this.houseNameList = houseNameList
        this.option.xAxis.data = houseNameList.map(item => item.index)
        this.option.series = [
          {
            name: '1',
            data: jobToHouseDistList,
            type: 'bar',
            showBackground: true,
            backgroundStyle: {
              color: 'rgba(180, 180, 180, 0.2)'
            }
          },
          {
            name: '2',
            data: housePriceList,
            type: 'bar',
            showBackground: true,
            backgroundStyle: {
              color: 'rgba(180, 180, 180, 0.2)'
            }
          }
        ]
      })
    },

    callBack() {
      this.$router.back()
    }
  },
  created() {
    const {jobId} = this.$route.query
    this.jobId = jobId
  },
  async mounted() {

    await this.initHouseList()
    let chartDom = document.getElementById('main');
    let myChart = echarts.init(chartDom);
    this.option && myChart.setOption(this.option);

  }
}
</script>

<style scoped lang="scss">
.body {
  display: flex;
  justify-content: center;

  .container {
    min-width: 1080px;
    padding: 10px;
    border-radius: 10px;
    background-color: #ffffff;
  }

  .container:not(:last-child) {
    margin-bottom: 10px;
  }

  .chart {
    width: 100%;
    height: 500px;
  }

  .sign-box {
    display: flex;

    .sign-item {
      display: flex;
      align-items: center;

      .sign {
        height: 20px;
        width: 20px;
        margin-right: 10px;
      }

      .first {
        background-color: #677adc;
      }
      .second {
        background-color: #9eca6f;
      }
    }

    .sign-item:not(:last-child) {
      margin-right: 20px;
    }
  }
}
</style>
