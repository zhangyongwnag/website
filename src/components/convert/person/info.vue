<template>
  <div class="user_info">
    <el-descriptions class="margin-top" title="个人介绍" :column="3" border>
      <template slot="extra">
        <el-button type="primary" size="small"
                   @click="$notify({ title:'提示',message: '暂无可操作选项',type:'info',showClose:true})">操作
        </el-button>
      </template>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-user"></i>
          姓名
        </template>
        {{user_info.user_name}}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-mobile-phone"></i>
          邮箱号
        </template>
        1363944092@qq.com
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-location-outline"></i>
          居住地
        </template>
        武汉市
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-tickets"></i>
          院校
        </template>
        <el-tag size="small">武汉传媒学院</el-tag>
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-office-building"></i>
          联系地址
        </template>
        湖北省武汉市江夏区藏龙岛凤凰大道 2 号
      </el-descriptions-item>
    </el-descriptions>
    <el-descriptions class="margin-top" title="我的院校" :column="3" border style="margin-top: 20px">
      <template slot="extra">
        <img src="../../../assets/img/logo2.png" alt="">
      </template>
    </el-descriptions>
    <div class="video">
      <video muted controls autoplay src="https://vdse.bdstatic.com//7768e8eb7ee711e7d44f1c3e63143f8d.mp4?authorization=bce-auth-v1%2F40f207e648424f47b2e3dfbb1014b1a5%2F2021-09-19T00%3A23%3A32Z%2F-1%2Fhost%2Ffecbb58929fa37304891cdda1d18f8997a2a2ef85a4d1d1fb60f75070f879e49"></video>
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
