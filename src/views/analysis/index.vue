<template>
  <div class="body">
    <div class="main">
      <div class="container pie-box">
        <div v-loading="jobLoading">
          <div>深圳 岗位-区位占比</div>
          <div id="jobPie" class="chart"></div>
        </div>
      </div>
      <div class="container">
<!--        <div id="column" class="chart"></div>-->
        <div v-loading="houseLoading">
          <div>深圳 房源-区位占比</div>
          <div id="housePie" class="chart"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// 引入 echarts 核心模块，核心模块提供了 echarts 使用必须要的接口。
import * as echarts from 'echarts/core';
// 引入柱状图图表，图表后缀都为 Chart
import {BarChart, PieChart} from 'echarts/charts';
// 引入提示框，标题，直角坐标系，数据集，内置数据转换器组件，组件后缀都为 Component
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,

  LegendComponent,
} from 'echarts/components';
// 标签自动布局、全局过渡动画等特性
import {LabelLayout, UniversalTransition} from 'echarts/features';
// 引入 Canvas 渲染器，注意引入 CanvasRenderer 或者 SVGRenderer 是必须的一步
import {CanvasRenderer} from 'echarts/renderers';
import {houseAnalysis, jobAnalysis} from "@/api/public";

echarts.use([
  // 注册必须的组件
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  BarChart,
  LabelLayout,
  UniversalTransition,
  CanvasRenderer,
  // 以下为非必须插件，需要时引入
  // 饼图
  LegendComponent,
  PieChart,
  // 柱状图
]);

const District = {
  Luohu: 1,
  FuTian: 2,
  NanShan: 3,
  LongGang: 4,
  YanTian: 5,
  LongHua: 6,
  PingShan: 7,
  GuangMing: 8,
  BaoAn: 9,
  Others: 10,
}

const DistrictCN = {
  [District.Luohu]: '罗湖区',
  [District.FuTian]: '福田区',
  [District.NanShan]: '南山区',
  [District.BaoAn]: '宝安区',
  [District.LongGang]: '龙岗区',
  [District.YanTian]: '盐田区',
  [District.LongHua]: '龙华区',
  [District.PingShan]: '坪山区',
  [District.GuangMing]: '光明区',
  [District.Others]: '其他',
}

const DistrictJobPerKey = {
  [District.Luohu]: 'luohu_per',
  [District.FuTian]: 'futian_per',
  [District.NanShan]: 'nanshan_per',
  [District.BaoAn]: 'baoan_per',
  [District.LongGang]: 'longgang_per',
  [District.YanTian]: 'yantian_per',
  [District.LongHua]: 'longhua_per',
  [District.PingShan]: 'pingshan_per',
  [District.GuangMing]: 'guangming_per',
  [District.Others]: 'others',
}

const DistrictHousePerKey = {
  [District.Luohu]: 'h_luohu_per',
  [District.FuTian]: 'h_futian_per',
  [District.NanShan]: 'h_nanshan_per',
  [District.BaoAn]: 'h_baoan_per',
  [District.LongGang]: 'h_longgang_per',
  [District.YanTian]: 'h_yantian_per',
  [District.LongHua]: 'h_longhua_per',
  [District.PingShan]: 'h_pingshan_per',
  [District.GuangMing]: 'h_guangming_per',
  // [District.Others]: 'others',
}
export default {
  name: "analysis-view",
  data() {
    return {
      District,
      DistrictJobPerKey,
      DistrictCN,
      DistrictHousePerKey,

      pieOption: {
        tooltip: {
          trigger: 'item'
        },
        legend: {
          top: '5%',
          left: 'center'
        },
        series: [
          {
            name: '区位占比',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2
            },
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 40,
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: [
              {value: '1.23', name: '罗湖区'},
              {value: 73, name: '福田区'},
              {value: 5, name: '南山区'},
              {value: 4, name: '宝安区'},
              {value: 10, name: '龙岗区'},
              {value: 10, name: '盐田区'},
              {value: 10, name: '龙华区'},
              {value: 10, name: '坪山区'},
              {value: 10, name: '光明区'},
            ]
          },
        ]
      },

      // columnOption: {
      //   xAxis: {
      //     type: 'category',
      //     data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      //   },
      //   yAxis: {
      //     type: 'value'
      //   },
      //   series: [
      //     {
      //       data: [120, 200, 150, 80, 70, 110, 130],
      //       type: 'bar',
      //       showBackground: true,
      //       backgroundStyle: {
      //         color: 'rgba(180, 180, 180, 0.2)'
      //       }
      //     }
      //   ]
      // }
      jobLoading: false,
      houseLoading: false
    }
  },
  methods: {
    initJobAnalysis() {
      this.jobLoading = true
      return jobAnalysis().then(res => {
        return Object.values(District).map(item => {
          return {
            name: DistrictCN[item],
            value: res[DistrictJobPerKey[item]]
          }
        })
      }).finally(() => {
        this.jobLoading = false
      })
    },
    initHouseAnalysis() {
      this.houseLoading = true
      return houseAnalysis().then(res => {
        return Object.values(District)
          .filter(item => item !== District.Others)
          .map(item => {
              return {
                name: DistrictCN[item],
                value: res[DistrictHousePerKey[item]]
              }
            }
          )
      }).finally(() => {
        this.houseLoading = false
      })
    }
  },
  created() {

  },
  async mounted() {
    let jobOption = this.$cloneDeep(this.pieOption)
    jobOption.series[0].data = await this.initJobAnalysis()
    let jobChart = echarts.init(document.getElementById('jobPie'));
    jobChart.setOption(jobOption);

    let houseOption = this.$cloneDeep(this.pieOption)
    houseOption.series[0].data = await this.initHouseAnalysis()
    let houseChart = echarts.init(document.getElementById('housePie'));
    houseChart.setOption(houseOption);

    // let columnChart = echarts.init(document.getElementById('column'))
    // columnChart.setOption(this.columnOption)
  },
  updated() {

  }
}
</script>

<style scoped lang="scss">
.body {
  height: calc(100vh - 56px);
  overflow: auto;

  width: 100%;
  display: flex;
  justify-content: center;

  .main {

  }

  .container {
    min-width: 1080px;
    padding: 10px;
    border-radius: 10px;
    background-color: #ffffff;
  }

  .container:not(:last-child) {
    margin-bottom: 10px;
  }

  .pie-box {
    display: flex;

    div {
      flex: 1;
    }
  }

  .chart {
    width: 100%;
    height: 500px;
  }
}
</style>
