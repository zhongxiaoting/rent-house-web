<template>
  <div class="body">
    <div class="house-info-box">
      <div>
        <div class="call-back" @click="callBack">
          <i class="el-icon-back"></i>
          <span>返回</span>
        </div>
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
    </div>
    <div class="house-location-box">
      <div class="house-location container">
        <baidu-map
            class="bmap"
            @ready="initMap"
            :center="housePoint"
        >
          <!-- 缩放控件 -->
          <bm-navigation
              anchor="BMAP_ANCHOR_TOP_LEFT"
              type="BMAP_NAVIGATION_CONTROL_LARGE"
          >
          </bm-navigation>
          <!-- 比例尺控件 -->
          <bm-scale anchor="BMAP_ANCHOR_LEFT_RIGHT"></bm-scale>
          <bm-marker :position="housePoint">
            <bm-label :content="houseInfo.house" :labelStyle="{color: 'red', fontSize : '18px', transform: 'translate(-50%, 0)'}" :offset="{width: '-50%', height: 30}"/>
          </bm-marker>
        </baidu-map>
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
  'House': 'house',
}
export default {
  name: "house-details",
  data() {
    return {
      HousePropertyKey,
      houseInfo: {},
      houseLabelList: [
        {
          key: HousePropertyKey.House,
          label: '',
          content: '',
        },
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
      center: {lng: 0, lat: 0},
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
        point.lng = Number(_this.housePoint.lng)
        point.lat = Number(_this.housePoint.lat)
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
  computed: {
    housePropertyList() {
      return this.houseLabelList.map(item => {
        return {
          ...item,
          content: this.houseInfo[item.key] || ''
        }
      })
    },

    housePoint() {
      return {
        lng: this.houseInfo.lng,
        lat: this.houseInfo.lat
      }
    }

  },
  created() {
    const {houseInfo} = this.$route.params
    this.houseInfo = JSON.parse(houseInfo)
  }
}
</script>

<style scoped lang="scss">
@import "/src/assets/global.scss";

@mixin maxWidth {
  flex: 1;
  max-width: 1080px;
}

@mixin justifyContentCenter {
  display: flex;
  justify-content: center;
}

.body {
  height: calc(100vh - 56px);
  overflow: auto;

  .call-back {

    margin-bottom: 20px;
    font-size: 18px;
    color: #ffffff;
  }

  .house-info {
    color: #ffffff;

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

        .label {
          font-size: 14px;
        }

        .content {
          font-size: 20px;
        }
      }
    }
  }

  .house-info-box {
    @include justifyContentCenter;
    background-color: $secondary-color;

    > div {
      @include maxWidth;
    }
  }

  .container {
    margin-top: 10px;
    padding: 10px;
    background-color: #ffffff;
    border-radius: 10px;
  }

  .container:not(:last-child) {

  }

  .house-location-box {
    @include justifyContentCenter;

    .house-location {
      @include maxWidth;

      .bmap {
        width: 100%;
        height: 500px;
        flex: 1;
      }
    }
  }
}
</style>
