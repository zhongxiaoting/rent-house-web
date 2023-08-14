<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>

export default {
  name: 'app'
}
</script>

<style lang="scss">
* {
    padding: 0;
    margin: 0;
}
</style>
<style scoped lang="scss">
@import "/src/assets/global.scss";
#app {
  min-height: 100vh;
  background-color: $bottom-color;
}
//#app {
//  font-family: Avenir, Helvetica, Arial, sans-serif;
//  -webkit-font-smoothing: antialiased;
//  -moz-osx-font-smoothing: grayscale;
//  //text-align: center;
//  color: #2c3e50;
//}

//nav {
//  padding: 30px;
//
//  a {
//    font-weight: bold;
//    color: #2c3e50;
//
//    &.router-link-exact-active {
//      color: #42b983;
//    }
//  }
//}
</style>
