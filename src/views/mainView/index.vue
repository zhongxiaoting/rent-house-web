<template>
  <div class="body">
    <nav-component></nav-component>
    <keep-alive
        :max="10"
        :include="['home-view', 'list-View']"
        :exclude="['job-details', 'house-details']"
    >
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
import NavComponent from "@/views/mainView/components/nav/index.vue";

export default {
  name: "main-view",
  components: {NavComponent}
}
</script>

<style scoped lang="scss">
@import "/src/assets/global.scss";
.body {

}
</style>
