<template>
  <span class="copy" :data-clipboard-text="text" @click="copy">
    <slot></slot>
  </span>
</template>
<script>
  import Clipboard from 'clipboard';

  export default {
    props: ['text'],
    methods: {
      // 复制
      copy() {
        let clipboard = new Clipboard('.copy')
        clipboard.on('success', e => {
          this.$message.success(`复制成功`)
          // 释放内存
          clipboard.destroy()
        })
        clipboard.on('error', e => {
          // 不支持复制
          this.$message.success(`请长按复制`)
          // 释放内存
          clipboard.destroy()
        })
      },
    },
  }
</script>
