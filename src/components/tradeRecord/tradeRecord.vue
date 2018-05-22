<template>
    <div class="trade-record">
        <!--<el-input placeholder="Search by Address / Txhash" v-model="searchParams">-->
        <!--<el-button slot="append" icon="el-icon-search" @click="getTransaction(searchParams)"></el-button>-->
        <!--</el-input>-->
        <el-table class="trade-record-table"
            v-if="showSwitch==='table'"
            :data="transactionsList"
            max-height="816px"
            style="color:#8490c5;font-size: 16px;background:#221d44;text-align:center;"
            :header-cell-style="headerCellStyle"
            :row-style="rowStyle"
            :cell-style="{'border-bottom':'none'}"
        >
            <el-table-column
                prop="txHash"
                label="交易hash"
                min-width="100px"
            >
                <template slot-scope="scope">
                    <a style="color:#8490c5;"
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
                prop="time"
                label="时间">
            </el-table-column>
            <el-table-column
                prop="from"
                label="转出方"
                min-width="300px">
            </el-table-column>
            <el-table-column
                prop="to"
                label="转入方"
                min-width="300px">
            </el-table-column>
            <el-table-column
                prop="value"
                label="金额">
            </el-table-column>
        </el-table>

        <div v-if="showSwitch==='list'" class="tx-list">
            <p class="title">交易信息</p>
            <el-row :gutter="20" v-for="(value,key) in transactionsData" :key="key">
                <el-col :span="6">
                    <div>
                        {{ key + " :" }}
                    </div>
                </el-col>
                <el-col :span="17" :offset="1">
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
                transactionsList: [
                    {
                        txHash: '0x1df077c27d039827ac3616551de3b6abf5a4763bb28a20cf14fea11727ad14de',
                        block: '5455154',
                        time: '2018-04-06',
                        from: '0xbbac7526697a187a3ec4201727520fd95be910ea',
                        to: '0xa2089adde76917463cc4da84ad2c5505fc83d664',
                        value: '4',
                    },
                    {
                        txHash: '0x1df077c27d039827ac3616551de3b6abf5a4763bb28a20cf14fea11727ad14de',
                        block: '5455154',
                        time: '2018-04-06',
                        from: '0xbbac7526697a187a3ec4201727520fd95be910ea',
                        to: '0xa2089adde76917463cc4da84ad2c5505fc83d664',
                        value: '4',
                    },
                    {
                        txHash: '0x1df077c27d039827ac3616551de3b6abf5a4763bb28a20cf14fea11727ad14de',
                        block: '5455154',
                        time: '2018-04-06',
                        from: '0xbbac7526697a187a3ec4201727520fd95be910ea',
                        to: '0xa2089adde76917463cc4da84ad2c5505fc83d664',
                        value: '4',
                    },
                    {
                        txHash: '0x1df077c27d039827ac3616551de3b6abf5a4763bb28a20cf14fea11727ad14de',
                        block: '5455154',
                        time: '2018-04-06',
                        from: '0xbbac7526697a187a3ec4201727520fd95be910ea',
                        to: '0xa2089adde76917463cc4da84ad2c5505fc83d664',
                        value: '4',
                    },
                    {
                        txHash: '0x1df077c27d039827ac3616551de3b6abf5a4763bb28a20cf14fea11727ad14de',
                        block: '5455154',
                        time: '2018-04-06',
                        from: '0xbbac7526697a187a3ec4201727520fd95be910ea',
                        to: '0xa2089adde76917463cc4da84ad2c5505fc83d664',
                        value: '4',
                    },
                    {
                        txHash: '0x1df077c27d039827ac3616551de3b6abf5a4763bb28a20cf14fea11727ad14de',
                        block: '5455154',
                        time: '2018-04-06',
                        from: '0xbbac7526697a187a3ec4201727520fd95be910ea',
                        to: '0xa2089adde76917463cc4da84ad2c5505fc83d664',
                        value: '4',
                    },
                ],
                transactionsData: null,
                // searchParams: '', // 搜索参数
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
                        let result = this.$web3.eth.getTransaction(hash);
                        this.transactionsData = result
                        this.showSwitch = 'list'
                    } else {
                        this.showSwitch = 'table'
                    }
                } else {
                    this.$message({
                        message: this.$msg.serviceException,
                        type: 'error'
                    })
                }
            },
            headerCellStyle({row, rowIndex}) {
                return 'background:#342C67;border-bottom:0;font-size: 20px;color: #d3ceff;height:70px;text-align:center;'
            },
            rowStyle({row, rowIndex}) {
                if (rowIndex & 1) {
                    return 'background:#342C67;'
                } else {
                    return 'background:#221d44;'
                }
            }
        }
    }
</script>

<style lang="scss" type="text/scss" scoped>
    .trade-record {
        .el-table::before {
            height: 0; //勿删
        }
        /*.el-input {*/
            /*margin-bottom: 50px;*/
        /*}*/
        .tx-list {
            padding: 20px;
            color:#8490c5;font-size: 16px;
            .title {
                width: 100%;
                height: 50px;
                line-height: 50px;
                background: #342C67;
                margin: -20px 0 10px -20px;
                padding: 0 20px;
                font-size: 20px;
            }
            .el-row {
                line-height: 45px;

                .el-col:first-child {
                    text-align: right;
                }
            }
        }
    }
</style>
