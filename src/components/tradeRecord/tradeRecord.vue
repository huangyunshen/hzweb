<template>
    <div class="trade-record">
        <el-input placeholder="Search by Address / Txhash" v-model="searchParams">
            <el-button slot="append" icon="el-icon-search" @click="getTransaction(searchParams)"></el-button>
        </el-input>
        <el-table
                v-if="showSwitch==='table'"
                :data="transactionsList"
                border
                stripe
                style="width: 100%">
            <el-table-column
                    prop="txHash"
                    label="交易hash">
                <template slot-scope="scope">
                    <a style="color: #f00"
                       :title="scope.row.txHash"
                       :href="scope.row.txHash"
                       @click.prevent="getTransaction(scope.row.txHash)">{{
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
        <div v-if="showSwitch==='list'" class="tx-list">
            <p class="title">Transaction Information</p>
            <el-row :gutter="20" v-for="(value,key) in transactionsData" :key="key">
                <el-col :span="6" class="key">
                    <div>
                        {{ key }}
                    </div>
                </el-col>
                <el-col :span="18" class="value">
                    <div>
                        {{ value }}
                    </div>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
    export default {
        name: "trade-record",
        data() {
            return {
                transactionsList: [{
                    txHash: '0x1df077c27d039827ac3616551de3b6abf5a4763bb28a20cf14fea11727ad14de',
                    block: '5455154',
                    age: '2018-04-06',
                    from: 'x0afa55a54f',
                    to: 'x0adf56465af5',
                    value: '4',
                }],
                transactionsData: null,
                searchParams: '', // 搜索参数
                showSwitch: 'table',// 显示表格还是列表
            }
        },
        methods: {
            /**
             * 获取交易信息
             * @param hash
             */
            getTransaction(hash) {
                let connected = this.$web3.isConnected()
                if (connected) {
                    if (hash) {
                        let result = this.$web3.eth.getTransactionByHash(hash);
                        console.log(result);
                        this.showSwitch = 'list'

                        // let params = {
                        //     method: 'eth_getTransactionByHash',
                        //     params: [hash],
                        //     id: '1'
                        // }
                        // this.$axios(params)
                        //     .then((response) => {
                        //         if (response.data.result) {
                        //             this.transactionsData = response.data.result
                        //             this.showSwitch = 'list'
                        //         } else {
                        //             this.$message.error(this.$msg.emptyResult)
                        //         }
                        //     })
                        //     .catch((error) => {
                        //         this.$message.error(error)
                        //     })
                    } else {
                        this.showSwitch = 'table'
                    }
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
        .tx-list {
            border: 1px solid #4DAD95;
            border-radius: 10px;
            padding: 20px;
            .title {
                width: 100%;
                height: 50px;
                line-height: 50px;
                border-radius: 10px 10px 0 0;
                background: #D9EDF7;
                margin: -20px 0 10px -20px;
                padding: 0 20px;
                font-size: 20px;
            }
            .el-row {
                .key, .value {
                    height: 40px;
                    line-height: 40px;
                }
            }
        }
    }
</style>
