<template>
  <div id="app">
    <Login />
    <router-view></router-view>
  </div>
</template>

<script>
  import Login from "./components/login";

  export default {
    components: {
      Login
    }
  }
</script>

<style scoped>
  #app {
    font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif !important;
    font-size: 16px;
    /*user-select: none;*/
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    box-sizing: border-box;
    -webkit-tap-highlight-color: transparent;
    scroll-behavior: smooth;
    /*transform:translateZ(0);*/
  }
</style>
