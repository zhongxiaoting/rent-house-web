<template>
  <div class="body">
    <div class="header">
      <div class="job-info">
        <div class="call-back" @click="callBack">
          <i class="el-icon-back"></i>
          <span>返回</span>
        </div>
        <div class="job-name-box">
          <div class="job-name">{{ jobInfo.job_name }}</div>
          <div class="provide-salary">{{ jobInfo.provide_salary }}</div>
        </div>
        <div class="requirement">
          <div
              v-for="(item) in requirementList"
              :key="`requirement-${item.key}`"
              class="requirement-item"
          >
            <span>{{ item.value }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="main">
      <div class="main-container">
        <div class="container ">
          <div class="job-tags">
            <div class="job-tags-title">
              <span>要求与福利</span>
            </div>
            <div class="job-tags-content">
              <el-tag
                  v-for="(item,index) in jobInfo.job_tags"
                  :key="`${item}-${index}`"
                  :disable-transitions="true"
                  class="tags-item"
              >{{ item }}
              </el-tag>
            </div>
          </div>
        </div>

        <div class="container">
          <div class="company-name">
            <span>{{ jobInfo.company_name }}</span>
          </div>
          <baidu-map
              class="bmap"
              @ready="initMap"
              :center="jobPoint"
          >
            <!-- 缩放控件 -->
            <bm-navigation
                anchor="BMAP_ANCHOR_TOP_LEFT"
                type="BMAP_NAVIGATION_CONTROL_LARGE"
            >
            </bm-navigation>
            <!-- 比例尺控件 -->
            <bm-scale anchor="BMAP_ANCHOR_LEFT_RIGHT"></bm-scale>
            <bm-marker :position="jobPoint">
              <bm-label :content="jobInfo.company_name" :labelStyle="{color: 'red', fontSize : '18px', transform: 'translate(-50%, 0)'}" :offset="{width: '-50%', height: 30}"/>
            </bm-marker>
          </baidu-map>
          <div class="navigation-result" ref="myRef"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {getCurrentLocation} from "@/api/baiduMap";

const TagsKeyList = [
  'job_area',
  'work_year',
  'degree'
]
export default {
  name: "job-details",
  data() {
    return {
      TagsKeyList,
      jobInfo: {},
      center: {lng: 0, lat: 0},
      jobPoint: {},
    }
  },
  computed: {
    requirementList() {
      return this.TagsKeyList.map(key => {
        return {
          key: key,
          value: this.jobInfo[key] || ''
        }
      })
    }
  },
  methods: {
    callBack() {
      this.$router.back()
    },


    async initMap({BMap, map}) {
      // 初始化获取当前ip的地址

      await this.getCurrCityInfo()
      await this.initCity(BMap, map)

      // this.getCityInfo()
    },
    async initCity(BMap, map) {
      const myGeo = new BMap.Geocoder()
      const {content} = this.currCityInfo
      const {address_detail} = content
      const _this = this

      myGeo.getPoint(address_detail.city || '北京', function (point) {
        point.lng = Number(_this.jobPoint.lng)
        point.lat = Number(_this.jobPoint.lat)
        if (point) {
          map.centerAndZoom(point, 18)
        } else {
          this.$message.warning('地址解析失败！')
        }
      }, address_detail.city || '北京')
    },

    getCityInfo() {

    },

    getCurrCityInfo() {
      return getCurrentLocation().then(res => {
        const {data} = res
        this.currCityInfo = data
      })
    },
  },
  created() {
    const {jobInfo} = this.$route.params
    this.jobInfo = JSON.parse(jobInfo)
    this.jobPoint = {
      lng: this.jobInfo.lng,
      lat: this.jobInfo.lat
    }
  }
}
</script>

<style scoped lang="scss">
@import "/src/assets/global.scss";

@mixin maxWidth {
  flex: 1;
  max-width: 1080px;
  //min-width: 1080px;
}

.body {

  .header {
    padding: 10px;
    background-color: $secondary-color;
    display: flex;
    justify-content: center;

    .call-back {
      margin-bottom: 20px;
      font-size: 18px;
      color: #ffffff;
    }

    .job-info {
      @include maxWidth;
      padding-top: 50px;

      .job-name-box {
        color: #ffffff;
        display: flex;
        justify-content: space-between;

        .job-name {
          font-size: 22px;
          font-weight: bold;
        }

        .provide-salary {
          color: #ff412d;
          font-size: 22px;
          font-weight: bold;
        }
      }

      .requirement {
        display: flex;
        color: #ffffff;

        .requirement-item {

        }

        .requirement-item:not(:last-child) {
          margin-right: 10px;
        }
      }
    }
  }

  .main {
    display: flex;
    justify-content: center;

    .main-container {
      min-width: 1080px;
    }

    .container {
      @include maxWidth;
      padding: 10px;
      margin-top: 10px;
      background-color: #ffffff;
      border-radius: 10px;
    }

    .container:not(:last-child) {

    }

    .job-tags {

      .job-tags-title {
        font-size: 18px;
        font-weight: bold;
      }

      .job-tags-content {
        margin-top: 10px;

        .tags-item {
          padding: 0 10px;
        }

        .tags-item:not(:last-child) {
          margin-right: 10px;
        }
      }
    }
  }
}

.bmap {
  width: 100%;
  height: 500px;
  flex: 1;
}

.company-name {
  padding: 10px;
  font-size: 20px;
  font-weight: bold;
}
</style>
