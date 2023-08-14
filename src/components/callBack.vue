<template>
  <div class="container call-back" @click="callBack">
    <i class="el-icon-back"></i>
    <span>返回</span>
  </div>
</template>

<script>
export default {
  name: "callBack",
  methods: {
    callBack() {
      this.$router.back()
    },
  }
}
</script>

<style scoped lang="scss">
.header {
  @include center;
  margin-bottom: 10px;

  .call-back {
    width: 100%;
    margin: 0 30px;
    flex: 1;
  }
}
</style>
