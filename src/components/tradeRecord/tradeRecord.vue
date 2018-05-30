<template>
    <div class="trade-record">
        <!--<el-input placeholder="Search by Address / Txhash" v-model="searchParams">-->
        <!--<el-button slot="append" icon="el-icon-search" @click="getTransaction(searchParams)"></el-button>-->
        <!--</el-input>-->
        <div v-if="showSwitch==='table'" class="table-list">
            <el-table class="trade-record-table"
                      :data="transactionsList"
                      max-height="816px"
                      style="color:#8490c5;font-size: 16px;background:#221d44;text-align:center;"
                      :header-cell-style="headerCellStyle"
                      :row-style="rowStyle"
                      :cell-style="{'border-bottom':'none'}"
            >
                <el-table-column
                        prop="hash"
                        label="交易hash"
                >
                    <template slot-scope="scope">
                        <a style="color:#8490c5;"
                           :title="scope.row.hash"
                           :href="scope.row.hash"
                           @click.prevent="getTransaction(scope.row.hash)">{{
                            scope.row.hash }}</a>
                    </template>
                </el-table-column>

                <el-table-column
                        prop="blockNumber"
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
            <el-pagination
                    background
                    layout="prev, pager, next"
                    :total="1000">
            </el-pagination>
        </div>

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
            <div class="return-back">
                <el-button @click="showSwitch='table'">返回</el-button>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "trade-record",
        data() {
            return {
                transactionsList: [],
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
                        this.transactionsData = this.$web3.eth.getTransaction(hash)
                        delete this.transactionsData.datasourcecode
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
            },
            // getTransactionData(item){
            //     return new Promise(function (resolve, reject) {
            //         let hashObj=this.$web3.eth.getTransaction(item.txHash)
            //         hashObj.value = this.$web3.fromWei(hashObj.value.toString(10))
            //
            //     })
            // }
        },
        mounted() {
            let users = this.$funs.getLocalAddress()
            let userAddr = users.addresses[users.active]
            this.$axios.post('/api/requestTx.php', {
                "addr": userAddr
            }).then((res) => {
                if (res.status === 200) {
                    let data = res.data
                    if(data.length){
                        // for(let i=0;i<data.length;i++){
                        //
                        // }
                        this.transactionsList = res.data.map((item)=>{
                            let hashObj=this.$web3.eth.getTransaction(item.txHash)
                            hashObj.value = this.$web3.fromWei(hashObj.value.toString(10))
                            return hashObj
                        })
                    }
                }
            }).catch((error) => {
                this.$message.error(String(error))
            })
        }
    }
</script>

<style lang="scss" type="text/scss" scoped>
    .trade-record {
        height: 100%;
        overflow-y: auto;
        .el-table::before {
            height: 0; //勿删
        }
        .table-list {
            height: 100%;
            position: relative;
            .el-pagination {
                text-align: center;
                position: absolute;
                bottom: 40px;
                left: 50%;
                transform: translateX(-50%);
            }
        }
        .tx-list {
            padding: 20px;
            color: #8490c5;
            font-size: 16px;
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
            .return-back {
                text-align: center;
                margin-top: 10px;
                .el-button {
                    background: #5837FF;
                    color: #fff;
                    font-size: 16px;
                    border: none;
                    &:hover {
                        background: #6262FF;
                        color: #fff;
                    }
                }
            }
        }
    }
</style>
