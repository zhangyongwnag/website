<template>
  <div class="user_info">
    <el-descriptions class="margin-top" title="个人作品" :column="3" borde></el-descriptions>
    <div class="user_art">
      <ul>
        <li>
          撰写校园公众号新媒体推文若干；
        </li>
        <li>
          参与了学校2019级开学迎新季纪录短片的拍摄；
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
