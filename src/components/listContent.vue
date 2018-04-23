<template>
  <el-tabs tab-position="left" v-model="activeName">
    <el-tab-pane label="全部" name="all">
      <el-row>
        <el-col :xs="{span:22,offset:1}" :sm="{span:20,offset:2}" :md="{span:18,offset:3}" :lg="{span:16,offset:4}" :xl="{span:14,offset:5}">
          <div class="panel-content" v-for="(item,index) in businessList.businessList" :key="index" @click="activeNameFun(item.name)">
            <business-unit
              :imgUrl="item.imgUrl"
              :contentText="item.contentText"
              :footerText="item.footerText"></business-unit>
          </div>
        </el-col>
      </el-row>
    </el-tab-pane>
    <el-tab-pane label="账户余额" name="balance">账户余额</el-tab-pane>
    <el-tab-pane label="交易记录" name="record">交易记录</el-tab-pane>
    <el-tab-pane label="对外转账" name="transfer">对外转账</el-tab-pane>
    <el-tab-pane label="应用市场" name="market">应用市场</el-tab-pane>
    <el-tab-pane label="创建应用" name="create">创建应用</el-tab-pane>
  </el-tabs>
</template>

<script>
  import businessUnit from './businessUnit';

  export default {
    name: "list-content",
    data(){
      return {
        activeName:'all',
        businessList:require('../JSON/business.json')
      }
    },
    methods:{
      activeNameFun(name){
        this.activeName=name;
      }
    },
    components:{
      businessUnit
    }
  }
</script>

<style lang="scss" type="text/scss" scoped>
  .el-col{
    display:flex;
    flex-flow: wrap;
  }
  .el-col .panel-content{
    margin:30px;
    flex: 0 1 25%;
  }
</style>
