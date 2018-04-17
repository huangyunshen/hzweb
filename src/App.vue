<template>
  <div id="app">
    <el-container>
      <el-header height="100px">
        <span class='header-title'>汇尊区块链</span>
        <el-select v-model="value">
          <el-option
            v-for="(item,index) in options"
            :key="index"
            :label="item.title"
            :value="item.label"
          ></el-option>
        </el-select>
      </el-header>
      <el-main>
        <router-view name="default"/>
      </el-main>
    </el-container>
  </div>
</template>

<script>
export default {
  name: 'App',
  data () {
    return {
      value:'ch',
      options:[
        {title:'中文',label:'ch'},
        {title:'English',label:'en'}
      ]
    }
  }
}
</script>

<style>
  html,body,#app,.el-container,.el-main{
    height:100%;
  }
  body{
    margin:0;
  }
  #app {
    font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
    font-size: 16px;
  }
  .el-header{
    background-color: #4DAD95;
  }
  .header-title{
    font-family: '华文新魏';
    font-size: 70px;
    line-height: 100px;
    color: #034D3B;
  }
  .el-select{
    float: right;
    margin-top: 30px;
  }
</style>
