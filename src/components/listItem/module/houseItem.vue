<template>
  <div class="house-item-box" @click="handleClick">
    <div class="left-box">
      <div
          v-for="(leftItem, index) in leftLabel"
          :key="`left-${index}`"
          :class="leftItem.className"
      >
        <span>{{ data[leftItem.key] }}</span>
      </div>
    </div>
    <div class="right-box">
      <div
          v-for="(rightItem, index) in rightLabel"
          :key="`right-${index}`"
          :class="rightItem.className"
      >
        <span>{{ data[rightItem.key] }}</span>
      </div>
    </div>
  </div>
</template>

<script>
const LeftKey = {
  House: 'house',
  Area: 'area',
  Addr: 'addr',
  AreaDP: 'area_d_p',
}
const RightKey = {
  Price: 'price',
}
export default {
  name: "houseItem",
  props: {
    data: {
      type: Object,
      default: () => {
      }
    }
  },

  data() {
    return {
      LeftKey,
      RightKey,
      leftLabel: [
        {
          key: LeftKey.House,
          className: 'house-name',
        },
        {
          key: LeftKey.Area,
          className: 'house-other-info',
        },
        {
          key: LeftKey.Addr,
          className: 'house-other-info',
        },
        {
          key: LeftKey.AreaDP,
          className: 'house-other-info',
        }
      ],
      rightLabel: [
        {
          key: RightKey.Price,
          className: 'house-price',
        }
      ]
    }
  },
  methods: {
    handleClick() {
      this.$emit('item-click')
    },
  }
}
</script>

<style scoped lang="scss">
@import "/src/assets/global.scss";

.house-item-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.house-item-box:not(:last-child) {
  padding: 10px 0;
  border-bottom: 1px solid $bottom-color;
}

.house-name {
  color: $secondary-color;
  font-size: 18px;
}

.house-price {
  color: #ff4400;
}

.house-other-info {
  font-size: 14px;
  color: #666666;
}
</style>
