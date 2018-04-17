<template>
  <el-tabs tab-position="left">
    <el-tab-pane label="全部">
      <el-row>
        <el-col :xs="{span:22,offset:1}" :sm="{span:20,offset:2}" :md="{span:18,offset:3}" :lg="{span:16,offset:4}" :xl="{span:14,offset:5}">
          <!--<template v-for="businessList">-->

          <!--</template>-->
        </el-col>
      </el-row>
    </el-tab-pane>
    <el-tab-pane label="账户详情">账户详情</el-tab-pane>
    <el-tab-pane label="转账">转账</el-tab-pane>
    <el-tab-pane label="应用市场">应用市场</el-tab-pane>
    <el-tab-pane label="查看信息">查看信息</el-tab-pane>
  </el-tabs>
</template>

<script>
    export default {
      name: "list-content",
      data(){
        return {
          businessList:[

          ]
        }
      }
    }
</script>

<style scoped>
  .el-tabs{
    height:100%;
  }
</style>
