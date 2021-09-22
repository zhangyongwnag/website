<template>
  <div class="user_info">
    <el-descriptions class="margin-top" title="个人简介" :column="3" borde></el-descriptions>
    <div class="user_description">
      本人熊亚琳，武汉传媒学院2019级网媒B1901班在读本科生，喜爱学习、读书、听音乐，因为对写作和文字的热爱而选择了目前所就读的这个专业。 <br> <br>
      平时性格比较活泼开朗，待人接物温和有礼，喜欢广交朋友；性格里也有较为佛系的一面，假期相较于出远门更喜欢宅在家里做自己的事情，比如打游戏。喜欢甜品、火锅和川菜，自己也常常动手下厨烹饪。 <br> <br>喜欢一切可爱的事物，爱护小动物，喜欢养植物和小宠物，对猫科动物情有独钟。喜欢唱歌和跳舞。
      <br><br>
      目前在学习爵士舞；对待自己的学业和工作都十分上心，座右铭是“天行健，君子以自强不息”。 <br><br>
      希望自己能牢牢把握大学期间的美好光阴和青春年华，谨学慎行，不忘初心。
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
