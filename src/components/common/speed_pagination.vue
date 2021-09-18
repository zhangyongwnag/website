<template>
  <div class="_flex_center" style="height: 80px">
    <el-pagination
        background
        layout="prev, pager, next"
        :total="total"
        @current-change="handle_current"
        :page-size="size"
    >
    </el-pagination>
  </div>
</template>

<script>
  export default {
    props: {
      total: Number, // 总条数
      // 每页条数，默认10
      size: {
        type: Number,
        default: 10
      },
    },
    methods: {
      // 页码改变
      handle_current(value) {
        this.$emit('handle-current', value)
      }
    },
  }
</script>
