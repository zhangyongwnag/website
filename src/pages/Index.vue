<template>
  <Index v-if="index_type === 'index'" />
  <NewTab v-else="index_type === 'new_tab'" />
</template>

<script>
  import index from '../components/init/index'
  import new_tab from '../components/init/new_tab'

  export default {
    data() {
      return {
        index_type: '' // 首页类型
      }
    },
    created() {
      // 获取起始页类型
      this.index_type = window.index_type
    },
    components: {
      Index: index,
      NewTab: new_tab
    }
  }
</script>
