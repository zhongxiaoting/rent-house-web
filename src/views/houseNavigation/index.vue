<template>
  <div class="body">
    <div class="header">
      <div class="container call-back" @click="callBack">
        <i class="el-icon-back"></i>
        <span>返回</span>
      </div>
    </div>
    <div class="main">
      <div>
        <div class="container house-info-box">
          <div class="house-info">
            <div class="price">
              {{ houseInfo.price }}元
            </div>
            <div class="info">
              <div
                  class="house-info-item"
                  v-for="item in housePropertyList"
                  :key="`house-info-item-${item.key}`"
              >
                <div class="label">
                  <span>{{ item.label }}</span>
                </div>
                <div class="content ellipsis">
                  <span>{{ item.content }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="container navigation">
          <div class="title">
            <span>起点：{{ companyName }}</span>
            <span>终点：{{ houseInfo.addr }}</span>
            <div>
              <el-button
                  v-for="item in tripModeList"
                  :key="item.key"
                  :type="item.type"
                  @click="handleButtonClick(item.key)"
              >{{ item.label }}
              </el-button>
            </div>
          </div>
          <baidu-map
              class="bmap"
              @ready="initMap"
              :center="center"
          >
            <!-- 缩放控件 -->
            <bm-navigation
                anchor="BMAP_ANCHOR_TOP_LEFT"
                type="BMAP_NAVIGATION_CONTROL_LARGE"
            >
            </bm-navigation>
            <!-- 比例尺控件 -->
            <bm-scale anchor="BMAP_ANCHOR_LEFT_RIGHT"></bm-scale>
            <template v-if="navigateInfo && this.currTripModeKey === 'publicTransport'">
              <bm-transit v-bind="navigateInfo" :auto-viewport="true" @resultshtmlset.once="handleResult"
                          :panel="false"></bm-transit>
            </template>
            <template v-else-if="navigateInfo && this.currTripModeKey === 'selfDriving'">
              <bm-driving
                  v-bind="navigateInfo"
                  :auto-viewport="true"
                  @resultshtmlset.once="handleResult"
                  :panel="false"
              ></bm-driving>
            </template>
            <template v-else-if="navigateInfo && this.currTripModeKey === 'walk'">
              <bm-walking v-bind="navigateInfo" :auto-viewport="true" @resultshtmlset.once="handleResult"
                          :panel="false"></bm-walking>
            </template>
          </baidu-map>
          <div class="navigation-result" ref="myRef"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {getCurrentLocation} from "@/api/baiduMap";

const HousePropertyKey = {
  'AreaDP': 'area_d_p',
  'Area': 'area',
  'Addr': 'addr',
}
export default {
  name: "house-details",
  data() {
    return {
      HousePropertyKey,
      jobPoint: undefined,
      houseInfo: {},
      houseLabelList: [
        {
          key: HousePropertyKey.AreaDP,
          label: '户型',
          content: '',
        },
        {
          key: HousePropertyKey.Area,
          label: '区位',
          content: '',
        },
        {
          key: HousePropertyKey.Addr,
          label: '详细地址',
          content: '',
        },
      ],
      currCityInfo: {},
      center: {lng: 0, lat: 0},
      navigateInfo: undefined,
      isLoading: true,
      companyName: '',

      tripModeList: [
        {
          key: 'publicTransport',
          label: '公共交通',
          type: 'primary'
        },
        {
          key: 'selfDriving',
          label: '驾车',
          type: 'primary'
        },
        {
          key: 'walk',
          label: '步行',
          type: 'primary'
        }
      ],
      currTripModeKey: 'publicTransport',
      refChildId: '',
    }
  },
  computed: {
    housePropertyList() {
      return this.houseLabelList.map(item => {
        return {
          ...item,
          content: this.houseInfo[item.key] || ''
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

      myGeo.getPoint(address_detail.city || '北京', function (point) {
        if (point) {
          map.centerAndZoom(point, 11)
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

    initNavigateToHouse() {
      this.navigateInfo = {
        start: {lng: this.jobPoint.lng.toString(), lat: this.jobPoint.lat.toString()},
        end: {lng: this.houseInfo.lng.toString(), lat: this.houseInfo.lat.toString()}
      }
    },

    handleResult(list) {
      if (this.refChildId !== '') {
        this.$refs.myRef.removeChild(this.refChildId)
      }
      this.refChildId = this.$refs.myRef.appendChild(list)
    },

    handleButtonClick(key) {
      this.currTripModeKey = key
    }
  },
  created() {
    const {jobPoint, house, company_name} = this.$route.params
    this.jobPoint = JSON.parse(jobPoint || '') || ''
    this.houseInfo = JSON.parse(house)
    this.companyName = company_name
    this.initNavigateToHouse()
  },
}
</script>

<style scoped lang="scss">
@import "/src/assets/global.scss";

@mixin maxWidth {
  flex: 1;
  max-width: 1080px;
  min-width: 1080px;
}

@mixin center {
  display: flex;
  justify-content: center;
}

.body {

  .header {
    @include center;
    margin-bottom: 10px;

    .call-back {
      @include maxWidth;
      margin: 0 30px;
      flex: 1;
    }
  }

  .main {
    @include center;

    .house-info-box {
      @include maxWidth;
      flex: 1;

      .house-info {

        .price {
          font-size: 32px;
          color: #ff4400;
        }

        .info {
          margin-top: 10px;
          display: flex;
          flex-wrap: wrap;
          justify-content: flex-start;

          .house-info-item {
            min-width: 200px;
            margin-right: 10px;
            margin-bottom: 10px;
          }
        }
      }
    }

    .navigation {
      @include maxWidth;

      .title {
        padding: 10px 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .bmap {
        width: 100%;
        height: 500px;
        flex: 1;
      }
    }

    .navigation-result {
      max-height: 500px;
      overflow: auto;
    }
  }

  .container {
    background-color: #ffffff;
    padding: 10px;
    border-radius: 10px;
  }

  .container:not(:last-child) {
    margin-bottom: 10px;
  }
}

.ellipsis {
  white-space: nowrap; /* 禁止折行 */
  overflow: hidden; /* 超出范围隐藏 */
  text-overflow: ellipsis; /* 显示省略号 */
  width: 100%; /* 限制宽度 */
}


</style>
