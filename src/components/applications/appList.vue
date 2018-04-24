<template>
  <div class="app-list">
    <ul>
      <li @click="goPlay">
        <div class="app-icon">
          <img src="@/assets/images/game1.jpg" alt="">
        </div>
        <p class="tc">龙虎斗</p>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    name: "app-list",
    methods:{
      goPlay(){
        this.$router.replace({path: '/appDetail'})
      }
    }
  }
</script>

<style lang="scss" type="text/scss" scoped>
  .app-list {
    margin: 0 auto;
    width: 80%;
    overflow: hidden;
    li {
      height: 150px;
      width: 150px;
      margin: 10px;
      cursor: pointer;
      float: left;
      &:hover{
        .tc{
          color: #f00;
        }
      }
      .app-icon {
        width: 100px;
        height: 100px;
        margin: 20px auto;
        img {
          width: 100%;
          height: 100%;
          border-radius: 10px;
        }
      }
    }
  }
</style>
