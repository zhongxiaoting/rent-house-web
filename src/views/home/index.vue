<template>
  <div class="body">
    <div class="main">
      <div class="recommend">
        <div class="title">
          <h3>精选推荐</h3>
          <div class="refresh">
            <span>{{refreshTime}}s</span>
            <i class="el-icon-refresh" @click="refreshRecommend"></i>
          </div>
        </div>
        <div v-if="jobList.length > 0">
          <div v-loading="loading">
            <job-item
                v-for="(item, index) in jobList"
                :key="`job-item-${index}`"
                :job-data="item"
                @on-route-jump="handleRouteJump"
                @on-click-house="handleClickHouse"
            ></job-item>
          </div>
          <div class="page-button">
            <el-pagination
                background
                layout="prev, pager, next"
                v-bind="pageInfo"
                @current-change="handleCurrentChange"
                :total="1000">
            </el-pagination>
          </div>
        </div>
        <div v-else class="empty">
          <span>暂时没有更多...</span>
        </div>
      </div>
    </div>

    <el-dialog
        title="更多房源"
        :visible.sync="dialogVisible"
    >
      <div>
        <el-button @click="toHouseCompare">房源对比</el-button>
      </div>
      <el-table :data="currTable">
        <el-table-column
            v-for="(item, index) in tableColumn"
            :key="`table-column-${index}`"
            v-bind="item"
        ></el-table-column>
        <el-table-column
            fixed="right"
            label="操作"
            width="100">
          <template slot-scope="scope">
            <el-button
                @click="handleClick(scope.row)"
                type="text"
                size="small"
            >查看详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import JobItem from "@/views/home/components/jobItem/index.vue";
import {getHouseListByJobId, getJobRecommendList, refreshData, refreshJisuan} from "@/api/public";
// import {getHouseListByJobId} from "@/api/public";


export default {
  name: 'home-view',
  data() {
    return {
      jobList: [],
      pageInfo: {
        pageCount: 10,
        pagerCount: 5,
        currentPage: 1,
        total: 1022,
      },
      loading: false,

      dialogVisible: false,

      tableColumn: [
        {
          property: 'house',
          label: '房源',
        },
        {
          property: 'area',
          label: '所在区',
        },
        {
          property: 'addr',
          label: '地址',
        },
        {
          property: 'area_d_p',
          label: '大小坐向格局',
        },
        {
          property: 'price',
          label: '租金',
        },
        {
          property: 'distance',
          label: '岗位到房源的距离(单位：km)'
        }
      ],

      currFocusJobId: '',
      currTable: [],

      defaultRefreshTime: 10,
      refreshTime: 10,
      setTimeoutId: 0,
      setIntervalId: null,
    }
  },
  methods: {
    handleRouteJump({routeName, data}) {
      this.$router.push({
        name: routeName,
        params: {
          jobInfo: JSON.stringify(data.jobInfo)
        }
      })
    },

    handleClickHouse({data}) {
      this.currFocusJobId = data.id
      getHouseListByJobId({jobId: this.currFocusJobId, page: 1}).then(res => {
        let {object_list} = res
        this.currTable = Object.keys(object_list).map(item => {
          return {
            ...object_list[item],
            distance: Number(item).toFixed(3)
          }
        })
      }).catch(() => {
        this.$message.error('服务错误')
      }).finally(() => {
        this.changeDialogVisible()
      })
    },

    changeDialogVisible() {
      this.dialogVisible = !this.dialogVisible
    },
    handleDialogClose() {
      this.changeDialogVisible()
    },
    handleClick(data) {
      const {lng, lat, company_name} = this.jobList.find(item => this.currFocusJobId === item.id)
      this.dialogVisible = false
      this.$router.push({
        name: 'HouseNavigation',
        params: {
          house: JSON.stringify(data),
          jobPoint: JSON.stringify({
            lng: lng,
            lat: lat,
          }),
          company_name,
        }
      })
    },
    debounce(fn, delay) {
      let timer = null;
      return function() {
        clearTimeout(timer);
        timer = setTimeout(() => {
          fn.apply(this, arguments);
        }, delay);
      };
    },

    getJobRecommendList(currPage) {
      this.loading = true
      return getJobRecommendList({
        page: currPage,
      }).then(res => {
        let {object_list, num_pages, page} = res
        this.jobList = object_list.map(item => {
          const tagsList = JSON.parse(item.job_tags.replace(/'/g, '"'))
          return {
            ...item,
            job_tags: tagsList.splice(0,5),
            job_tags_surplus: tagsList.length,
            house_list: [
              ...item.min_house,
              ...item.sec_house,
            ]
          }
        })
        this.pageInfo.pageCount = num_pages
        this.pageInfo.currentPage = page
      }).finally(() => {
        this.loading = false
      })
    },

    handleCurrentChange(value) {
      this.loading = true
      this.pageInfo.currentPage =value
      this.getJobRecommendList(value)
    },

    refreshRecommend() {
      clearTimeout(this.setTimeoutId)
      this.setTimeoutId = setTimeout(() => {
        clearInterval(this.setIntervalId)
        this.refreshTime = this.defaultRefreshTime
        refreshData().finally(() => {
          this.getJobRecommendList(this.pageInfo.currentPage).finally(() => {
            this.setIntervalId = this.createSetInterval()
          })
        }),
        refreshJisuan().finally(() => {
          this.getJobRecommendList(this.pageInfo.currentPage)})
      }, 500)

    },

    createSetInterval() {
      return setInterval(() => {
        this.refreshTime -= 1
        if (this.refreshTime === 0) {
          clearInterval(this.setIntervalId)
          refreshData().finally(() => {
            this.getJobRecommendList(this.pageInfo.currentPage).finally(() => {
              this.refreshTime = this.defaultRefreshTime
              this.setIntervalId = this.createSetInterval()
            })
          }),
          refreshJisuan().finally(() => {
            this.getJobRecommendList(this.pageInfo.currentPage)
          })
        }
      }, 1000)
    },

    toHouseCompare() {
      this.changeDialogVisible()
      this.$router.push({
        name: 'HouseCompare',
        query: {
          jobId: this.currFocusJobId
        }
      })
    }
  },
  components: {
    JobItem,
  },
  created() {
    this.loading = true
    this.getJobRecommendList(this.pageInfo.currentPage)

    this.setIntervalId = this.createSetInterval()
  }
}
</script>

<style scoped lang="scss">
@import "/src/assets/global.scss";
.body {
  height: calc(100vh - 56px);
  overflow: auto;

    .main {
      //max-width: 1920px;
      //min-width: 1080px;
      width: 100%;
      display: flex;
      justify-content: center;

      margin: 0;

      .recommend {
        margin: 0 30px;
        max-width: 1080px;
        flex: 1;

        .title {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px;
          color: $primary-color;

          span {
            padding: 10px;
          }
          i {
            font-size: 20px;
          }
        }

        .page-button {
          margin-bottom: 10px;
          display: flex;
          justify-content: center;
        }

        .empty {
          display: flex;
          justify-content: center;
          align-items: center;

          span {
            color: $secondary-color;
          }
        }
      }
    }
}
</style>
