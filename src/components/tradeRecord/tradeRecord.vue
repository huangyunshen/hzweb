<template>
  <div class="trade-record">
    <el-input placeholder="Search by Address / Txhash / Block / Token / Ens">
      <el-button slot="append" icon="el-icon-search"></el-button>
    </el-input>
    <el-table
      :data="tableData2"
      border
      stripe
      style="width: 100%">
      <el-table-column
        prop="txHash"
        label="交易hash">
      </el-table-column>
      <el-table-column
        prop="block"
        label="区块值">
      </el-table-column>
      <el-table-column
        prop="age"
        label="时间">
      </el-table-column>
      <el-table-column
        prop="from"
        label="转出方">
      </el-table-column>
      <el-table-column
        prop="to"
        label="转入方">
      </el-table-column>
      <el-table-column
        prop="value"
        label="交易金额">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  export default {
    name: "trade-record",
    data() {
      return {
        tableData2: [{
          txHash: 'x056456655656565332',
          block: '5455154',
          age: '2018-04-06',
          from: 'x0afa55a54f',
          to: 'x0adf56465af5',
          value: '4',
        }]
      }
    },
  }
</script>

<style lang="scss" type="text/scss" scoped>
  .trade-record {
    width: 80%;
    margin: 0 auto;
    .el-input{
      margin-bottom: 50px;
    }
  }
</style>
