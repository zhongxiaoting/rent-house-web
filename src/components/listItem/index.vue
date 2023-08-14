<template>
  <div>
    <div v-if="listKey === 'job'">
      <job-item
          v-for="(item, index) in list"
          :key="`job-${index}`"
          :data="item"
          @item-click="handleToDetails(item)"
      ></job-item>
    </div>
    <div v-else-if="listKey === 'house'">
      <house-item
          v-for="(item, index) in list"
          :key="`house-${index}`"
          :data="item"
          @item-click="handleToDetails(item)"
      ></house-item>
    </div>
  </div>
</template>

<script>
import jobItem from "@/components/listItem/module/jobItem.vue";
import houseItem from "@/components/listItem/module/houseItem.vue";

export default {
  name: "list-item",
  props: {
    list: {
      type: Array,
      default: () => [],
    },
    listKey: {
      type: String
    }
  },
  components: {
    jobItem,
    houseItem
  },
  methods: {
    handleToDetails(item) {
      this.$emit('to-details-view', item)
    }
  }
}
</script>

<style scoped>

</style>
