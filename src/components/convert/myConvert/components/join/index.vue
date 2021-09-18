<template>
  <div style="width: 100%;height: 100%;">
    <JoinAfter :info="info"/>
  </div>
</template>

<script>
  import join_before from "./components/join_before";
  import join_check from "./components/join_check";
  import join_after from "./components/join_after";

  export default {
    data() {
      return {
        info: {}, // 用户加盟信息
      }
    },
    created() {
      this.getInfo()
    },
    methods: {
      // 检测用户加盟状态
      getInfo() {

      }
    },
    components: {
      JoinBefore: join_before,
      JoinCheck: join_check,
      JoinAfter: join_after,
    }
  }
</script>
