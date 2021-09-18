<template>
  <div
      :class="filter_class_name"
      :style="{ borderRadius:radius, opacity:type != 'cancel' && disabled ? .4 : 1 }"
      @click.stop="handle_click"
  >
    <slot>{{text}}</slot>
  </div>
</template>

<script>
  /**
   * @description 封装按钮
   * @props {
   *
   * }
   */

  export default {
    props: {
      type: {
        type: String,
        default: 'confirm',
      },
      radius: {
        type: String,
        default: '20px'
      },
      text: {
        type: String,
        default: '提交'
      },
      icon: {
        type: String,
        default: '',
      },
      bgColor: {
        type: String,
        default: ''
      },
      brColor: {
        type: String,
        default: ''
      },
      color: {
        type: String,
        default: '#fff'
      },
      size: {
        type: Number,
        default: 14
      },
      disabled: {
        type: Boolean,
        default: false,
      },
      loading: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {}
    },
    watch: {},
    computed: {
      // 过滤class
      filter_class_name() {
        let basic = ' speed_button'
        if (this.disabled) {
          return 'disabled ' + this.type + basic
        }
        switch (this.type) {
          default :
            return this.type + basic + ' activeElement';
        }
      },
    },
    created() {

    },
    mounted() {

    },
    methods: {
      handle_click() {
        if (this.disabled) return
        this.$emit('confirm')
      }
    },
    components: {}
  }
</script>

<style lang="less" scoped>
  .speed_button {
    border-radius: 5px;
    padding: 0px 24px;
    font-size: 14px;
    color: #fff;
    cursor: pointer;
    display: inline-block;
    position: relative;
    text-align: center;
    letter-spacing: 2px;
    height: 37px;
    line-height: 37px;
    white-space: nowrap;
  }

  .confirm {
    background: #1165D6;
  }

  .cancel {
    background-color: rgba(207, 207, 207, 0.65);
    color: #fff;
  }

  .disabled {
    cursor: not-allowed;
  }

  .activeElement::before{
    content: " ";
    position: absolute;
    top: 50%;
    left: 50%;
    opacity: 0;
    width: 100%;
    height: 100%;
    border: inherit;
    border-color: #000;
    background-color: #000;
    border-radius: inherit;
    -webkit-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
  }
  .activeElement:active::before {
    opacity: 0.3;
  }
</style>
