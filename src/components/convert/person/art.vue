<template>
  <div class="user_info">
    <el-descriptions class="margin-top" title="技能特长" :column="3" borde></el-descriptions>
    <div class="user_art">
      <ul>
        <li>
          熟悉office办公软件；
        </li>
        <li>
          对PS、PR等修图和视频剪辑软件较为熟悉；
        </li>
        <li>
          能够独立制作微信推文，拍摄视频和短片；
        </li>
        <li>
          具备一定的摄影技巧和常识；
        </li>
        <li>
          古筝业余八级；
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
