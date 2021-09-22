<template>
  <div class="user_info">
    <el-descriptions class="margin-top" title="兴趣爱好" :column="3" borde></el-descriptions>
    <div class="user_art">
      <ul>
        <li>
          古筝
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  import {mapState} from 'vuex'

  export default {
    computed: {
      ...mapState({
        user_info: state => state.login.user_info
      }),
    },
  }
</script>

<style scoped lang="less">
  .user_info {
    padding: 10px 20px 20px;
    margin: 50px 0;
    transition: all .3s;
    box-shadow: 0 0 5px 10px #fff;
    animation: fade-bottom .5s 0s;

    img {
      width: 150px;
    }

    .video {
      display: flex;
      align-items: center;

      video {
        width: 1010px;
        height: 570px;
      }
    }

    &:hover {
      box-shadow: 0 0 5px 1px #e9e9e9;
      transform: translateY(-10px);
    }

    .user_description {
      letter-spacing: 2px;
      text-align: justify;
      line-height: 30px;
    }

    .user_art {
      ul {
        padding: 0 20px;
        margin-top: 0;

        li {
          margin-bottom: 10px;
        }
      }
    }
  }
</style>
