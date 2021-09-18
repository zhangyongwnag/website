<template>
  <el-scrollbar class="scroll_wrap" :native="false" wrapStyle="overflow-x: hidden;" wrapClass="" viewClass="" viewStyle="" :noresize="false" tag="section">
    <p>从PDF转换</p>
    <div class="convert_wrap">
      <div class="_common_block _flex_column_center" v-for="(item,index) in from_pdf_list" @click="handle_click(item,index)">
        <img :src="item.icon_2x" alt="">
        <span>{{item.name}}</span>
      </div>
    </div>
    <p>转换成PDF</p> <br>
    <div class="convert_wrap">
      <div class="_common_block _flex_column_center" v-for="(item,index) in to_pdf_list" @click="handle_click(item,index)">
        <img :src="item.icon_2x" alt="">
        <span>{{item.name}}</span>
      </div>
    </div>
  </el-scrollbar>
</template>

<script>
  import { mapState } from 'vuex'

  export default {
    data() {
      return {}
    },
    computed: {
      ...mapState({
        convert_list: state => state.convert.convert_list // 转换列表
      }),
      // 从PDF转换
      from_pdf_list() {
        return this.convert_list.filter(item => item.type == 'from-pdf')
      },
      // 转换成PDF列表
      to_pdf_list() {
        return this.convert_list.filter(item => item.type == 'to-pdf')
      }
    },
    methods: {
      /**
       * @description 点击转换元素
       * @param {Object} item: 当前选中项
       * @param {Number} index: 选中项下标index
       */
      handle_click(item, index) {
        // 将当前选择的Tab保存，动态引入组件
        this.$store.dispatch('update_convert_header_active', {
          tab: {
            id: 7,
            component_name: 'index',
          },
          index: 6
        })
        // 更新当前选择的转换信息
        this.$store.dispatch('update_convert_info', item.file_type)
      }
    },
    components: {}
  }
</script>

<style lang="less" scoped>
  .scroll_wrap {
    width: 100%;
    height: calc(100vh - 75px);
    animation: fade-bottom .5s 0s forwards;

    .convert_wrap {
      padding: 25px 19px 0px 40px;
      overflow: hidden;
      display: grid;
      justify-content: space-between;
      grid-template-columns: repeat(auto-fill, 190px);
      grid-gap: 1px
    }

    p {
      padding-left: 48px;
      color: rgba(51, 51, 51, 0.7);
      margin-bottom: -14px;
    }

    p:last-of-type {
      margin: -10px 0 -25px;
    }
  }
</style>
