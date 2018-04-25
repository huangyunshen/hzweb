<template>
    <div class="trade-record">
        <el-input placeholder="Search by Address / Txhash / Block / Token / Ens" v-model="searchParams">
            <el-button slot="append" icon="el-icon-search" @click="getTransaction()"></el-button>
        </el-input>
        <el-table
                v-if="showSwitch==='table'"
                :data="transactionsData"
                border
                stripe
                style="width: 100%">
            <el-table-column
                    prop="txHash"
                    label="交易hash">
                <template slot-scope="scope">
                    <a style="color: #f00" :href="scope.row.txHash" @click.prevent="getTransaction(scope.row.txHash)">{{
                        scope.row.txHash }}</a>
                </template>
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
                transactionsData: [{
                    txHash: 'x056456655656565332',
                    block: '5455154',
                    age: '2018-04-06',
                    from: 'x0afa55a54f',
                    to: 'x0adf56465af5',
                    value: '4',
                }],
                searchParams: '', // 搜索参数
                showSwitch: 'table',// 显示表格还是列表
            }
        },
        methods: {
            /**
             * 获取交易信息
             * @param params
             */
            getTransaction(params) {
                let connected = this.$web3.isConnected()
                if (connected) {
                    let params = {
                        method: 'eth_accounts',
                        params: [],
                        id: '1'
                    }
                    this.$axios(params)
                        .then(function (response) {
                            console.log(response)
                        })
                        .catch(function (error) {
                            console.log(error)
                        })
                } else {
                    this.$message.error(this.$msg.serviceException)
                }
            }
        }
    }
</script>

<style lang="scss" type="text/scss" scoped>
    .trade-record {
        width: 80%;
        margin: 0 auto;
        .el-input {
            margin-bottom: 50px;
        }
    }
</style>
